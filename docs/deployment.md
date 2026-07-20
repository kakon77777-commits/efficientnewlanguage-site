# 部署與回退

## 正常部署流程

推到 `main` 會觸發 `.github/workflows/deploy.yml`：checkout 站台倉庫 + EML 語言核心倉庫 → 完整
build（含 `verify-dist`）→ worker 測試 → 把同一份 `dist/` 產物部署到 Cloudflare Pages → 對剛部署的
URL 跑 HTTP 層級煙霧測試（`/`、`/app`、`/docs`、`/cases`、`/healthz`、`/readyz`、`/version`）。任何一步
失敗，整條 pipeline 會標紅，不會有東西悄悄上線。

Pull request 會走同一條 pipeline，部署到 Cloudflare Pages 自動產生的 Preview URL（不影響正式站）。

## 回退

Cloudflare Pages 本身保留每次部署的完整歷史，不需要額外的自訂回退系統：

**用 Dashboard（最快）**：
1. 打開 https://dash.cloudflare.com/97e5df19575474a8fb0b047c16e701e7/pages/view/neokpolaris
2. 「Deployments」分頁，找到上一個健康的部署
3. 該筆部署右側選單 → 「Rollback to this deployment」

**用 CLI 查歷史**：
```bash
npx wrangler pages deployment list --project-name=neokpolaris
```
每筆記錄有對應的 commit SHA、部署時間、狀態，可以對照 GitHub Actions 的 build log 找到要回退的目標。

## 什麼時候該回退，而不是繼續往前修

依計畫書 §21：黑畫面或核心路由失敗時，先回退到上一個健康部署止血，再到 Preview 環境修復、驗證後
重新發布，不要在正式環境上連續嘗試修改（今天稍早那場 Cloudflare 事故的教訓）。
