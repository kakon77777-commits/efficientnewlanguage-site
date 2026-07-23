import type { Lang } from '../i18n';
import { LINKS } from '../lib/links';

const REPO = LINKS.github;

/**
 * All site copy, EN (primary) + ZH-Hant (hand-written, not machine-translated),
 * parallel and type-checked. Components read the active language's object via
 * `useContent()`. Sourced from the EML whitepaper, README, and v1.0 spec.
 */
export interface SiteContent {
  nav: { links: { id: string; label: string }[]; tryIt: string; cases: string; origins: string };
  hero: {
    badge: string;
    titleA: string;
    titleB: string;
    subtitle: string;
    ctaTry: string;
    ctaSpec: string;
    inLabel: string;
    pyLabel: string;
    runLabel: string;
    note: string;
  };
  what: { kicker: string; title: string; lead: string; principles: { title: string; body: string }[] };
  loop: { kicker: string; title: string; lead: string; steps: string[]; note: string };
  play: {
    kicker: string;
    title: string;
    lead: string;
    dirEml: string;
    dirPy: string;
    example: string;
    tabs: { python: string; trace: string; ast: string };
    run: string;
    stdout: string;
    events: string;
    anomalies: string;
    noOutput: string;
    fixErrors: string;
    clean: string;
    reverseNote: string;
    deferNote: string;
    rtOk: string;
    rtBad: string;
    rtNa: string;
    rtHot: string;
    copy: string;
    copied: string;
    transpiled: string;
    errors: string;
    reset: string;
    downloadEml: string;
    downloadPy: string;
    downloadTrace: string;
    loadedCase: string;
    caseLoadFailed: string;
  };
  terminal: {
    kicker: string;
    title: string;
    lead: string;
    filesLabel: string;
    editorLabel: string;
    outputLabel: string;
    tabs: { stdout: string; diagnostics: string; trace: string };
    reset: string;
    exportWorkspace: string;
    loadedCase: string;
    caseLoadFailed: string;
    commandPlaceholder: string;
    noOutputYet: string;
    noDiagnostics: string;
    noTrace: string;
    helpHint: string;
    pythonIdle: string;
    pythonLoading: string;
    pythonReady: string;
  };
  features: { kicker: string; title: string; lead: string; items: { phase: string; title: string; body: string }[] };
  ai: {
    kicker: string;
    title: string;
    lead: string;
    layers: { name: string; body: string }[];
    toolsTitle: string;
    toolsLead: string;
    linksTitle: string;
    curlNote: string;
    note: string;
  };
  symbols: {
    kicker: string;
    title: string;
    lead: string;
    colSym: string;
    colPy: string;
    colDesc: string;
    colFamily: string;
    colStatus: string;
    note: string;
    fullSpec: string;
    loopTitle: string;
    loopLead: string;
    loopCol: { id: string; name: string; rule: string; status: string };
  };
  cli: { kicker: string; title: string; lead: string; commands: { cmd: string; desc: string }[] };
  arch: { kicker: string; title: string; lead: string; packages: { name: string; role: string }[]; principle: string };
  oss: { kicker: string; title: string; lead: string; points: { title: string; body: string }[]; note: string; github: string };
  origins: {
    kicker: string;
    title: string;
    lead: string;
    definition: { kicker: string; title: string; lead: string; body: string; statusNote: string };
    capabilities: { kicker: string; title: string; lead: string; clusters: { title: string; items: string[] }[] };
    relation: {
      kicker: string;
      title: string;
      lead: string;
      subsetNote: string;
      projectionLead: string;
      projectionSteps: { title: string; body: string }[];
      noLossNote: string;
      directionNote: string;
    };
    roadmap: {
      kicker: string;
      title: string;
      lead: string;
      colPhase: string;
      colName: string;
      colDesc: string;
      colStatus: string;
      note: string;
    };
    sources: { kicker: string; title: string; lead: string; links: { title: string; desc: string; href: string }[]; deepLink: string };
  };
  footer: { tagline: string; rights: string; madeWith: string; contact: string; forAgents: string };
}

const NAV_IDS = [
  { id: 'what', en: 'Overview', zh: '概觀' },
  { id: 'playground', en: 'Playground', zh: '示範區' },
  { id: 'features', en: 'Capabilities', zh: '能力' },
  { id: 'ai', en: 'AI layer', zh: 'AI 層' },
  { id: 'symbols', en: 'Symbols', zh: '符號' },
  { id: 'architecture', en: 'Architecture', zh: '架構' },
  { id: 'opensource', en: 'License', zh: '授權' },
];

