# DiSA Slide Deck - Manual Editing Guide

このディレクトリは、HTMLスライドの正本です。
`index.html` と `css/theme.css` を直接編集して更新してください。

## ディレクトリ構成

```
slide/
├── index.html        # スライド本体（コンテンツはここを編集）
├── css/
│   ├── slide.css     # CSSアグリゲーター（base.css + theme.css をimport）
│   ├── base.css      # MarpベースCSS（編集不要）
│   └── theme.css     # カスタムテーマ（デザイン調整はここを編集）
└── js/
    ├── marp-runtime.js  # Marpスライド制御ランタイム（編集不要）
    └── nav.js           # クリック/タップナビゲーション（左半分=前、右半分=次）
```

## クイックガイド

1. **スライドの編集**: `index.html` 内のテキストや構成を直接変更
2. **デザインの調整**: `css/theme.css` を編集
3. **プレビュー**: `index.html` をブラウザで開いて確認

---

## [TEMPLATE] スライド追加用テンプレート

新しいスライドを追加する際は、以下のHTMLブロックをコピーして `index.html` 末尾の `<!-- [END OF SLIDES] -->` 直前に挿入してください。

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
