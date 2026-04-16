# DiSA Slide Deck - Manual Editing Guide

このディレクトリは、Marpから独立したHTMLスライドの「正本」です。
Markdown（.md）ではなく、`index.html` と `slide.css` を直接編集して更新してください。

## クイックガイド

1. **スライドの編集**: `index.html` 内のテキストや構成を直接変更します。
2. **デザインの調整**: `slide.css` を編集します。
3. **プレビュー**: `index.html` をブラウザで開くか、`npm start` でローカルサーバーを起動して確認してください。

---

## [TEMPLATE] スライド追加用テンプレート

新しいスライドを追加する際は、以下のHTMLブロックをコピーして `index.html` の末尾（`<!-- [END OF SLIDES] -->` の直前）に挿入してください。

```html
<div id=":$p" data-bespoke-marp-osc="false">
  <svg data-marpit-svg="" viewBox="0 0 1280 720">
    <foreignObject width="1280" height="720">
      <section class="dense"> <!-- 必要に応じて class="lead" や "dense" を使用 -->
        <header>
          <div class="header-content">
            <img src="https://disa.run/assets/img/common/logo.svg" class="header-logo" alt="DiSA Logo">
            <span>株式会社DiSA - スライドタイトル</span>
          </div>
        </header>

        <h1>ここにタイトルを入力</h1>
        
        <div class="card">
          <p>ここにコンテンツを入力</p>
        </div>

        <footer>DiSA Inc. All Rights Reserved.</footer>
      </section>
    </foreignObject>
  </svg>
</div>
```

---

## ディレクトリ構成
- `index.html`: スライド本体
- `slide.css`: スタイル定義（基本レイアウト + カスタムテーマ）
- `marp-runtime.js`: スライド制御プログラム
- `package.json`: ローカルサーバー起動用 (`npm start`)