export const CONTENT: Record<Lang, SiteContent> = {
  en: {
    nav: { links: NAV_IDS.map((n) => ({ id: n.id, label: n.en })), tryIt: 'Try it', cases: 'Cases', origins: 'Origins' },
    hero: {
      badge: 'EML 2026 · Efficient New Language',
      titleA: 'Symbolic in.',
      titleB: 'Real result out.',
      subtitle:
        'EML is a deterministic semantic-overlay layer: it compresses high-frequency program intent into symbols and transpiles, rule-based and reversibly, to standard languages. Not a replacement language — an overlay for humans and AI agents alike.',
      ctaTry: 'Try it in your browser',
      ctaSpec: 'Read the v1.0 spec',
      inLabel: 'EML',
      pyLabel: 'Python',
      runLabel: 'Executed in-browser → stdout',
      note: 'The result above is computed live, in your browser, by EML’s execution-truth interpreter — no backend and no local Python needed to watch it run.',
    },
    what: {
      kicker: 'What EML is',
      title: 'A semantic overlay, not a new language to learn',
      lead: 'EML symbolizes the high-value regions of a program and transpiles them, deterministically, to a standard language. The symbolic form is the machine-canonical artifact; the editor projection is for humans.',
      principles: [
        { title: 'Optional enhancement', body: 'Symbolize the high-density regions — math, accumulation, time loops. Everything else stays ordinary Python.' },
        { title: 'Round-trip first', body: 'Rule-based and testable, with no LLM in the core chain. Python → EML → Python reaches a fixpoint for the supported subset.' },
        { title: 'Machine-first, human-adaptive', body: 'Symbols for machines and agents; a projection editor and a trace for humans to read, run, and audit.' },
      ],
    },
    loop: {
      kicker: 'The closed loop',
      title: 'Write it. Transpile it. Run it. Trace it back.',
      lead: 'One deterministic pass turns symbols into runnable, observable Python.',
      steps: ['EML / Py⁺', 'normalize', 'lex', 'parse → AST', 'semantic', 'emit', 'Python', 'run / trace'],
      note: 'Every step is rule-based and covered by tests (300+). The same resolved AST also targets a C⁺⁺⁺ prototype — one overlay, multiple back ends.',
    },
    play: {
      kicker: 'Interactive',
      title: 'The playground',
      lead: 'Type EML on the left, watch the Python expansion on the right, then run it — the program actually executes in your browser and emits a phosphor-jsonl-v1 trace. This in-browser playground needs no backend server and no local Python install.',
      dirEml: 'EML → Python',
      dirPy: 'Python → EML',
      example: 'Example',
      tabs: { python: 'Python', trace: 'Run / Trace', ast: 'AST' },
      run: 'stdout',
      stdout: 'Executed in-browser',
      events: 'events',
      anomalies: 'anomalies',
      noOutput: '(no output)',
      fixErrors: 'Fix the errors above to run.',
      clean: 'No diagnostics — clean.',
      reverseNote: 'Reverse compression is a deterministic inverse for the supported subset; it fails loudly on inexpressible constructs.',
      deferNote: 'numpy / temporal constructs run only under a real Python runtime — the interpreter defers them.',
      rtOk: '⇄ round-trip fixpoint',
      rtBad: '⇄ mismatch',
      rtNa: '⇄ n/a · functions are forward-only',
      rtHot: '⇄ n/a · @hot marker is comment-only (permanent, cosmetic)',
      copy: 'copy JSONL',
      copied: 'copied ✓',
      transpiled: 'transpiled',
      errors: 'error(s)',
      reset: 'Reset',
      downloadEml: 'Download .eml',
      downloadPy: 'Download .py',
      downloadTrace: 'Download trace',
      loadedCase: 'Loaded from case:',
      caseLoadFailed: "Could not load that case — showing the default example instead.",
    },
    terminal: {
      kicker: 'Web Terminal',
      title: 'A real EML workspace, in your browser',
      lead: 'Type commands, edit files, run the real toolchain — no local install. Everything here calls the same parser, transpiler, interpreter and trace emitter that power the Playground, routed through explicit, structured commands instead of eval\'d strings.',
      filesLabel: 'Files',
      editorLabel: 'Editor',
      outputLabel: 'Output',
      tabs: { stdout: 'stdout', diagnostics: 'Diagnostics', trace: 'Trace' },
      reset: 'Reset workspace',
      exportWorkspace: 'Export workspace',
      loadedCase: 'Loaded case:',
      caseLoadFailed: 'Could not load that case — the workspace was left as-is.',
      commandPlaceholder: 'eml run main.eml',
      noOutputYet: 'Run a command to see output here.',
      noDiagnostics: 'No diagnostics for the last command.',
      noTrace: 'No trace for the last command — try "eml run" or "eml trace".',
      helpHint: 'Type "help" for the command list.',
      pythonIdle: 'Python: not loaded',
      pythonLoading: 'Python: loading…',
      pythonReady: 'Python: ready',
    },
    features: {
      kicker: 'Capabilities',
      title: 'Five phases, one closed system',
      lead: 'EML grew in deterministic, test-gated phases. Each ships real behavior, not a promise.',
      items: [
        { phase: 'Phase 0', title: 'Py⁺ transpiler', body: 'The hard closed loop: EML → Python, deterministic, with golden tests and real execution.' },
        { phase: 'Phase 1', title: 'Bidirectional + round-trip', body: 'A deterministic Python → EML inverse with a fixpoint validator. AI-assisted compression is suggestion-only and execution-gated.' },
        { phase: 'Phase 2', title: 'Cold / hot + crystallization', body: '@cold pure logic becomes cacheable (@functools.cache); interprocedural purity, structural AST-hash caching, importance scoring.' },
        { phase: 'Phase 3', title: 'Temporal loops + BUG classifier', body: '@temporal_loop: a no-busy-wait asyncio runtime with a hard deadline. Errors classify into 5 levels, mapped back to EML source.' },
        { phase: 'Phase 4', title: 'loopKind + C⁺⁺⁺', body: 'Static loop-classification metadata, and a C++20 prototype from the same resolved AST — proving one overlay can target many back ends.' },
        { phase: 'Phase 5', title: 'Execution truth + trace', body: 'A browser-safe interpreter computes exactly what Python would (gated by tests) and emits a phosphor-jsonl-v1 trace. It powers this playground.' },
      ],
    },
    ai: {
      kicker: 'AI-native interface',
      title: 'Not just a website — a semantic node for humans and AI',
      lead: 'A React playground is great for people but opaque to crawlers and agents. So EML also publishes a public, non-visual, versioned, machine-readable surface at /ai/ — and bounded tools agents can actually call.',
      layers: [
        { name: 'Human UI Layer', body: 'The landing page, workbench, and in-browser playground — for people to see it, run it, and trust it.' },
        { name: 'Machine Corpus Layer', body: 'Plain-text + structured data at /ai/: concept genealogy, the v1.0 spec, EBNF grammar, AST / trace / error JSON Schemas, and verified examples.' },
        { name: 'Agent Tool Layer', body: 'Bounded, machine-callable endpoints at /ai/tools/* running the real toolchain at the edge — parse, transpile (both ways), interpret, trace, round-trip.' },
      ],
      toolsTitle: 'Bounded tools, callable from any agent',
      toolsLead: 'The same browser-safe toolchain, bundled into the edge worker. No arbitrary execution, no filesystem, no shell, no outbound network; inputs capped at 20k chars; structured errors and a trace id on every call.',
      linksTitle: 'Machine entrypoints',
      curlNote: 'Live, deterministic, no LLM in the core — try it from your terminal:',
      note: 'No cloaking: humans and machines are served from distinct public entrypoints, never different content per User-Agent.',
    },
    symbols: {
      kicker: 'Notation',
      title: 'The symbol catalog',
      lead: 'A small, stable set of overlays. ASCII is canonical; a Unicode display form (Σ, ∈, ⇒) projects on top.',
      colSym: 'EML / Py⁺',
      colPy: 'Python',
      colDesc: 'Meaning',
      colFamily: 'Family',
      colStatus: 'Status',
      note: 'This is a compact, hand-picked slice of the full registry (eml-symbols.json), grouped by syntax family with an implementation-status label — implemented, partial, conceptual, or planned.',
      fullSpec: 'Full self-contained AI-semantic spec (status vocabulary, twelve-loop taxonomy, bug/repair/criticality models)',
      loopTitle: 'The twelve-loop semantic taxonomy',
      loopLead: 'EML classifies loops by intent and dynamics, not only by surface keyword — a plain while can be several of these classes. Only 5 of the 12 classes have accepted surface syntax today; the rest are conceptual.',
      loopCol: { id: 'ID', name: 'Loop class', rule: 'Semantic rule', status: 'Status' },
    },
    cli: {
      kicker: 'Command line',
      title: 'A real toolchain',
      lead: 'The eml CLI runs the whole pipeline from source — parse, transpile, execute, trace, classify, round-trip.',
      commands: [
        { cmd: 'eml run f.eml', desc: 'transpile and execute via Python' },
        { cmd: 'eml transpile f.eml --target cpp', desc: 'EML → Python, or the C⁺⁺⁺ prototype' },
        { cmd: 'eml trace f.eml --run', desc: 'phosphor-jsonl-v1 trace; bakes in an interp≡Python check' },
        { cmd: 'eml compress f.py', desc: 'reverse: Python (subset) → EML' },
        { cmd: 'eml roundtrip f.eml', desc: 'EML → Py → EML → Py fixpoint check' },
        { cmd: 'eml bugs f.eml --run', desc: 'classify errors (5 levels), mapped to source' },
      ],
    },
    arch: {
      kicker: 'Architecture',
      title: 'Small packages, no cycles, run from source',
      lead: 'A TypeScript monorepo. The parser, transpiler and interpreter are browser-safe — which is exactly why the playground above runs with no backend.',
      packages: [
        { name: '@eml/parser', role: 'normalize → lex → parse → AST' },
        { name: '@eml/transpiler-python', role: 'semantic analysis + Python emitter' },
        { name: '@eml/transpiler-eml', role: 'reverse + round-trip validators' },
        { name: '@eml/transpiler-cpp', role: 'C⁺⁺⁺ prototype back end' },
        { name: '@eml/interp', role: 'execution-truth interpreter + trace' },
        { name: '@eml/trace', role: 'phosphor-jsonl-v1 emitter' },
        { name: '@eml/bug-classifier', role: '5-level BUG classifier' },
        { name: '@eml/cli', role: 'the eml command' },
      ],
      principle: 'No LLM in the core transpilation chain. Determinism and round-trip faithfulness are invariants, not features.',
    },
    oss: {
      kicker: 'License & patent',
      title: 'Open source, under Apache-2.0',
      lead: 'EML is free to use, study, modify, and build on — commercial use included. Keep the attribution, credit the original author, and the rest is yours.',
      points: [
        { title: 'Open source (Apache-2.0)', body: 'The whole project is released under the Apache License 2.0 — use it, fork it, ship products with it.' },
        { title: 'Just credit the author', body: 'Keep the license/attribution notices and respect Neo.K (許筌崴) / EveMissLab as the original author. That is the only ask beyond the license.' },
        { title: 'Patent — granted to you', body: 'Aspects are covered by Taiwan Utility Model M672933 (Taiwan only). Apache-2.0 includes a patent-license grant, so you are covered — and some concepts already reach beyond the patent.' },
        { title: 'Contributions welcome', body: 'Inbound contributions are under the same Apache-2.0 terms (inbound = outbound). No separate CLA.' },
      ],
      note: 'Built in the open. Commercial use, forks, and adaptations are all welcome under Apache-2.0.',
      github: 'View on GitHub',
    },
    origins: {
      kicker: 'Origins',
      title: 'EML-U — the original vision',
      lead: 'EML formally splits into two profiles. EML-P is what is built and shipping today — see Docs and the Workbench. This page preserves EML-U: the original, broader idea EML-P was drawn from, and the direction future work may take.',
      definition: {
        kicker: 'Definition',
        title: 'What EML-U is',
        lead: 'EML-U is EML’s complete original Profile: universal semantic attachment, high-density symbols, structural and intent compression, non-linear representation, cross-host and AI-native collaboration.',
        body: 'EML-P ⊆ EML-U. EML-P (see Docs) is EML-U’s stable, linear, low-ambiguity, engineered subset. Every EML-P program should have an EML-U semantic representation; EML-U can contain semantics EML-P does not support yet.',
        statusNote: 'Current status: theory-preservation stage. Zero code, zero engineering directory. This page and the linked documents are the preservation work itself.',
      },
      capabilities: {
        kicker: 'Original capabilities',
        title: 'What EML-U preserves',
        lead: 'None of this is implemented. It is recorded here so it is not forgotten while EML-P keeps getting engineered.',
        clusters: [
          {
            title: 'Position & structure',
            items: [
              'Multi-position semantic attachment — upper-right, upper-left, lower-right, lower-left',
              'Layers of meaning above and below the code',
              'Two-dimensional syntax, non-linear reading order',
              'Multi-layer symbols, structural folding',
            ],
          },
          {
            title: 'Semantic modeling',
            items: ['Semantic graphs', 'Intent nodes', 'Host-neutral Semantic IR'],
          },
          {
            title: 'Cross-host & cross-media',
            items: [
              'Multi-host projection — one semantics, projected to Python / C++ / JS / natural-language explanation / Agent JSON',
              'Natural-language attachment (e.g. “ship v1 next week” carrying deadline semantics)',
              'Data-field attachment — unit, type, source, privacy, quality',
              'Workflow-node attachment — retryable, idempotent, needs human review, risk, cost',
              'Multimedia time/space attachment — audio, image, video timelines, 3D scenes, game worlds',
            ],
          },
          {
            title: 'AI-native',
            items: ['AI-adaptive display', 'Domain-specific semantic packages', 'Multiple reader-projections of the same semantics'],
          },
        ],
      },
      relation: {
        kicker: 'Relation to EML-P',
        title: 'How EML-P and EML-U relate',
        lead: 'The two profiles are not competing designs — one is the engineered projection of the other.',
        subsetNote: 'EML-P ⊆ EML-U — EML-P is a linear projection of EML-U.',
        projectionLead: 'Any EML-U structure downgrades through the projection function Π_P into one of three outcomes:',
        projectionSteps: [
          { title: 'Fully expressible', body: 'Downgrades completely into EML-P.' },
          { title: 'Executable, not preservable', body: 'Becomes EML-P plus explicit metadata.' },
          { title: 'Unsafe to express', body: 'Marked unsupported — never silently dropped.' },
        ],
        noLossNote: 'No silent loss: if EML-P cannot represent something EML-U expresses, the system must report it explicitly — never quietly leave only the surface code behind.',
        directionNote: 'EML-U may understand, import, and generate EML-P. EML-P specs may never retroactively delete EML-U theory, and what EML-P’s parser happens to support today must never be read back as EML-U’s boundary.',
      },
      roadmap: {
        kicker: 'Roadmap',
        title: 'EML-U’s own roadmap (U0–U4)',
        lead: 'Separate from EML-P’s own roadmap (see Docs) and from the deeper source document’s system-wide migration steps — EML-U’s U-numbering is its own.',
        colPhase: 'Phase',
        colName: 'Name',
        colDesc: 'Description',
        colStatus: 'Status',
        note: 'EML-U engineering, when it starts, is meant to live in an independent experimental directory — not mixed into EML-P’s current packages.',
      },
      sources: {
        kicker: 'Read the source',
        title: 'The normative documents',
        lead: 'This page is a readable summary. These three documents are the actual source — read them before building anything on EML-U.',
        links: [
          { title: 'EML-P Profile', desc: 'What is built and shipping today.', href: `${REPO}/blob/main/docs/EML-P-PROFILE.md` },
          { title: 'EML-U Profile', desc: 'The full original vision, in detail.', href: `${REPO}/blob/main/docs/EML-U-PROFILE.md` },
          { title: 'EML-P ↔ EML-U Compatibility', desc: 'The subset relation, the projection function, the no-silent-loss rule.', href: `${REPO}/blob/main/docs/EML-P-EML-U-COMPATIBILITY.md` },
        ],
        deepLink: 'Read the full formal model (Semantic IR, layered architecture, TypeScript interface drafts)',
      },
    },
    footer: {
      tagline: 'Efficient New Language — a high-density semantic overlay for humans and AI agents.',
      rights: '© 2026 EveMissLab (一言諾科技有限公司) / Neo.K. All rights reserved.',
      madeWith: 'This site’s demos run on the real EML toolchain, in your browser.',
      contact: 'Contact',
      forAgents: 'For agents',
    },
  },

  zh: {
    nav: { links: NAV_IDS.map((n) => ({ id: n.id, label: n.zh })), tryIt: '立即試用', cases: '案例庫', origins: '緣起' },
    hero: {
      badge: 'EML 2026 · 高效新語言',
      titleA: '輸入符號，',
      titleB: '輸出真實結果。',
      subtitle:
        'EML 是一套確定性的「語意疊加層」：把程式裡高頻出現的意圖壓成符號，再以規則化、可逆的方式轉譯回標準語言。它不取代任何語言，而是人類與 AI 代理都能共用的一層疊加。',
      ctaTry: '在瀏覽器裡試一下',
      ctaSpec: '閱讀 v1.0 規格',
      inLabel: 'EML',
      pyLabel: 'Python',
      runLabel: '瀏覽器內執行 → stdout',
      note: '上面這個結果，是 EML 的「執行真相」直譯器在你的瀏覽器裡當場算出來的——看它跑起來，不需要後端，也不需要在本機安裝 Python。',
    },
    what: {
      kicker: 'EML 是什麼',
      title: '一層語意疊加，而不是要你重學的新語言',
      lead: 'EML 只把程式裡最有價值的片段符號化，再確定性地轉譯回標準語言。符號是給機器看的正規形式，編輯器裡的展開則是給人看的。',
      principles: [
        { title: '選擇性增益', body: '只把高密度的地方符號化——數學、累加、時間迴圈；其餘照常是一般的 Python。' },
        { title: '可逆優先', body: '規則化、可測試，核心流程不放任何 LLM。在支援的子集裡，Python → EML → Python 會回到同一個不動點。' },
        { title: '機器優先，人類自適應', body: '符號給機器和代理使用；投影編輯器與執行 trace 則讓人能讀、能跑、能稽核。' },
      ],
    },
    loop: {
      kicker: '一個閉環',
      title: '寫得出、轉得過、跑得起、追得回',
      lead: '一趟確定性的流程，就把符號變成可執行、可觀測的 Python。',
      steps: ['EML / Py⁺', '正規化', '詞法分析', '語法分析 → AST', '語意分析', '輸出', 'Python', '執行 / trace'],
      note: '每一步都是規則化的，而且都有測試把關（300 個以上）。同一份解析完成的 AST 還能輸出成 C⁺⁺⁺ 原型——一層疊加，多種後端。',
    },
    play: {
      kicker: '互動體驗',
      title: '線上示範區',
      lead: '左邊打 EML，右邊立刻看到展開後的 Python，再按執行——程式會真的在你的瀏覽器裡跑起來，並產生一份 phosphor-jsonl-v1 trace。這個線上 Playground 不需要後端伺服器，也不需要在本機安裝 Python。',
      dirEml: 'EML → Python',
      dirPy: 'Python → EML',
      example: '範例',
      tabs: { python: 'Python', trace: '執行 / Trace', ast: 'AST' },
      run: 'stdout',
      stdout: '瀏覽器內執行',
      events: '個事件',
      anomalies: '個異常',
      noOutput: '（沒有輸出）',
      fixErrors: '先修正上面的錯誤才能執行。',
      clean: '沒有任何診斷訊息，乾淨。',
      reverseNote: '反向壓縮是支援子集的確定性反函數；遇到無法表達的寫法會直接報錯，不會硬猜。',
      deferNote: 'numpy 與時間迴圈這類構造只能在真正的 Python 環境裡跑，直譯器會把它們交給後端處理。',
      rtOk: '⇄ 往返回到不動點',
      rtBad: '⇄ 兩邊不一致',
      rtNa: '⇄ 不適用 · 函數為單向',
      rtHot: '⇄ 不適用 · @hot 僅為註解標記（永久性、無實質差異）',
      copy: '複製 JSONL',
      copied: '已複製 ✓',
      transpiled: '已轉譯',
      errors: '個錯誤',
      reset: '重設',
      downloadEml: '下載 .eml',
      downloadPy: '下載 .py',
      downloadTrace: '下載 trace',
      loadedCase: '案例載入自：',
      caseLoadFailed: '無法載入該案例，改顯示預設範例。',
    },
    terminal: {
      kicker: 'Web Terminal',
      title: '一個真正的 EML 工作區，就在瀏覽器裡',
      lead: '打指令、編輯檔案、跑真正的工具鏈——不用裝任何東西。這裡呼叫的是驅動示範區的同一套解析器、轉譯器、直譯器與 trace 產生器，只是改用明確、結構化的指令路由，而不是把字串丟給 eval。',
      filesLabel: '檔案',
      editorLabel: '編輯器',
      outputLabel: '輸出',
      tabs: { stdout: 'stdout', diagnostics: '診斷', trace: 'Trace' },
      reset: '重設工作區',
      exportWorkspace: '匯出工作區',
      loadedCase: '已載入案例：',
      caseLoadFailed: '無法載入該案例——工作區維持原樣。',
      commandPlaceholder: 'eml run main.eml',
      noOutputYet: '執行一個指令後，這裡會顯示輸出。',
      noDiagnostics: '上一個指令沒有診斷訊息。',
      noTrace: '上一個指令沒有 trace——試試「eml run」或「eml trace」。',
      helpHint: '輸入「help」查看指令清單。',
      pythonIdle: 'Python：尚未載入',
      pythonLoading: 'Python：載入中…',
      pythonReady: 'Python：就緒',
    },
    features: {
      kicker: '能力',
      title: '五個階段，一個完整閉環',
      lead: 'EML 是一階一階、用測試把關長出來的。每一階交出的都是真的能跑的東西，不是口頭承諾。',
      items: [
        { phase: '階段 0', title: 'Py⁺ 轉譯器', body: '最硬的那個閉環：EML → Python，確定性轉譯，有 golden 測試，也真的會執行。' },
        { phase: '階段 1', title: '雙向轉譯 + 往返驗證', body: '確定性的 Python → EML 反函數，搭配不動點驗證。AI 輔助壓縮只給建議，而且每一條都要先通過執行驗證。' },
        { phase: '階段 2', title: '冷熱分離 + 結晶化', body: '@cold 的純邏輯可以被快取（@functools.cache）；含跨函數純度分析、以結構雜湊做快取、以及重要度評分。' },
        { phase: '階段 3', title: '時間迴圈 + 錯誤分類', body: '@temporal_loop 是一套不空轉等待、且有硬性時限的 asyncio 執行期。錯誤分成五級，並對應回 EML 原始碼。' },
        { phase: '階段 4', title: 'loopKind + C⁺⁺⁺', body: '靜態的迴圈分類資訊；並由同一份 AST 產出 C++20 原型——證明一層疊加可以對應到多種後端。' },
        { phase: '階段 5', title: '執行真相 + trace', body: '一個瀏覽器安全的直譯器，算出與 Python 完全一致的結果（有測試把關），並輸出 phosphor-jsonl-v1 trace。這個示範區就是它驅動的。' },
      ],
    },
    ai: {
      kicker: 'AI 原生接口',
      title: '不只是一個網站，而是給人類與 AI 的語義節點',
      lead: 'React 示範區對人很好，但對爬蟲與代理來說是不透明的。所以 EML 另外在 /ai/ 發布一個公開、非視覺化、可版本化、機器可讀的表面——還有代理真的能調用的受限工具。',
      layers: [
        { name: 'Human UI Layer（人類層）', body: '首頁、工程工作台、瀏覽器內示範區——讓人看得到、跑得起、信得過。' },
        { name: 'Machine Corpus Layer（機器語料層）', body: '/ai/ 下的純文字 + 結構化資料：概念譜系、v1.0 規格、EBNF 文法、AST／trace／error 的 JSON Schema，以及已驗證的範例。' },
        { name: 'Agent Tool Layer（代理工具層）', body: '/ai/tools/* 下受限、可被機器調用的端點，在邊緣執行真實工具鏈——解析、雙向轉譯、直譯、trace、往返驗證。' },
      ],
      toolsTitle: '受限工具，任何代理都能調用',
      toolsLead: '同一套瀏覽器安全的工具鏈，打包進邊緣 worker。不執行任意程式碼、無檔案系統、無 shell、無對外網路；輸入上限 2 萬字元；每次呼叫都回傳結構化錯誤與 trace id。',
      linksTitle: '機器入口',
      curlNote: '即時、確定性、核心不放 LLM——直接在終端機試：',
      note: '不做 cloaking：人類與機器各自從不同的公開入口取得內容，絕不依 User-Agent 給不同內容。',
    },
    symbols: {
      kicker: '記法',
      title: '符號表',
      lead: '一組精簡而穩定的疊加符號。ASCII 是正規寫法；Σ、∈、⇒ 這些 Unicode 顯示形式只是疊在上面的投影。',
      colSym: 'EML / Py⁺',
      colPy: 'Python',
      colDesc: '含義',
      colFamily: '類別',
      colStatus: '狀態',
      note: '這裡只是完整符號登記表（eml-symbols.json）中精選出的一小部分，依語法類別分組，並標示實作狀態——implemented（已實作）、partial（部分實作）、conceptual（僅概念）或 planned（規劃中）。',
      fullSpec: '完整、自足的 AI 語義規格（狀態詞彙、十二種迴圈分類、錯誤/修復/關鍵度模型）',
      loopTitle: '十二種迴圈語義分類',
      loopLead: 'EML 依「意圖與動態行為」而非單純表面關鍵字來分類迴圈——同一個 while 可能對應多種語義類別。目前 12 類中只有 5 類擁有可接受的表面語法，其餘仍屬概念層級。',
      loopCol: { id: 'ID', name: '迴圈類別', rule: '語義規則', status: '狀態' },
    },
    cli: {
      kicker: '命令列',
      title: '一套真正能用的工具鏈',
      lead: 'eml 指令直接從原始碼跑完整流程——解析、轉譯、執行、追蹤、分類、往返驗證。',
      commands: [
        { cmd: 'eml run f.eml', desc: '轉譯後直接用 Python 執行' },
        { cmd: 'eml transpile f.eml --target cpp', desc: '轉成 Python，或 C⁺⁺⁺ 原型' },
        { cmd: 'eml trace f.eml --run', desc: '產生 phosphor-jsonl-v1 trace，並內建 interp≡Python 比對' },
        { cmd: 'eml compress f.py', desc: '反向：把 Python（子集）壓回 EML' },
        { cmd: 'eml roundtrip f.eml', desc: 'EML → Py → EML → Py 不動點檢查' },
        { cmd: 'eml bugs f.eml --run', desc: '錯誤分五級，並對應回原始碼' },
      ],
    },
    arch: {
      kicker: '架構',
      title: '小套件、無循環依賴、直接從原始碼跑',
      lead: '一個 TypeScript monorepo。解析器、轉譯器與直譯器都是瀏覽器安全的——這正是上面那個示範區能不靠後端就跑起來的原因。',
      packages: [
        { name: '@eml/parser', role: '正規化 → 詞法 → 語法 → AST' },
        { name: '@eml/transpiler-python', role: '語意分析 + Python 輸出' },
        { name: '@eml/transpiler-eml', role: '反向轉譯 + 往返驗證' },
        { name: '@eml/transpiler-cpp', role: 'C⁺⁺⁺ 原型後端' },
        { name: '@eml/interp', role: '執行真相直譯器 + trace' },
        { name: '@eml/trace', role: 'phosphor-jsonl-v1 輸出器' },
        { name: '@eml/bug-classifier', role: '五級錯誤分類器' },
        { name: '@eml/cli', role: 'eml 指令' },
      ],
      principle: '核心轉譯流程完全不放 LLM。確定性與往返一致性是不可違反的不變式，而不是附加功能。',
    },
    oss: {
      kicker: '授權與專利',
      title: '開源，採用 Apache-2.0',
      lead: 'EML 可以自由使用、研究、修改、再延伸，商業用途也沒問題。保留署名、尊重原作者，其餘都歸你。',
      points: [
        { title: '開源（Apache-2.0）', body: '整個專案以 Apache License 2.0 釋出——盡管使用、fork、拿去做產品。' },
        { title: '只要署名原作者', body: '保留授權與署名聲明，並尊重 Neo.K（許筌崴）/ EveMissLab 是原作者。除了授權條款本身，這是唯一的請求。' },
        { title: '專利——已授權給你', body: '部分設計受台灣新型專利 M672933 保護（僅限台灣）。Apache-2.0 內含專利授權條款，所以你已被涵蓋；而且有些概念其實已經超出專利範圍。' },
        { title: '歡迎貢獻', body: '送進來的貢獻同樣適用 Apache-2.0（貢獻即採同一授權），不需要另外簽 CLA。' },
      ],
      note: '在開放中打造。商業使用、fork、改編，在 Apache-2.0 之下一律歡迎。',
      github: '在 GitHub 上查看',
    },
    origins: {
      kicker: '緣起',
      title: 'EML-U——最初的構想',
      lead: 'EML 正式分成兩個 Profile。EML-P 是現在做出來、正在運作的一切——見文件與 Workbench。這頁保存 EML-U：EML-P 脫胎於此的原始、更廣義構想，以及未來可能的方向。',
      definition: {
        kicker: '定義',
        title: 'EML-U 是什麼',
        lead: 'EML-U 是 EML 原始理論的完整 Profile：通用語意附加、高密度符號、結構與意圖壓縮、非線性表示、跨宿主與 AI 原生協作。',
        body: 'EML-P ⊆ EML-U。EML-P（見文件）是 EML-U 的穩定、線性、低歧義、已工程化的子集。每個 EML-P 程式都應該有對應的 EML-U 語意表示；EML-U 可以包含 EML-P 尚未支援的語意。',
        statusNote: '目前狀態：理論封存階段。零程式碼、沒有獨立的工程目錄。這個頁面跟連結的文件本身，就是封存工作。',
      },
      capabilities: {
        kicker: '原始能力',
        title: 'EML-U 保留的原始能力',
        lead: '以下都還沒有實作。記錄在這裡，是為了在 EML-P 持續施工的同時，不遺忘它們。',
        clusters: [
          {
            title: '位置與結構',
            items: ['多位置語意附加——右上、左上、右下、左下', '程式碼上方與下方的語意層', '二維語法，非線性閱讀順序', '多層符號，結構折疊'],
          },
          {
            title: '語意建模',
            items: ['語意圖（Semantic Graph）', '意圖節點', '宿主中立的 Semantic IR'],
          },
          {
            title: '跨宿主與跨媒介',
            items: [
              '多宿主投影——同一語意，投影成 Python／C++／JS／自然語言說明／Agent JSON',
              '自然語言附加（例如「下週完成初版」帶有 deadline 語意）',
              '資料欄位附加——單位、型別、來源、隱私、品質',
              '工作流節點附加——可重試、冪等、需人工確認、風險、成本',
              '多媒體時空附加——音訊、圖片、影片時間軸、3D 場景、遊戲世界',
            ],
          },
          {
            title: 'AI 原生',
            items: ['AI 自適應顯示', '領域專用語意包', '同一語意的多種讀者投影'],
          },
        ],
      },
      relation: {
        kicker: '與 EML-P 的關係',
        title: 'EML-P 與 EML-U 如何關聯',
        lead: '這兩個 Profile 不是互相競爭的設計——一個是另一個的工程化投影。',
        subsetNote: 'EML-P ⊆ EML-U——EML-P 是 EML-U 的一種線性投影。',
        projectionLead: '任何 EML-U 結構，透過投影函數 Π_P 降級，會得到以下三種結果之一：',
        projectionSteps: [
          { title: '可以完整表達', body: '完整降級為 EML-P。' },
          { title: '可執行但無法保存', body: '轉成 EML-P，外加明確的 metadata。' },
          { title: '無法安全表達', body: '明確標示為 unsupported——絕不悄悄遺失。' },
        ],
        noLossNote: '不允許靜默遺失：如果 EML-P 無法表示 EML-U 表達的內容，系統必須明確回報——絕不能只悄悄留下表面程式碼。',
        directionNote: 'EML-U 可以理解、匯入、生成 EML-P。EML-P 規格不能反過來刪除 EML-U 理論，EML-P 現行 parser 剛好能解析什麼，也不能被反推當成 EML-U 的邊界。',
      },
      roadmap: {
        kicker: '路線圖',
        title: 'EML-U 自己的路線圖（U0–U4）',
        lead: '跟 EML-P 自己的路線圖（見文件）是分開的，跟更深層來源文件裡「整個系統」的遷移步驟編號也不一樣——EML-U 的 U 編號是它自己的。',
        colPhase: '階段',
        colName: '名稱',
        colDesc: '說明',
        colStatus: '狀態',
        note: 'EML-U 的工程，未來啟動時，應該放在獨立的實驗性目錄——不會跟 EML-P 現行的 packages 混在一起。',
      },
      sources: {
        kicker: '延伸閱讀',
        title: '規範性文件',
        lead: '這個頁面是給人讀的摘要。真正的來源是這三份文件——在 EML-U 上做任何事之前，先讀它們。',
        links: [
          { title: 'EML-P Profile', desc: '現在做出來、正在運作的一切。', href: `${REPO}/blob/main/docs/EML-P-PROFILE.md` },
          { title: 'EML-U Profile', desc: '完整的原始構想細節。', href: `${REPO}/blob/main/docs/EML-U-PROFILE.md` },
          { title: 'EML-P ↔ EML-U 相容性規範', desc: '子集關係、投影函數、不允許靜默遺失規則。', href: `${REPO}/blob/main/docs/EML-P-EML-U-COMPATIBILITY.md` },
        ],
        deepLink: '閱讀完整形式模型（Semantic IR、分層架構、TypeScript 介面草案）',
      },
    },
    footer: {
      tagline: '高效新語言——給人類與 AI 代理的高密度語意疊加層。',
      rights: '© 2026 EveMissLab（一言諾科技有限公司）/ Neo.K（許筌崴）。保留一切權利。',
      madeWith: '本站的示範，都是真的 EML 工具鏈在你的瀏覽器裡跑出來的。',
      contact: '聯絡',
      forAgents: '給代理',
    },
  },
};

export function useContentFor(lang: Lang): SiteContent {
  return CONTENT[lang];
}
