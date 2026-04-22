# DiSA スライド デザインシステム

実装者向けのガイドです。新しいスライドを作る前に必ず読んでください。

---

## 1. 基本ルール

- スタイルは `css/theme.css` に集約されています。**インラインCSSは書かない**
- `theme.css` に存在しないクラス名・CSS変数は使わない
- 画像パスはルート相対パス（`/assets/wp/`）を使う。`../../` は使わない
- フォントは **Noto Sans JP** を基本に、英数字用に **Inter** を1つ追加する（`font-family` を独自指定しない）
- フォントサイズはユーティリティクラス（`.text-huge` 等）で定義されたもののみ使用し、独自のサイズ指定（`font-size: 24px` 等）は行わない
- `theme.css` に存在しないクラス名・CSS変数は使わない
- 新しいパターンが必要なときは、個別ファイルに書かず `theme.css` に追加する

---

## 2. スライドのHTMLひな形

新しいスライドページを作るときはこの構造をコピーして使います。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">

  <title>ページタイトル | 一般社団法人ディレクションサポート協会（DiSA）</title>
  <meta name="description" content="説明文">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/slide/css/base.css">
  <link rel="stylesheet" href="/slide/css/theme.css">
  <!-- ↑ <style> タグは書かない -->
</head>
<body>
  <div class="bespoke-marp-osc">...</div>
  <div id=":$p">

    <!-- 各スライドは <svg> > <foreignObject> > <section> の構造 -->
    <svg data-marpit-svg="" viewBox="0 0 1280 720">
      <foreignObject width="1280" height="720">
        <section id="1" class="[テンプレートクラス]" data-template="[a|b]"
          data-paginate="true"
          data-header="&lt;div class=&quot;header-content&quot;&gt;&lt;img src=&quot;/assets/wp/logo-1.svg&quot; class=&quot;header-logo&quot;&gt;&lt;/div&gt;"
          data-footer="COPYRIGHT - 一般社団法人ディレクションサポート協会（DiSA）"
          data-marpit-pagination="1"
          data-marpit-pagination-total="10">
          <header>
            <div class="header-content">
              <img src="/assets/wp/logo-1.svg" class="header-logo" alt="一般社団法人ディレクションサポート協会（DiSA）ロゴ">
            </div>
          </header>

          <!-- コンテンツ -->

          <footer>COPYRIGHT - 一般社団法人ディレクションサポート協会（DiSA）</footer>
        </section>
      </foreignObject>
    </svg>

  </div>
  <script src="../js/marp-runtime.js"></script>
  <script src="../js/nav.js"></script>
</body>
</html>
```

---

## 3. テンプレートクラス

スライドの `<section>` に付けるクラスです。

| クラス | 用途 | 組み合わせる `data-template` |
|---|---|---|
| `lead template-a` | タイトルスライド・中扉（中央揃え） | `data-template="a"` |
| `template-b` | 通常コンテンツスライド | `data-template="b"` |
| `template-b dense` | カードや項目が多い密集スライド | `data-template="b"` |

```html
<!-- タイトルスライド -->
<section class="lead template-a" data-template="a" ...>
  <h1>メインタイトル</h1>
  <h2>サブタイトル</h2>
</section>

<!-- 通常スライド -->
<section class="template-b" data-template="b" ...>
  <h1>スライドタイトル</h1>
  <h2>サブ見出し（任意）</h2>
  <!-- コンテンツ -->
</section>

<!-- 密集スライド（カードやリストが多い場合） -->
<section class="template-b dense" data-template="b" ...>
  ...
