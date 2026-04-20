# DiSA Slides Library

このディレクトリは、一般社団法人ディレクションサポート協会（DiSA）が提供する各種スライド資料を管理しています。

## ディレクトリ構成

```text
/slide
  ├── index.html          # スライドハブ（目的別のスライド一覧ページ）
  ├── introduction/       # 【基本資料】サービス紹介スライド
  │   └── index.html
  ├── members/            # 【単体スライド】DiSAメンバー紹介
  │   └── index.html
  ├── membership/         # 【営業資料】法人会員（メンバーシップ）のご提案
  │   └── index.html
  ├── css/                # スライド共通CSS
  │   ├── base.css        # スライド基本構造
  │   └── theme.css       # DiSAデザインテーマ
  ├── js/                 # スライド共通JavaScript (marp-runtime.js, nav.js)
  └── md/                 # スライド構成・原稿（Markdown）
      └── membership/     # 法人会員向けスライドの構成案
          └── index.md
```

## デザインシステム

**実装前に必ず読んでください → [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)**

コンポーネント一覧・ユーティリティクラス・NG例・チェックリストを掲載しています。

## 実装・運用ルール

1. **コンテンツの一貫性**: 
   - スライド内のテキスト、画像は、原則として [drsp.cc](https://drsp.cc/) 本サイトのものを使用します。
2. **デザインの統一**: 
   - 全てのスライドで `css/theme.css` を共通利用します。個別のスライドごとに独自のバリエーションは作成せず、一貫したブランドイメージを維持します。
3. **コードの純粋性**:
   - HTML内へのインラインCSS・JavaScriptの記述は最小限（レイアウトの微調整など不可避なもの）に留め、ロジックや共通スタイルは外部ファイル（`css/`, `js/`）に集約します。
4. **Markdown先行**:
   - 新しいスライドを作成する際は、まず `md/` 配下に構成案を作成し、内容を確定させてからHTML実装に移行します。

## 開発用リンク
- [スライドハブ（トップ）](./index.html)
- [DiSAメンバー](./members/index.html)
- [DiSA サービス紹介](./introduction/index.html)
- [法人会員のご提案](./membership/index.html)
