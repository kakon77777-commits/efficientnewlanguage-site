# 事故紀錄：EML 網站黑畫面事件

依 `EML網站下次故障預防與全端設計改良計畫書_v0.1.md` 第十二部「事故紀錄模板」填寫。本文件記錄的
是實際排查後**已驗證**的事實；仍無法確認的欄位維持標註「待補」，不寫成推測結論。

## 事件名稱

EML 網站黑畫面事件（`efficientnewlanguage.org` 全站無法顯示）

## 發生時間

2026-07-19（確切時分待補 — 排查過程未記錄逐分鐘時間戳）。

## 受影響路徑

全站（`/` 首頁與其餘路徑皆受影響）。屬全站等級事故，非單一路由問題。

## 使用者可見現象

整頁呈現空白／深色背景，沒有任何正常內容。透過多種獨立工具（本地端 Agent 使用的瀏覽器工具、
Neo 本人的真實瀏覽器）皆可 100% 重現；`curl`（任何 header 組合）與一個模擬真實頁面多工請求的原始
Node `http2` 測試腳本皆 0% 重現。

## 第一個已驗證錯誤

透過瀏覽器層重現追蹤，鎖定問題落在一個特定內容雜湊資產：`index-CvxTkKGn.css`。該資產請求在真實
瀏覽器情境下持續失敗，而完全相同的 URL 用 `curl` 或 Node `http2`（含模擬瀏覽器並發請求模式）皆能
正常取得。

## 真正根因

Cloudflare Pages 資產儲存層中，`index-CvxTkKGn.css` 這一個特定內容雜湊資產的已儲存物件疑似損毀
或卡住（stuck stored object）。這不是應用程式碼、Worker 路由、DNS、WAF、Bot Fight Mode、AI
機器人政策或任何 Zone 設定（`security_level`／`early_hints`／`0rtt`／`http3`）造成 —
這些項目在排查過程中逐一被明確排除（見下方「觸發條件」與「為什麼既有測試未攔截」）。

對全域 `purge_cache` 的呼叫沒有效果 — 這證實問題不在 edge cache，而在更底層、purge 無法觸及的
已儲存物件本身。

修復方式是重新部署（產生新的內容雜湊檔名），繞開了損毀物件，而非任何設定變更或程式碼修正。事後
把所有實驗性 Zone 設定改回原值，網站仍正常運作 — 證明這些設定從頭到尾都不是成因，只是排查過程
中因為看不到根因而依序排除的候選項。

## 觸發條件

待補。目前不清楚是什麼觸發了該特定物件在 Cloudflare Pages 儲存層損毀 — 這是 Cloudflare 內部
儲存層的問題，本地端無法觀測其成因，也沒有從 Cloudflare 端取得對應的內部診斷資訊。

## 修正提交

本次修復本身不是一次程式碼提交 — 是一次全新的 `wrangler pages deploy`（部署到
`https://a4991d6e.neokpolaris.pages.dev`，對應站台倉庫 commit `8acb705`，語言核心倉庫 commit
`0ab6624`），因為新內容雜湊檔名而繞過了損毀的舊儲存物件。

本文件所屬的這一輪「Phase 0 故障預防」變更（可見 fallback、Error Boundary、chunk 重試、Build
ID、`/version`、`verify-dist.mjs`）是本事故發生**之後**才新增的架構改良，目標是讓「未來任何前端
失敗」都不再以黑畫面呈現 — 並非針對這次 Cloudflare 儲存層問題本身的修正（那個問題的觸發條件不明，
也不在應用層可控範圍）。

## 修正內容

1. 直接因素：重新執行 `wrangler pages deploy`，產生一組全新內容雜湊的靜態資產，繞開損毀物件。
2. 排查過程中曾實驗性調整的 Zone 設定（`security_level`、`early_hints`、`0rtt`、`http3`）事後全數
   revert 回原值，並重新驗證網站仍正常 — 確認這些設定與本次事故無關。
