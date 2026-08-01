import type { Lang } from '../i18n';

/**
 * The "Related" link area (/related) — Neo.K / EveMissLab's sibling language &
 * specification projects that are NOT EML, each with its own spec-grade page at
 * /related/<slug>. No sub-sites: these pages live in this repo and are rendered
 * from the registry below, so adding the next project is one entry here plus one
 * line in scripts/prerender.mjs + public/sitemap.xml.
 *
 * Every fact in this file is sourced from the project's own frozen release
 * artifacts (whitepapers, freeze contracts, test reports) — see each entry's
 * `docs` section for the exact documents. Where a project explicitly refuses a
 * claim (conformance, consensus, license), this file refuses it too.
 */

/** A string that exists in both site languages. */
type L = Record<Lang, string>;
/** A string list that exists in both site languages (parallel, same length). */
type LL = Record<Lang, string[]>;

/** Row / item maturity, reusing the site's status vocabulary. */
export type RelatedStatus = 'stable' | 'partial' | 'draft' | 'planned';

export interface RelatedTableRow {
  /** First column — rendered mono, accent-coloured (phase id, level, letter…). */
  id: string;
  /** Remaining columns, in order. Columns at index >= 1 are hidden below `sm`. */
  cells: L[];
  status?: RelatedStatus;
}

/**
 * A page section. The renderer (pages/RelatedProject.tsx) maps `kind` to one of
 * the site's existing visual patterns, so these pages look native rather than
 * like a bolted-on microsite.
 */
export type RelatedSection =
  | { kind: 'prose'; id?: string; kicker: L; title: L; lead?: L; paras?: LL; callout?: L }
  | { kind: 'cards'; id?: string; kicker: L; title: L; lead?: L; cards: { title: L; body: L }[]; note?: L }
  | { kind: 'pipeline'; id?: string; kicker: L; title: L; lead?: L; steps: LL; note?: L }
  | { kind: 'code'; id?: string; kicker: L; title: L; lead?: L; code: string; note?: L }
  | { kind: 'groups'; id?: string; kicker: L; title: L; lead?: L; groups: { title: L; items: LL }[]; note?: L }
  | {
      kind: 'table';
      id?: string;
      kicker: L;
      title: L;
      lead?: L;
      /** Headers including the status column when any row carries a status. */
      cols: L[];
      rows: RelatedTableRow[];
      note?: L;
    }
  | { kind: 'limits'; id?: string; kicker: L; title: L; lead?: L; items: { title: L; body: L }[]; note?: L }
  | {
      kind: 'docs';
      id?: string;
      kicker: L;
      title: L;
      lead?: L;
      docs: { title: string; meta: string; desc: L }[];
      note?: L;
    };

export interface RelatedProject {
  slug: string;
  /** Short code name, used as the mono badge. */
  code: string;
  /** Language-neutral expansion of the acronym. */
  expansion: string;
  /** Localised full name. */
  name: L;
  /** One line for the hub card. */
  tagline: L;
  /** Three short claims for the hub card. */
  hubPoints: LL;
  /** Accent token — 'symbol' is EML's own cyan, so siblings get their own. */
  accent: 'violet' | 'run' | 'amber';
  kicker: L;
  title: L;
  lead: L;
  /** Meta strip under the page title. Values are language-neutral (versions, ids, counts). */
  facts: { label: L; value: string }[];
  sections: RelatedSection[];
}

// ───────────────────────────────────────────────────────────────────────────────
// CAIR — Canonical Authoritative Intermediate Representation
// Sources: CAIR_v1.0_技術白皮書 (SHA-256 bb40a1e1…), CAIR_v1.0_發行總結與研究交接報告,
// CAIR_v1.1-v2.0_發展路線圖, and the v1.0 engineering package's own README/pyproject.
// ───────────────────────────────────────────────────────────────────────────────

