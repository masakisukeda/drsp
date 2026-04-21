# DiSA サイト デザインシステム

実装者向けのガイドです。新しいページを作る前に必ず読んでください。

---

## 1. 基本ルール

- スタイルは `/styles.css` に集約しています。**新規ページでは `<style>` タグや `style=` 属性は書かない**
- `styles.css` に存在しないクラス名・CSS変数は使わない
- 画像は **WebP を基本**に、ロゴ・アイコンは **SVG**、ファビコンは **ICO** を使う。パスはルート相対パス（`/assets/wp/`）を使う
- フォントは **Noto Sans JP** のみ（`font-family` を独自指定しない）
- アニメーションは `data-aos` 属性と `main.js` の IntersectionObserver 実装で統一する
- 円形アイコンの枠線色は `--circle-border` を使い、`#666666` に統一する
- 既存の `404.html` や一部ページにはレガシーな `style` 属性・`<style>` が残っているが、新規実装では増やさない

---

## 2. ページHTMLひな形

新しいページを作るときはこの構造をコピーして使います。

```html
<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="【説明文（120文字以内）】">
  <title>【ページタイトル】 | DiSA</title>
  <link rel="icon" type="image/x-icon" href="/favicon.ico?v=20260413">
  <link rel="shortcut icon" href="/favicon.ico?v=20260413">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css?v=【バージョン日付】">
  <!-- SEO/OGP: managed -->
  【SEO/OGPブロック ← セクション10参照】
  <!-- /SEO/OGP: managed -->
  【Google Analytics タグ】
</head>

<body class="page-【ページ名】">
  <header class="site-header">
    【ヘッダー ← セクション3参照】
  </header>

  <main class="page-main">
    <nav class="page-breadcrumb" aria-label="breadcrumb">
      <ol class="page-breadcrumb-list">
        <li><a href="/">TOP</a></li>
        <li aria-current="page">【ページ名】</li>
      </ol>
    </nav>

    【セクションパネル ← セクション4参照】
  </main>

  <footer class="site-footer" id="contact">
    【フッター ← セクション3参照】
  </footer>

  <script src="/main.js"></script>
</body>
</html>
```

---

## 3. 共通パーツ（ヘッダー・フッター）

### ヘッダー

```html
<header class="site-header">
  <div class="header-wrap">
    <a class="logo" href="/"><img src="/assets/wp/logo-1.svg" alt="DiSA"></a>
    <button class="menu-toggle" aria-label="メニューを開く">
      <span class="menu-toggle-bar"></span>
    </button>
    <nav>
      <a href="/about">法人案内</a>
      <a href="/hieiri">活動</a>
      <a href="/eiri">コラボ活動</a>
      <a href="/member">メンバー</a>
      <a href="/membership">法人会員</a>
      <a href="/slide">スライド</a>
      <a href="https://note.com/disa_pr/m/m47a4d3af0541" target="_blank" rel="noopener noreferrer">↗活動報告</a>
      <a class="nav-cta" href="/inquiry">問い合わせ</a>
    </nav>
  </div>
</header>
```

### フッター

```html
<footer class="site-footer" id="contact">
  <div class="footer-wrap">
    <section data-aos="fade-up" data-aos-duration="700">
      <h3>【noteタイトル or SNSセクション名】</h3>
      <ul class="note-rss-list">
        <li><a href="【URL】" target="_blank" rel="noopener noreferrer">【記事タイトル】</a></li>
      </ul>
    </section>
    <section data-aos="fade-up" data-aos-duration="700" data-aos-delay="100">
      <h3>SNS</h3>
      <div class="sns-grid">
        <a href="https://note.com/disa_pr" target="_blank" rel="noopener noreferrer"><img src="/assets/wp/note.webp" alt="note"></a>
        <a href="https://x.com/pr_disa" target="_blank" rel="noopener noreferrer"><img src="/assets/wp/x.webp" alt="X"></a>
        <a href="https://www.youtube.com/@2022disa" target="_blank" rel="noopener noreferrer"><img src="/assets/wp/you.webp" alt="YouTube"></a>
      </div>
    </section>
  </div>
  <div class="footer-wrap">
    <p class="footer-legal">
      &copy; 一般社団法人ディレクションサポート協会（DiSA）<br>
      <a href="/privacy">プライバシーポリシー</a>
    </p>
  </div>
</footer>
```

