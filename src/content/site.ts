import type { Lang } from '../i18n';

/**
 * All site copy, EN (primary) + ZH-Hant (hand-written, not machine-translated),
 * parallel and type-checked. Components read the active language's object via
 * `useContent()`. Sourced from the EML whitepaper, README, and v1.0 spec.
 */
export interface SiteContent {
  nav: { links: { id: string; label: string }[]; tryIt: string; cases: string };
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
    nav: { links: NAV_IDS.map((n) => ({ id: n.id, label: n.en })), tryIt: 'Try it', cases: 'Cases' },
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
    footer: {
      tagline: 'Efficient New Language — a high-density semantic overlay for humans and AI agents.',
      rights: '© 2026 EveMissLab (一言諾科技有限公司) / Neo.K. All rights reserved.',
      madeWith: 'This site’s demos run on the real EML toolchain, in your browser.',
      contact: 'Contact',
      forAgents: 'For agents',
    },
  },

  zh: {
    nav: { links: NAV_IDS.map((n) => ({ id: n.id, label: n.zh })), tryIt: '立即試用', cases: '案例庫' },
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