const CAIR: RelatedProject = {
  slug: 'cair',
  code: 'CAIR',
  expansion: 'Canonical Authoritative Intermediate Representation',
  name: { en: 'Canonical Authoritative Intermediate Representation', zh: '規範權威中介表示' },
  tagline: {
    en: 'A program does not have to be owned by one text surface. Text, graph, grid, natural language, AI candidates, tensors and governance are projections of one authoritative computational ontology.',
    zh: '程式的權威身份不必由單一文字表面壟斷。文字、圖、格子、自然語言、AI 候選、張量與治理，都是同一個權威計算本體的投影。',
  },
  hubPoints: {
    en: [
      'P* ≠ P_i — the authoritative ontology is never any single one of its surfaces',
      'AI and UI edits become candidate proposals, never silent commits',
      'v1.0 frozen: cair-mvp==1.0.0, /api/v1, 105 stable operations, 88 regression tests',
    ],
    zh: [
      'P* ≠ P_i——權威本體永遠不等於它的任何單一表面',
      'AI 與介面的修改一律只形成候選提案，不能靜默提交',
      'v1.0 已凍結：cair-mvp==1.0.0、/api/v1、105 個穩定操作、88 項回歸測試',
    ],
  },
  accent: 'violet',
  kicker: { en: 'Related · CAIR', zh: '相關語言 · CAIR' },
  title: { en: 'CAIR — the authoritative program ontology', zh: 'CAIR——權威程式本體' },
  lead: {
    en: 'Most languages assume program ≈ text source. CAIR does not delete text — it demotes it to one projection among many, and moves version, governance, write-back and verification onto a single authoritative ontology that text, graphs, grids, natural language and AI candidates all point at. EML appears inside CAIR as the intent / spec-normalization layer.',
    zh: '大多數語言假設「程式 ≈ 文字原始碼」。CAIR 不刪除文字，而是把文字降格為眾多投影之一，並把版本、治理、回寫與驗證統一放到一個權威本體上——文字、圖、格子、自然語言與 AI 候選都指向它。EML 在 CAIR 裡的位置，是意圖與規格正規化層。',
  },
  facts: [
    { label: { en: 'Version', zh: '版本' }, value: 'v1.0.0' },
    { label: { en: 'Package', zh: '套件' }, value: 'cair-mvp==1.0.0' },
    { label: { en: 'Stable API', zh: '穩定 API' }, value: '/api/v1' },
    { label: { en: 'CAIR Schema', zh: 'CAIR Schema' }, value: '1.0.0' },
    { label: { en: 'DB schema', zh: '資料庫 schema' }, value: '1000' },
    { label: { en: 'Stable operations', zh: '穩定操作' }, value: '105' },
    { label: { en: 'JSON Schemas', zh: 'JSON Schema' }, value: '75' },
    { label: { en: 'Regression tests', zh: '回歸測試' }, value: '88' },
    { label: { en: 'Status', zh: '狀態' }, value: 'Stable / capped' },
    { label: { en: 'License', zh: '授權' }, value: 'none declared' },
  ],
  sections: [
    {
      kind: 'cards',
      id: 'why',
      kicker: { en: 'The problem', zh: '問題' },
      title: {
        en: 'Four places where “program = text source” stops holding',
        zh: '「程式 = 文字原始碼」失效的四個位置',
      },
      lead: {
        en: 'The classic pipeline — parse, lower, compile, execute — has not failed. It simply no longer describes a system shaped by AI generation, agent workflows, visual editing, tensor graphs and automated governance at the same time.',
        zh: '傳統流程——解析、降階、編譯、執行——並沒有失效。它只是不再足以描述一個同時被 AI 生成、Agent 工作流、視覺化編輯、張量計算與自動化治理塑造的系統。',
      },
      cards: [
        {
          title: { en: 'The upstream is no longer formal syntax', zh: '上游不再只有形式語法' },
          body: {
            en: 'Systems now start from requirements, conversations, example I/O, diagrams, tables, domain rules, AI candidates, or an already-running state — inputs that carry ambiguity and undecided items, and cannot simply be equated with an authoritative program.',
            zh: '系統現在可能從需求、對話、輸入輸出範例、流程圖、表格、領域規則、AI 候選，甚至已存在的執行狀態開始。這些輸入含有歧義與未決項目，不能直接等同於權威程式。',
          },
        },
        {
          title: { en: 'The editors are no longer only human', zh: '修改者不再只有人類' },
          body: {
            en: 'Developers, optimizers, models, agents, runtimes, hardware adapters, policy engines and remote governance nodes all propose changes. So the system has to answer: who may generate, who may verify, who may commit, who may execute, who may revoke.',
            zh: '開發者、最佳化器、模型、Agent、運行時、硬體適配器、政策引擎與遠端治理節點都可能提出修改。因此系統必須回答：誰可以生成、誰可以驗證、誰可以提交、誰可以執行、誰可以撤回。',
          },
        },
        {
          title: { en: 'The structure is no longer linear', zh: '結構不再只有線性文字' },
          body: {
            en: 'A tensor program is naturally an operator graph; an agent system is a capability/permission graph; distributed governance is an event chain with signatures. Forcing all of them to use file paths and line numbers as identity means constantly flattening and re-inflating them.',
            zh: '張量程式的自然結構是算子圖；Agent 系統是能力與權限圖；分散式治理是事件鏈與簽章。若強迫它們都以檔案位置與行號作為身份，工具就必須不斷把非線性結構壓成文字再恢復。',
          },
        },
        {
          title: { en: 'Automation amplifies control and liability', zh: '自動化放大控制與責任' },
          body: {
            en: 'When an agent can generate code, call tools, mutate data, deploy services and change persistent world state, “the output looks reasonable” is not enough to justify execution. Permissions, blast radius, risk level, provenance, verification, commit record and rollback are required.',
            zh: '當 Agent 可以生成程式、調用工具、修改資料、部署服務並改變持續性世界狀態時，「生成結果看起來合理」不足以支撐執行。還需要權限、影響範圍、風險等級、來源證據、驗證條件、提交記錄與回滾策略。',
          },
        },
      ],
    },
    {
      kind: 'code',
      id: 'ontology',
      kicker: { en: 'Core relation', zh: '核心關係' },
      title: { en: 'The ontology is not the surface', zh: '本體不等於表面' },
      lead: {
        en: 'CAIR’s one-line thesis is an inequality. The authoritative program ontology P* carries nodes, edges, regions, types, effects, constraints, governance, history and provenance; every text, graph, grid, natural-language or execution view is a projection π_i of it. Identity never depends on screen layout, line numbers or a particular model.',
        zh: 'CAIR 的一行論點是一個不等式。權威程式本體 P* 承載節點、關係邊、區域、型別、效果、約束、治理、歷史與來源；文字、圖、格子、自然語言與執行結果都只是它的投影 π_i。身份永遠不依賴畫面位置、文字行號或特定模型。',
      },
      code: `P*  ≠  P_i

P*  =  (N, E, R, T, F, C, G, H, M)
       nodes, edges, regions, types, effects,
       constraints, governance, history, metadata

π_i :  P*    ->  P_i        project  (text / graph / grid / NL / tensor / governance)
ρ_i :  P_i   ->  P*         parse back
δ_i :  ΔP_i  ->  ΔP*_c      write back  — as a CANDIDATE, never a commit

h_semantic  ≠  h_layout     moving a node on screen must not change meaning`,
      note: {
        en: 'Layout and semantics get separate fingerprints, and a pure layout operation is required to leave the authoritative content fingerprint untouched. Dragging a box is not a program change; rewiring a capability edge is — even though the pixel diff is far smaller.',
        zh: '布局指紋與語義指紋分離，純布局操作必須不改變權威內容指紋。拖動一個方塊不是程式修改；改動一條能力邊則是——即使畫面上的差異小得多。',
      },
    },
    {
      kind: 'cards',
      id: 'projection-levels',
      kicker: { en: 'Projections', zh: '投影' },
      title: { en: 'Four grades of projection', zh: '投影的四個等級' },
      lead: {
        en: 'A projection has to declare how much it can carry back. Conflating a lossless text DSL with an AI-written summary is exactly how information disappears silently.',
        zh: '投影必須宣告自己能承載多少資訊。把無損的文字 DSL 和 AI 寫的摘要當成同一種東西，正是資訊靜默消失的方式。',
      },
      cards: [
        {
          title: { en: 'Lossless & reversible', zh: '無損可逆' },
          body: {
            en: 'ρ_i(π_i(P*)) = P*. CAIR’s structured text DSL targets this inside its supported subset.',
            zh: 'ρ_i(π_i(P*)) = P*。CAIR 的結構化文字 DSL 在支援子集內以此為目標。',
          },
        },
        {
          title: { en: 'Conditionally reversible', zh: '條件可逆' },
          body: {
            en: 'Reversible only on a declared subset D_i. Outside it, round-tripping is not guaranteed and must not be assumed.',
            zh: '只在已宣告的子集 D_i 上可逆。超出範圍就不保證往返一致，也不得假設一致。',
          },
        },
        {
          title: { en: 'Lossy summary', zh: '有損摘要' },
          body: {
            en: 'Natural-language summaries, simplified architecture diagrams, statistics. Useful for understanding; not write-back-enabled by default.',
            zh: '自然語言摘要、簡化架構圖、統計報告。可以用來理解，但預設不可直接回寫。',
          },
        },
        {
          title: { en: 'Generative', zh: '生成式' },
          body: {
            en: 'π_θ,Ctx depends on model and context, so it must label model + version, the context used, the authoritative source, inference vs. fact, what was omitted, and whether it may produce candidates at all.',
            zh: 'π_θ,Ctx 依模型與上下文而變，因此必須標記模型與版本、使用的上下文、權威來源、推論與事實的區分、省略內容，以及是否允許產生候選修改。',
          },
        },
      ],
    },
    {
      kind: 'pipeline',
      id: 'writeback',
      kicker: { en: 'Write-back', zh: '回寫' },
      title: { en: 'Nothing edits the authority directly', zh: '沒有東西能直接改寫權威' },
      lead: {
        en: 'The hard part of a multi-projection system is not showing one program in many views — it is safely changing one program from many views. Every edit, from any actor, becomes a candidate that must survive type, effect, permission, policy, risk and invariant validation before it can become a version.',
        zh: '多重投影系統真正困難的不是「用很多視圖顯示同一程式」，而是「從很多視圖安全修改同一程式」。任何角色的任何修改都先變成候選，必須通過型別、效果、權限、政策、風險與不變量驗證，才能成為新版本。',
      },
      steps: {
        en: ['projection edit', 'candidate proposal', 'validate', 'semantic diff', 'impact preview', 'commit version', 'controlled execution', 'certificate'],
        zh: ['投影修改', '候選提案', '驗證', '語義差異', '影響預覽', '版本提交', '受控執行', '證書'],
      },
      note: {
        en: 'The invariants this buys: AI may generate but not silently commit; a drag may propose but not pollute semantics; natural language may form candidates but must show what it presumed; governance changes get reviewed independently; and an uncommitted proposal cannot mutate the authoritative version. Execution output likewise never writes back — it has to raise a new proposal.',
        zh: '換來的不變量是：AI 可以生成但不能靜默提交；拖曳可以提出修改但不會污染語義；自然語言可以形成候選但必須顯示推定；治理變化必須被獨立審查；未提交的提案不影響權威版本。執行結果同樣不會回寫——想改權威狀態，也得另外形成候選。',
      },
    },
    {
      kind: 'table',
      id: 'layers',
      kicker: { en: 'Architecture', zh: '架構' },
      title: { en: 'Eight layers — and where EML sits', zh: '八層架構——以及 EML 的位置' },
      lead: {
        en: 'CAIR v1.0 defines S = (L_I, L_E, L_C, L_N, L_P, L_G, L_X, L_V). The second layer is named EML: multi-surface semantic input and spec normalization, the place where intent is separated into goals, constraints, resources, acceptance criteria and unresolved items before anything becomes authoritative.',
        zh: 'CAIR v1.0 定義 S = (L_I, L_E, L_C, L_N, L_P, L_G, L_X, L_V)。第二層叫做 EML：多表面語義輸入與規格正規化層——在任何東西成為權威之前，先把意圖拆成目標、約束、資源、驗收標準與未決項目。',
      },
      cols: [
        { en: 'Layer', zh: '層' },
        { en: 'Name', zh: '名稱' },
        { en: 'Role', zh: '職責' },
      ],
      rows: [
        {
          id: 'L_I',
          cells: [
            { en: 'Intent input', zh: '意圖輸入層' },
            { en: 'Requirements, conversation, examples, diagrams, existing state — ambiguity allowed here and nowhere downstream.', zh: '需求、對話、範例、圖形、既有狀態——歧義只允許存在於這一層。' },
          ],
        },
        {
          id: 'L_E',
          cells: [
            { en: 'EML semantic translation', zh: 'EML 語義轉譯層' },
            { en: 'Normalizes intent into I = (G, C, R, V, U) and must distinguish human-specified, system-default, AI-inferred, AI-completed, undecided and conflicting.', zh: '把意圖正規化為 I = (G, C, R, V, U)，並必須區分人類明確指定、系統預設、AI 推定、AI 補全、尚未決定與相互衝突。' },
          ],
        },
        {
          id: 'L_C',
          cells: [
            { en: 'CAIR authoritative ontology', zh: 'CAIR 權威本體層' },
            { en: 'Nodes, edges, ports, regions, types, effects, constraints, governance, history — the single source of identity.', zh: '節點、邊、端口、區域、型別、效果、約束、治理、歷史——唯一的身份來源。' },
          ],
        },
        {
          id: 'L_N',
          cells: [
            { en: 'NOVA tensor / operator', zh: 'NOVA 張量—算子層' },
            { en: 'Tensors, operators, shapes, devices, layouts, effects and certificates as first-class authoritative structure.', zh: '張量、算子、形狀、裝置、布局、效果與證書，全部作為一級權威結構。' },
          ],
        },
        {
          id: 'L_P',
          cells: [
            { en: 'Multi-projection', zh: '多重投影層' },
            { en: 'Text, graph, grid, natural language, tensor, governance and diff views over the same version.', zh: '在同一版本之上的文字、圖、格子、自然語言、張量、治理與差異視圖。' },
          ],
        },
        {
          id: 'L_G',
          cells: [
            { en: 'Control & governance', zh: '控制治理層' },
            { en: 'Capabilities, region policy, risk ceilings, multi-party approval, policy-as-code.', zh: '能力、區域政策、風險上限、多方批准、政策即程式。' },
          ],
        },
        {
          id: 'L_X',
          cells: [
            { en: 'Controlled execution', zh: '受控執行與互操作層' },
            { en: 'Isolated Skill backends, whitelisted NumPy, resource budgets, external adapters (OCI, Sigstore, OPA).', zh: '隔離的 Skill 後端、白名單 NumPy、資源預算、外部適配器（OCI、Sigstore、OPA）。' },
          ],
        },
        {
          id: 'L_V',
          cells: [
            { en: 'Verification & certificates', zh: '驗證、版本與證書層' },
            { en: 'Validators, versions, execution certificates, transparency log, snapshots.', zh: '驗證器、版本、執行證書、透明度日誌、快照。' },
          ],
        },
      ],
      note: {
        en: 'Read L_E as an architectural role, not a wiring claim: CAIR v1.0 (cair-mvp==1.0.0) does not bundle this site’s EML-P toolchain. What the two share is the position EML occupies — the semantic entry point that must never let an AI’s reasonable guess be written down as the user’s original intent.',
        zh: '請把 L_E 讀成架構位置，而不是接線宣稱：CAIR v1.0（cair-mvp==1.0.0）並未內含本站的 EML-P 工具鏈。兩者共有的是 EML 所站的位置——那個絕不能讓 AI 的合理猜測被靜默寫成使用者原意的語義入口。',
      },
    },
    {
      kind: 'groups',
      id: 'shipped',
      kicker: { en: 'What v1.0 ships', zh: 'v1.0 交付了什麼' },
      title: { en: 'One closed loop, four clusters', zh: '一個閉環，四個群組' },
      lead: {
        en: 'CAIR grew through M0–M6 and v0.5–v0.9 with every stage keeping the previous stage’s regressions — 7 tests at M0–M1, 88 at v1.0. These are the capabilities that reached code + tests + artifact + acceptance.',
        zh: 'CAIR 經過 M0–M6 與 v0.5–v0.9，每一階段都保留前一階段的回歸測試——M0–M1 是 7 項，v1.0 是 88 項。以下是真正達到「程式碼 + 測試 + 發行物 + 驗收」的能力。',
      },
      groups: [
        {
          title: { en: 'Ontology, projections & versions', zh: '本體、投影與版本' },
          items: {
            en: [
              'Pydantic v2 authoritative model: nodes, edges, ports, regions, constraints',
              'Canonical JSON + SHA-256 content fingerprint, layout/semantic split',
              'Text DSL round-trip, graph and grid projections sharing one fingerprint',
              'Change proposals, stale-proposal blocking, semantic diff, impact closure',
              'SQLite versions; restore creates a NEW version instead of overwriting history',
            ],
            zh: [
              'Pydantic v2 權威模型：節點、邊、端口、區域、約束',
              '規範 JSON + SHA-256 內容指紋，布局與語義分離',
              '文字 DSL 往返，圖與格子投影共享同一份指紋',
              '變更提案、過期提案阻擋、語義差異、影響閉包',
              'SQLite 版本；恢復會產生「新版本」，不覆寫歷史',
            ],
          },
        },
        {
          title: { en: 'AI candidates & NOVA', zh: 'AI 候選與 NOVA' },
          items: {
            en: [
              'Rule-based structured candidate generation with reasons, confidence, assumptions',
              'Unsupported intent degrades safely to unresolved instead of guessing',
              'Tensor shape inference: named dims, broadcasting, matmul, reduction, reshape, transpose, ReLU',
              'Whitelisted NumPy execution, network effects refused, resource budgets',
              'Execution certificates binding program hash, input hash, output hash, backend, limits',
            ],
            zh: [
              '規則型結構化候選生成，附帶理由、信心與假設',
              '不支援的意圖安全退化為 unresolved，而不是硬猜',
              '張量形狀推導：命名維度、broadcasting、matmul、reduction、reshape、transpose、ReLU',
              '白名單 NumPy 執行、拒絕網路效果、資源預算',
              '執行證書綁定程式雜湊、輸入雜湊、輸出雜湊、後端與限制',
            ],
          },
        },
        {
          title: { en: 'Governed Skills', zh: '治理型 Skill' },
          items: {
            en: [
              'Skill as H = (domain, input, output, capability, permission, validator, failure policy)',
              'Four simultaneous checks: actor capability ∧ region policy ∧ skill capability ∧ risk ceiling',
              'Human approval forced when the region requires it and the actor is an autonomous agent',
              'Process-isolated (python -I) and Docker backend abstraction with timeout/CPU/memory/IO caps',
              'Network and filesystem denied by default',
            ],
            zh: [
              'Skill 定義為 H =（領域、輸入、輸出、能力、權限、驗證器、失敗政策）',
              '四項同時檢查：操作者能力 ∧ 區域政策 ∧ Skill 能力 ∧ 風險上限',
              '區域要求人工審核且執行主體是自主 Agent 時，強制人工批准',
              '程序隔離（python -I）與 Docker 後端抽象，含逾時／CPU／記憶體／IO 上限',
              '網路與檔案系統預設拒絕',
            ],
          },
        },
        {
          title: { en: 'Supply chain & distributed governance', zh: '供應鏈與分散式治理' },
          items: {
            en: [
              '.cairskill / .cairpolicy signed packages: file manifest, SHA-256, Ed25519',
              'Signer identity separated from key generation; active / retired / revoked',
              'Trust needs all three: signature valid ∧ signer trusted ∧ package enabled',
              'Append-only transparency log, checkpoints, Merkle root, witness quorum',
              'Multi-party approval requiring role coverage AND organization diversity',
              'Governance replication, anti-entropy, signed LWW-map CRDT, verifiable snapshots',
            ],
            zh: [
              '.cairskill／.cairpolicy 簽章套件：檔案 manifest、SHA-256、Ed25519',
              '簽署者身分與金鑰世代分離；active／retired／revoked 三態',
              '信任需要三者同時成立：簽章有效 ∧ 簽署者可信 ∧ 套件已啟用',
              'Append-only 透明度日誌、checkpoint、Merkle root、witness quorum',
              '多方批准同時要求角色覆蓋「與」組織多樣性',
              '治理複製、anti-entropy、簽章式 LWW-map CRDT、可驗證快照',
            ],
          },
        },
      ],
      note: {
        en: 'CAIR’s own completion test is Code ∧ Tests ∧ Artifact ∧ Acceptance. An adapter existing is not conformance; a Dockerfile existing is not a verified image build.',
        zh: 'CAIR 自訂的「已完成」判準是 程式碼 ∧ 測試 ∧ 發行物 ∧ 驗收。有適配器不等於符合性；有 Dockerfile 不等於已完成映像建置驗收。',
      },
    },
    {
      kind: 'limits',
      id: 'boundaries',
      kicker: { en: 'Boundaries', zh: '邊界' },
      title: { en: 'What v1.0 explicitly does not claim', zh: 'v1.0 明確不宣稱什麼' },
      lead: {
        en: 'This list is not a disclaimer added afterwards — it is written into the release itself, and it is the reason the rest of the page can be read literally.',
        zh: '這份清單不是事後補上的免責聲明——它寫在發行物本身裡，也正因為有它，這頁其他內容才能被逐字採信。',
      },
      items: [
        {
          title: { en: 'Not a distributed database', zh: '不是分散式資料庫' },
          body: {
            en: 'SQLite is each node’s local authoritative database. Program rollback and database restore are different operations.',
            zh: 'SQLite 是每個節點的本地權威資料庫。程式版本回滾與資料庫恢復是兩種不同的操作。',
          },
        },
        {
          title: { en: 'Not consensus', zh: '不是共識' },
          body: {
            en: '`local-quorum` is a threshold check. It is not Raft, Paxos, BFT, or a linearizable replicated state machine — operations needing real consensus must use an external adapter.',
            zh: '`local-quorum` 只是門檻判定。它不是 Raft、Paxos、BFT，也不是線性一致的複製狀態機——需要真正共識的操作必須使用外部適配器。',
          },
        },
        {
          title: { en: 'CRDT has a scope', zh: 'CRDT 有適用範圍' },
          body: {
            en: 'The signed LWW-map fits mergeable, low-risk state. It does not fit key revocation, asset transfer, unique ownership, one-shot capabilities or irreversible operations.',
            zh: '簽章式 LWW-map 適合可合併的低風險狀態，不適合金鑰撤銷、資產轉移、唯一所有權、一次性 Capability 或不可逆操作。',
          },
        },
        {
          title: { en: 'Process isolation is not a strong sandbox', zh: '程序隔離不是強安全沙盒' },
          body: {
            en: 'v1.0 states plainly that process isolation cannot safely run arbitrary hostile Python. Third-party code needs containers, Wasm, microVMs or separate hosts.',
            zh: 'v1.0 直接寫明：程序隔離不能安全執行任意敵意 Python。第三方程式需要容器、Wasm、microVM 或獨立主機。',
          },
        },
        {
          title: { en: 'No external-standard conformance claimed', zh: '不宣稱外部標準符合性' },
          body: {
            en: 'OCI conformance, full online Sigstore verification, Rekor inclusion-proof validation, Fulcio X.509 path validation, RFC 9162, SLSA levels, in-toto and TUF are all explicitly not claimed. When a tool or trust material is missing, CAIR reports `unavailable` rather than success.',
            zh: 'OCI 符合性、完整線上 Sigstore 驗證、Rekor inclusion proof 完整驗證、Fulcio X.509 路徑驗證、RFC 9162、SLSA 等級、in-toto 與 TUF，全部明確不宣稱。外部工具或信任材料缺失時，CAIR 回報 `unavailable`，而不是宣稱成功。',
          },
        },
        {
          title: { en: 'Not formally proven', zh: '尚未形式化證明' },
          body: {
            en: 'There are structure, type, effect, policy and property tests, but CAIR is not a formally verified language core, and the cross-language canonicalization corpus does not exist yet.',
            zh: '有結構、型別、效果、政策與性質測試，但 CAIR 還不是經過完整形式證明的語言核心，跨語言 canonicalization 測試語料庫也尚未建立。',
          },
        },
        {
          title: { en: 'Not performance-tuned', zh: '未做效能最佳化' },
          body: {
            en: 'The v1.0 acceptance target was the semantic and governance loop. Very large graphs, very large tensors, high-throughput multi-node deployment and production penetration testing are all out of scope.',
            zh: 'v1.0 的驗收目標是語義與治理閉環。超大圖、超大張量、高吞吐多節點部署與生產環境滲透測試都不在範圍內。',
          },
        },
      ],
    },
    {
      kind: 'table',
      id: 'roadmap',
      kicker: { en: 'Roadmap', zh: '路線圖' },
      title: { en: 'v1.1 – v2.0 capability gates', zh: 'v1.1 – v2.0 能力門檻' },
      lead: {
        en: 'A capability plan, not a calendar. CAIR’s own judgement is that the next node is usability, not consensus: v1.1 succeeds when someone unfamiliar with the internals can build, review, approve, commit and restore an authoritative program through the Workbench and still see exactly what every projection, plugin, Skill and remote decision was permitted to do.',
        zh: '這是能力門檻規劃，不是日曆承諾。CAIR 自己的判斷是：下一個節點是可用性，不是共識。v1.1 的成功判準是——一個不熟悉內部程式碼的人，可以透過 Workbench 建立、理解、修改、驗證、批准、提交與恢復一個權威程式，並且清楚看到每一個投影、插件、Skill 與遠端決策擁有什麼權限。',
      },
      cols: [
        { en: 'Version', zh: '版本' },
        { en: 'Theme', zh: '主題' },
        { en: 'Gate', zh: '門檻' },
      ],
      rows: [
        {
          id: 'v1.1',
          cells: [
            { en: 'Workbench & conformance baseline', zh: '工作台與符合性基線' },
            { en: 'Program explorer, proposal review, complete semantic diff, version timeline, canonicalization test vectors.', zh: '程式瀏覽器、提案審查、完整語義差異、版本時間線、canonicalization 測試向量。' },
          ],
          status: 'planned',
        },
        {
          id: 'v1.2',
          cells: [
            { en: 'Multi-user platform', zh: '多使用者平台' },
            { en: 'Identity, organizations, RBAC + capability, PostgreSQL repository, object storage, audit events.', zh: '身分、組織、RBAC + Capability、PostgreSQL repository、物件儲存、審計事件。' },
          ],
          status: 'planned',
        },
        {
          id: 'v1.3',
          cells: [
            { en: 'Plugin ABI & isolation', zh: '插件 ABI 與隔離' },
            { en: '.cairplugin manifest, Wasm Component Model, five isolation profiles, capability broker. Draft spec exists; no stable plugin API in v1.0.', zh: '.cairplugin manifest、Wasm Component Model、五種隔離 profile、Capability Broker。規格草案已存在；v1.0 沒有穩定插件 API。' },
          ],
          status: 'draft',
        },
        {
          id: 'v1.4',
          cells: [
            { en: 'Agent interoperability', zh: 'Agent 互操作' },
            { en: 'MCP and A2A adapters — pinned to real stable versions, isolated behind adapters, never written into CAIR Core.', zh: 'MCP 與 A2A 適配器——固定在真正的 stable 版本、以 adapter 隔離、絕不寫進 CAIR Core。' },
          ],
          status: 'planned',
        },
        {
          id: 'v1.5',
          cells: [
            { en: 'Observability', zh: '可觀測性' },
            { en: 'Tracing and metrics over proposals, validation, execution and governance decisions.', zh: '對提案、驗證、執行與治理決策的追蹤與指標。' },
          ],
          status: 'planned',
        },
        {
          id: 'v1.6',
          cells: [
            { en: 'Supply-chain conformance', zh: '供應鏈符合性' },
            { en: 'Where SLSA / in-toto / Sigstore claims could become real — only after actual build-platform controls exist.', zh: 'SLSA／in-toto／Sigstore 宣稱可能成真的位置——但必須先有真正的建置平台控制。' },
          ],
          status: 'planned',
        },
        {
          id: 'v1.7',
          cells: [
            { en: 'Distributed state', zh: '分散式狀態' },
            { en: 'Beyond threshold checks toward genuine replicated authority.', zh: '從門檻判定走向真正的複製式權威。' },
          ],
          status: 'planned',
        },
        {
          id: 'v1.8',
          cells: [
            { en: 'World-state programming', zh: '世界狀態程式' },
            { en: 'Persistent state and its permitted transitions as first-class program structure.', zh: '把持續狀態與其允許的轉換當成一級程式結構。' },
          ],
          status: 'planned',
        },
        {
          id: 'v2.0',
          cells: [
            { en: 'Distributed authoritative ontology', zh: '分散式權威計算本體' },
            { en: 'The only version allowed to change v1.0’s stable contract — after a v1.9 candidate proves it.', zh: '唯一允許改變 v1.0 穩定契約的版本——而且要先由 v1.9 候選版證明。' },
          ],
          status: 'planned',
        },
      ],
      note: {
        en: 'Ten items on v1.0’s do-not-change list protect this path: the package name, /api/v1 semantics, CAIR Schema 1.0.0, the migration history of DB schema 1000, the 105 stable operations, existing schema field semantics, the canonical JSON profile, program fingerprint identity, and the proposal base-version check.',
        zh: 'v1.0 的「不可回改清單」有十項在保護這條路徑：套件名稱、/api/v1 語義、CAIR Schema 1.0.0、資料庫 schema 1000 的既有 migration 歷史、105 個穩定操作、既有 Schema 欄位語義、Canonical JSON Profile、程式指紋同一性，以及提案 base-version 檢查。',
      },
    },
    {
      kind: 'docs',
      id: 'docs',
      kicker: { en: 'Source documents', zh: '來源文件' },
      title: { en: 'The frozen v1.0 document set', zh: '已封存的 v1.0 文件集' },
      lead: {
        en: 'This page is a readable summary. These are the normative documents behind it, each with its own content fingerprint. CAIR fixes an authority order for conflicts: release artifacts first, then the executable stable contract, then acceptance/operations docs, then whitepapers, and drafts last — a draft may never overwrite v1.0 stable behavior.',
        zh: '這頁是給人讀的摘要。以下是它背後的規範性文件，每一份都有自己的內容指紋。CAIR 為衝突固定了權威順序：發行物優先，然後是可執行的穩定契約，再是驗收與維運文件，接著是白皮書，草案最後——草案永遠不能覆寫 v1.0 的穩定行為。',
      },
      docs: [
        {
          title: 'CAIR v1.0 技術白皮書：多重投影程式系統與權威計算本體',
          meta: 'sha256:bb40a1e1…',
          desc: {
            en: 'The main external document: what CAIR is, and how EML, CAIR, NOVA, projections, governance and execution fit together.',
            zh: '對外主文件：CAIR 是什麼，以及 EML、CAIR、NOVA、投影、治理與執行如何統合。',
          },
        },
        {
          title: 'CAIR 規範白皮書：權威 IR、多重投影與語義回寫',
          meta: 'sha256:da58fe9d…',
          desc: {
            en: 'The implementer’s anchor: core model, canonical JSON profile, projection certificate, change operations, validators, versioning, conformance profiles. Also states that the v1.0 fingerprint is not RFC 8785 JCS and change operations are not RFC 6902 JSON Patch.',
            zh: '實作者的規格錨點：核心模型、Canonical JSON Profile、投影證書、變更操作、驗證器、版本與符合性 profile。也明確寫出 v1.0 的指紋不是 RFC 8785 JCS、變更操作不是 RFC 6902 JSON Patch。',
          },
        },
        {
          title: 'CAIR 治理與供應鏈安全白皮書',
          meta: 'sha256:9b7ec3f1…',
          desc: {
            en: 'Signed packages, signer/key model, dependency locks, governance, transparency, witnesses, the OCI / Sigstore / OPA adapter boundaries, replication and execution security.',
            zh: '簽章套件、簽署者與金鑰模型、依賴鎖、治理、透明度、witness、OCI／Sigstore／OPA 適配邊界、複製與執行安全。',
          },
        },
        {
          title: 'CAIR v1.0 系統實作與部署手冊',
          meta: 'sha256:91131113…',
          desc: {
            en: 'Wheel / source / offline install, systemd, Uvicorn, Nginx, Docker, SQLite migration, online backup, restore, multi-node topology, anti-entropy, incident handling.',
            zh: 'Wheel／原始碼／離線安裝、systemd、Uvicorn、Nginx、Docker、SQLite 遷移、線上備份、恢復、多節點拓撲、anti-entropy、事故處理。',
          },
        },
        {
          title: 'CAIR v1.1–v2.0 發展路線圖',
          meta: 'sha256:ee6c5c36…',
          desc: {
            en: 'The capability-gate plan summarised in the roadmap table above. Explicitly not a calendar and not completed capability.',
            zh: '上方路線圖表格所摘要的能力門檻規劃。明確不是日曆承諾，也不是已完成的能力。',
          },
        },
        {
          title: 'CAIR 插件與生態系統規範 v1.0-draft',
          meta: 'draft · targets v1.3',
          desc: {
            en: 'Plugin manifest, entry points, Wasm components, capability broker, publisher/catalog. Must not be read as an implemented stable plugin API.',
            zh: '插件 manifest、entry point、Wasm component、Capability Broker、發布者與目錄。不得被誤讀為已實作的穩定插件 API。',
          },
        },
        {
          title: 'CAIR v1.0 發行總結與研究交接報告',
          meta: 'zip sha256:29b8144d…',
          desc: {
            en: 'The handoff baseline: full engineering history M0–v1.0, the frozen contract, the do-not-change list, known limits, and the minimum reading order for restarting the work. It also keeps the failure records — npm 503s, unavailable Docker/Podman, untested external Cosign/Fulcio/Rekor — on the grounds that failure records are part of the engineering boundary.',
            zh: '交接基線：M0 到 v1.0 的完整工程史、凍結契約、不可回改清單、已知限制，以及重新開始工作的最小閱讀順序。它也保留了失敗紀錄——npm 503、Docker／Podman 不可用、外部 Cosign／Fulcio／Rekor 未實測——理由是失敗紀錄本身就是工程邊界的一部分。',
          },
        },
      ],
      note: {
        en: 'CAIR is currently a research and engineering archive. Its v1.0 package ships no license file and declares none in its metadata, and the release documents reference no public repository — so nothing here is a download link. If that changes, this page gets the links.',
        zh: 'CAIR 目前是研究與工程封存。它的 v1.0 工程包沒有附授權檔案，metadata 也沒有宣告授權，發行文件裡也沒有提到公開倉庫——所以這裡沒有任何下載連結。等到有了，這頁就會補上。',
      },
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// ICNS — Interpretation-Complete Numeral Specification
// Sources: 解譯完備數符 公開論文 v0.1, 統合技術白皮書 v0.1, ICNS_v1.0.0 release
// package (spec/icns-1.0-freeze.json, conformance report, TEST_REPORT.txt),
// ICNS 1.0 後續發展與未來計畫 v0.1.
// ───────────────────────────────────────────────────────────────────────────────

const ICNS: RelatedProject = {
  slug: 'icns',
  code: 'ICNS',
  expansion: 'Interpretation-Complete Numeral Specification',
  name: { en: 'Interpretation-Complete Numeral Specification', zh: '解譯完備數符' },
  tagline: {
    en: '`0.91` is not a number. It is a surface string whose semantics have not been declared — it can be 0.91, (0,91) or (0,9,1), and no amount of prefixing fixes that.',
    zh: '`0.91` 不是一個數字。它是一個尚未宣告語義的表面字串——它可以是 0.91、(0,91) 或 (0,9,1)，而加前綴解決不了這件事。',
  },
  hubPoints: {
    en: [
      'Surface symbol ≠ parse structure ≠ canonical value ≠ judgment rules',
      'Comparison is allowed to fail: LT / EQ / GT / INCOMPARABLE / UNRESOLVED / INVALID',
      'v1.0 frozen: 4 profiles, 8 built-in schemas, transport v1, 227 tests, spec hash pinned',
    ],
    zh: [
      '表面符號 ≠ 解析結構 ≠ 規範值 ≠ 判定規則',
      '比較允許失敗：LT／EQ／GT／INCOMPARABLE／UNRESOLVED／INVALID',
      'v1.0 已凍結：4 個 Profile、8 個內建綱要、Transport v1、227 項測試、規格雜湊已固定',
    ],
  },
  accent: 'run',
  kicker: { en: 'Related · ICNS', zh: '相關語言 · ICNS' },
  title: { en: 'ICNS — declare the numeral before you use it', zh: 'ICNS——先宣告，再使用' },
  lead: {
    en: 'Everyone has seen a version sorter decide 0.10 < 0.9. ICNS treats that not as a bug in one tool but as a missing declaration: a numeral only has decidable meaning once its carrier, grammar, radix, position map, bounds, ordering, equality, normalization, resolution, carry and successor rules are all declared and retrievable. Its scope is deliberately narrow, and it is engineered to 1.0.',
    zh: '每個人都見過某個版本排序器判定 0.10 < 0.9。ICNS 不把這當成某個工具的 bug，而是當成「宣告缺失」：一個數符只有在承載域、文法、進位制、位置映射、邊界、排序、相等、正規化、解析度、進位與後繼規則全部已宣告且可取得時，才具有可判定的意義。它的範圍刻意很窄，而且已經工程化到 1.0。',
  },
  facts: [
    { label: { en: 'Spec version', zh: '規格版本' }, value: '1.0.0' },
    { label: { en: 'Frozen', zh: '凍結日' }, value: '2026-07-29' },
    { label: { en: 'Status', zh: '狀態' }, value: 'STABLE' },
    { label: { en: 'Profiles', zh: 'Profile' }, value: '4' },
    { label: { en: 'Stable features', zh: '穩定功能' }, value: '21' },
    { label: { en: 'Built-in schemas', zh: '內建綱要' }, value: '8' },
    { label: { en: 'Transport', zh: '傳輸協定' }, value: 'icns-transport v1' },
    { label: { en: 'API paths', zh: 'API 路徑' }, value: '78' },
    { label: { en: 'Tests', zh: '測試' }, value: '227' },
    { label: { en: 'License', zh: '授權' }, value: 'undecided' },
  ],
  sections: [
    {
      kind: 'code',
      id: 'problem',
      kicker: { en: 'The problem', zh: '問題' },
      title: { en: 'Four strings, three legitimate orderings', zh: '四個字串，三種合法排序' },
      lead: {
        en: 'Take the same four tokens and read them under three different declarations. Every ordering below is correct — under its own schema. Nothing about the characters themselves tells you which one applies, which is why a reader, a package manager and a language model can each pick a different answer and all feel confident.',
        zh: '把同樣四個 token 放進三種不同的宣告來讀。下面每一種排序都是正確的——在它自己的綱要之下。字元本身完全沒有告訴你該用哪一種，所以人、套件管理器與語言模型可以各選一種答案，而且都覺得自己沒錯。',
      },
      code: `tokens:   0.9    0.10    0.89    0.91

decimal-real          0.10 = 0.1  <  0.89  <  0.9   <  0.91
version-2-lex          (0,9)      <  (0,10) < (0,89) < (0,91)
version-packed-111     0.91  ->  (0, 9, 1)     not  (0, 91)

so:  succ(0.90) = 0.91        under decimal-10-p2   (resolution 1/100)
     succ(0.9)  = 1.0         under decimal-10-p1   (resolution 1/10)
     succ(x)    = undefined   under decimal-real    (no quantization)

and:  "V0.91"  ->  UNRESOLVED + W_PREFIX_ONLY
      a prefix is a hint, not a declaration`,
      note: {
        en: 'The last line is ICNS’s first proposition: string concatenation cannot make a numeral unambiguous. `V0.91` still admits (0,91), (0,9,1) and 0.91 — unless `V` resolves to a complete, retrievable schema, it carries context, not semantics.',
        zh: '最後一行就是 ICNS 的第一個命題：字串拼接無法讓數符變得無歧義。`V0.91` 依然同時容許 (0,91)、(0,9,1) 與 0.91——除非 `V` 能解析到一個完整、可取得的綱要，它提供的只是語境，不是語義。',
      },
    },
    {
      kind: 'code',
      id: 'object',
      kicker: { en: 'Core object', zh: '核心物件' },
      title: { en: 'Surface, declaration, judgment, envelope', zh: '表面、宣告、判定、封套' },
      lead: {
        en: 'ICNS splits a numeral into a surface token plus the environment that gives it meaning. The declaration domain says what it is; the judgment domain says how it may be compared, normalized and advanced; the operation envelope makes the whole thing identifiable, versioned and exchangeable.',
        zh: 'ICNS 把數符拆成「表面 token」加上「賦予它意義的環境」。宣告域說它是什麼；判定域說它可以怎麼比較、正規化與推進；操作封套讓整件事可識別、可版本化、可交換。',
      },
      code: `N^  =  < s ; Δ , Π ; Ω >

Δ  =  < D, G, R, P, M, K >     declaration
      carrier, grammar, radix, position map, bounds, length

Π  =  < O, E, N, Q, C, S >     judgment
      order, equality, normalization, resolution, carry, successor

Ω  =  < ρ, ν, h, λ, μ >        envelope
      schema id, version, content hash, scope, provenance

meaning(s)          is not well-formed
meaning(s | Γ)      is                      Γ = (Δ, Π)`,
      note: {
        en: 'The envelope may never change what Δ and Π mean mathematically — it exists for resolution, verification, caching, tracing and cross-system exchange. And the same (ρ, ν) pair must never point at two different content hashes: that is E_SCHEMA_HASH_MISMATCH, refused rather than resolved.',
        zh: '封套絕不能改變 Δ 與 Π 的數學意義——它只用於解析、查驗、快取、追蹤與跨系統交換。而同一組 (ρ, ν) 絕不能指向兩個不同的內容指紋：那是 E_SCHEMA_HASH_MISMATCH，直接拒絕，而不是自行排解。',
      },
    },
    {
      kind: 'cards',
      id: 'propositions',
      kicker: { en: 'Propositions', zh: '命題' },
      title: { en: 'Three results that make the rest necessary', zh: '讓其餘部分變成必要的三個結論' },
      cards: [
        {
          title: { en: 'Prefixes are insufficient', zh: '前綴不足命題' },
          body: {
            en: 'For any prefix p and bare numeral s, concatenating them cannot guarantee a unique interpretation. `V0.91` has at least three compatible readings. A prefix only becomes a declaration when it resolves to a complete, unique, retrievable schema.',
            zh: '對任意前綴 p 與裸數符 s，單純拼接不能保證唯一解譯。`V0.91` 至少有三種相容讀法。前綴只有在能解析到一個完整、唯一、可取得的綱要時，才構成宣告。',
          },
        },
        {
          title: { en: '“Next” depends on the domain', zh: '後繼依賴命題' },
          body: {
            en: 'The successor of a numeral is not a property of its surface value. In ℝ no successor exists; on a quantization grid it is x + Q; in a version vector it is a chosen field plus one. Without D, Q and S declared, “the next one” has no unique answer.',
            zh: '數符的「下一個」不是表面數值的內在性質。在 ℝ 中不存在後繼；在量化網格上是 x + Q；在版本向量中是指定欄位加一。沒有宣告 D、Q 與 S 時，「下一個」沒有唯一答案。',
          },
        },
        {
          title: { en: 'Equal display ≠ equal meaning', zh: '表示相等不蘊含語義相等' },
          body: {
            en: 'Under real semantics 0.9 = 0.90. Under measurement semantics the values match but the resolutions do not. Under field semantics (0,9) ≠ (0,90). Value equality, representation equality, precision equality and structural equality have to be declared separately.',
            zh: '在實數語義下 0.9 = 0.90。在量測語義下值相同但解析度不同。在欄位語義下 (0,9) ≠ (0,90)。值相等、表示相等、精度相等與結構相等，必須分開宣告。',
          },
        },
      ],
      note: {
        en: 'A fourth distinction runs through the paper: the largest single digit, the digit-count limit, the largest representable value at that limit (1 − b⁻ⁿ), and the supremum or limit under unbounded expansion are four different things and must not share one word.',
        zh: '論文裡還有第四個區分貫穿全文：單一數字位上限、位數上限、該位數下的可表示最大值（1 − b⁻ⁿ），以及無限延伸下的上確界或極限，是四件不同的事，不能用同一個詞籠統處理。',
      },
    },
    {
      kind: 'table',
      id: 'representations',
      kicker: { en: 'Representations', zh: '表示法' },
      title: { en: 'Seven surfaces, one intermediate representation', zh: '七種表面，一份中介表示' },
      lead: {
        en: 'ICNS does not require every environment to look the same — it requires every environment to compile down to the same declaration and judgment conditions. Two representations are semantically equivalent exactly when CompileRep gives them the same canonical object.',
        zh: 'ICNS 不要求所有環境長得一樣，只要求它們都能編譯成同一組宣告與判定條件。兩種表示語義等價的條件，就是 CompileRep 後得到同一個規範物件。',
      },
      cols: [
        { en: 'Form', zh: '形式' },
        { en: 'Name', zh: '名稱' },
        { en: 'Where it fits', zh: '適用位置' },
      ],
      rows: [
        {
          id: 'A',
          cells: [
            { en: 'Linear scope declaration', zh: '線性作用域宣告' },
            { en: '@schema / @alias / @use / @bind blocks — documents, code blocks, data tables. Bare numerals inherit until the scope ends or a new @use appears.', zh: '@schema／@alias／@use／@bind 區塊——文件、程式碼區塊、資料表。裸數符一路繼承，直到作用域結束或出現新的 @use。' },
          ],
        },
        {
          id: 'B',
          cells: [
            { en: 'Over/under attachment', zh: '上下語義附加' },
            { en: 'Declaration above, judgment below the token. For papers, formulae and locally ambiguous positions.', zh: '宣告寫在 token 上方、判定寫在下方。適合論文、公式與局部歧義位置。' },
          ],
        },
        {
          id: 'C',
          cells: [
            { en: 'Four-corner attachment', zh: '四隅語義附加' },
            { en: 'Carrier top-left, order bottom-left, radix+grammar top-right, resolution+bounds bottom-right. A visual syntax, not a storage format.', zh: '左上承載型別、左下排序判定、右上基數與文法、右下解析度與邊界。這是視覺語法，不是儲存格式。' },
          ],
        },
        {
          id: 'D',
          cells: [
            { en: 'Schema anchoring', zh: '綱要錨定' },
            { en: '0.91@{icns:decimal-10-p2@0.1.0}, or a short alias that is only legal after an explicit @alias.', zh: '0.91@{icns:decimal-10-p2@0.1.0}，或一個只有在明確 @alias 之後才合法的簡寫。' },
          ],
        },
        {
          id: 'E',
          cells: [
            { en: 'Explicit container', zh: '顯式語義容器' },
            { en: 'Decimal<radix=10, scale=2>[0.91] vs Version<fields=major|minor, order=lex>[0.91]. Readable by humans and code at once.', zh: 'Decimal<radix=10, scale=2>[0.91] 與 Version<fields=major|minor, order=lex>[0.91]。人與程式可以同時讀。' },
          ],
        },
        {
          id: 'F',
          cells: [
            { en: 'Self-describing exchange', zh: '自描述交換格式' },
            { en: 'YAML / JSON objects carrying token plus declaration and judgment, or just a schema_ref. For protocols and long-term storage.', zh: 'YAML／JSON 物件，攜帶 token 與宣告判定，或只帶一個 schema_ref。適合協定與長期保存。' },
          ],
        },
        {
          id: 'G',
          cells: [
            { en: 'Sidecar schema', zh: '旁路綱要' },
            { en: 'Selector-to-schema bindings in a side file, so legacy CSV, databases, APIs and unmodifiable documents keep their original values untouched.', zh: '在旁路檔中做 selector 到綱要的綁定，讓舊 CSV、資料庫、既有 API 與不可修改的文件保持原值不動。' },
          ],
        },
      ],
      note: {
        en: 'Resolution priority is fixed and silent overwrite is forbidden: inline ▷ anchor ▷ block ▷ sidecar ▷ document ▷ application ▷ registry. Two conflicting declarations at the same priority return E_SCHEMA_CONFLICT rather than letting the implementation pick.',
        zh: '解析優先序是固定的，且禁止靜默覆寫：inline ▷ anchor ▷ block ▷ sidecar ▷ document ▷ application ▷ registry。同優先級的兩個宣告衝突時回傳 E_SCHEMA_CONFLICT，而不是讓實作自己挑一個。',
      },
    },
    {
      kind: 'pipeline',
      id: 'pipeline',
      kicker: { en: 'Engine', zh: '引擎' },
      title: { en: 'The processing pipeline', zh: '核心處理管線' },
      lead: {
        en: 'Pure-function-first, so f(x, Γ) is reproducible for the same input and schema. Parsing requires exactly one legal reading: zero matches is E_PARSE_NO_MATCH, more than one is E_PARSE_AMBIGUOUS. Neither is quietly resolved.',
        zh: '純函數優先，因此 f(x, Γ) 在相同輸入與綱要下可重現。解析要求恰好一種合法讀法：零種是 E_PARSE_NO_MATCH，多於一種是 E_PARSE_AMBIGUOUS。兩者都不會被悄悄排解。',
      },
      steps: {
        en: ['resolve', 'parse', 'validate', 'evaluate', 'normalize', 'operate', 'serialize'],
        zh: ['解析綱要', '語法解析', '驗證', '求值', '正規化', '運算', '序列化'],
      },
      note: {
        en: 'Cross-schema comparison negotiates a common schema Γ* first and converts losslessly into it. If no common schema exists, or a conversion would lose scale or structure, the answer is INCOMPARABLE or a W_CONVERSION_LOSSY warning — not a number.',
        zh: '跨綱要比較會先協商共同綱要 Γ*，再無損轉換過去。若不存在共同綱要，或轉換會遺失尺度或結構，答案是 INCOMPARABLE 或 W_CONVERSION_LOSSY 警告——而不是一個數字。',
      },
    },
    {
      kind: 'table',
      id: 'levels',
      kicker: { en: 'Grading', zh: '分級' },
      title: { en: 'Six levels of completeness', zh: '六級完備性' },
      lead: {
        en: 'Not every use needs the same strength, so ICNS grades it instead of demanding everything everywhere. The reference implementation targets at least L3, raises to L4 when successor or carry is used, and L5 when publishing across systems.',
        zh: '不是每個用途都需要同樣強度，所以 ICNS 把它分級，而不是要求處處完整。參考實作預設把輸入提升或驗證到至少 L3；需要後繼與進位時提升到 L4；跨系統發佈時使用 L5。',
      },
      cols: [
        { en: 'Level', zh: '等級' },
        { en: 'Name', zh: '名稱' },
        { en: 'Declared', zh: '已宣告' },
      ],
      rows: [
        {
          id: 'L0',
          cells: [
            { en: 'Bare symbol', zh: '裸符號' },
            { en: 'The string only. Nothing may be assumed about it.', zh: '只有字串。任何事都不能對它做假設。' },
          ],
        },
        {
          id: 'L1',
          cells: [
            { en: 'Type hint', zh: '類型提示' },
            { en: 'Something like V0.91 — context is suggested but no full schema is retrievable.', zh: '像 V0.91 這樣——有語境暗示，但取不到完整綱要。' },
          ],
        },
        {
          id: 'L2',
          cells: [
            { en: 'Parseable', zh: '可解析' },
            { en: 'D and G declared: it splits and maps uniquely.', zh: '已宣告 D 與 G：可以唯一切分與映射。' },
          ],
        },
        {
          id: 'L3',
          cells: [
            { en: 'Decidable', zh: '可判定' },
            { en: 'O, E and N declared: it can be compared and tested for equality.', zh: '已宣告 O、E、N：可以比較與判等。' },
          ],
        },
        {
          id: 'L4',
          cells: [
            { en: 'Operable', zh: '可操作' },
            { en: 'Q, C and S declared: successor, carry and overflow are defined.', zh: '已宣告 Q、C、S：後繼、進位與溢位都有定義。' },
          ],
        },
        {
          id: 'L5',
          cells: [
            { en: 'Exchangeable & traceable', zh: '可交換與可追溯' },
            { en: 'Stable id, version, content fingerprint, provenance and lossless exchange rules.', zh: '穩定識別碼、版本、內容指紋、來源與無損交換規則。' },
          ],
        },
      ],
      note: {
        en: 'Six of the eight schemas frozen in 1.0 reach L4 — decimal-10-p1, decimal-10-p2, time-hms, version-2-lex, version-3-lex, version-packed-111 — while decimal-real and identifier-exact stop at L3, because a real number has no successor and an opaque identifier has no order.',
        zh: '1.0 凍結的八個綱要中有六個達到 L4——decimal-10-p1、decimal-10-p2、time-hms、version-2-lex、version-3-lex、version-packed-111——而 decimal-real 與 identifier-exact 停在 L3，因為實數沒有後繼，不透明識別碼沒有排序。',
      },
    },
    {
      kind: 'groups',
      id: 'frozen',
      kicker: { en: 'What 1.0 freezes', zh: '1.0 凍結了什麼' },
      title: { en: 'Four profiles, one contract hash', zh: '四個 Profile，一個契約雜湊' },
      lead: {
        en: 'ICNS 1.0 does not just tag a version — it emits a machine-readable stability contract (spec/icns-1.0-freeze.json) pinning profiles, feature stability, built-in schema hashes, transport operations and the OpenAPI hash, then verifies itself against it for drift.',
        zh: 'ICNS 1.0 不只是打一個版本號——它產出一份機器可讀的穩定契約（spec/icns-1.0-freeze.json），釘住 Profile、功能穩定性、內建綱要雜湊、傳輸操作與 OpenAPI 雜湊，然後拿它反過來驗證自己有沒有漂移。',
      },
      groups: [
        {
          title: { en: 'Core 1.0 — 8 features', zh: 'Core 1.0——8 項功能' },
          items: {
            en: [
              'parse, compare, equal, normalize, successor, serialize',
              'declarative schema validation',
              'the built-in schema set and its frozen semantics',
              '8 schemas, each pinned by content hash: decimal-real, decimal-10-p1, decimal-10-p2, version-2-lex, version-3-lex, version-packed-111, time-hms, identifier-exact',
            ],
            zh: [
              'parse、compare、equal、normalize、successor、serialize',
              '宣告式綱要驗證',
              '內建綱要集合與其凍結語義',
              '8 個綱要，各以內容雜湊釘住：decimal-real、decimal-10-p1、decimal-10-p2、version-2-lex、version-3-lex、version-packed-111、time-hms、identifier-exact',
            ],
          },
        },
        {
          title: { en: 'Interop 1.0 — 5 features', zh: 'Interop 1.0——5 項功能' },
          items: {
            en: [
              'Transport v1: 17 hashable request/response operations, idempotent replay, collision refusal',
              'sorted-json-utf8-v1 canonicalization — Python and JavaScript produce the same SHA-256',
              'Signed schema packages with SHA-256 integrity and a four-state trust model',
              'Append-only registry: one content hash per (package, version), forever',
              'Transparency log with Merkle inclusion proofs; federation snapshots, deltas, fork evidence, offline bundles, witnesses',
            ],
            zh: [
              'Transport v1：17 個可雜湊的請求／回應操作、冪等重放、碰撞拒絕',
              'sorted-json-utf8-v1 正規化——Python 與 JavaScript 產生相同的 SHA-256',
              '簽章式綱要套件，含 SHA-256 完整性與四態信任模型',
              'Append-only 註冊中心：每個 (套件, 版本) 永久只允許一個內容雜湊',
              '透明度日誌與 Merkle 包含證明；聯邦快照、增量、分叉證據、離線包、witness',
            ],
          },
        },
        {
          title: { en: 'Tooling 1.0 — 4 features', zh: 'Tooling 1.0——4 項功能' },
          items: {
            en: [
              'Python SDK (local + HTTP client) and JavaScript SDK (browser + Node)',
              'Language Server: diagnostics, hover, completion, formatting, quick fixes, document symbols',
              'VS Code extension, project check with SARIF output, GitHub Actions and pre-commit hooks',
              'Deterministic codegen to Python, TypeScript and JSON Schema, with a verifiable codegen manifest',
            ],
            zh: [
              'Python SDK（本地 + HTTP 客戶端）與 JavaScript SDK（瀏覽器 + Node）',
              'Language Server：診斷、hover、補全、格式化、快速修正、文件符號',
              'VS Code 擴充、Project Check 與 SARIF 輸出、GitHub Actions 與 pre-commit hook',
              '確定性 codegen 到 Python、TypeScript 與 JSON Schema，附可驗證的 codegen manifest',
            ],
          },
        },
        {
          title: { en: 'Deployment 1.0 — 4 features', zh: 'Deployment 1.0——4 項功能' },
          items: {
            en: [
              'Liveness, readiness and full runtime status endpoints; Prometheus text metrics',
              'Structured forward-hash-chain audit log with verification',
              'Verifiable backup, safe restore refusing path traversal, recovery drill',
              'Reproducible release manifest; Docker, Compose, Kubernetes and systemd assets running non-root on a read-only root filesystem',
            ],
            zh: [
              'liveness、readiness 與完整運行狀態端點；Prometheus 文字指標',
              '結構化前向雜湊鏈稽核日誌，附驗證',
              '可驗證備份、拒絕路徑穿越的安全還原、故障復原演練',
              '可重現的發行清單；Docker、Compose、Kubernetes 與 systemd 資產，以非 root 在唯讀根檔案系統上執行',
            ],
          },
        },
      ],
      note: {
        en: 'Verified by 227 regression tests plus a normative conformance suite (icns-1.0-core, 18 cases, PASS). Within 1.x: no stable feature removed, no built-in schema semantics changed, no transport operation removed, no stable API path dropped without a replacement, and no new required field added to an existing stable request. Deprecation takes at least 2 minor releases and at least 180 days, whichever is later.',
        zh: '由 227 項回歸測試加上一份規範性一致性套件（icns-1.0-core，18 個案例，PASS）驗證。在 1.x 期間：不移除穩定功能、不改變既有內建綱要語義、不移除 Transport v1 操作、不無替代地移除穩定 API、不向既有穩定請求加入新的必要欄位。棄用基線為至少 2 個 minor 版本且至少 180 天，以較晚者為準。',
      },
    },
    {
      kind: 'limits',
      id: 'boundaries',
      kicker: { en: 'Boundaries', zh: '邊界' },
      title: { en: 'What ICNS refuses to be', zh: 'ICNS 拒絕成為什麼' },
      lead: {
        en: 'ICNS’s own post-1.0 plan opens with five principles, and most of them are restraints rather than features.',
        zh: 'ICNS 自己的 1.0 後續計畫以五項原則開頭，而其中大部分是約束，不是功能。',
      },
      items: [
        {
          title: { en: 'Not a consensus system', zh: '不是共識系統' },
          body: {
            en: 'The federation layer is not a blockchain and not Byzantine consensus. It will never automatically rule which side of a fork is the real history — it produces verifiable evidence and leaves adjudication to explicit governance policy.',
            zh: '聯邦層不是區塊鏈，也不是拜占庭共識。它永遠不會自動裁決分叉中哪一支是真實歷史——它提供可驗證證據，把裁決留給明確的治理政策。',
          },
        },
        {
          title: { en: 'Verifiable is not true', zh: '可驗證不等於真實' },
          body: {
            en: 'Content hashes, signatures, transparency logs and witnesses prove whether content was modified, whether a publisher signed, and whether a node witnessed. They cannot prove a schema is correct about the real world.',
            zh: '內容雜湊、簽章、透明度日誌與見證可以證明內容是否被修改、發布者是否簽署、節點是否曾見證。它們不能證明一個綱要在現實世界中一定正確。',
          },
        },
        {
          title: { en: 'Experimental must not pose as stable', zh: '實驗不得偽裝成穩定' },
          body: {
            en: 'Anything without enough tests, cases and formal analysis is marked EXPERIMENTAL, may iterate fast, and promises no 1.x compatibility. Network exploration and arbitrary executable schema rules were deliberately left outside the stable core.',
            zh: '沒有足夠測試、案例與形式分析的能力一律標為 EXPERIMENTAL，可以快速迭代，但不承諾 1.x 相容性。實驗性網路探索與任意可執行綱要規則被刻意排除在穩定核心之外。',
          },
        },
        {
          title: { en: 'No untrusted code execution', zh: '不執行不可信程式碼' },
          body: {
            en: 'External schemas may not run arbitrary code. Custom parsers and comparators are declarative, sandboxed, resource-limited, reproducible and network-denied by default. Token length, field count, recursion depth and candidate-parse count are all capped against parser DoS.',
            zh: '外部綱要不得執行任意程式碼。自訂解析器與比較器必須是宣告式、沙箱化、有資源限制、可重現，且預設禁止網路。token 長度、欄位數、遞迴深度與候選解析數都設有上限，以防解析器 DoS。',
          },
        },
        {
          title: { en: 'Not owned by a product', zh: '不被單一產品綁架' },
          body: {
            en: 'The core stays an independently usable specification. A product may use ICNS; it may not reverse-decide ICNS’s semantics. Its value depends on cross-implementation agreement, which a closed core would destroy.',
            zh: '核心保持為可獨立使用的規格。產品可以使用 ICNS，但不能反過來決定 ICNS 的語義。它的價值依賴跨實作一致性，而封閉核心會摧毀這一點。',
          },
        },
        {
          title: { en: 'Not an internet standard, and not yet licensed', zh: '不是網際網路標準，也還沒授權' },
          body: {
            en: 'The `application/icns+json` media type is experimental; standardization is meant to follow real interoperability demand, not theoretical completeness. And 1.0 freezes technical contracts only — MIT, Apache-2.0 or dual licensing all remain an explicit, unmade publisher decision.',
            zh: '`application/icns+json` 媒體型別是實驗性的；標準化應該建立在真實互通需求上，而不是因為理論完整就立即申請。而 1.0 只凍結技術契約——MIT、Apache-2.0 或雙授權，都仍是一個尚未做出的發布決定。',
          },
        },
      ],
    },
    {
      kind: 'table',
      id: 'next',
      kicker: { en: 'What comes next', zh: '後續' },
      title: { en: 'Four separate lines, and a stop condition', zh: '四條分離的路線，加上一個停止條件' },
      lead: {
        en: 'ICNS 1.0 is capped, and its own plan argues against extending 1.1, 1.2, 1.3 merely because more features are possible. The four development lines are deliberately separated so a research experiment can never leak into the stable contract.',
        zh: 'ICNS 1.0 已經封頂，而它自己的計畫反對「因為還能加功能」就立刻延伸 1.1、1.2、1.3。四條發展路線刻意分離，讓研究實驗不可能滲進穩定契約。',
      },
      cols: [
        { en: 'Line', zh: '路線' },
        { en: 'Scope', zh: '範圍' },
        { en: 'Content', zh: '內容' },
      ],
      rows: [
        {
          id: '1.x',
          cells: [
            { en: 'Stable maintenance', zh: '穩定維護線' },
            { en: 'Public release prep (license decision, public repo, split packages icns-core / -transport / -sdk-* / -lsp / -registry / -server), a five-category case library with test vectors, then performance and security hardening.', zh: '公開發行準備（授權決策、公開倉庫、拆分 icns-core／-transport／-sdk-*／-lsp／-registry／-server 套件）、五類案例庫與測試向量，再做效能與安全硬化。' },
          ],
          status: 'partial',
        },
        {
          id: '2.0',
          cells: [
            { en: 'Experimental research', zh: '實驗研究線' },
            { en: 'Context-dependent schemas Γ(x,t,c), partial orders and multi-valued judgments (DEFINITELY_LT / POSSIBLY_LT / OVERLAPPING / UNKNOWN), schema-composition algebra, conversion-preservation proofs, Lean 4 / Coq formalization.', zh: '依賴上下文的綱要 Γ(x,t,c)、部分序與多值判定（DEFINITELY_LT／POSSIBLY_LT／OVERLAPPING／UNKNOWN）、綱要組合代數、轉換守恆證明、Lean 4／Coq 形式化。' },
          ],
          status: 'planned',
        },
        {
          id: 'eco',
          cells: [
            { en: 'Ecosystem & adoption', zh: '生態與採用線' },
            { en: 'Spec site with a schema browser and playground; editor and data-tool integration; ICNS-aware database columns; AI-agent semantic guard turning AgentAction(s) into AgentAction(s, Γ).', zh: '含綱要瀏覽器與 Playground 的規範網站；編輯器與資料工具整合；ICNS-aware 資料庫欄位；把 AgentAction(s) 變成 AgentAction(s, Γ) 的 AI Agent 語義防護層。' },
          ],
          status: 'planned',
        },
        {
          id: 'link',
          cells: [
            { en: 'Theory & product bridges', zh: '理論與產品銜接線' },
            { en: 'Version-representation theory as the first specialised application family; dynamic encoding formats; AI-native document formats carrying (s, Γ, source, trust); timestamp and evidence-chain systems.', zh: '版本表示理論作為第一個專門應用族；動態編碼格式；攜帶 (s, Γ, 來源, 信任) 的 AI 原生文件格式；時間戳與證據鏈系統。' },
          ],
          status: 'planned',
        },
      ],
      note: {
        en: 'Otherwise the state is STABLE / MAINTENANCE. Restart conditions are explicit: a confirmed defect, a real use case, an external report, a publication need, a dependent product, formalization work that requires spec wording changes, or new theory strong enough to justify 2.0.',
        zh: '否則狀態就是 STABLE／MAINTENANCE。重新啟動的條件是明確列出的：發現明確缺陷、有真實使用案例、有外部回報、需要公開發布、有相關產品需要整合、形式化工作需要調整規格文字，或出現足以支持 2.0 的新理論。',
      },
    },
    {
      kind: 'prose',
      id: 'eml',
      kicker: { en: 'Relation to EML', zh: '與 EML 的關係' },
      title: { en: 'Why this sits next to a transpiler', zh: '為什麼它和一個轉譯器放在一起' },
      paras: {
        en: [
          'The link is not thematic — it is in the release. ICNS 1.0 ships EveMissLab version schemas as worked examples: `eml-version-2-bounded`, `eml-version-3-bounded` (major 0–9, minor 0–99, patch 0–99 with a default, lexicographic order, pad-right-zero normalization, no carry, successor increments patch) and `eml-release-train` (year 2026–2099 × train 0–99). They exist because a spec that cannot state its own version numbering has not finished.',
          'The deeper overlap is a shared refusal. EML’s core rule is that no LLM sits in the transpilation chain and round-trip faithfulness is an invariant, not a feature. ICNS’s core rule is that a declaration always beats a guess, and an insufficient declaration returns UNRESOLVED or AMBIGUOUS instead of a plausible number. Both are betting that determinism is what makes a layer safe to put under an AI, and both would rather fail loudly than be quietly wrong.',
          'They also fail in the same direction. EML’s reverse compression is a deterministic inverse only on its supported subset and errors out on inexpressible constructs. ICNS refuses cross-schema comparison when no lossless common schema exists. Neither treats “produce something” as better than “say it cannot be done”.',
        ],
        zh: [
          '這個連結不是主題上的，而是寫在發行物裡。ICNS 1.0 內建了 EveMissLab 的版本綱要作為實例：`eml-version-2-bounded`、`eml-version-3-bounded`（major 0–9、minor 0–99、patch 0–99 帶預設值，字典序，pad-right-zero 正規化，不進位，後繼遞增 patch）與 `eml-release-train`（year 2026–2099 × train 0–99）。它們存在的理由很簡單：一份說不出自己版本編號規則的規格，還沒做完。',
          '更深的重疊是一種共同的拒絕。EML 的核心規則是：核心轉譯鏈裡不放任何 LLM，往返一致性是不變式而不是功能。ICNS 的核心規則是：宣告永遠勝過猜測，宣告不足時回傳 UNRESOLVED 或 AMBIGUOUS，而不是回傳一個看起來合理的數字。兩者都在賭同一件事——確定性才是讓一個層可以被安心放在 AI 底下的原因；也都寧願大聲失敗，而不要安靜地錯。',
          '它們失敗的方向也一樣。EML 的反向壓縮只在支援子集內是確定性反函數，遇到無法表達的寫法就直接報錯。ICNS 在不存在無損共同綱要時直接拒絕跨綱要比較。兩者都不認為「產出一個東西」比「說它做不到」更好。',
        ],
      },
      callout: {
        en: 'The one-line principle ICNS wants to outlive itself: before any symbol is executed, compared, sorted, exchanged, or handed to an artificial intelligence, it should first declare which semantic system it belongs to.',
        zh: 'ICNS 希望活得比自己更久的那一句原則：任何符號在被執行、比較、排序、交換或交由人工智慧處理之前，都應先宣告它屬於什麼語義系統。',
      },
    },
    {
      kind: 'docs',
      id: 'docs',
      kicker: { en: 'Source documents', zh: '來源文件' },
      title: { en: 'Paper, whitepaper, frozen spec', zh: '論文、白皮書、凍結規格' },
      lead: {
        en: 'ICNS went from proposition to capped specification in one cycle: bare numeral → interpretation-complete semantics → schema → document → package → governance → federation → SDK → toolchain → deployment → stable spec.',
        zh: 'ICNS 在一個週期內從命題走到封頂規格：裸數符 → 解譯完備語義 → 綱要 → 文件 → 套件 → 治理 → 聯邦 → SDK → 工具鏈 → 部署 → 穩定規格。',
      },
      docs: [
        {
          title: '解譯完備數符：從裸數字到可判定語義的表示框架',
          meta: 'public paper · v0.1 · 2026-07-29',
          desc: {
            en: 'The theory: bare-numeral ambiguity, the declaration and judgment domains, the three propositions, the fourfold distinction of decimal limits, and the four public representation methods.',
            zh: '理論：裸數符歧義、宣告域與判定域、三個基本命題、小數位極限的四重區分，以及四種公開表示方法。',
          },
        },
        {
          title: '解譯完備數符統合技術白皮書',
          meta: 'whitepaper · v0.1 · 2026-07-29',
          desc: {
            en: 'The implementable spec: field-by-field declaration and judgment vocabulary, the seven representations, scope priority, the minimal EBNF, schema registration and fingerprints, the pipeline, algorithms, error and warning codes, completeness levels, and the acceptance test vectors.',
            zh: '可實作的規格：宣告與判定的逐欄位詞彙、七種表示法、作用域優先序、最小 EBNF、綱要註冊與指紋、處理管線、核心演算法、錯誤與警告碼、完備性分級，以及驗收測試向量。',
          },
        },
        {
          title: 'spec/icns-1.0-freeze.json',
          meta: 'sha256:151b432d…',
          desc: {
            en: 'The machine-readable stability contract: 4 profiles, 21 features with stability labels, 8 built-in schema hashes, the transport operation list, the OpenAPI lock (78 paths), 12 normative artifacts with their own hashes, and the compatibility policy.',
            zh: '機器可讀的穩定契約：4 個 Profile、21 項附穩定性標籤的功能、8 個內建綱要雜湊、傳輸操作清單、OpenAPI lock（78 條路徑）、12 份各自帶雜湊的規範性產出，以及相容性政策。',
          },
        },
        {
          title: 'spec/ICNS-1.0-Core / Schema-and-Semantics / Transport / Profiles / Versioning / Conformance',
          meta: '6 normative documents',
          desc: {
            en: 'The 1.0 normative document set, each pinned by hash inside the freeze contract and re-verified by `spec-verify` for drift.',
            zh: '1.0 的規範性文件集，每一份都在凍結契約中以雜湊釘住，並由 `spec-verify` 反覆驗證是否漂移。',
          },
        },
        {
          title: 'conformance/icns-1.0-core.suite.json',
          meta: '18 cases · PASS',
          desc: {
            en: 'The normative conformance suite, runnable via `conformance-run`, with JSON and JUnit reports so another implementation can be measured against the same cases.',
            zh: '規範性一致性套件，可用 `conformance-run` 執行，輸出 JSON 與 JUnit 報告，讓其他實作可以用同一組案例衡量自己。',
          },
        },
        {
          title: 'ICNS 1.0 後續發展與未來計畫',
          meta: 'non-normative · v0.1 · 2026-07-29',
          desc: {
            en: 'The four development lines, five principles, priority order, and the stop / restart conditions summarised in the table above. Explicitly does not modify the 1.0 freeze.',
            zh: '上方表格所摘要的四條發展路線、五項原則、優先序，以及停止與重新啟動條件。明確不修改 1.0 的凍結內容。',
          },
        },
      ],
      note: {
        en: 'Like CAIR, ICNS is currently a research and engineering archive, so nothing here is a download link. Its release states the licensing position outright: 1.0 freezes technical contracts only, the bundled implementation keeps its research-artifact notice, and choosing MIT, Apache-2.0 or dual licensing remains a separate publisher decision. The compatibility promise above is a technical policy — not a commercial SLA, warranty, uptime or response-time commitment.',
        zh: '和 CAIR 一樣，ICNS 目前是研究與工程封存，因此這裡沒有任何下載連結。它的發行物直接寫明授權立場：1.0 只凍結技術契約，內含的實作保留原本的研究產出聲明，而選擇 MIT、Apache-2.0 或雙授權，仍是一個獨立的發布決定。上面的相容性承諾是技術政策——不是商業 SLA、保固、服務可用率或回應時間承諾。',
      },
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// MNVP — Multi-layer Numerical Visualization Protocol
// Sources: MNVP_獨立理論_數值語義到認知投影_v0.1, MNVP_技術白皮書_v0.1, the
// MNVP_v1.0.0 release package (spec/mnvp-1.0-freeze.json, TEST_REPORT.txt,
// conformance/mnvp-core-v1.0.report.json), MNVP_1.0_後續發展與未來計畫_v0.1.
// MNVP is the display tier above ICNS, so this entry sits directly after it.
// ───────────────────────────────────────────────────────────────────────────────

const MNVP: RelatedProject = {
  slug: 'mnvp',
  code: 'MNVP',
  expansion: 'Multi-layer Numerical Visualization Protocol',
  name: { en: 'Multi-layer Numerical Visualization Protocol', zh: '多層數值視覺化協定' },
  tagline: {
    en: 'A number being correctly represented is not the same as a number being correctly understood. Every display is a projection — MNVP makes that projection declare what it kept, what it dropped, and whether it is still faithful.',
    zh: '一個數值被正確表示，不等於它被正確理解。任何顯示都是投影——MNVP 要求那個投影說清楚它保留了什麼、丟掉了什麼，以及它是否仍然忠實。',
  },
  hubPoints: {
    en: [
      'SemanticallyCorrect(x) ⇏ CognitivelyAccessible(x) — two different layers',
      'Every render emits an omission manifest and a fidelity report, or it fails',
      'v1.0 frozen: 4 profiles, 7 digest-pinned visual profiles, 5 targets, 266 tests',
    ],
    zh: [
      '語義正確(x) ⇏ 認知可達(x)——這是兩個不同層次',
      '每次渲染都必須產出省略清單與忠實性報告，否則就失敗',
      'v1.0 已凍結：4 個 Profile、7 個雜湊釘住的視覺 Profile、5 種輸出、266 項測試',
    ],
  },
  accent: 'amber',
  kicker: { en: 'Related · MNVP', zh: '相關語言 · MNVP' },
  title: { en: 'MNVP — how a number should be seen', zh: 'MNVP——數值應該如何被看見' },
  lead: {
    en: 'ICNS answers what a numeral is. MNVP answers how an already-interpreted number should be shown — under a task, a medium, an audience, accessibility requirements and an explicit information-loss budget. It treats rendering as constrained semantic compilation rather than a front-end styling decision, and it refuses to let cognitive convenience be bought with semantic distortion.',
    zh: 'ICNS 回答數符「是什麼」。MNVP 回答已解譯的數值「應該怎麼被看見」——在特定任務、媒介、受眾、無障礙需求與一份明確的資訊損失預算之下。它把渲染當成受約束的語義編譯，而不是前端樣式決定，並且拒絕用語義失真去換取認知上的方便。',
  },
  facts: [
    { label: { en: 'Version', zh: '版本' }, value: 'v1.0.0' },
    { label: { en: 'Protocol', zh: '協定' }, value: '1.0' },
    { label: { en: 'Frozen', zh: '凍結日' }, value: '2026-07-30' },
    { label: { en: 'Status', zh: '狀態' }, value: 'STABLE' },
    { label: { en: 'Profiles', zh: 'Profile' }, value: '4' },
    { label: { en: 'Visual profiles', zh: '視覺 Profile' }, value: '7' },
    { label: { en: 'Render targets', zh: '輸出格式' }, value: '5' },
    { label: { en: 'Stable API paths', zh: '穩定 API 路徑' }, value: '49' },
    { label: { en: 'Tests', zh: '測試' }, value: '266' },
    { label: { en: 'License', zh: '授權' }, value: 'undecided' },
  ],
  sections: [
    {
      kind: 'code',
      id: 'problem',
      kicker: { en: 'The problem', zh: '問題' },
      title: { en: 'Correct is not the same as readable', zh: '正確，不等於讀得懂' },
      lead: {
        en: 'Scientific notation is exact. It is also five separate acts of mental work before a reader can say which of two numbers is bigger. And the older failure is worse: a display can be perfectly legal and still assert a relationship that does not exist.',
        zh: '科學記數法是精確的。它同時也是「讀者要先做五件事，才能說出哪一個比較大」。而更老的那個失效更嚴重：一個顯示可以完全合法，卻同時斷言一個並不存在的關係。',
      },
      code: `SemanticallyCorrect(x)   =>/=   CognitivelyAccessible(x)

4.4 x 10^26      vs      1.6 x 10^-35
   exact, and yet the reader must first:
   1. split coefficient from exponent
   2. read the sign
   3. compute or estimate the exponent gap
   4. turn that gap into scale intuition
   5. decide whether the two belong on one axis at all

and the failure that is not about effort at all:

   version  0.9  vs  0.10       shown on a decimal axis
   -> the picture says 0.10 > 0.9        the schema says otherwise
   -> the display did not lose information, it ASSERTED a false order`,
      note: {
        en: 'MNVP’s first principle follows directly: semantics before appearance. Given the bare string `0.91` with no schema, a renderer may print the literal characters and nothing more — it may not decide to draw it as a version ladder, a decimal proportion or a percentage. Unresolved input caps what a projection is allowed to claim.',
        zh: 'MNVP 的第一原則由此直接得出：語義先於表象。只給裸字串 `0.91`、沒有綱要時，渲染器最多只能印出字面字元——不能自己決定把它畫成版本階梯、小數比例或百分比。輸入未解析，就限住了投影能主張的上限。',
      },
    },
    {
      kind: 'code',
      id: 'mapping',
      kicker: { en: 'Core mapping', zh: '核心映射' },
      title: { en: 'Rendering as constrained semantic compilation', zh: '把渲染當成受約束的語義編譯' },
      lead: {
        en: 'A projection takes three inputs and must return two outputs. The second output is the part conventional rendering never produces: a machine-readable account of what this particular view preserved, omitted and can still be trusted for.',
        zh: '一次投影吃三個輸入，並且必須回傳兩個輸出。第二個輸出正是傳統渲染從來不產出的東西：一份機器可讀的交代，說明這個視圖保留了什麼、省略了什麼，以及它還能被信任到什麼程度。',
      },
      code: `V :  N  x  C  x  P   ->   G  x  R

N  numerical object   value, schema_ref, scale, unit, precision, resolution,
                      uncertainty, quality, derivation, provenance, constraints
C  projection context task, medium, audience, interaction, accessibility,
                      disclosure level, loss budget
P  visual profile     required semantics, channel map, disclosure, fidelity,
                      accessibility contract

G  perceptual output  primary display + channel map + layers + alt text
R  report             preserved / omitted / unknown, loss, fidelity checks

field states:  KNOWN  UNKNOWN  NOT_APPLICABLE  WITHHELD  INFERRED
               UNKNOWN must never be rendered as zero,
               NOT_APPLICABLE must never be rendered as missing`,
      note: {
        en: 'Frozen in 1.0: six value kinds (scalar, scientific, tuple, interval, distribution, samples), seven uncertainty kinds (none, unknown, plus-minus, interval, distribution, samples, scenario-set) and three distribution families (normal, lognormal, uniform). A `±` is not self-explanatory, so `interpretation` — standard deviation vs. confidence interval — is carried explicitly rather than assumed.',
        zh: '1.0 凍結的內容包括：六種值類型（scalar、scientific、tuple、interval、distribution、samples）、七種不確定度類型（none、unknown、plus-minus、interval、distribution、samples、scenario-set），以及三個分布族（normal、lognormal、uniform）。一個 `±` 本身說明不了自己，所以 `interpretation`——標準差還是信賴區間——是明確攜帶的，不是猜的。',
      },
    },
    {
      kind: 'cards',
      id: 'principles',
      kicker: { en: 'Principles', zh: '原則' },
      title: { en: 'Seven rules a projection has to obey', zh: '投影必須遵守的七條規則' },
      lead: {
        en: 'Most of these are restraints on the renderer, not features for the reader. That is deliberate: the failure mode being designed against is a beautiful view that quietly changed the answer.',
        zh: '這七條大多是對渲染器的約束，不是給讀者的功能。這是刻意的：要防的失效模式，是一個漂亮的視圖悄悄改掉了答案。',
      },
      cards: [
        {
          title: { en: 'Semantics before appearance', zh: '語義先於表象' },
          body: {
            en: 'A renderer must not infer full semantics from how something looks. No schema means no semantic projection — only the literal string.',
            zh: '渲染器不得從外觀猜測完整語義。沒有綱要就沒有語義投影，只能顯示字面字串。',
          },
        },
        {
          title: { en: 'Projection depends on task', zh: '投影依賴任務' },
          body: {
            en: 'There is no task-free best representation. Engineering wants scale, finance wants fixed precision, science wants uncertainty, audit wants provenance. Two different views of one number are not evidence that one of them is wrong.',
            zh: '不存在脫離任務的最佳表示。工程要尺度、財務要固定精度、科學要不確定度、稽核要來源。同一個數值有兩種不同視圖，不代表其中一個是錯的。',
          },
        },
        {
          title: { en: 'Compression must not distort what matters', zh: '壓縮不得讓關鍵語義失真' },
          body: {
            en: 'The task-critical semantics must be a subset of what the projection preserves. If the task is deciding whether two measurements are meaningfully apart, a centre-value-only chart is not a faithful projection of them.',
            zh: '任務關鍵語義必須是投影所保留語義的子集。如果任務是判斷兩個量測是否顯著分離，那麼只畫中心值的圖形就不構成忠實投影。',
          },
        },
        {
          title: { en: 'Progressive disclosure, not permanent deletion', zh: '漸進揭露，而非永久刪除' },
          body: {
            en: 'Simplifying is allowed; it must be expandable. A lower layer may omit, but must keep the expansion path, the omission hint, the full value and the machine-readable data underneath. Hidden costs less than destroyed.',
            zh: '允許簡化，但必須能展開。低層可以省略，但必須保留展開機制、省略提示、完整值與底下的機器可讀資料。「暫時隱藏」的代價低於「永久刪除」。',
          },
        },
        {
          title: { en: 'Cross-medium semantic equivalence', zh: '跨媒介語義等價' },
          body: {
            en: 'SVG, plain text, LaTeX, speech and touch may look nothing alike, but the task-critical semantics must decode to the same meaning. Equivalence is about what can be recovered, not about appearance.',
            zh: 'SVG、純文字、LaTeX、語音與觸覺可以毫無相似之處，但任務關鍵語義必須解碼出同樣的意義。等價講的是「能還原出什麼」，不是外觀。',
          },
        },
        {
          title: { en: 'Incomparability must stay visible', zh: '不可比較性必須看得見' },
          body: {
            en: 'If two objects share no comparison domain, placing them on one axis must not imply they can be ordered. The view has to say INCOMPARABLE, CONVERSION_REQUIRED, SCHEMA_MISMATCH, UNIT_MISMATCH or UNCERTAINTY_OVERLAP — a missing rule may not be dressed up as a size difference.',
            zh: '若兩個物件沒有共同比較域，把它們放在同一條軸上不得暗示可以排序。視圖必須說出 INCOMPARABLE、CONVERSION_REQUIRED、SCHEMA_MISMATCH、UNIT_MISMATCH 或 UNCERTAINTY_OVERLAP——缺少比較規則，不能被打扮成大小差。',
          },
        },
        {
          title: { en: 'Accessibility is redundancy, not an add-on', zh: '無障礙是冗餘編碼，不是附加功能' },
          body: {
            en: 'Colour may enhance a channel but may never be the only one carrying information. If hue encodes scale or confidence, text, shape, pattern, position, stroke or an assistive-technology label must carry it too. WCAG 2.2 is the floor here, not the goal.',
            zh: '顏色可以強化通道，但絕不能是唯一承載資訊的通道。若色相編碼尺度或可信度，那麼文字、形狀、圖案、位置、線型或輔助技術標籤也必須承載它。WCAG 2.2 在這裡是底線，不是目標。',
          },
        },
      ],
    },
    {
      kind: 'table',
      id: 'channels',
      kicker: { en: 'Channels', zh: '通道' },
      title: { en: 'Visual channels are not interchangeable', zh: '視覺通道並非任意可換' },
      lead: {
        en: 'Position on a common scale and length support precise quantitative comparison in a way that angle, area and hue do not — a result from the graphical-perception literature. MNVP encodes that as default channel policy rather than as a universal psychological law, and every mapping stays overridable per profile.',
        zh: '共同尺度上的位置與長度，在精確定量比較上優於角度、面積與色相——這是圖形感知研究的結果。MNVP 把它寫成預設的通道策略，而不是普遍心理定律；每一條映射都可以在 Profile 層被覆寫。',
      },
      cols: [
        { en: 'Semantic', zh: '語義' },
        { en: 'Preferred channel', zh: '優先通道' },
        { en: 'Never alone', zh: '不建議單獨使用' },
      ],
      rows: [
        {
          id: 'value',
          cells: [
            { en: 'Position on a common axis; length or text as secondary', zh: '共同軸位置；長度或文字為次要' },
            { en: 'Hue, area', zh: '色相、面積' },
          ],
        },
        {
          id: 'scale',
          cells: [
            { en: 'Logarithmic or banded position; exponent text', zh: '對數或分層位置；指數文字' },
            { en: 'Font size alone', zh: '只用字體大小' },
          ],
        },
        {
          id: 'precision',
          cells: [
            { en: 'Significant digits, boundary markers, stroke', zh: '有效位數、邊界標記、線型' },
            { en: 'Hue', zh: '色相' },
          ],
        },
        {
          id: 'uncertainty',
          cells: [
            { en: 'Interval, distribution or sample set; text', zh: '區間、分布或樣本集合；文字' },
            { en: 'A single blur effect', zh: '單一模糊效果' },
          ],
        },
        {
          id: 'unit',
          cells: [
            { en: 'Text, icon, grouping position', zh: '文字、圖示、分組位置' },
            { en: 'Colour only', zh: '只用顏色' },
          ],
        },
        {
          id: 'quality',
          cells: [
            { en: 'Badge, stroke style, explicit state text', zh: '標章、線型、明確的狀態文字' },
            { en: 'Buried in a tooltip', zh: '藏在提示框裡' },
          ],
        },
        {
          id: 'incomparable',
          cells: [
            { en: 'Separated regions, a blocking marker, diagnostic text', zh: '分離區域、阻斷符號、診斷文字' },
            { en: 'Side by side on one axis', zh: '同軸並列' },
          ],
        },
      ],
      note: {
        en: 'Channels can also collide: map magnitude and uncertainty both to area and a reader cannot separate them. MNVP scores that as a conflict and requires the renderer to switch channels, lower the disclosure level, split into several views, or emit W_CHANNEL_CONFLICT.',
        zh: '通道也會互相干擾：把數值大小與不確定度同時映射到面積，讀者就無法分離兩者。MNVP 把這計為衝突，並要求渲染器改用其他通道、降低揭露層級、拆成多個視圖，或發出 W_CHANNEL_CONFLICT。',
      },
    },
    {
      kind: 'table',
      id: 'disclosure',
      kicker: { en: 'Disclosure', zh: '揭露' },
      title: { en: 'Four layers, and a manifest of what is missing', zh: '四個層級，以及一份「缺了什麼」的清單' },
      lead: {
        en: 'A finite medium cannot always show complete semantics, so MNVP does not demand zero loss — it demands that loss be declarable, measurable and controllable. Each semantic carries a task weight; the omitted weights are summed and compared against the context’s budget.',
        zh: '有限的媒介不可能總是顯示完整語義，所以 MNVP 不要求零損失——它要求損失可聲明、可測量、可控制。每個語義都帶一個任務權重；被省略的權重加總後，與情境給定的預算相比。',
      },
      cols: [
        { en: 'Layer', zh: '層級' },
        { en: 'Name', zh: '名稱' },
        { en: 'Adds', zh: '加入' },
      ],
      rows: [
        {
          id: 'L0',
          cells: [
            { en: 'Primary', zh: '核心值層' },
            { en: 'The main value, necessary scale, necessary unit — plus the ability to tell that something was omitted.', zh: '主值、必要尺度、必要單位——以及「能看出有東西被省略」這件事。' },
          ],
        },
        {
          id: 'L1',
          cells: [
            { en: 'Comparative', zh: '比較層' },
            { en: 'Comparison axis, primary uncertainty, thresholds and state, comparability.', zh: '比較軸、主要不確定度、閾值與狀態、可比較性。' },
          ],
        },
        {
          id: 'L2',
          cells: [
            { en: 'Interpretive', zh: '解釋層' },
            { en: 'Precision, resolution, uncertainty kind, quality, and both the raw and canonical representations.', zh: '精度、解析度、不確定度類型、品質，以及原始與規範兩種表示。' },
          ],
        },
        {
          id: 'L3',
          cells: [
            { en: 'Audit', zh: '稽核層' },
            { en: 'Schema, provenance, operation log, verification state, and the complete machine object.', zh: '綱要、來源鏈、操作紀錄、驗證狀態，以及完整的機器物件。' },
          ],
        },
      ],
      note: {
        en: 'If a semantic carries infinite weight — a currency, a fixed precision, a decisive uncertainty, a revoked state — omitting it does not merely exceed the budget, it makes the render fail with E_LOSS_BUDGET_EXCEEDED. This is the mechanism that turns "should we simplify?" from a style preference into a checkable rule, including for an AI writing the output.',
        zh: '如果某個語義帶有無限權重——幣別、固定精度、會改變結論的不確定度、已撤銷狀態——省略它不只是超出預算，而是讓渲染直接以 E_LOSS_BUDGET_EXCEEDED 失敗。正是這個機制，把「要不要簡化」從風格偏好變成可檢查的規則——對正在產生輸出的 AI 也一樣適用。',
      },
    },
    {
      kind: 'groups',
      id: 'fidelity',
      kicker: { en: 'Fidelity', zh: '忠實性' },
      title: { en: 'Eight checks, and what each one catches', zh: '八項檢查，以及各自抓什麼' },
      lead: {
        en: 'Fidelity here does not mean the picture resembles the number. It means the projection did not change the judgement the current task depends on — so it is task-relative by construction, and a view can be faithful for rough ranking while unfaithful for deciding whether two distributions overlap.',
        zh: '這裡的忠實性不是「圖形長得像那個數值」，而是「投影沒有改變當前任務所依賴的判斷」。因此它天生是任務相對的：同一個視圖可以在粗略排序上忠實，在判斷兩個分布是否重疊上不忠實。',
      },
      groups: [
        {
          title: { en: 'Value, order, sign, scale', zh: '值、順序、符號、尺度' },
          items: {
            en: [
              'Value decodes back to the input, or stays inside a declared approximation bound',
              'Truncated axes and area ratios may not reverse a required ordering (E_ORDER_REVERSED)',
              'A minus sign, direction or inverse state may not vanish into formatting (E_SIGN_HIDDEN)',
              'A non-linear scale must be visibly declared or readable by assistive technology',
            ],
            zh: [
              '值必須能解碼回輸入，或落在已聲明的近似界限內',
              '截斷軸線與面積比例不得反轉必要的排序（E_ORDER_REVERSED）',
              '負號、方向或逆向狀態不得因格式化而消失（E_SIGN_HIDDEN）',
              '非線性尺度必須有可見標記，或能被輔助技術讀取',
            ],
          },
        },
        {
          title: { en: 'Precision, uncertainty, unit, comparability', zh: '精度、不確定度、單位、可比較性' },
          items: {
            en: [
              'Displayed precision may never exceed input precision — 0.9 must not become 0.900000 (E_PRECISION_OVERSTATED)',
              'If the profile requires uncertainty, dropping it fails rather than warns (E_UNCERTAINTY_DROPPED)',
              'A unit may not be hidden where the number is read (E_UNIT_HIDDEN)',
              'Upstream INCOMPARABLE forbids any total-order axis downstream (E_INCOMPARABLE_ALIGNED)',
            ],
            zh: [
              '顯示精度絕不得高於輸入精度——0.9 不能變成 0.900000（E_PRECISION_OVERSTATED）',
              '若 Profile 要求不確定度，省略它是失敗，不是警告（E_UNCERTAINTY_DROPPED）',
              '單位不得在讀到數值的位置被藏起來（E_UNIT_HIDDEN）',
              '上游回傳 INCOMPARABLE，下游就不得產生任何全序軸（E_INCOMPARABLE_ALIGNED）',
            ],
          },
        },
        {
          title: { en: 'Accessibility as a hard check', zh: '無障礙是硬檢查' },
          items: {
            en: [
              'Colour-only encoding is an error, not a lint warning (E_COLOR_ONLY)',
              'Missing alternative text is an error (E_ALT_TEXT_MISSING)',
              'Key information behind hover only is flagged (W_HOVER_ONLY)',
              'SVG output must carry <title>, <desc> and a traceable object id',
            ],
            zh: [
              '色彩唯一編碼是錯誤，不是 lint 警告（E_COLOR_ONLY）',
              '缺少替代文字是錯誤（E_ALT_TEXT_MISSING）',
              '關鍵資訊只放在 hover 會被標記（W_HOVER_ONLY）',
              'SVG 輸出必須帶 <title>、<desc> 與可追溯的物件 id',
            ],
          },
        },
        {
          title: { en: 'Visual spoofing', zh: '視覺欺騙' },
          items: {
            en: [
              'Hidden minus signs, zero-width characters and Unicode homoglyphs',
              'Low-contrast critical information and truncated axes',
              'Undeclared non-linear scales and selective omission of inconvenient data',
              'Weakening a REVOKED state into an ordinary colour',
            ],
            zh: [
              '隱藏的負號、零寬字元與 Unicode 同形字',
              '低對比的關鍵資訊與截斷的軸線',
              '未聲明的非線性尺度，以及選擇性省略不利資料',
              '把 REVOKED 狀態弱化成一般顏色',
            ],
          },
        },
      ],
      note: {
        en: 'MNVP also keeps five things apart that get collapsed constantly: CONTENT_VALID, SIGNATURE_VALID, PUBLISHER_TRUSTED, SEMANTICALLY_CORRECT and EMPIRICALLY_TRUE. A valid signature says nothing about whether the number is right about the world.',
        zh: 'MNVP 也把五件經常被混為一談的事分開：CONTENT_VALID、SIGNATURE_VALID、PUBLISHER_TRUSTED、SEMANTICALLY_CORRECT、EMPIRICALLY_TRUE。簽章有效，完全沒有說這個數值對現實世界是不是正確的。',
      },
    },
    {
      kind: 'table',
      id: 'profiles',
      kicker: { en: 'Visual profiles', zh: '視覺 Profile' },
      title: { en: 'Seven frozen profiles, each pinned by digest', zh: '七個凍結的 Profile，各以雜湊釘住' },
      lead: {
        en: 'A visual profile is the contract: which semantics are required, which channels carry them, how disclosure behaves, what fidelity must hold, what accessibility must hold. Profile identity is immutable — the same ID and version may never point at different content.',
        zh: '視覺 Profile 就是那份契約：哪些語義是必要的、由哪些通道承載、揭露怎麼運作、必須維持什麼忠實性、必須維持什麼無障礙條件。Profile 身份是不可變的——同一個 ID 與版本，絕不能指向不同內容。',
      },
      cols: [
        { en: 'Profile', zh: 'Profile' },
        { en: 'For', zh: '用於' },
        { en: 'Must preserve', zh: '必須保留' },
      ],
      rows: [
        {
          id: 'compact@0.1',
          cells: [
            { en: 'Fast reading in tight space', zh: '有限空間的快速閱讀' },
            { en: 'Value, scale where it changes the value, unit, and an omission indicator. Explicitly not for high-stakes judgement.', zh: '值、會影響值的尺度、單位，以及一個省略提示。明確不適合高風險判斷。' },
          ],
        },
        {
          id: 'scientific@0.1',
          cells: [
            { en: 'Measurement and comparison', zh: '量測與比較' },
            { en: 'Value, scale, unit, precision and the uncertainty state — including when that state is UNKNOWN.', zh: '值、尺度、單位、精度與不確定度狀態——包含該狀態就是 UNKNOWN 的情況。' },
          ],
        },
        {
          id: 'engineering@0.1',
          cells: [
            { en: 'Estimation and tolerance', zh: '估算與容差' },
            { en: 'Order-of-magnitude position, tolerance, thresholds, unit consistency, and the negligibility condition actually used.', zh: '數量級位置、容差、閾值、單位一致性，以及實際採用的可忽略條件。' },
          ],
        },
        {
          id: 'version@0.1',
          cells: [
            { en: 'Version tuples', zh: '版本 tuple' },
            { en: 'Field structure. Must render 0 · 9 · 1 with field labels — rendering it as the decimal 0.91 is a conformance failure.', zh: '欄位結構。必須渲染成帶欄位標籤的 0 · 9 · 1——把它渲染成小數 0.91 就是一致性失敗。' },
          ],
        },
        {
          id: 'uncertainty@0.2',
          cells: [
            { en: 'Intervals, distributions, samples', zh: '區間、分布、樣本' },
            { en: 'The uncertainty kind itself, not just a bar. Does not flatten every uncertainty into a single ±.', zh: '不確定度的「類型」本身，而不只是一根誤差棒。不把所有不確定度壓成單一個 ±。' },
          ],
        },
        {
          id: 'provenance@0.2',
          cells: [
            { en: 'Audit', zh: '稽核' },
            { en: 'Original value, processing chain, source, verification state, derivation depth and conversion loss. Sensitive fields may be masked, but WITHHELD must not read as absent.', zh: '原始值、處理鏈、來源、驗證狀態、推導深度與轉換損失。敏感欄位可以遮蔽，但 WITHHELD 不能被讀成「不存在」。' },
          ],
        },
        {
          id: 'accessibility@0.1',
          cells: [
            { en: 'Assistive technology', zh: '輔助技術' },
            { en: 'Text alternative, no colour-only encoding, a keyboard reading path, a data-table or structured alternative, and no critical information reachable only by hover.', zh: '文字替代、不使用色彩唯一編碼、鍵盤讀取路徑、資料表或結構化替代，且關鍵資訊不得只能靠 hover 取得。' },
          ],
        },
      ],
      note: {
        en: 'The whitepaper also drafts a financial profile (decimal exactness, currency, rounding mode, minimum unit, audit state); it is not in the frozen built-in set, so it is a draft here and not a shipped capability. Custom and signed third-party profiles are supported through the registry — Ed25519, with the trust states TRUSTED, VALID_UNTRUSTED, VALID_REVOKED_KEY, UNSIGNED and INVALID kept distinct.',
        zh: '白皮書另外草擬了一個 financial profile（十進位精確、幣別、捨入方式、最小計價單位、稽核狀態）；它不在凍結的內建集合裡，所以在這裡是草案，不是已交付的能力。自訂與第三方簽章 Profile 透過 Registry 支援——Ed25519，且 TRUSTED、VALID_UNTRUSTED、VALID_REVOKED_KEY、UNSIGNED、INVALID 五種信任狀態彼此分開。',
      },
    },
    {
      kind: 'pipeline',
      id: 'pipeline',
      kicker: { en: 'Engine', zh: '引擎' },
      title: { en: 'The rendering pipeline', zh: '渲染管線' },
      lead: {
        en: 'The renderer never mutates the numerical object, and high-risk profiles validate fidelity before an artifact is returned rather than after. Context resolution has a fixed priority — inline request, component, document, application, user accessibility preferences, system default — and an accessibility preference may not be overridden by a lower layer.',
        zh: '渲染器絕不改動數值物件，而高風險 Profile 會在回傳 artifact「之前」驗證忠實性，而不是之後。情境解析有固定優先序——inline 請求、元件、文件、應用、使用者無障礙偏好、系統預設——而無障礙偏好不得被較低層覆蓋。',
      },
      steps: {
        en: ['ingest', 'validate', 'resolve context', 'select profile', 'plan channels', 'render', 'validate fidelity', 'serialize'],
        zh: ['接收', '驗證', '解析情境', '選擇 Profile', '規劃通道', '渲染', '驗證忠實性', '序列化'],
      },
      note: {
        en: 'Five built-in targets come out of it — text, HTML, SVG, LaTeX and Vega-Lite — plus a cross-scale view and an uncertainty view. MNVP sits between structured numerical data and chart grammar rather than replacing either: it can compile to Vega-Lite, and it can refuse to let semantically incomplete or incomparable data reach a chart that would misrepresent it.',
        zh: '從管線出來的是五種內建輸出——text、HTML、SVG、LaTeX、Vega-Lite——加上跨尺度視圖與不確定度視圖。MNVP 站在結構化數值資料與圖表語法「之間」，而不是取代任何一方：它可以編譯成 Vega-Lite，也可以擋住語義不完備或不可比較的資料，不讓它進到會誤導人的圖表裡。',
      },
    },
    {
      kind: 'groups',
      id: 'frozen',
      kicker: { en: 'What 1.0 freezes', zh: '1.0 凍結了什麼' },
      title: { en: 'Four profiles, 31 features, one contract hash', zh: '4 個 Profile、31 項功能、一個契約雜湊' },
      lead: {
        en: 'MNVP went from theory to capped spec in one cycle — v0.1 prototype, v0.2 uncertainty, v0.3 document binding and LSP, v0.4 signed profiles and conformance, v0.5 renderer packages and the pre-integration baseline, then 1.0 — with every stage keeping the previous stage’s regressions.',
        zh: 'MNVP 在一個週期內從理論走到封頂規格——v0.1 原型、v0.2 不確定度、v0.3 文件綁定與 LSP、v0.4 簽章 Profile 與一致性、v0.5 Renderer Package 與整合前基線，然後 1.0——而且每一階段都保留前一階段的回歸測試。',
      },
      groups: [
        {
          title: { en: 'Core 1.0 — 6 features', zh: 'Core 1.0——6 項功能' },
          items: {
            en: [
              'Numerical Object validation and normalization',
              'Projection Context: task, medium, audience, interaction, accessibility, loss budget',
              'Visual Profile model with immutable profile identity',
              'Six value kinds and seven uncertainty kinds',
              'Canonical normalization to protocol 1.0 while still accepting 0.1–0.5 objects',
            ],
            zh: [
              '數值物件驗證與正規化',
              'Projection Context：任務、媒介、受眾、互動、無障礙、損失預算',
              '視覺 Profile 模型，Profile 身份不可變',
              '六種值類型與七種不確定度類型',
              '正規化到協定 1.0，同時仍接受 0.1–0.5 的物件',
            ],
          },
        },
        {
          title: { en: 'Projection 1.0 — 12 features', zh: 'Projection 1.0——12 項功能' },
          items: {
            en: [
              'Task- and profile-aware channel planning',
              'Progressive disclosure and the omission manifest',
              'Task-relative semantic loss budget',
              'Fidelity checks: value, order, sign, scale, precision, uncertainty, unit, comparability',
              'Accessibility: alternative text, non-colour redundancy, audit',
              'Five renderers plus cross-scale and uncertainty views',
            ],
            zh: [
              '依任務與 Profile 的通道規劃',
              '漸進揭露與省略清單',
              '任務相對的語義損失預算',
              '忠實性檢查：值、順序、符號、尺度、精度、不確定度、單位、可比較性',
              '無障礙：替代文字、非色彩冗餘、稽核',
              '五種渲染器，加上跨尺度與不確定度視圖',
            ],
          },
        },
        {
          title: { en: 'Interop 1.0 — 8 features', zh: 'Interop 1.0——8 項功能' },
          items: {
            en: [
              'ICNS adapter: token to provenance, canonical to value, schema id/version/hash to schema_ref',
              'Markdown inline syntax, sidecar document bindings, embedded mnvp JSON blocks',
              'Batch rendering and reproducible Artifact Manifests that can be re-verified offline',
              'Ed25519-signed visual profiles with a local trust store and an immutable registry',
              'Declarative renderer packages — templates with no arbitrary code execution — signed and shipped as reproducible .mnvp-plugin.zip',
              'Capability negotiation and object/profile migration with verifiable migration reports',
            ],
            zh: [
              'ICNS 適配器：token 進 provenance、canonical 進 value、綱要 id／版本／雜湊進 schema_ref',
              'Markdown 內嵌語法、旁路文件綁定、嵌入式 mnvp JSON 區塊',
              '批次渲染與可重現的 Artifact Manifest，可離線重新驗證',
              'Ed25519 簽章的視覺 Profile，搭配本地信任庫與不可變 Registry',
              '宣告式 Renderer Package——只是模板，沒有任意程式碼執行能力——簽章後打包成可重現的 .mnvp-plugin.zip',
              '能力協商，以及帶可驗證遷移報告的物件／Profile 遷移',
            ],
          },
        },
        {
          title: { en: 'Tooling 1.0 — 5 features', zh: 'Tooling 1.0——5 項功能' },
          items: {
            en: [
              'CLI: validate, plan, render, fidelity, adapt-icns, cross-scale and more',
              'REST API across 49 frozen paths with a locked OpenAPI document',
              'Language server with diagnostics over MNVP documents',
              'Offline Manifest V3 browser extension',
              'Conformance runner: mnvp-core-v1.0, 12 cases, PASS, package and report both digest-pinned',
            ],
            zh: [
              'CLI：validate、plan、render、fidelity、adapt-icns、cross-scale 等',
              '橫跨 49 條凍結路徑的 REST API，附鎖定的 OpenAPI 文件',
              '對 MNVP 文件做診斷的 Language Server',
              '離線的 Manifest V3 瀏覽器擴充',
              '一致性執行器：mnvp-core-v1.0，12 個案例，PASS，套件與報告都以雜湊釘住',
            ],
          },
        },
      ],
      note: {
        en: 'Verified by 266 regression tests across six suites, a release audit and a smoke report, all PASS, with 23 JSON Schemas and the whole contract pinned at sha256:1aff494b…. Two honest details from the release itself: component formats are versioned independently of the product, so profile IDs at @0.1/@0.2, profile signature 0.4 and renderer package 0.5 were deliberately NOT renamed or re-signed just because the product reached 1.0 — and the release ships no private key, so it is UNSIGNED and offers verifiable SHA-256 integrity only.',
        zh: '由六組共 266 項回歸測試、一份 release audit 與一份 smoke report 驗證，全部 PASS；23 份 JSON Schema，整份契約釘在 sha256:1aff494b…。發行物本身還交代了兩個誠實的細節：元件格式的版本與產品版本互相獨立，所以 @0.1／@0.2 的 Profile ID、0.4 的 Profile 簽章封套與 0.5 的 Renderer Package，並沒有因為產品升到 1.0 就被改名或重簽——而且發行包裡沒有私鑰，所以它本身是 UNSIGNED，只提供可驗證的 SHA-256 完整性。',
      },
    },
    {
      kind: 'limits',
      id: 'boundaries',
      kicker: { en: 'Boundaries', zh: '邊界' },
      title: { en: 'What MNVP refuses to become', zh: 'MNVP 拒絕成為什麼' },
      lead: {
        en: 'The post-1.0 plan opens with seven principles, and the sharpest ones are limits on ambition rather than statements of capability.',
        zh: '1.0 之後的計畫以七項原則開頭，而其中最鋒利的幾條，是對野心的限制，不是能力的宣稱。',
      },
      items: [
        {
          title: { en: 'Not a general visualization system', zh: '不是萬能的資料視覺化系統' },
          body: {
            en: 'MNVP is numerical semantics to perceptual projection. It is not business BI, not data storytelling, not a full statistics suite, not a 3D engine, not a design tool, not a database and not a reporting platform. It integrates with those; it must not swallow them.',
            zh: 'MNVP 的核心是「數值語義到感知投影」。它不是商業 BI、不是資料故事編排、不是完整統計套件、不是 3D 引擎、不是設計工具、不是資料庫、不是報表平台。它與那些系統整合，但不應吞噬它們。',
          },
        },
        {
          title: { en: 'It does not redefine numbers', zh: '它不重新定義數' },
          body: {
            en: 'How a bare numeral parses, whether `0.91` is a decimal or a version, whether a trailing zero changes equality, whether a successor exists — none of that is MNVP’s question. It starts after semantics exist, and refuses to guess when they do not.',
            zh: '一個裸數符如何解析、`0.91` 是小數還是版本、尾零是否改變相等、是否存在後繼——這些都不是 MNVP 的問題。它從「語義已經存在」之後開始，而語義不存在時它拒絕猜。',
          },
        },
        {
          title: { en: 'Fidelity is not correct decision-making', zh: '忠實不等於決策正確' },
          body: {
            en: 'A view can faithfully present the data and the reader can still reach a wrong conclusion through missing background or decision bias. MNVP constrains the projection, not the reasoning that follows it.',
            zh: '一個視圖可以忠實呈現資料，讀者仍可能因為背景知識不足或決策偏誤而得出錯誤結論。MNVP 約束的是投影，不是投影之後的推理。',
          },
        },
        {
          title: { en: 'Verifiable is not true', zh: '可驗證不等於真實' },
          body: {
            en: 'It can verify that a projection met its spec, that an artifact was not modified, that a signature is valid, that conformance passed. It cannot prove the data source is right, the statistical model is reasonable, the publisher is trustworthy, or that one view helps everyone understand.',
            zh: '它可以驗證投影是否符合規格、artifact 是否被修改、簽章是否有效、一致性是否通過。它不能證明資料來源必然正確、統計模型必然合理、發布者必然可信，或某個視圖一定能改善所有人的理解。',
          },
        },
        {
          title: { en: 'Channel rankings are contextual', zh: '通道排序有情境性' },
          body: {
            en: 'Graphical-perception research is the foundation, but device, culture, age, training and task can change the outcome. MNVP does not write any single experiment’s ordering into the spec as an unmodifiable universal law, and it claims no fixed improvement factor for any profile.',
            zh: '圖形感知研究是基礎，但裝置、文化、年齡、專業訓練與任務都可能改變結果。MNVP 不把任何單一實驗的排序寫成不可修改的普遍定律，也不為任何 Profile 宣稱固定的改善倍數。',
          },
        },
        {
          title: { en: 'Experimental must not pose as stable', zh: '實驗不得偽裝成穩定' },
          body: {
            en: 'Audio, tactile, AR/VR numerals, AI-chosen graphics, adaptive profiles, personalized cognitive mapping and cross-cultural visual models are all marked EXPERIMENTAL. AI may propose a profile or channel plan, but it must be labelled AI-generated, pass static validation, fidelity check, accessibility audit and human review — and it may never overwrite a stable profile or enter a trusted registry automatically.',
            zh: '音訊、觸覺、AR／VR 空間數值、AI 自動選圖、自適應 Profile、個人化認知映射與跨文化視覺模型，全部標記為 EXPERIMENTAL。AI 可以提出 Profile 或通道計畫，但必須標示為 AI 生成，並通過靜態驗證、忠實性檢查、無障礙稽核與人工審查——而且永遠不得覆寫穩定 Profile 或自動進入受信任 Registry。',
          },
        },
        {
          title: { en: 'Personalization has a fairness limit', zh: '個人化有公平性界線' },
          body: {
            en: 'Adapting a view to a reader may improve understanding, but it can also mean different people see different critical information, inconsistent decisions, and weakened risk warnings. Fairness here does not mean identical pixels for everyone — it means critical risk and decision information may not be quietly weakened by personalization.',
            zh: '依讀者調整視圖可能改善理解，但也可能造成不同人看到不同的關鍵資訊、決策不一致、風險警告被弱化。這裡的公平不是所有人看到完全相同的畫面，而是關鍵風險與決策資訊不得因個人化而被不當弱化。',
          },
        },
        {
          title: { en: 'Not a standard, and not yet licensed', zh: '不是標準，也還沒授權' },
          body: {
            en: '`application/vnd.mnvp+json` is not a registered media type, and standardization is meant to follow real interoperability demand. Like its siblings, 1.0 freezes technical contracts only — no open-source license was selected because no publisher authorization was supplied for one.',
            zh: '`application/vnd.mnvp+json` 不是已註冊的媒體型別，標準化也應該跟隨真實互通需求。和它的姊妹專案一樣，1.0 只凍結技術契約——沒有選定任何開源授權，因為沒有取得選擇授權的發布授權。',
          },
        },
      ],
    },
    {
      kind: 'prose',
      id: 'stack',
      kicker: { en: 'The stack', zh: '分層' },
      title: { en: 'Where this sits relative to ICNS and EML', zh: '它與 ICNS、EML 的相對位置' },
      paras: {
        en: [
          'MNVP and ICNS are one pipeline, deliberately split at a seam: a raw token becomes a semantically complete number through ICNS, and that number becomes a faithful perceptual projection through MNVP. The seam is enforced in code — MNVP ships an ICNS adapter that maps token to provenance.original_token, canonical to value, schema id/version/hash to schema_ref, trust state to quality.verification — and the post-1.0 plan explicitly forbids MNVP from re-implementing numeral parsing, version semantics, schema registries, comparison rules or successors. Neither layer is allowed to absorb the other.',
          'The shared failure they were both built around is the same one: `0.9` versus `0.10`. ICNS refuses to answer which is larger until a schema says which system the token belongs to. MNVP refuses to draw the answer on a decimal axis once the schema says it is a version tuple — its version profile must render 0 · 9 · 1 with field labels, and rendering it as 0.91 is a recorded conformance failure, not a cosmetic preference.',
          'The link to EML is a shared invariant rather than shared code. EML puts no LLM in its transpilation chain and treats round-trip faithfulness as an invariant instead of a feature; MNVP puts fidelity above visual effect and makes an AI unable to drop an infinite-weight semantic for the sake of brevity. Both projects are, in the end, betting that the useful thing to hand an AI is not a more capable generator but a layer that can refuse — and that says exactly what it refused and why.',
        ],
        zh: [
          'MNVP 與 ICNS 是同一條管線，只是刻意在一個接縫處切開：裸 token 經 ICNS 變成語義完備的數值，那個數值再經 MNVP 變成忠實的感知投影。這個接縫是寫進程式碼的——MNVP 附有 ICNS 適配器，把 token 映到 provenance.original_token、canonical 映到 value、綱要 id／版本／雜湊映到 schema_ref、信任狀態映到 quality.verification——而 1.0 之後的計畫明確禁止 MNVP 重做數符解析、版本語義、綱要註冊、比較規則與後繼。任何一層都不准把另一層吸收掉。',
          '它們共同圍繞的那個失效是同一個：`0.9` 與 `0.10`。ICNS 拒絕在綱要說出這個 token 屬於哪個系統之前回答誰比較大。而綱要一旦說它是版本 tuple，MNVP 就拒絕把答案畫在小數軸上——它的 version profile 必須渲染成帶欄位標籤的 0 · 9 · 1，把它渲染成 0.91 是被記錄下來的一致性失敗，不是外觀偏好。',
          '與 EML 的連結是共有的不變式，而不是共用的程式碼。EML 的轉譯鏈裡不放 LLM，並且把往返一致性當成不變式而不是功能；MNVP 把忠實性放在視覺效果之上，並且讓 AI 沒辦法為了簡潔而刪掉一個無限權重的語義。這幾個專案最後都在賭同一件事：真正該交給 AI 的，不是一個更能生成的產生器，而是一個「能拒絕」的層——而且它會明確說出它拒絕了什麼、為什麼。',
        ],
      },
      callout: {
        en: 'The one-line principle MNVP wants to outlive itself: once a number is projected onto a finite medium, it must state what it kept, what it lost, who it was shown for, and whether it is still faithful to the original semantics.',
        zh: 'MNVP 希望活得比自己更久的那一句原則：數值一旦被投影到有限媒介，就必須說明它保留了什麼、丟失了什麼、為誰而顯示，以及是否仍忠實於原始語義。',
      },
    },
    {
      kind: 'docs',
      id: 'docs',
      kicker: { en: 'Source documents', zh: '來源文件' },
      title: { en: 'Theory, whitepaper, frozen spec', zh: '理論、白皮書、凍結規格' },
      lead: {
        en: 'One thing worth reading in order: the independent theory paper argues the problem exists, the whitepaper turns it into an implementable protocol, and the 1.0 freeze contract is what the reference implementation is actually held to. The main line is now STABLE / MAINTENANCE with ten explicit restart conditions.',
        zh: '這一組值得按順序讀：獨立理論論證問題存在，技術白皮書把它變成可實作的協定，而 1.0 凍結契約才是參考實作真正被綁住的東西。主線現在是 STABLE／MAINTENANCE，並列出十個明確的重啟條件。',
      },
      docs: [
        {
          title: 'MNVP 獨立理論：從數值語義到認知投影的多層數值視覺化協定',
          meta: 'theory paper · v0.1 · 2026-07-30',
          desc: {
            en: 'Why semantic correctness and cognitive accessibility are different layers: the core objects, the seven principles, visual channels, progressive disclosure, fidelity, the loss budget, cross-scale comparison, the six propositions, and the separation of precision, resolution, uncertainty, confidence and derivation depth.',
            zh: '為什麼語義正確與認知可達是兩個不同層次：核心物件、七項原則、視覺通道、漸進揭露、忠實性、資訊損失預算、跨尺度比較、六個命題，以及精度、解析度、不確定度、信賴與推導深度的分離。',
          },
        },
        {
          title: 'MNVP 技術白皮書',
          meta: 'whitepaper · v0.1 · Draft / Experimental',
          desc: {
            en: 'The implementable spec with RFC-style MUST/SHOULD language: numerical object fields, value and uncertainty models, projection context, profile model, the channel vocabulary, disclosure layers, the fidelity contract, serialization, the ICNS compatibility adapter, REST and CLI drafts, error and warning codes, conformance levels C0–C4, and the MVP scope. Note its own status line — it is the draft the 1.0 freeze was built from, not the frozen contract.',
            zh: '帶有 MUST／SHOULD 規範詞的可實作規格：數值物件欄位、值與不確定度模型、投影情境、Profile 模型、通道詞彙、揭露層級、忠實性契約、序列化、ICNS 相容適配器、REST 與 CLI 草案、錯誤與警告碼、C0–C4 一致性等級，以及 MVP 範圍。請注意它自己的狀態標記——它是 1.0 凍結所依據的草案，不是凍結契約本身。',
          },
        },
        {
          title: 'spec/mnvp-1.0-freeze.json',
          meta: 'sha256:1aff494b…',
          desc: {
            en: 'The machine-readable stability contract: 4 profiles, 31 features with stability labels, 7 digest-pinned built-in visual profiles, 5 built-in targets, 49 stable API paths, 47 stable error codes, 23 schemas with integrity hashes, the independent component-format versions, and the compatibility policy. The implementation verifies itself against this for drift.',
            zh: '機器可讀的穩定契約：4 個 Profile、31 項附穩定性標籤的功能、7 個以雜湊釘住的內建視覺 Profile、5 種內建輸出、49 條穩定 API 路徑、47 個穩定錯誤碼、23 份帶完整性雜湊的 Schema、各自獨立的元件格式版本，以及相容性政策。實作會拿它反過來驗證自己有沒有漂移。',
          },
        },
        {
          title: 'spec/MNVP-1.0-Core / Projection-and-Fidelity / Profiles / Interop-and-Packages / Versioning / Conformance / Maintenance-Baseline',
          meta: '7 normative documents',
          desc: {
            en: 'The 1.0 normative document set, each pinned inside the freeze contract and re-checked by `spec-status` and `spec-freeze-verify`.',
            zh: '1.0 的規範性文件集，每一份都在凍結契約裡被釘住，並由 `spec-status` 與 `spec-freeze-verify` 反覆檢查。',
          },
        },
        {
          title: 'conformance/mnvp-core-v1.0.package.json',
          meta: '12 cases · PASS',
          desc: {
            en: 'The normative conformance package. Its cases are the interesting part: a version tuple must not render as 0.91, precision must not inflate, a REVOKED state needs a non-colour channel and the literal word, incomparable units must not share an axis.',
            zh: '規範性一致性套件。它的案例才是重點：版本 tuple 不得渲染成 0.91、精度不得膨脹、REVOKED 狀態需要非色彩通道加上那個字本身、不可比較的單位不得共用一條軸。',
          },
        },
        {
          title: 'MNVP 1.0 後續發展與未來計畫',
          meta: 'non-normative · v0.1 · 2026-07-30',
          desc: {
            en: 'Five development lines (1.x maintenance, 2.0 research, ecosystem, productization, theory bridges), the seven principles, the priority order, and the ten restart conditions. One of them is having a second independent implementation — the plan names a TypeScript core as the way to prove the spec is real rather than merely written.',
            zh: '五條發展路線（1.x 維護、2.0 研究、生態、產品化、理論銜接）、七項原則、優先序，以及十個重啟條件。其中一個是「有第二個獨立實作」——計畫指名 TypeScript core，作為證明這份規格是真的、而不只是寫出來的方式。',
          },
        },
      ],
      note: {
        en: 'Like CAIR and ICNS, MNVP is a research and engineering archive: no public repository, no selected license, so nothing here is a download link. Its own first-priority list starts with exactly that — license decision, public repo, spec site, playground, conformance runner.',
        zh: '和 CAIR、ICNS 一樣，MNVP 目前是研究與工程封存：沒有公開倉庫、沒有選定授權，因此這裡沒有任何下載連結。而它自己的第一優先清單，開頭正是這些——授權決策、公開倉庫、規範網站、Playground、一致性執行器。',
      },
    },
  ],
};

/** Every sibling project, in hub display order. Add the next one here. */
export const RELATED_PROJECTS: RelatedProject[] = [CAIR, ICNS, MNVP];

export const RELATED_SLUGS: string[] = RELATED_PROJECTS.map((p) => p.slug);

export function findRelatedProject(slug: string): RelatedProject | undefined {
  return RELATED_PROJECTS.find((p) => p.slug === slug);
}

/** Copy for the hub page (/related) itself. Kept out of content/site.ts so the
 *  shared content module every route loads stays small. */
export const RELATED_PAGE = {
  kicker: { en: 'Related', zh: '相關語言' },
  title: {
    en: 'Related languages & specifications',
    zh: '相關語言與規格',
  },
  lead: {
    en: 'EML is not the only thing built here. These are the sibling language and specification projects from the same workshop — each with its own frozen release, its own stated boundaries, and its own page. They share one working rule with EML: a layer that an AI is allowed to sit on top of has to be deterministic, and has to fail loudly rather than guess.',
    zh: 'EML 不是這裡唯一做出來的東西。以下是同一個工作間裡的其他語言與規格專案——每一個都有自己的凍結發行、自己明確寫下的邊界，以及自己的頁面。它們和 EML 共用一條工作原則：一個允許 AI 疊在上面的層，必須是確定性的，而且必須大聲失敗，不能靠猜。',
  },
  cardLead: { en: 'What it claims', zh: '它主張什麼' },
  cta: { en: 'Read the page', zh: '閱讀分頁' },
  note: {
    en: 'More will follow — this area is a registry, not a fixed list. Every project below is currently a research and engineering archive: their technical contracts are frozen and hash-pinned, but their release artifacts name no public repository and declare no public license, so none of these pages offers downloads. ICNS and MNVP are two tiers of one pipeline — ICNS decides what a numeral is, MNVP decides how it may be shown — and they are kept separate here because the releases keep them separate.',
    zh: '之後還會有更多——這個區塊是一份登記表，不是固定清單。下面每一個專案目前都是研究與工程封存：技術契約已凍結並以雜湊釘住，但它們的發行物都沒有指出公開倉庫、也沒有宣告公開授權，所以這些頁面都沒有提供下載。ICNS 與 MNVP 是同一條管線的上下兩層——ICNS 決定數符是什麼，MNVP 決定它可以怎麼被顯示——這裡分開放，是因為發行物本身就是分開的。',
  },
  backToHub: { en: 'All related projects', zh: '所有相關專案' },
  notFound: {
    en: 'No related project with that name — here is the full list.',
    zh: '沒有這個名稱的相關專案——這裡是完整清單。',
  },
} as const;