---

## 4. ページレイアウト構造

### 4-1. ページ共通（内部ページ）

すべての内部ページは `<main class="page-main">` を使う。

```
page-main
  └─ page-breadcrumb（パンくず）
  └─ panel（イントロ）← about-intro-dark でスタイル上書き
  └─ panel（セクション1）
  └─ panel（セクション2）
  ...
```

### 4-2. パネル（`.panel`）

ページの各セクション。背景グレー、角丸14px。

```html
<section class="panel" data-aos="fade-up" data-aos-duration="700">
  <p class="eyebrow">SECTION LABEL</p>
  <h2>セクション見出し</h2>
  <!-- コンテンツ -->
</section>
```

### 4-3. イントロパネル（ページ最初のパネル）

最初のパネルは `.about-intro-dark` クラスを併用する。背景・ボーダーが消え、透明になる。

```html
<section class="panel about-intro-dark" data-aos="fade-up" data-aos-duration="700">
  <h1 class="page-title">【ページタイトル】</h1>
  <div class="content-stack">
    <p>ページの概要文。</p>
  </div>
</section>
```

> NG: `.page-title` を2番目以降のパネルに使わない。1ページに1つのみ。

### 4-4. インナーパネル（`.inner-panel`）

パネル内のサブエリア。背景がわずかに濃いグレー（`--inner`）。

```html
<div class="inner-panel">
  <!-- ネストしたコンテンツ -->
</div>
```

---

## 5. タイポグラフィ

### フォントサイズスケール

| 変数 | 値（clamp） | 用途 |
|---|---|---|
| `--fs-1` | 38px〜64px | 超大見出し（`.h2-accent`） |
| `--fs-2` | 22px〜34px | セクション見出し（`h2`） |
| `--fs-3` | 17px〜20px | カード見出し（`h3`） |
| `--fs-4` | 14px〜17px | 本文 |
| `--fs-5` | 12px〜14px | 補足テキスト・ラベル |

> `font-size: 24px` のような直接指定はしない。変数かクラスを使う。

### 見出しクラス

```html
<h1 class="page-title">ページタイトル</h1>     <!-- ページ最大見出し -->
<p class="eyebrow">SECTION LABEL</p>          <!-- セクション上部の小ラベル -->
<h2>セクション見出し</h2>                        <!-- .panel内の主見出し -->
<p class="sub">サブ見出し</p>                   <!-- 中央揃えの補足見出し -->
```

### テキストコンテナ

```html
<div class="content-stack">
  <p>本文テキスト。複数段落はこの中に並べる。</p>
  <p>2段落目。</p>
</div>
```

---

## 6. コンポーネント

### 6-1. カード `.card` / `.cm-card`

白背景・ボーダー・シャドウの基本ブロック。グリッド外で単体使用する場合は `.cm-card` を使う。

```html
<!-- グリッド内で使う場合 -->
<div class="card">
  <p>テキスト</p>
</div>

<!-- 単体・汎用カード -->
<div class="cm-card">
  <!-- コンテンツ -->
</div>
```

### 6-2. メンバーカード `.member-card`

写真付きの人物カード。`<article>` タグを使う。

```html
<article class="member-card" data-aos="flip-left" data-aos-duration="400" data-aos-delay="0" data-aos-easing="ease" data-aos-once="true">
  <img src="/assets/wp/photo.webp" alt="氏名">
  <h3>氏名（ニックネーム）</h3>
  <p class="role">役職</p>
  <p>プロフィール文。</p>
  <div class="member-links">
    <a href="【URL】" target="_blank" rel="noopener noreferrer">↗リンクラベル</a>
    <a class="x-icon-link" href="https://x.com/【handle】" target="_blank" rel="noopener noreferrer">𝕏</a>
  </div>
</article>
```