</section>
```

---

## 3.5. スライドレイアウト自動判断ルール

コーディング時にレイアウトを毎回指示しなくていいよう、以下のルールに従って実装する。指示がない場合はこのルールが優先される。

### テンプレート選択

| 条件 | セクションクラス | data-template |
|---|---|---|
| タイトルスライド・クロージング | `lead template-a` | `"a"` |
| カードやメンバーが5枚以上、または項目が密集 | `template-b dense` | `"b"` |
| それ以外のコンテンツスライド | `template-b` | `"b"` |

### コンテンツ配置

| コンテンツの種類 | 使うコンポーネント | 備考 |
|---|---|---|
| カード3枚 | `.grid-3` | |
| カード6枚 | `.grid-3` | `dense` を自動付与 |
| 2カラム比較・左右対比 | `.columns` | 各アイテムを独立 `.card` に |
| FAQ | `.columns` | 各質問を独立 `.card` に（`.faq-q` `.faq-a` を使う） |
| ステップフロー | `.step-container` | |
| メンバーカード | `.member-flex.member-flex-5` | カラム数は5固定。9名の場合は1枠プレースホルダーで埋める |

### カード内コンテンツの構造固定ルール（コピーに依存しないレイアウト）

カード内の構造はコンテンツの種類によって固定する。文言の長短でレイアウトが崩れないよう、以下のパターン以外は使わない。

| カードの用途 | 内部構造 |
|---|---|
| カテゴリ説明カード | `chip` → `p`（本文） |
| 番号付き提供価値カード | `chip`（番号+名称）→ `p.font-bold`（小見出し）→ `p`（説明） |
| FAQ カード | `p.faq-q` → `p.faq-a` |
| MISSION/VISION/VALUES | `chip` → `p` |
| エントリーテーブル（法人概要） | `.entry-table` 単体（カードにしない） |

> NG: カードの種類によって構造がバラバラになること。同じスライド内のカードは同じ構造にする。

### チップ（`.chip`）の仕様統一

- **位置**: 必ずカードの先頭に置く。本文中・末尾への挿入は禁止
- **文言**: 15文字以内。英語は全大文字、日本語は名詞のみ
- **用途**: カテゴリラベル・番号付きシーケンス・ステータス（MISSION等）・サービス種別（FOR BUSINESS等）
- **禁止**: 説明文・動詞・文章をチップに入れない

```html
<!-- OK -->
<span class="chip">01 AI UPDATE</span>
<span class="chip">FOR BUSINESS</span>
<span class="chip">情報のシェア</span>

<!-- NG -->
<span class="chip">AIの最新情報を共有します</span>  <!-- 文章はNG -->
<span class="chip">chip filled</span>              <!-- 存在しないバリアントはNG -->
```

### h1・h2 必須ルール

- **`template-b` / `template-b dense` のすべてのスライドに h1・h2 が必要**
- `lead template-a` スライドは h2 任意
- h2 のテキストが指定されていない場合はコーディングを止めて確認する

### メンバーカード固定ルール

- カラム数は常に `member-flex-5`（5カラム固定）
- 5の倍数に満たない場合は `<div class="card is-placeholder"></div>` で不足分を埋める

---

## 4. コンポーネント

### 4-1. カード `.card`

白背景・ボーダー・シャドウの基本ブロック。

```html
<div class="card">
  <p>テキスト</p>
</div>
```

### 4-2. チップ `.chip`

アクセントカラーのラベル。カード内の先頭に置くことが多い。

```html
<span class="chip">LABEL</span>
```

> NG: `chip filled`、`chip active` など存在しないバリアントは使わない

### 4-3. 3カラムグリッド `.grid-3`

```html
<div class="grid-3">
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
</div>
```

### 4-4. 2カラム `.columns`

```html
<div class="columns">
  <div class="card">左</div>
  <div class="card">右</div>
</div>
```

### 4-5. メンバーカード `.member-flex`

**必ず `.member-info` ラッパーを使う。** `img` の `alt` も必須。

```html
<div class="member-flex">
  <div class="card">
    <img src="../../assets/wp/photo.webp" alt="氏名">
    <div class="member-info">
      <h3>氏名</h3>
      <div class="tags">#タグ1 #タグ2</div>
      <div class="desc">説明文。</div>
    </div>
  </div>
  </div>
  <!-- 5カラム固定が基本。5の倍数（5, 10, 15...）になるよう placeholder で調整する -->