3. 本輪追加的架構性防禦（見下方「預防性改良」）並非「修正這次事故」，而是「降低未來同類或不同
   類前端失敗變成黑畫面的機率」。

## 為什麼既有測試未攔截

在本次事故發生前，本專案不存在任何測試層級。即使存在，這類事故的本質也超出應用層驗證的範圍：

- 單元測試、型別檢查、`vite build` 只能驗證「建置產物本身是否正確」，無法驗證「Cloudflare Pages
  部署後，其儲存層是否正確保存了該產物」。
- 本次事故的根因是 CDN 供應商內部儲存層的物件完整性問題，不是本地建置或程式邏輯錯誤 —
  這類問題原則上只能靠「部署後、從真實瀏覽器情境做合成監測」才可能提早發現，而非建置期測試。

不過，本次事故確實暴露出一個應用層真正的既有缺陷，且**這個缺陷本來就攔得住**：無論觸發原因是
CDN 儲存層問題、chunk 404、或任何其他前端載入失敗，當時的 `Suspense fallback` 只是一個純背景色
的空 `<div>`，且完全沒有 Error Boundary — 這代表「任何」前端載入失敗，不論根因為何，使用者看到
的都會是難以區分正常/異常的黑畫面。這正是本輪 Phase 0 要修的東西。

## 新增的回歸測試

本輪新增的不是針對「Cloudflare 儲存層物件損毀」這個特定根因的回歸測試（該根因不在應用層可重現
範圍內），而是針對「前端失敗時系統的可見性」這個真正的架構缺陷：

- 手動故障注入驗證（本地）：刻意把一個已建置的真實 chunk 檔案改名模擬遺失，在全新分頁（無
  `sessionStorage` 殘留）造訪 `/app`，確認行為符合設計：先自動重試一次（帶
  `?_retry=<timestamp>` cache-busting 參數），重試後仍失敗則顯示完整錯誤畫面（含錯誤代碼
  `EML-FE-CHUNK`、Build ID、重新載入／回首頁／文件／複製診斷資訊等按鈕）— 不再是純黑畫面。復原
  檔案後於另一個全新分頁重新驗證，確認完全恢復正常、無 console 錯誤。
- `scripts/verify-dist.mjs`：建置後自動驗證 `index.html` 引用的每個資產、每個 JS chunk 內部
  `import()` 引用的每個 chunk 都確實存在於 `dist/`，作為部署前的產物完整性阻斷條件。
- `scripts/test-worker.mjs` 新增 `/healthz`、`/readyz`、`/version` 三個端點測試。
- Playwright 瀏覽器煙霧測試（計畫書 Phase 0 第 8 項）**本輪尚未實作** — 因為專案目前未安裝
  Playwright，需要新增依賴與瀏覽器下載，範圍上決定延後到下一輪處理，先以上述手動故障注入驗證
  取代。

## 預防性改良

本輪（Phase 0，已完成並驗證）：

1. `AppLoading`：可見的載入畫面取代純背景色空白 `Suspense fallback`。
2. `AppErrorBoundary`：根級 React Error Boundary，捕捉 `lazy()` 載入失敗與渲染錯誤，顯示 Build
   ID、錯誤代碼、重新載入／回首頁／文件／複製診斷資訊。
3. Chunk 載入失敗辨識 + 一次性 session-scoped 自動重試（cache-busting 參數），避免無限刷新。
4. `scripts/build-meta.mjs` 產生 `public/build-info.json`（`build_id`／`site_sha`／
   `eml_core_sha`／`built_at`），經 `vite.config.ts` 的 `define` 編譯進前端，供 Error
   Boundary／`/version` 共用同一份 Build ID。
5. Worker 新增 `/healthz`、`/readyz`、`/version` 三個端點，路由優先序放在 canonical redirect 之後、
   CORS preflight 之前（符合計畫書第 13 節建議順序）。