> - `<img>` の `alt` は「氏名」を入れる
> - `.member-links` はカード末尾に配置。Xアカウントがない場合は省略可
> - `.x-icon-link` はX（旧Twitter）専用クラス。他リンクは通常の `<a>` タグ（`↗` 矢印プレフィックスをつける）
> - 人物カードの丸い写真枠は `--circle-border` を使い、全ページで同じ色に揃える

### 6-3. MVVカード `.mvv-card`

MISSION / VISION / VALUES 用。`.mvv-grid`（3カラム）内で使う。

```html
<div class="mvv-card" data-aos="flip-left" data-aos-duration="400" data-aos-delay="0" data-aos-easing="ease" data-aos-once="true">
  <div class="mvv-icon">🏔️</div>
  <h3>Mission</h3>
  <p>ミッションの内容。</p>
</div>
```

### 6-4. サポートカード `.support-card`

「こんな人たちへ」など対象者紹介用。`.support-grid`（4カラム）内で使う。

```html
<div class="support-card" data-aos="flip-left" data-aos-duration="400" data-aos-delay="0" data-aos-easing="ease" data-aos-once="true">
  <div class="support-icon">
    <img src="/assets/wp/support-faces/director.webp" alt="ディレクターの顔イラスト" loading="lazy">
  </div>
  <span class="en-label">DIRECTOR</span>
  <h3>ディレクター</h3>
  <p>説明文。</p>
</div>
```

> - `.support-icon` の丸枠も `--circle-border` を使い、人物系・アイコン系で色を揃える
> - `.service-banner-icon` の丸枠も `--circle-border` を使う

### 6-5. サービスカード `.service-card`

サービス紹介用バナーカード。`.service-grid`（3カラム）内で使う。`<article>` タグを使う。

```html
<article class="service-card" data-aos="flip-left" data-aos-duration="400" data-aos-delay="0" data-aos-easing="ease" data-aos-once="true">
  <div class="service-banner">
    <img class="service-banner-avatar" src="/assets/wp/photo.webp" alt="担当者名">
    <p class="service-banner-title">サービス名</p>
    <a class="service-banner-btn" href="/【URL】">詳細はこちら →</a>
  </div>
  <div class="service-body">
    <p>サービスの説明文。</p>
  </div>
</article>
```

> - バナー画像はアバター（円形）が基本。ロゴ画像なら `service-banner-avatar` は不要
> - `.service-body` 内の `<a>` タグは CSS で `display: none` になっているため省略可
> - `service-banner-avatar` の丸枠も `--circle-border` を使う

### 6-6. コンセプトカード `.concept-card`

汎用コンテンツカード。画像あり・なし両対応。リンクにする場合は `<a>` タグに変更。

```html
<!-- 画像なし -->
<div class="concept-card">
  <div class="concept-icon">🎯</div>
  <h3>見出し</h3>
  <p>説明文。</p>
</div>

<!-- 画像あり -->
<div class="concept-card">
  <img class="concept-card-image" src="/assets/wp/image.webp" alt="画像の説明" loading="lazy">
  <h3>見出し</h3>
  <p>説明文。</p>
</div>

<!-- リンクカード -->
<a class="concept-card" href="/【URL】">
  <div class="concept-icon">🎯</div>
  <h3>見出し</h3>
  <p>説明文。</p>
</a>
```

### 6-7. FAQカード `.faq-card`

よくある質問の Q&A 表示。`.faq-grid`（2カラム）内で使う。

```html
<dl class="faq-card">
  <dt>Q：質問文</dt>
  <dd>A：回答文。</dd>
</dl>
```

### 6-8. フローアイテム `.flow-item`

ステップ・フロー説明。`.flow-list`（縦並び）内で使う。