</div>
```

> NG: `member-info` を省略して `h3`・`.tags`・`.desc` を `card` 直下に置かない

### 4-6. ステップ `.step-container`

導入フローなどに使う。

```html
<div class="step-container">
  <div class="step-box">
    <div class="step-num">1</div>
    <p class="font-bold">STEP 1</p>
    <h3>見出し</h3>
    <p>説明</p>
  </div>
  <div class="step-arrow">▶</div>
  <div class="step-box">
    <div class="step-num">2</div>
    <p class="font-bold">STEP 2</p>
    <h3>見出し</h3>
    <p>説明</p>
  </div>
</div>
```

### 4-7. FAQ `.faq-item`

```html
<div class="faq-item">
  <p class="faq-q">Q：質問文</p>
  <p class="faq-a">A：回答文</p>
</div>
```

### 4-8. 引用ブロック `blockquote`

```html
<blockquote>
  通常テキスト。<strong>アクセントカラーになるテキスト</strong>
</blockquote>
```

### 4-9. エントリーテーブル `.entry-table`

ラベル付きの情報テーブル。

```html
<div class="entry-table">
  <div class="entry-row">
    <div class="entry-label">ラベル</div>
    <div class="entry-value">値</div>
  </div>
  <div class="entry-row">
    <div class="entry-label">ラベル</div>
    <div class="entry-value">値</div>
  </div>
</div>
```

### 4-10. カテゴリラベル `.category-label`

メンバー紹介スライドの分類見出し。

```html
<span class="category-label">Marketing & Direction</span>
```

### 4-11. CTAボタン `.service-banner-btn`

Thank U! スライド等で使用する問い合わせ誘導ボタン。

```html
<div class="mt-md flex-center">
  <a href="https://drsp.cc/inquiry" class="service-banner-btn" target="_blank" rel="noopener noreferrer">詳細はこちら（お問い合わせ） →</a>
</div>
```

---

## 5. ユーティリティクラス

### テキスト

| クラス | 効果 |
|---|---|
| `.text-huge` | font-size: 3rem（インパクト数字・大見出し） |
| `.text-md` | font-size: 1rem（標準本文） |
| `.text-sm` | font-size: 0.8rem（キャプション・補足） |
| `.text-white` | color: #fff |
| `.accent` | アクセントカラー + 太字 |
| `.font-bold` | font-weight: 700 |
| `.lh-loose` | line-height: 1.8 |
| `.lh-tight` | line-height: 1.5 |

### マージン

| クラス | 値 |
|---|---|
| `.mt-sm` | margin-top: 10px |
| `.mt-md` | margin-top: 20px |
| `.mt-lg` | margin-top: 40px |
| `.mt-xl` | margin-top: 60px |
| `.mb-xs` | margin-bottom: 5px |
| `.mb-sm` | margin-bottom: 10px |
| `.mb-md` | margin-bottom: 20px |
| `.mb-lg` | margin-bottom: 40px |
| `.m-0` / `.mb-0` / `.mt-0` | margin: 0 |

> NG: `mt-huge` は存在しない → `mt-xl` を使う

### パディング

| クラス | 値 |
|---|---|
| `.p-0` | padding: 0 |
| `.pl-md` | padding-left: 20px |

### ギャップ（grid / flex の gap）

| クラス | 値 |
|---|---|
| `.gap-sm` | gap: 10px |
| `.gap-md` | gap: 20px |
| `.gap-lg` | gap: 40px |
| `.gap-xl` | gap: 60px |

### レイアウト

| クラス | 効果 |
|---|---|
| `.flex-center` | display:flex + 中央揃え |
| `.vcenter` | スライド全体を縦中央に（sectionクラスに付ける） |

### CSS変数

| 変数名 | 値 |
|---|---|
| `--accent-color` | #1f62b8（メインのアクセントカラー） |

> NG: `--slide-accent` は存在しない → `--accent-color` を使う

---

## 6. やってはいけないこと（NG集）

### NG-1: インラインCSSを `<style>` タグで追加する

`theme.css` で対応できないからといって `<style>` タグをHTMLに書き足さない。必要なスタイルは `theme.css` に追加する。

```html
<!-- NG -->
<style>
  #\:\$p>svg>foreignObject>section .member-flex .card img {
    width: 72px;
    border-radius: 50%;
  }