6. `scripts/verify-dist.mjs` 納入 `npm run build` 流程，任何資產缺失都會讓建置直接失敗
   （`process.exit(1)`），而非只看 `vite build` 指令是否成功退出。
7. `index.html` 新增 `<noscript>` 區塊與 `#root` 內的靜態 boot-fallback，涵蓋比 Error Boundary
   更早期的失敗模式（JS 根本沒執行）。

尚未進行（下一輪，計畫書 Phase 1 起）：CI 雙倉庫 checkout + 固定 SHA、移除本機絕對路徑依賴、
Preview／Promotion／Rollback 管線、首頁靜態化、合成監測、Playwright 煙霧測試。

## 回退是否使用

否。事故發生當下，本文件描述的回退機制（保留最近 5 次成功部署、一鍵回退）尚未建立，因此修復採用
「直接重新部署」而非「回退到已驗證的上一版」。這也是計畫書 Phase 2（Preview／Promotion／
Rollback）被列為高優先的原因之一。

## 事故時間線

（相對順序，非精確時間戳 — 精確時分待補）

1. 網站顯示黑畫面，Neo 回報無法顯示。
2. 初步排查：`curl` 對站台的請求皆正常回應，形成「僅自動化流量正常、真實瀏覽器異常」的假設，
   並據此檢視 Bot Fight Mode／Security Level 等機器人防護相關設定。
3. Neo 建立限時 API 權杖供本地端 Agent 直接查詢 Cloudflare 設定（唯讀權限開始）。
4. 排查 DNS（乾淨的 proxied CNAME）、Page Rules（權杖範圍無法存取）、舊版 WAF 防火牆規則
   （空）、Zone 層級 Worker Routes（無）— 均排除。
5. Neo 回報：問題不只影響本地端 Agent，連他自己的真實瀏覽也無法訪問 — 這個事實推翻了「僅自動化
   流量受影響」的假設，促使排查方向轉向「這是所有真實瀏覽器情境都會踩到的問題，不分操作者」。
6. Neo 逐步將 API 權杖權限提升至 `Zone Settings: Edit`、後續再加上 `Cache Purge`，並明確表示
   「我授權給你了。幫我操作。」，本地端 Agent 開始直接對 Cloudflare API 做設定變更嘗試
   （`security_level`、`early_hints`、`0rtt`、`http3` 依序調整）與一次全域 `purge_cache`。
7. 每次設定變更後重新測試，網站仍然黑畫面 — 逐一排除這些候選項。
8. 深入比對真實瀏覽器與 `curl`／原始 Node `http2` 測試的行為差異，鎖定單一資產
   `index-CvxTkKGn.css` 的請求在真實瀏覽器情境下必定失敗，而其他管道必定成功 — 確認問題落在
   Cloudflare Pages 資產儲存層本身，而非任何 Zone 設定或應用層程式碼。
9. 期間 Neo 另外諮詢了一個未經本地端 Agent 驗證的 AI 工具，該工具提供的技術說法（聲稱 Security
   Level 已變成「無法更改」）與本地端 Agent 剛驗證過的 API 結果直接矛盾；本地端 Agent 依指令來源
   邊界原則，引用該段文字並向 Neo 確認來源，Neo 隨後確認該內容確實來自另一個未經檢查的 AI 諮詢。
10. 對站台倉庫重新執行 `wrangler pages deploy`（此次部署恰好同時包含 EML Web Terminal Phase 0
    的功能變更，產生全新內容雜湊）— 網站恢復正常。
11. 將所有實驗性 Zone 設定改回原始值，重新驗證網站仍正常運作 — 確認這些設定確實與事故無關，根因
    是 Cloudflare Pages 儲存層物件問題，經新部署的新雜湊檔名繞過。
12. 在 AI Board（`aiboard.evemisslab.com`）留言記錄本次排查過程（`topic:
    efficientnewlanguage-outage`）。
13. 啟動本輪 Phase 0 架構改良（本文件所屬的變更）。
