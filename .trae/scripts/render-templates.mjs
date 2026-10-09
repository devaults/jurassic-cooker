#!/usr/bin/env node
/**
 * render-templates.mjs —— 把 specs/_template/ 渲染到目标目录（团队 specs/ 或外置个人根）
 *
 * 用法：
 *   node render-templates.mjs domains/<domain>/<feature>      # 团队 spec（落本仓 specs/，签字冻结）
 *   node render-templates.mjs specs/<YYYY-MM>/<slug> --out-root <abs>   # 个人 spec（落 <abs>/specs/<YYYY-MM>/<slug>/，免签字）
 *   node render-templates.mjs <path> --dry-run                # 仅打印，不写
 *   node render-templates.mjs <path> --force                  # 已存在则覆盖（默认拒绝覆盖）
 *   node render-templates.mjs <path> --knowledge <abs>        # 覆盖知识库根探测
 *   node render-templates.mjs <path> --registry <abs>         # 覆盖项目注册表位置
 *   node render-templates.mjs <path> --check-signing          # 渲染后扫描产物中残留的 "草稿/TODO/draft" 关键字（如 .trae/config.yaml 配 signing.required=true），发现即报错
 *   node render-templates.mjs <path> --check-signing          # 单独扫：目标已存在时不渲染，直接扫描签字状态
 *
 * 两个档位（团队 / 个人）**产物完全一致**——同一套 11 个文件：requirements / design-ui /
 * design-contract / tech-solution-{backend,frontend} + tasks/{backend,frontend}/ + qa/。
 * 差别只在**落点与签字**：
 *   - 团队 spec：<path> 须为 domains/<domain>/<feature>（3 段），落本仓 <cooker>/specs/，必须签字冻结
 *   - 个人 spec：加 --out-root <abs> 指定**外置个人根**，<path> 为根下相对路径（如 specs/<YYYY-MM>/<slug>），免签字
 * 不指定 --out-root 时，<path> 只允许 domains/ 开头（不落 specs/ 根下，避免与 README/_template/domains 混杂）。
 *
 * 工作原理（**零配置**：路径全部自算，不读 config.yaml / config.local.json）：
 *   1. 模板源 = 本脚本所在 <cooker>/.trae/scripts/ → <cooker>/specs/_template
 *   2. 输出根 = 默认 <cooker>/specs（团队）；传 --out-root <abs> 时改用该路径（个人，可外置）
 *   3. 知识库根 = detectKnowledgeRoot()（兄弟目录约定命名 → 兜底，可 --knowledge 覆盖）
 *   4. 遍历模板源下的所有文件并渲染 ${...} 占位符：
 *      - requirements.md / design-*.md / tech-solution-*.md → 写到 <path>/ 顶层
 *      - tasks/backend/_template/*  → 写到 <path>/tasks/backend/
 *      - tasks/frontend/_template/* → 写到 <path>/tasks/frontend/
 *      - qa/_template/*             → 写到 <path>/qa/
 *      - tasks/_template/（入口指针）不渲染
 *
 * 占位符（只有一组：**相对当前文件**的跨层路径，不落本机绝对路径）：
 *   ${rel.cooker}            → 从当前文件到 cooker 仓根的相对路径（如 `../../../..`）
 *   ${rel.knowledge}         → 到知识库根的相对路径
 *   ${rel.project_registry}  → 到项目注册表的相对路径
 * 由脚本按**输出文件所在目录**动态计算，故每个使用方渲染出的都是各自正确、可点击的路径。
 *
 * 故意不支持：渲染时的逻辑判断 / 条件块 / 循环。如需条件渲染，改用多个模板文件。
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, statSync } from 'node:fs'
import { dirname, join, resolve as pathResolve, relative, isAbsolute } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ─── 路径自动探测（零配置）───────────────────────────────────────────────

/** specs 库根 = <cooker>/specs（本脚本位于 <cooker>/.trae/scripts/） */
const SPECS_ROOT = pathResolve(__dirname, '..', '..', 'specs')
/** cooker 仓根（不硬编码仓名；任何目录名都能跑） */
const COOKER_ROOT = pathResolve(SPECS_ROOT, '..')