</style>
```

### NG-2: 存在しないクラス名を使う

`theme.css` を確認せずにクラス名を書かない。

```html
<!-- NG -->
<span class="chip filled">LABEL</span>  <!-- filled は存在しない -->
<div class="mt-huge">...</div>          <!-- mt-huge は存在しない、mt-xl を使う -->
```

### NG-3: 存在しないCSS変数を使う

```css
/* NG */
color: var(--slide-accent);  /* 存在しない。var(--accent-color) を使う */
```

### NG-4: 画像に絶対URLを使う

```html
<!-- NG -->
<img src="https://drsp.cc/assets/wp/photo.webp">

<!-- OK -->
<img src="/assets/wp/photo.webp" alt="氏名">
```

### NG-5: `.member-info` ラッパーを省略する

```html
<!-- NG -->
<div class="card">
  <img src="...">
  <h3>氏名</h3>
  <div class="tags">...</div>
  <div class="desc">...</div>
</div>

<!-- OK -->
<div class="card">
  <img src="/assets/wp/photo.webp" alt="氏名">
  <div class="member-info">
    <h3>氏名</h3>
    <div class="tags">...</div>
    <div class="desc">...</div>
  </div>
</div>
```

### NG-6: フォントを勝手に追加・変更する

`Noto Sans JP` を基本に、英数字用に `Inter` を1つ追加する。`font-family` を独自指定したり、不要にフォントを増やしたりしない。

```css
/* NG */
font-family: "MS Gothic", sans-serif;
font-family: "Roboto", sans-serif;
```

### NG-7: 独自のフォントサイズを指定する

インラインCSSや追加の `<style>` タグで、システム外の `font-size` を指定しない。必ずユーティリティクラスを使用する。

```html
<!-- NG -->
<p style="font-size: 25px;">テキスト</p>

<!-- OK -->
<p class="text-md">テキスト</p>
```

---

## 7. SEO / OGP / LLMO 対策

### 7-1. 必須メタタグ

スライドページの `<head>` には以下を必ず設定します。CSS リンクの直後、`</head>` の前に置いてください。

```html
<!-- SEO/OGP: managed -->
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<meta name="googlebot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="https://drsp.cc/slide/【ページ名】/">
<meta property="og:locale" content="ja_JP">
<meta property="og:type" content="website">
<meta property="og:site_name" content="一般社団法人ディレクションサポート協会（DiSA）">
<meta property="og:title" content="【ページタイトル】 | DiSA">
<meta property="og:description" content="【説明文（120文字以内）】">
<meta property="og:url" content="https://drsp.cc/slide/【ページ名】/">
<meta property="og:image" content="https://drsp.cc/assets/wp/ogp-seminar-webinar-qa.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="【ページタイトル】 | DiSA">
<meta name="twitter:description" content="【説明文（120文字以内）】">
<meta name="twitter:image" content="https://drsp.cc/assets/wp/ogp-seminar-webinar-qa.webp">
```

**各項目の書き方：**

| 項目 | ルール |
|---|---|
| `canonical` | `https://drsp.cc/slide/【ページ名】/`（末尾スラッシュあり） |
| `og:title` / `twitter:title` | `【資料名】 \| DiSA` の形式。`<title>` タグと揃える |
| `og:description` / `twitter:description` | `<meta name="description">` と同じ文字列を使う |
| `og:image` / `twitter:image` | 共通OGP画像 `ogp-seminar-webinar-qa.webp` を使う |

### 7-2. llms.txt への追記（LLMO対策）

新しいスライドページを公開したら、サイトルートの `llms.txt` にURLを追加します。

**ファイルパス：** `/llms.txt`

```text
## Slide Presentations
- https://drsp.cc/slide/membership/
- https://drsp.cc/slide/spot/
- https://drsp.cc/slide/【新しいページ名】/  ← 追加する
```

> `llms.txt` はAI検索エンジン（ChatGPT, Perplexity 等）がサイト構造を把握するためのファイルです。スライドページを追加したら必ずここも更新してください。

### 7-3. SEO / OGP チェックポイント