```html
<div class="flow-list">
  <div class="flow-item">
    <div class="flow-num">1</div>
    <div class="flow-content">
      <h3>ステップ見出し</h3>
      <p>説明文。</p>
    </div>
  </div>
  <div class="flow-item">
    <div class="flow-num">2</div>
    <div class="flow-content">
      <h3>ステップ見出し</h3>
      <p>説明文。</p>
    </div>
  </div>
</div>
```

### 6-9. ボタン `.cm-btn` / `.service-banner-btn`

| クラス | 用途 |
|---|---|
| `.cm-btn` | 標準CTA（丸角・黒） |
| `.service-banner-btn` | サービスカード内・大きめCTA（ピル型・黒） |

```html
<a class="cm-btn" href="/inquiry">お問い合わせはこちら</a>

<a class="service-banner-btn" href="/inquiry">詳細はこちら →</a>
```

### 6-10. 法人概要テーブル `.law-table`

法人情報の表示。`.law-grid` 内で使う。

```html
<table class="law-table">
  <tr>
    <th>法人名</th>
    <td>一般社団法人ディレクションサポート協会</td>
  </tr>
  <tr>
    <th>代表理事</th>
    <td>助田 正樹</td>
  </tr>
</table>
```

### 6-11. プロフィール横並びカード `.profile-row`（2026-04-21統一仕様）

対象ページ:

- `page-speakingcircles`
- `page-community`
- `page-sukeda`

PC（960pxより上）の仕様:

- レイアウトは **2カラム固定**（左: テキスト / 右: 写真）
- `grid-template-columns: minmax(0, 1fr) clamp(240px, 24vw, 340px)`
- テキストと写真の **カラム間余白は 0**
- 写真は `aspect-ratio: 4 / 5`、`object-fit: cover`
- 写真コンテナは右カラムに配置（`order: 2`）、テキストは左カラム（`order: 1`）

SP（960px以下）の仕様:

- 1カラムに折り返し
- 写真を先頭、テキストを後段に並べる
- 写真角丸は `14px`

実装時の注意:

- `.profile-row` / `.profile-photo` / `.profile-text` の構造は崩さない
- 余白調整を負マージンや `calc(100% + ...)` で行わない
- ページ固有調整は必ず `page-...` スコープで行う

---

## 7. グリッドシステム

| クラス | カラム数 | 用途 |
|---|---|---|
| `.member-cards` | 3 | メンバーカード |
| `.mvv-grid` | 3 | MVVカード |
| `.cards` | 3 | 汎用カード（`.card` 使用） |
| `.tile-grid` | 3 | 画像タイル |
| `.solution-grid` | 3 | ソリューション説明カード |
| `.service-grid` | 3 | サービスカード |
| `.slack-cards` | 3 | Slackサンプルカード |
| `.concept-grid` / `.concept-grid--3` | 3 | コンセプトカード |
| `.concept-grid--2` | 2 | コンセプトカード（2列） |
| `.concept-grid--1` | 1 | コンセプトカード（1列） |
| `.support-grid` | 4 | サポート対象カード |
| `.partner-grid` | 4 | パートナーロゴ |
| `.faq-grid` | 2 | FAQカード |
| `.law-grid` | 2 | 法人概要＋地図 |

> レスポンシブ（960px以下）ですべて1カラムになる。

---

## 8. AOSアニメーション

アニメーションは `data-aos` 属性で統一し、`main.js` の IntersectionObserver で表示制御している。

| 用途 | パターン |
|---|---|
| パネル（セクション） | `data-aos="fade-up" data-aos-duration="700"` |
| カード1枚目 | `data-aos="flip-left" data-aos-duration="400" data-aos-delay="0" data-aos-easing="ease" data-aos-once="true"` |
| カード2枚目 | `data-aos-delay="100"` |
| カード3枚目 | `data-aos-delay="200"` |
| カード4枚目 | `data-aos-delay="300"` |