/**
 * 知识库根探测（不硬编码仓名，可用 --knowledge 覆盖）：
 *   1. 显式参数（绝对路径或相对 cwd）
 *   2. 兄弟目录约定命名：`jurassic-knowledge` / `knowledge`（存在即用）
 *   3. 兜底 `<cooker>/../knowledge`
 */
function detectKnowledgeRoot(knowledgeArg) {
  if (knowledgeArg) {
    return isAbsolute(knowledgeArg) ? knowledgeArg : pathResolve(process.cwd(), knowledgeArg)
  }
  const parent = pathResolve(COOKER_ROOT, '..')
  for (const name of ['jurassic-knowledge', 'knowledge']) {
    const dir = join(parent, name)
    if (existsSync(dir)) return dir
  }
  return join(parent, 'knowledge')
}

/** 项目注册表默认位置（约定；可用 --registry 覆盖） */
function defaultRegistry(knowledgeRoot) {
  return join(knowledgeRoot, 'tooling', 'project-registry.md')
}

// ─── 占位符展开 ──────────────────────────────────────────────────────────

function resolvePlaceholders(text, vars) {
  return text.replace(/\$\{([^}]+)\}/g, (_, path) => {
    if (path.startsWith('\\')) return '${' + path.slice(1) + '}'
    const v = getByPath(vars, path.trim())
    if (v === undefined) {
      throw new Error(`未定义的占位符：\${${path}}（模板里可能写错了）`)
    }
    return String(v)
  })
}

function getByPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)
}