- `og:title` と `<title>` タグの文言が一致しているか
- `og:description` と `<meta name="description">` の文言が一致しているか
- `canonical` のURLが実際の公開URLと一致しているか（末尾スラッシュに注意）
- `llms.txt` に新しいページのURLを追記したか

---

## 8. 共通スライドスニペット

全スライドで共通して使う固定ページのHTMLです。新しいスライドを作るときはここからコピーしてください。

### 冒頭3ページ構成

**スライド1 — タイトル（テンプレA）**

```html
<!-- Slide 1: Title -->
<svg data-marpit-svg="" viewBox="0 0 1280 720">
  <foreignObject width="1280" height="720">
    <section id="1" class="lead template-a" data-template="a" data-paginate="true"
      data-header="&lt;div class=&quot;header-content&quot;&gt;&lt;img src=&quot;../../assets/wp/logo-1.svg&quot; class=&quot;header-logo&quot;&gt;&lt;/div&gt;"
      data-footer="COPYRIGHT - 一般社団法人ディレクションサポート協会（DiSA）"
      data-marpit-pagination="1" data-marpit-pagination-total="【総ページ数】">
      <header>
        <div class="header-content"><img src="../../assets/wp/logo-1.svg" class="header-logo" alt="一般社団法人ディレクションサポート協会（DiSA）ロゴ"></div>
      </header>
      <h1>【サービス名】</h1>
      <h2>【キャッチコピー】</h2>
      <span class="chip">FOR BUSINESS</span>
      <div class="mt-md flex-center">
        <a href="https://drsp.cc/inquiry" class="service-banner-btn" target="_blank" rel="noopener noreferrer">詳細はこちら（お問い合わせ） →</a>
      </div>
      <footer>COPYRIGHT - 一般社団法人ディレクションサポート協会（DiSA）</footer>
    </section>
  </foreignObject>
</svg>
```

**スライド2 — サービス概要（テンプレB）**

```html
<!-- Slide 2: サービス概要 -->
<svg data-marpit-svg="" viewBox="0 0 1280 720">
  <foreignObject width="1280" height="720">
    <section id="2" class="template-b" data-template="b" data-paginate="true"
      data-header="&lt;div class=&quot;header-content&quot;&gt;&lt;img src=&quot;../../assets/wp/logo-1.svg&quot; class=&quot;header-logo&quot;&gt;&lt;/div&gt;"
      data-footer="COPYRIGHT - 一般社団法人ディレクションサポート協会（DiSA）"
      data-marpit-pagination="2" data-marpit-pagination-total="【総ページ数】">
      <header>
        <div class="header-content"><img src="../../assets/wp/logo-1.svg" class="header-logo" alt=""></div>
      </header>
      <h1>【サービス名】</h1>
      <h2>【サービスの一言説明】</h2>
      <div class="grid-3">
        <div class="card">
          <span class="chip">【概念1】</span>
          <p>【説明】</p>
        </div>
        <div class="card">
          <span class="chip">【概念2】</span>
          <p>【説明】</p>
        </div>
        <div class="card">
          <span class="chip">【概念3】</span>
          <p>【説明】</p>
        </div>
      </div>
      <footer>COPYRIGHT - 一般社団法人ディレクションサポート協会（DiSA）</footer>
    </section>
  </foreignObject>
</svg>
```

**スライド3 — AS-IS / TO-BE（テンプレB）**

```html
<!-- Slide 3: AS-IS / TO-BE -->
<svg data-marpit-svg="" viewBox="0 0 1280 720">
  <foreignObject width="1280" height="720">
    <section id="3" class="template-b" data-template="b" data-paginate="true"
      data-header="&lt;div class=&quot;header-content&quot;&gt;&lt;img src=&quot;../../assets/wp/logo-1.svg&quot; class=&quot;header-logo&quot;&gt;&lt;/div&gt;"
      data-footer="COPYRIGHT - 一般社団法人ディレクションサポート協会（DiSA）"
      data-marpit-pagination="3" data-marpit-pagination-total="【総ページ数】">
      <header>
        <div class="header-content"><img src="../../assets/wp/logo-1.svg" class="header-logo" alt=""></div>
      </header>
      <h1>【サービス名】が解決すること</h1>
      <div class="asis-tobe">
        <div class="asis-box">
          <p class="asis-label">AS-IS</p>
          <p>【現状の課題を箇条書きなどで】</p>
        </div>
        <div class="asis-tobe-arrow">→</div>
        <div class="service-box">
          <span class="chip">【サービス名】</span>
          <p>【サービスが提供する価値】</p>
        </div>
        <div class="asis-tobe-arrow">→</div>
        <div class="tobe-box">
          <p class="tobe-label">TO-BE</p>
          <p>【理想の状態を箇条書きなどで】</p>
        </div>
      </div>
      <footer>COPYRIGHT - 一般社団法人ディレクションサポート協会（DiSA）</footer>
    </section>
  </foreignObject>
</svg>
```