```html
<!-- パネル -->
<section class="panel" data-aos="fade-up" data-aos-duration="700">

<!-- カード（3枚の場合） -->
<div class="mvv-card" data-aos="flip-left" data-aos-duration="400" data-aos-delay="0" data-aos-easing="ease" data-aos-once="true">
<div class="mvv-card" data-aos="flip-left" data-aos-duration="400" data-aos-delay="100" data-aos-easing="ease" data-aos-once="true">
<div class="mvv-card" data-aos="flip-left" data-aos-duration="400" data-aos-delay="200" data-aos-easing="ease" data-aos-once="true">
```

> `data-aos-once="true"` は必須。スクロールのたびにアニメーションが繰り返されないようにする。

---

## 9. 画像ルール

- ラスター画像は **WebP** を基本にする。ロゴ・アイコンは **SVG**、ファビコンは **ICO**、動画は **MP4** を使う
- パスは **ルート相対パス**（`/assets/wp/photo.webp`）。`../` は使わない
- `alt` 属性は必須（装飾画像は `alt=""`）
- ヒーロー画像以外はすべて `loading="lazy"` を付ける

```html
<!-- OK -->
<img src="/assets/wp/photo.webp" alt="氏名" loading="lazy">
<img src="/assets/wp/logo-1.svg" alt="DiSA">
<video src="/assets/wp/miyu.mp4" autoplay muted loop playsinline></video>

<!-- NG -->
<img src="../assets/wp/photo.png">            <!-- 相対パス・PNG -->
<img src="https://example.com/photo.jpg">    <!-- 外部URL -->
<img src="/assets/wp/photo.webp">            <!-- loading="lazy" なし（ヒーロー以外） -->
```

---

## 10. SEO / OGP ブロック

各ページの `<head>` にあるコメント `<!-- SEO/OGP: managed -->` 〜 `<!-- /SEO/OGP: managed -->` の中に書く。

```html
<!-- SEO/OGP: managed -->
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<meta name="googlebot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="https://drsp.cc/【パス】/">
<meta property="og:locale" content="ja_JP">
<meta property="og:type" content="website">
<meta property="og:site_name" content="一般社団法人ディレクションサポート協会（DiSA）">
<meta property="og:title" content="【ページタイトル】 | DiSA">
<meta property="og:description" content="【説明文（120文字以内）】">
<meta property="og:url" content="https://drsp.cc/【パス】/">
<meta property="og:image" content="https://drsp.cc/assets/wp/ogp-seminar-webinar-qa.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="【ページタイトル】 | DiSA">
<meta name="twitter:description" content="【説明文（120文字以内）】">
<meta name="twitter:image" content="https://drsp.cc/assets/wp/ogp-seminar-webinar-qa.webp">
<!-- /SEO/OGP: managed -->
```

**各項目のルール：**

| 項目 | ルール |
|---|---|
| `canonical` | `https://drsp.cc/【パス】/`（末尾スラッシュあり）|
| `og:title` / `twitter:title` | `【ページタイトル】 \| DiSA`。`<title>` タグと完全一致させる |
| `og:description` / `twitter:description` | `<meta name="description">` と同じ文字列 |
| `og:image` / `twitter:image` | 新規ページは原則共通 OGP 画像 `ogp-seminar-webinar-qa.webp` を使う。既存ページには `logo-1.svg` を使っている例もある |

---

## 11. CSS変数一覧

```css
:root {
  --bg: #ededed;        /* ページ背景 */
  --panel: #dfdfdf;     /* パネル背景 */
  --inner: #ececec;     /* インナーパネル背景 */
  --text: #313338;      /* 本文テキスト */
  --blue: #1f62b8;      /* アクセントカラー（リンク・フォーカス等） */
  --site-max: 1140px;   /* コンテンツ最大幅 */
  --gutter: 15px;       /* 左右余白 */
  --fs-1〜--fs-5;       /* フォントサイズ（セクション5参照） */
}
```

> NG: `--accent` `--primary` など存在しない変数名は使わない → `--blue` を使う

---

## 12. bodyクラスと page-specific スタイル

各ページの `<body>` には `page-【名前】` クラスを付ける。ページ固有のスタイルは `styles.css` 内でこのクラスをスコープにして書く。

