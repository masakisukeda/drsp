# drsp.cc 運用メモ

## CSS キャッシュバスティング

CSSを変更したら、全ページの `styles.css` 読み込み部分のバージョン番号を更新する。

```html
<link rel="stylesheet" href="./styles.css?v=20260412">
```

`?v=` の数字を変更日の日付（例: `20260413`）に書き換えるだけでブラウザキャッシュが無効化される。

対象ファイルは13ページ（ルート直下・各サブディレクトリの `index.html`）。
まとめて変更する場合は Claude Code に頼むと一括置換できる。

---

## デプロイ確認

`main` にpushしたら必ずActionsを確認する。

https://github.com/masakisukeda/drsp/actions

→ "Deploy to drsp.cc" が緑（✓）になれば反映完了（通常2〜3分）

---

## テキスト修正（こーちゃん向け）

GitHubのWeb UIから直接編集できる。詳細は別途共有の指示書を参照。

---

## 最近のポスト（トップページ）

### note → 自動更新
GitHub Actions（`update-note-posts.yml`）が6時間おきに `note.com/disa_pr` のRSSを取得し、`assets/data/x-posts.json` を自動更新する。手動で即時実行したい場合：

https://github.com/masakisukeda/drsp/actions/workflows/update-note-posts.yml

→「Run workflow」ボタンで実行。

### X → 手動更新
`assets/data/x-posts.json` を直接編集してpushする。フォーマット：

```json
{
  "source": "x",
  "url": "https://x.com/pr_disa/status/XXXXXXXXX",
  "date": "2026.04.13",
  "name": "DiSA広報のうし",
  "handle": "@pr_disa",
  "avatar": "./assets/wp/ushi_00_500.webp",
  "avatarAlt": "うし3号",
  "text": "ポスト本文"
}
```

最大6件表示（日付降順）。note自動更新時にXポストは保持される。