### 末尾3ページ構成

**最後から3番目 — メンバーページ**

既存の `.member-flex` コンポーネントを使用。「4-5. メンバーカード」を参照。

**よくある質問スライド**

```html
<!-- Slide N: よくある質問 -->
<svg data-marpit-svg="" viewBox="0 0 1280 720">
  <foreignObject width="1280" height="720">
    <section id="【N】" class="template-b dense" data-template="b" data-paginate="true"
      data-header="&lt;div class=&quot;header-content&quot;&gt;&lt;img src=&quot;../../assets/wp/logo-1.svg&quot; class=&quot;header-logo&quot;&gt;&lt;/div&gt;"
      data-footer="COPYRIGHT - 一般社団法人ディレクションサポート協会（DiSA）"
      data-marpit-pagination="【N】" data-marpit-pagination-total="【総ページ数】">
      <header>
        <div class="header-content"><img src="../../assets/wp/logo-1.svg" class="header-logo" alt="一般社団法人ディレクションサポート協会（DiSA）ロゴ"></div>
      </header>
      <h1>よくある質問</h1>
      <h2>ご不明な点はお気軽にお問い合わせください。</h2>
      <div class="columns mt-sm">
        <div class="card">
          <p class="faq-q">Q：【質問文】</p>
          <p class="faq-a">A：【回答文】</p>
        </div>
        <div class="card">
          <p class="faq-q">Q：【質問文】</p>
          <p class="faq-a">A：【回答文】</p>
        </div>
        <!-- 各FAQを独立カードで配置。5問なら 2+2+1 の並び -->
      </div>
      <footer>COPYRIGHT - 一般社団法人ディレクションサポート協会（DiSA）</footer>
    </section>
  </foreignObject>
</svg>
```

> ルール: FAQ は `.faq-item` ラッパーを使わず、`.card` 1枚に Q と A を直接置く。INQUIRY カードは含めない。

**最後から2番目 — 法人概要（N-1ページ目）**

```html
<!-- Slide N-1: 法人概要 -->
<svg data-marpit-svg="" viewBox="0 0 1280 720">
  <foreignObject width="1280" height="720">
    <section id="【N-1】" class="template-b" data-template="b" data-paginate="true"
      data-header="&lt;div class=&quot;header-content&quot;&gt;&lt;img src=&quot;../../assets/wp/logo-1.svg&quot; class=&quot;header-logo&quot;&gt;&lt;/div&gt;"
      data-footer="COPYRIGHT - 一般社団法人ディレクションサポート協会（DiSA）"
      data-marpit-pagination="【N-1】" data-marpit-pagination-total="【N】">
      <header>
        <div class="header-content"><img src="../../assets/wp/logo-1.svg" class="header-logo" alt="一般社団法人ディレクションサポート協会（DiSA）ロゴ"></div>
      </header>
      <h1>法人概要</h1>
      <h2>一般社団法人ディレクションサポート協会について</h2>
      <div class="columns mt-md">
        <div class="entry-table">
          <div class="entry-row">
            <div class="entry-label">法人名</div>
            <div class="entry-value">一般社団法人ディレクションサポート協会</div>
          </div>
          <div class="entry-row">
            <div class="entry-label">代表理事</div>
            <div class="entry-value">助田 正樹</div>
          </div>
          <div class="entry-row">
            <div class="entry-label">設立</div>
            <div class="entry-value">2022年10月3日</div>
          </div>
          <div class="entry-row">
            <div class="entry-label">所在地</div>
            <div class="entry-value">〒143-0023 東京都大田区山王2-5-6 SANNO BRIDGE</div>
          </div>
          <div class="entry-row">
            <div class="entry-label">事業内容</div>
            <div class="entry-value">法人プロジェクト支援 / イベント企画・運営</div>
          </div>
          <div class="entry-row">
            <div class="entry-label">適格請求書番号</div>
            <div class="entry-value">T4010805002979</div>
          </div>
        </div>
        <div>
          <div class="card">
            <span class="chip">MISSION</span>
            <p>世にある「ディレクションの困りごと」をなくす</p>
          </div>
          <div class="card mt-sm">
            <span class="chip">VISION</span>
            <p>ディレクションを「みんなのベーススキル」として教え合う</p>
          </div>
          <div class="card mt-sm">
            <span class="chip">VALUES</span>
            <p>ディレクションの知識を、わかりやすく実践的な形に整理する</p>
          </div>
        </div>
      </div>
      <footer>COPYRIGHT - 一般社団法人ディレクションサポート協会（DiSA）</footer>
    </section>
  </foreignObject>
</svg>
```