| ページ | bodyクラス |
|---|---|
| TOP | `page-top` |
| 法人案内 | `page-about` |
| コラボ活動 | `page-community` |
| Speaking Circles | `page-speakingcircles` |
| LPORT | `page-lport` |
| AI部 | `page-ai-bu` |
| メンバー | `page-member` |
| 法人会員 | `page-membership` |
| 会員規約 | `page-membership-terms` |
| プライバシーポリシー | `page-membership` |
| SPOT WORKS | `page-spot` |
| 助田プロフィール | `page-sukeda` |
| 404 | `page-404` |

> 新ページを作ったら必ず `page-【名前】` を追加する。`.panel` 等の共通コンポーネントに新しいページ固有のスタイルをあてるときはこのクラスでスコープを切る。

---

## 13. やってはいけないこと（NG集）

### NG-1: インラインCSSを書く

```html
<!-- NG -->
<p style="font-size: 20px; color: red;">テキスト</p>
<section style="margin-top: 40px;">

<!-- OK: styles.css のクラスを使う -->
<p class="...">テキスト</p>
```

### NG-2: `<style>` タグをHTMLに書く

新規実装では書かない。独自スタイルが必要なら `styles.css` の末尾に `page-【名前】` スコープで追加する。

### NG-3: 存在しないクラスを使う

`styles.css` を確認してから使う。

```html
<!-- NG -->
<div class="mt-lg">         <!-- 存在しない（サイト版にユーティリティなし） -->
<div class="card-lg">       <!-- 存在しない -->

<!-- OK -->
<div class="inner-panel">
```

### NG-4: 画像を WebP 以外で使う

```html
<!-- NG -->
<img src="/assets/wp/photo.png">
<img src="/assets/wp/photo.jpg">

<!-- OK -->
<img src="/assets/wp/photo.webp" alt="説明" loading="lazy">
<img src="/assets/wp/logo-1.svg" alt="DiSA">
<video src="/assets/wp/miyu.mp4" autoplay muted loop playsinline></video>
```

### NG-5: `alt` を省略する

```html
<!-- NG -->
<img src="/assets/wp/photo.webp">

<!-- OK -->
<img src="/assets/wp/photo.webp" alt="助田 正樹" loading="lazy">
```

### NG-6: ヒーロー以外で `loading="lazy"` を省略する

スクロールして見える画像（カード画像・メンバー写真等）にはすべて `loading="lazy"` を付ける。

### NG-7: AOS を付けずにカードを並べる

```html
<!-- NG -->
<div class="mvv-card">

<!-- OK -->
<div class="mvv-card" data-aos="flip-left" data-aos-duration="400" data-aos-delay="0" data-aos-easing="ease" data-aos-once="true">
```

### NG-8: `og:title` と `<title>` を揃えない

両者は完全一致が原則。フォーマットは `【ページタイトル】 | DiSA`（TOPページのみ法人名フル表記）。

---

## 14. 実装前チェックリスト

- [ ] `<style>` タグ・`style=` 属性を書いていない
- [ ] `styles.css` に存在するクラス名のみ使っている
- [ ] `<body>` に `page-【名前】` クラスがある
- [ ] イントロパネルに `.about-intro-dark` を使っている
- [ ] `h1.page-title` はページに1つだけ
- [ ] カードに `data-aos="flip-left"` アニメーションが付いている（`data-aos-once="true"` も）
- [ ] パネルに `data-aos="fade-up" data-aos-duration="700"` が付いている
- [ ] 画像形式が用途に合っている（WebP / SVG / MP4 / ICO）
- [ ] 画像パスがルート相対パス（`/assets/wp/`）
- [ ] ヒーロー以外の画像に `loading="lazy"` がある
- [ ] すべての画像に `alt` 属性がある
- [ ] `robots` / `googlebot` メタタグがある
- [ ] `og:title` と `<title>` が一致している
- [ ] `og:description` と `<meta name="description">` が一致している
- [ ] `canonical` URL が末尾スラッシュありで実際の URL と一致している
