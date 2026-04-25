# AGENTS.md (ノートアプリ)

このフォルダはノートアプリ固有の補足だけを置きます。  
運用・デプロイ・ロールバック・共通チェックは [`共通/COMMON.md`](/Users/masakisukeda/Library/CloudStorage/GoogleDrive-masaki.sukeda@gmail.com/マイドライブ/DiSA/プロジェクト/アプリ/共通/COMMON.md) を最優先で参照してください。

## 1. プロジェクト概要
- 公開URL: `https://drsp.cc/app/note/`
- 主要構成:
  - `index.html`: 画面構造
  - `app.js`: 主要ロジック（検索、ノートくん、モーダル、描画）
  - `css/site.css` / `css/site.min.css`: スタイル
  - `data/`: 記事・カテゴリ・カリキュラム・用語データ
  - `api/`: コメント等のAPI

## 2. 変更ルール（ノート固有）
- 変更は原則「最小差分」。
- UI文言は日本語トーンを維持する。
- 入力系モーダルは誤タップで閉じない設計を優先（閉じるは `×` など明示操作）。
- `app.js` の構文エラーを出さない（編集後に `node --check app.js`）。
- CSSビルドは GitHub Actions の deploy ワークフローで自動実行されるため、通常は手動実行不要。
  - `bash scripts/build-css.sh` が `site.min.css` 再生成 + `index.html` の CSS バージョン番号更新を自動で行う。
  - 手動で `site.min.css` を編集したりバージョン番号を書き換えたりしない。

## 3. ノートくん修正時の注意
- 主要関数:
  - `answerFromDictionary`
  - `findDirectDictionaryMatches`
  - `findGuidedDictionaryMatch`
- 用語系の改善は以下も確認:
  - `GLOSSARY_TERMS`
  - `DICT_KUN_GUIDE_MAP`
  - `DICT_KUN_SYNONYM_GROUPS`
- ヒットしない語は、記事検索だけでなく用語集フォールバックも検討する。

## 4. ローカル起動
```bash
cd /Users/masakisukeda/Library/CloudStorage/GoogleDrive-masaki.sukeda@gmail.com/マイドライブ/DiSA/プロジェクト/アプリ/ノートアプリ
./start-local.sh
# http://127.0.0.1:8000
```

## 5. 反映前チェック
- 画面確認: `index.html` / `manual.html`
- LP修正時: `./lp/check-lp-regression.sh`
- API変更時: 主要操作（投稿・編集・削除・投票）を最低1周確認
- PHP構文確認例:
```bash
php -l api.php
```

## 6. 反映確認
- `index.html` の `app.js?v=...` が更新されているか。
- 本番JSに修正コードが載っているか。

例:
```bash
curl -fsSL 'https://drsp.cc/app/note/index.html' | rg 'app.js\?v='
curl -fsSL 'https://drsp.cc/app/note/app.js?v=xxxx' | rg '確認したい関数名'
```

### デバッグメモ（2026-04-03 / toolsカテゴリ）
- 対象URL: `https://drsp.cc/app/note/?view=category&id=tools`
- 変更内容: カテゴリ項目に `対象ツール: ...` を表示
- デバッグ回数: 3回
  - 1回目（21:40 JST）: `node --check app.js` OK / ローカル表示で `対象ツール:` を確認
  - 2回目（21:40 JST）: `node --check app.js` OK / ローカル表示で `対象ツール:` を確認
  - 3回目（21:40 JST）: `node --check app.js` OK / ローカル表示で `対象ツール:` を確認
- 補足: 本番URLへの `curl` GET はWAFで `403` になることがあるため、ブラウザ経由（Playwright screenshot）で表示確認する。

## 7. NG
- 指示のない大規模リファクタ。
- 無関係なデザイン変更。
- デプロイなしで「反映済み」と報告。
- 機密値のハードコード。