// ─── 主流程 ──────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2)
  const flagValue = (flag) => {
    const i = args.indexOf(flag)
    return i >= 0 ? args[i + 1] : null
  }

  if (args.length === 0 || args[0].startsWith('--')) {
    console.error('用法：node render-templates.mjs domains/<domain>/<feature> [--dry-run] [--force] [--knowledge <abs>] [--registry <abs>]')
    console.error('   或：node render-templates.mjs specs/<YYYY-MM>/<slug> --out-root <外置个人根>   # 个人 spec（免签字）')
    process.exit(1)
  }

  // <path>：目标路径。团队 = domains/<domain>/<feature>（相对 <cooker>/specs）；
  //         个人 = specs/<YYYY-MM>/<slug>（相对 --out-root 指定的外置个人根）
  const relTarget = args[0].replace(/\\/g, '/').replace(/\/+$/, '')
  const segs = relTarget.split('/')
  const isKebab = (s) => /^[a-z0-9][a-z0-9-]*$/.test(s)

  if (relTarget.startsWith('/') || relTarget.includes('..')) {
    console.error(`✗ 目标路径必须是相对路径且不含 ".."：${relTarget}`)
    process.exit(1)
  }
  const badSeg = segs.find((s) => !isKebab(s))
  if (badSeg !== undefined) {
    console.error(`✗ 路径各段须为 kebab-case（小写字母 / 数字 / 连字符）：${badSeg}`)
    process.exit(1)
  }

  const outRootArg = flagValue('--out-root')
  const isExternal = outRootArg !== null

  if (!isExternal) {
    if (segs[0] !== 'domains') {
      console.error(`✗ 不指定 --out-root 时，目标路径必须以 domains/ 开头（团队 spec 只落 specs/domains/<domain>/<feature>）：${relTarget}`)
      console.error('  个人 spec（不共享、免签字）请用 `specs/<YYYY-MM>/<slug> --out-root <外置个人根>`')
      process.exit(1)
    }
    if (segs.length !== 3) {
      console.error(`✗ 团队 spec 路径须为 domains/<domain>/<feature>（3 段）：${relTarget}`)
      process.exit(1)
    }
  }

  const dryRun = args.includes('--dry-run')
  const force = args.includes('--force')

  // 输出根：默认本仓 specs/（团队）；--out-root 时改用外置个人根（个人）
  const templatesRoot = join(SPECS_ROOT, '_template')
  const targetRoot = isExternal
    ? (isAbsolute(outRootArg) ? outRootArg : pathResolve(process.cwd(), outRootArg))
    : SPECS_ROOT

  const knowledgeRoot = detectKnowledgeRoot(flagValue('--knowledge'))
  const registryArg = flagValue('--registry')
  const registryPath = registryArg
    ? (isAbsolute(registryArg) ? registryArg : pathResolve(process.cwd(), registryArg))
    : defaultRegistry(knowledgeRoot)

  const featureDir = join(targetRoot, relTarget)

  const checkSigning = args.includes('--check-signing')

  // 单跑 --check-signing 且目标已存在：跳过渲染，直接扫描
  const checkOnly = checkSigning && existsSync(featureDir) && !force && !dryRun

  if (existsSync(featureDir) && !force && !dryRun && !checkOnly) {
    console.error(`✗ 目标已存在：${featureDir}`)
    console.error(`  覆盖请加 --force；仅预览加 --dry-run；扫签字加 --check-signing`)
    process.exit(1)
  }

  console.log(`▶ 渲染目标：${featureDir}`)
  console.log(`  路径: ${relTarget}`)
  if (isExternal) console.log(`  外置个人根：${targetRoot}`)
  console.log(`  模板源：${templatesRoot}`)

  if (!existsSync(templatesRoot)) {
    console.error(`✗ 模板目录不存在：${templatesRoot}`)
    process.exit(1)
  }

  // 单跑 --check-signing：跳过渲染，直接扫描并退出
  if (checkOnly) {
    console.log(`▶ 仅扫签字：${featureDir}`)
    const featureFiles = walkDir(featureDir, featureDir)
    const violations = []
    for (const f of featureFiles) {
      if (!f.rel.endsWith('.md')) continue
      const text = readFileSync(f.abs, 'utf8')
      const statusDraft = /状态[^\n]*`(草稿|draft|DRAFT)/i.test(text)
      const todoBlock = /```\s*\nTODO/i.test(text) || /## TODO/i.test(text)
      if (statusDraft || todoBlock) {
        violations.push({ rel: f.rel, reason: statusDraft ? '状态=草稿/draft' : 'TODO 段落' })
      }
    }
    if (violations.length > 0) {
      console.error('✗ --check-signing 发现未签字 / TODO 残留：')
      for (const v of violations) {
        console.error(`  - ${v.rel}（${v.reason}）`)
      }
      console.error('  处理：把「状态」改为「已签字」并填「签字与版本」区块，或清掉 TODO 段落')
      process.exit(2)
    }
    console.log('✓ --check-signing 通过（未发现草稿 / TODO 残留）')
    return
  }

  // 工具：递归列出目录所有文件（相对 rootDir）
  function walkDir(dir, rootDir) {
    if (!existsSync(dir)) return []
    const out = []
    for (const name of readdirSync(dir)) {
      const p = join(dir, name)
      const st = statSync(p)
      if (st.isDirectory()) out.push(...walkDir(p, rootDir))
      else out.push({ abs: p, rel: relative(rootDir, p) })
    }
    return out
  }

  // 工具：根据文件相对路径判断目标位置
  //   tasks/backend/_template/*  → <path>/tasks/backend/*
  //   tasks/frontend/_template/* → <path>/tasks/frontend/*
  //   qa/_template/*             → <path>/qa/*
  //   其余 → <path>/<rel>
  // 注：walkDir 以 specs/_template 为根，rel 不会带 '_template/' 前缀
  function classify(rel) {
    if (rel.startsWith('tasks/backend/_template/')) {
      return { stage: 'tasks-backend', targetRel: 'tasks/backend/' + rel.slice('tasks/backend/_template/'.length) }
    }
    if (rel.startsWith('tasks/frontend/_template/')) {
      return { stage: 'tasks-frontend', targetRel: 'tasks/frontend/' + rel.slice('tasks/frontend/_template/'.length) }
    }
    if (rel.startsWith('qa/_template/')) {
      return { stage: 'qa', targetRel: 'qa/' + rel.slice('qa/_template/'.length) }
    }
    if (rel.startsWith('tasks/')) {
      return { stage: 'tasks', targetRel: rel }
    }
    if (rel.startsWith('qa/')) {
      return { stage: 'qa', targetRel: rel }
    }
    return { stage: rel.replace(/\.md$/, ''), targetRel: rel }
  }

  const rendered = []
  for (const f of walkDir(templatesRoot, templatesRoot)) {
    // 跳过 tasks/_template/（入口指针，声明"不作模板"，不能渲染进 feature）
    if (f.rel.startsWith('tasks/_template/')) continue
    const { stage, targetRel } = classify(f.rel)
    // 跳过模板说明性质的 README（避免把模板说明复制到 feature 里）
    // 白名单：各 tier 总览 / qa 总览（feature 级 tasks/ 总览由 tier README 承担）
    const isFeatureReadme =
      targetRel === 'tasks/backend/README.md' ||
      targetRel === 'tasks/frontend/README.md' ||
      targetRel === 'qa/README.md'
    if (targetRel.endsWith('/README.md') && !isFeatureReadme) continue

    const out = join(featureDir, targetRel)
    const outDir = dirname(out)
    // 相对当前文件的跨层路径：供模板写可点击的引用（不落本机绝对路径）
    const rel = {
      cooker: relative(outDir, COOKER_ROOT),
      knowledge: relative(outDir, knowledgeRoot),
      project_registry: relative(outDir, registryPath),
    }
    const text = resolvePlaceholders(readFileSync(f.abs, 'utf8'), { rel })
    if (!dryRun) {
      mkdirSync(dirname(out), { recursive: true })
      writeFileSync(out, text, 'utf8')
    }
    rendered.push({
      src: relative(templatesRoot, f.abs),
      out: relative(targetRoot, out),
      stage,
    })
  }

  // 输出汇总
  console.log('')
  console.log(dryRun ? '✓ 预览完成（未写盘）：' : '✓ 渲染完成：')
  for (const r of rendered) {
    console.log(`  [${r.stage}] ${r.src}  →  ${r.out}`)
  }
  console.log('')
  console.log('下一步：填写 requirements.md → design-ui.md / design-contract.md → tasks/{backend,frontend}/T-NN-*.md → qa/README.md。')

  // ─── 签字检查（--check-signing）────────────────────────────────────
  // 两种用法：
  //   1) 配合渲染：渲染后立即扫，发现草稿/TODO 残留即报错
  //   2) 单独跑：node render-templates.mjs <existing-feature-dir> --check-signing（目标已存在时仅扫描，不渲染）
  if (args.includes('--check-signing') && !dryRun) {
    // 单独跑且目标不存在 → 报错
    if (rendered.length === 0 && !existsSync(featureDir)) {
      console.error(`✗ --check-signing 单独跑时目标必须已存在：${featureDir}`)
      process.exit(2)
    }
    const scanRoot = rendered.length > 0 ? featureDir : featureDir  // 渲染后或单跑都扫 featureDir
    const blockKeywords = ['草稿', 'draft', 'TODO', 'DRAFT']
    const featureFiles = walkDir(scanRoot, scanRoot)
    const violations = []
    for (const f of featureFiles) {
      if (!f.rel.endsWith('.md')) continue
      const text = readFileSync(f.abs, 'utf8')
      // 只扫「状态」字段——避免误命中正文里的关键词
      const statusDraft = /状态[^\n]*`(草稿|draft|DRAFT)/i.test(text)
      const todoBlock = /```\s*\nTODO/i.test(text) || /## TODO/i.test(text)
      if (statusDraft || todoBlock) {
        violations.push({ rel: f.rel, reason: statusDraft ? '状态=草稿/draft' : 'TODO 段落' })
      }
    }
    if (violations.length > 0) {
      console.error('✗ --check-signing 发现未签字 / TODO 残留：')
      for (const v of violations) {
        console.error(`  - ${v.rel}（${v.reason}）`)
      }
      console.error('  处理：把「状态」改为「已签字」并填「签字与版本」区块，或清掉 TODO 段落')
      process.exit(2)
    }
    console.log('✓ --check-signing 通过（未发现草稿 / TODO 残留）')
  }
}

main()