**最後 — Thank U!（Nページ目）**

```html
<!-- Slide N: Thank U! -->
<svg data-marpit-svg="" viewBox="0 0 1280 720">
  <foreignObject width="1280" height="720">
    <section id="【N】" class="lead template-a" data-template="a" data-paginate="true"
      data-header="&lt;div class=&quot;header-content&quot;&gt;&lt;img src=&quot;../../assets/wp/logo-1.svg&quot; class=&quot;header-logo&quot;&gt;&lt;/div&gt;"
      data-footer="COPYRIGHT - 一般社団法人ディレクションサポート協会（DiSA）"
      data-marpit-pagination="【N】" data-marpit-pagination-total="【N】">
      <header>
        <div class="header-content"><img src="../../assets/wp/logo-1.svg" class="header-logo" alt="一般社団法人ディレクションサポート協会（DiSA）ロゴ"></div>
      </header>
      <h1>Thank U!</h1>
      <h2>【サービス名】のご相談を受付中です</h2>
      <div class="mt-md flex-center">
        <a href="https://drsp.cc/inquiry" class="service-banner-btn" target="_blank" rel="noopener noreferrer">詳細はこちら（お問い合わせ） →</a>
      </div>
      <p class="mt-md">
        <span class="chip">CONTACT</span><br>
        <strong>一般社団法人ディレクションサポート協会（DiSA）</strong><br>
        <a href="https://drsp.cc/" class="accent" target="_blank" rel="noopener noreferrer">https://drsp.cc/</a>
      </p>
      <footer>COPYRIGHT - 一般社団法人ディレクションサポート協会（DiSA）</footer>
    </section>
  </foreignObject>
</svg>
```

---

## 9. 実装前チェックリスト

- [ ] `<style>` タグを書いていない（インラインの `style=` 属性も禁止）
- [ ] `theme.css` に存在するクラス名のみ使っている
- [ ] `template-b` スライドに h1・h2 が両方ある（h2 がなければ実装を止めて確認）
- [ ] レイアウトは「3.5. スライドレイアウト自動判断ルール」に従っている
- [ ] 同じスライド内のカードは同じ内部構造になっている（コピーに依存しない）
- [ ] チップはカード先頭のみ・15文字以内・名詞または英大文字
- [ ] `--accent-color` 変数を正しく使っている（`--slide-accent` などを使っていない）
- [ ] 画像パスが `/assets/wp/` のルート相対パスになっている
- [ ] 画像に `alt` 属性がある
- [ ] `.member-flex` 内のカードに `.member-info` ラッパーがある
- [ ] `data-marpit-pagination-total` がスライド枚数と一致している
- [ ] `robots` / `googlebot` メタタグが設定されている
- [ ] `canonical` URL が実際の公開URLと一致している
- [ ] `og:title`・`og:description` が `<title>`・`<meta name="description">` と一致している
- [ ] `llms.txt` に新しいスライドページのURLを追記した
