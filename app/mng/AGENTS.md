# AGENTS.md (予実.app / mng)

このフォルダを触る AI / 自動化ツール向けの「最初に読む」メモです。

## 0. 共通ルール（最優先）
- 共通指示書: `/Users/masakisukeda/Library/CloudStorage/GoogleDrive-masaki.sukeda@gmail.com/マイドライブ/DiSA/プロジェクト/アプリ/AGENTS.md`
- スコープは `/app` `/chat` `/dic` `/mng` のみ。無関係フォルダの編集・デプロイは禁止。
- **このフォルダ以外へ絶対にデプロイしないこと**。
- 通常デプロイは `main` へ push -> GitHub Actions で実施（直接FTPアップロードは禁止）。
- `mng-deploy` の反映先は `/public_html/drsp.cc/app/mng` を正とする。
- `mng-deploy` は軽量運用として、必須ファイル（`.htaccess` `index.html` `mng.html` `manual.html` と `lp/`）のみを転送する。
- `.htaccess` のセキュリティヘッダ（`CSP` `X-Frame-Options` `nosniff` など）は削除しない。

## 1. 対象
- 公開URL: `https://drsp.cc/app/mng/mng.html`
- 主要実装:
  - `index.html`（本体）
  - `mng.html`（`index.html` へのリダイレクト）
  - `manual.html`（運用マニュアル）
  - `lp/index.html`（LP）

## 2. 作業ルール
- 変更は最小差分。
- 既存の運用フロー（GAS接続・保存・固定化）の導線は維持。
- KPI表示・比較表・入力フォームの文言は、運用者目線で一貫性を保つ。
- `index.html` は1ファイル集約型のため、編集箇所の前後文脈を崩さない。

## 3. 反映前チェック
- 画面確認:
  - `index.html`
  - `manual.html`
  - `lp/index.html`
- リンク確認:
  - `/app/mng/index.html`
  - `/app/mng/mng.html`
  - `/app/mng/manual.html`
  - `/app/mng/lp/`

## デプロイ完遂ルール

ユーザーへの確認不要。自己完結で実施し結果のみ報告すること。

1. push -> GitHub Actions完了を待つ（`gh run list --branch main --limit 5` / `gh run watch --exit-status`）
2. `curl -I https://drsp.cc/app/mng/mng.html` でHTTP 200を確認（必要に応じて `Last-Modified` も確認）
3. 不具合があれば即座にロールバック:
```bash
git revert HEAD --no-edit
git push origin main
```
4. push が `non-fast-forward` の場合は `git fetch` -> `git rebase origin/main` 後に再pushする

報告フォーマット: `✅ デプロイ完了` / `❌ ロールバック実施済み／原因：〇〇`

## 4. NG
- 無関係な全体リデザイン。
- 導入手順の文言や順序を根拠なく変更。
- 反映手順未確認での完了報告。
