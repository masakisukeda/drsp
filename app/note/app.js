const STORAGE_KEYS = {
  progress: 'dir_progress',
  level: 'dir_level',
  toolPref: 'dir_tool_pref',
  bookmarks: 'dir_bookmarks',
  theme: 'dir_theme',
  comments: 'dir_comments',
  commentName: 'dir_comment_name',
  articleOverrides: 'dir_article_overrides',
  deletedArticles: 'dir_deleted_articles',
  glossaryTerms: 'dir_glossary_terms',
  glossaryBaseOverrides: 'dir_glossary_base_overrides',
  glossaryBaseDeleted: 'dir_glossary_base_deleted',
  glossarySort: 'dir_glossary_sort',
  toolsSort: 'dir_tools_sort',
  articleEditorMode: 'dir_article_editor_mode',
  editors: 'dir_editors',
  dictKunRingDismissed: 'dir_dictkun_ring_dismissed',
};

const NOTE_RSS_URL = 'https://note.com/disa_pr/rss';
const NOTE_HOME_LIMIT = 5;
const NOTE_RELATED_LIMIT = 5;
const HOME_RECENT_LIMIT = 6;
const HOME_COMMENT_LIMIT = 6;
const COMMENT_INDEX_LIMIT = 300;
const HOME_COMMENT_EXCERPT_MAX = 20;
const HOME_COMMENT_TITLE_MAX = 16;
const HOME_UPDATE_LIMIT = 3;
const HOME_UPDATES = [
  {
    date: '2026/04/01',
    channel: 'UI',
    title: 'モーダルの閉じる操作を統一',
    body: '管理者キーを含む主要モーダルを、×ボタンとEscキーで閉じられる仕様に統一。',
    link: 'https://drsp.cc/app/note/',
  },
  {
    date: '2026/04/01',
    channel: 'ADMIN',
    title: '管理者キーモーダルを整理',
    body: 'EDIT MODE表示を追加し、管理者キー変更の導線を折りたたみで整理。',
    link: 'https://drsp.cc/app/note/',
  },
  {
    date: '2026/04/01',
    channel: 'NAV',
    title: 'PC/モバイルのヘッダー項目を統一',
    body: '「要望 / 用語集 / 編集メンバー / 管理者キー」のラベル名と順番を統一。',
    link: 'https://drsp.cc/app/note/',
  },
  {
    date: '2026/04/01',
    channel: 'APP',
    title: '記事作成モーダルを追加',
    body: 'タイトル・カテゴリ・参考URLから新規記事の下書きを作成し、すぐ編集可能に。',
    link: 'https://drsp.cc/app/note/',
  },
  {
    date: '2026/04/01',
    channel: 'LP',
    title: 'LPの機能表記を最新UIに同期',
    body: 'LP内の「要望投稿」表記を「要望」に更新し、アプリ導線と表現を統一。',
    link: 'https://drsp.cc/app/note/lp/',
  },
];
const COMMENT_NOTIFY_POLL_MS = 45000;
const COMMENT_NOTIFY_SEEN_KEY = 'dir_comment_notify_seen_v1';
const ADMIN_SESSION_KEY = 'dir_admin_session_key';
const ADMIN_SESSION_AT = 'dir_admin_session_at';
const ADMIN_SESSION_TTL_MS = 2 * 60 * 60 * 1000;
const BASE_CONTENT_UPDATED_AT = '2026-02-17T00:00:00+09:00';
const CONTENT_ASSET_VERSION = '20260425.1618';
const SIMPLE_ROUTE_VIEWS = new Set(['glossary', 'tools', 'requests', 'comments', 'editors', 'dictionary', 'appendix']);
const PUBLIC_BASE_URL = 'https://drsp.cc/app/note/';
const DEFAULT_SEO_TITLE = 'Note.app — ディレクションのノート';
const DEFAULT_SEO_DESCRIPTION = 'ディレクションの"わからない"を、なくそう。キャリアチェンジ中のデザイナーも、新人ディレクターも迷ったらすぐ開けるノートアプリ。';
const DEFAULT_OG_IMAGE = 'https://drsp.cc/app/note/img/ogp-1200x630.png?v=20260425';
const APPENDIX_CATEGORY_IDS = new Set(['tools', 'hiring', 'failure_cases']);
const CATEGORY_GROUP_OPTIONS = [
  { key: 'dictionary', label: 'ノート' },
  { key: 'appendix', label: 'Appendix' },
];

const API_BASE = (
  window.location.protocol === 'http:' || window.location.protocol === 'https:'
) ? `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '/')}` : '';
const COMMENTS_API_ENDPOINT = API_BASE ? `${API_BASE}api/comments.php` : './api/comments.php';
const COMMENTS_SERVER_ENABLED = window.location.protocol !== 'file:';
const IS_FILE_PROTOCOL = window.location.protocol === 'file:';

const TOOL_VARIANT_EXTENSIONS = {
  'バイブコーディング': ['Codex', 'Claude Code', 'Antigravity', 'Relume', 'できるくんAI'],
};
const FEATURE_VIBE_TOOLING_ENABLED = true;
const DISABLED_ARTICLE_TOOLS = new Set(['バイブコーディング', 'Codex', 'Claude Code', 'Antigravity', 'Relume', 'できるくんAI']);
const DISABLED_HASHTAG_KEYS = new Set(['バイブコーディング', 'vibe', 'codex', 'claude code', 'claude_code', 'antigravity', 'relume', 'できるくんai']);
const TOOLS_USAGE_KEYWORD_STOPWORDS = new Set([
  'ツール', '実務', '業務', '作業', '利用', '活用', '導入', '運用', '対応',
  '整理', '情報', '管理', '確認', '共有', '比較', '検討', '改善', '案件',
  '制作', '開発', '設計', 'チーム', 'プロジェクト',
]);
const FORCE_HIDDEN_ARTICLE_IDS = new Set([
  '2bdd0f0a002680059327da9b2088404c',
]);

const RECOMMENDED_CURRICULUM_CATEGORIES = [
  {
    id: 'track_career_change',
    icon: '🧭',
    name: 'ディレクターへキャリアチェンジ',
    kicker: 'RECOMMENDED TRACK',
    description: 'キャリアチェンジで最初に押さえるべき基礎から、進行管理・品質管理までを10記事で確認できるおすすめカテゴリです。',
    items: [
      { title: 'AI時代のディレクションについて', id: '2c3d0f0a00268005a02bd61646318b64' },
      { title: '要件定義', id: '2bdd0f0a0026801094baf17661e44931' },
      { title: '進行管理', id: '2bdd0f0a00268003bc2fe091cf130299' },
      { title: 'WBS（ワークブレークダウンストラクチャー）', id: '2bdd0f0a00268058a83ec5a9f0c5d431' },
      { title: 'クライアントとのコミュニケーション', id: '2bdd0f0a0026803088c3faf71fc9abbf' },
      { title: 'ユーザシナリオ作成', id: '2bdd0f0a002680919aa1d403d4552bf7' },
      { title: 'UX設計', id: '2bdd0f0a002680f3974de7edf2bcacf8' },
      { title: 'デザインレビュー', id: '2bdd0f0a00268014b7bff50c4a427b4d' },
      { title: 'QAエンジニアとのコミュニケーション', id: '2bdd0f0a002680b98decd5d900c9670c' },
      { title: '選考フロー', id: '2bdd0f0a0026800da675c891789145fb' },
      { title: 'スケジュール計画', id: '2bdd0f0a00268062b887e05e3ef35637' },
      { title: 'コーディングチェック', id: '2bdd0f0a0026800983d1f98db7765ae0' },
    ],
  },
  {
    id: 'track_vibe_coding',
    icon: '🤖',
    name: 'バイブコーディング',
    kicker: 'RECOMMENDED TRACK',
    description: 'AIエージェント時代の制作フローを前提に、主要ツールの使い分けと進め方を10記事で短期把握できるおすすめカテゴリです。',
    items: [
      { title: 'AI協業ディレクション', id: 'ai_collaboration_direction' },
      { title: 'Codex', id: 'tool_codex' },
      { title: 'Claude', id: 'tool_claude' },
      { title: 'Antigravity', id: 'tool_antigravity' },
      { title: 'Relume', id: 'tool_relume' },
      { title: 'できるくんAI', id: 'tool_dekirukun_ai' },
      { title: 'Cursor', id: 'tool_cursor' },
      { title: 'v0', id: 'tool_v0' },
      { title: 'Bolt.new', id: 'tool_bolt_new' },
      { title: 'Windsurf', id: 'tool_windsurf' },
    ],
  },
  {
    id: 'track_management',
    icon: '📈',
    name: 'チームマネジメント',
    kicker: 'RECOMMENDED TRACK',
    description: '採用・収益・運用ガバナンスを軸に、経営判断に必要なディレクション視点を10記事で整理できるおすすめカテゴリです。',
    items: [
      { title: 'AI運用ガバナンス', id: 'ai_operation_governance' },
      { title: 'AI時代のディレクター評価基準', id: 'ai_hiring_scorecard' },
      { title: 'KPI・KGI設定', id: '2bdd0f0a00268063a17ccc6ba496b871' },
      { title: '予算計画（P/L・ROI）', id: '2bdd0f0a002680c8b4f7cc1d769b6dea' },
      { title: '工数見積り', id: '2bdd0f0a0026803caef4c90b16ca8c90' },
      { title: 'スケジュール計画', id: '2bdd0f0a00268062b887e05e3ef35637' },
      { title: 'リリース計画', id: '2bdd0f0a002680559d49efa52d2b5323' },
      { title: '求人票設計', id: '2bdd0f0a00268010821ac1d53b864b03' },
      { title: '面接設計', id: '2bdd0f0a002680a8956ef742c82c105e' },
      { title: 'クロージング', id: '2bdd0f0a002680d4a03ad0d5b5f8e704' },
    ],
  },
  {
    id: 'track_digital_marketing',
    icon: '📣',
    name: 'デジタルマーケティング',
    kicker: 'RECOMMENDED TRACK',
    description: '集客から改善運用まで、広告・分析・検証の実務を10記事で押さえられるデジタルマーケティング向けカテゴリです。',
    items: [
      { title: 'AIクリエイティブ検証', id: 'ai_creative_testing' },
      { title: 'SEO（検索最適化/構造化データ/コアウェブバイタル対応）', id: '2bdd0f0a00268031901fe028ed3c6a44' },
      { title: 'LLMO（大規模言語モデル最適化）', id: '2bdd0f0a002680c89340c0a45f5268d1' },
      { title: 'LPO（ランディングページ最適化）', id: '2bdd0f0a002680369094f0cc5d75e28f' },
      { title: 'EFO（エントリーフォーム最適化）', id: '2bdd0f0a002680109f84e74dcc2c129f' },
      { title: 'SNS広告運用', id: '2bdd0f0a002680708a8df9c7bd35aff3' },
      { title: 'リスティング広告', id: '2bdd0f0a002680a2a63cc647cfc57bbb' },
      { title: 'GoogleAnalyticsを使った改善提案', id: '2bdd0f0a00268031abb4c3c931a0382d' },
      { title: 'ヒートマップ/BIツール分析', id: '2bdd0f0a0026802bb695d70a3d08db75' },
      { title: 'インフルエンサーマーケティング', id: '2bdd0f0a002680efb175d1092e92a6db' },
    ],
  },
  {
    id: 'track_reiwa_latest_direction',
    icon: '✨',
    name: '続 令和時代に必要な10',
    kicker: 'RECOMMENDED TRACK',
    description: 'AI時代の実務で今すぐ効くテーマを横断し、企画から運用改善までを最短で押さえられる最新カテゴリです。',
    items: [
      { title: 'AI時代のディレクションについて', id: '2c3d0f0a00268005a02bd61646318b64' },
      { title: 'AI協業ディレクション', id: 'ai_collaboration_direction' },
      { title: '要件定義', id: '2bdd0f0a0026801094baf17661e44931' },
      { title: '進行管理', id: '2bdd0f0a00268003bc2fe091cf130299' },
      { title: 'スケジュール計画', id: '2bdd0f0a00268062b887e05e3ef35637' },
      { title: 'リリース計画', id: '2bdd0f0a002680559d49efa52d2b5323' },
      { title: 'AI運用ガバナンス', id: 'ai_operation_governance' },
      { title: 'LLMO（大規模言語モデル最適化）', id: '2bdd0f0a002680c89340c0a45f5268d1' },
      { title: 'GoogleAnalyticsを使った改善提案', id: '2bdd0f0a00268031abb4c3c931a0382d' },
      { title: 'ヒートマップ/BIツール分析', id: '2bdd0f0a0026802bb695d70a3d08db75' },
    ],
  },
];

const GLOSSARY_TERMS = [
  { term: 'P/L', desc: '損益計算書。売上・原価・利益の関係を把握し、収益構造を判断する基本資料。' },
  { term: 'ROI', desc: '投資対効果。投入した費用に対して、どれだけ成果や利益が得られたかを示す指標。' },
  { term: 'KPI', desc: '重要業績評価指標。目標達成までの進捗を日々追うために設定する中間指標。' },
  { term: 'KGI', desc: '重要目標達成指標。プロジェクトの最終ゴールを定量で示す着地点の数値。' },
  { term: 'OKR', desc: '目標管理手法。目標と主要結果をセットで定義し、挑戦的な成長を促す運用方式。' },
  { term: 'WBS', desc: '作業分解構成図。タスクを粒度ごとに分解して、担当・期限・依存関係を整理する表。' },
  { term: 'RACI', desc: '役割分担マトリクス。実行責任・最終責任・相談先・共有先を明確にする整理法。' },
  { term: 'RFP', desc: '提案依頼書。課題・要件・予算・日程を示し、外部パートナーに提案を募る文書。' },
  { term: 'SOW', desc: '作業範囲記述書。成果物・対象範囲・前提条件・除外事項を契約前に明文化する資料。' },
  { term: 'BRD', desc: '業務要件定義書。事業上の目的や業務課題を整理し、実装前の判断軸を固める文書。' },
  { term: 'QA', desc: '品質保証。バグ修正だけでなく、仕様適合性や再現性を含めて品質を担保する活動。' },
  { term: 'UAT', desc: '受け入れテスト。利用者や発注側の観点で最終確認し、本番投入可否を判断する工程。' },
  { term: 'SLA', desc: 'サービス品質合意。稼働率・応答時間・復旧時間など提供水準を定める取り決め。' },
  { term: 'CMS', desc: 'コンテンツ管理システム。非エンジニアでも更新運用しやすくするための基盤機能。' },
  { term: 'IA', desc: '情報設計。情報の分類・階層・導線を整理し、迷わず到達できる構造を作る設計。' },
  { term: 'UX', desc: '体験設計。使いやすさだけでなく、利用前後の印象や満足感まで含めて設計する視点。' },
  { term: 'UI', desc: '画面設計。視認性・操作性・一貫性を整え、意図した行動を促す接点デザイン。' },
  { term: 'SEO', desc: '検索最適化。検索エンジンに適切に評価されるよう、構造と内容を改善する施策。' },
  { term: 'OGP', desc: 'SNS共有メタ情報。共有時のタイトル・説明・画像表示を制御し、CTRを高める設定。' },
  { term: 'GA4', desc: 'Google Analytics 4。イベント単位で行動を計測し、改善の仮説検証に使う分析基盤。' },
  { term: 'CRO', desc: 'コンバージョン最適化。導線や訴求を改善し、成果到達率を継続的に高める取り組み。' },
  { term: 'LPO', desc: 'ランディングページ最適化。離脱要因を減らし、フォーム送信や問い合わせ率を向上。' },
  { term: 'MEO', desc: '地図検索最適化。店舗や拠点のローカル検索露出を高め、来店導線を強化する施策。' },
  { term: 'クライアント', desc: '発注側・依頼側の関係者を指す実務用語。単なる「お客さん」ではなく、意思決定者・担当者・運用責任者など複数の立場を含む。' },
  { term: '3C分析', desc: '市場・競合・自社の3視点で現状を整理するフレームワーク。企画初期で前提をそろえ、打ち手の優先順位を決めるときに使う。' },
  { term: 'PEST分析', desc: '政治・経済・社会・技術の外部環境を俯瞰する分析手法。中長期のリスクと機会を整理し、戦略や施策の方向性を判断するときに使う。' },
  { term: '要件定義', desc: 'プロジェクトで実現すべき機能・制約・優先度を整理し、関係者で合意する工程。後工程の手戻りを減らす基礎になる。' },
  { term: 'フェーズ', desc: 'プロジェクトを区切って進める段階のこと。企画・設計・実装・検証のように工程を分けることで、進捗管理と意思決定がしやすくなる。' },
  { term: 'サイトマップ', desc: 'Webサイト全体のページ構成を整理した設計図。情報の階層や導線を可視化し、制作前の認識合わせに使う。sitemap.xmlとは用途が異なる。' },
  { term: 'データベース', desc: '情報を構造的に保存・検索・更新する仕組み。会員情報や投稿データを安定して扱う土台で、仕様設計や運用設計に直結する。' },
  { term: 'コーディング', desc: '設計に沿ってHTML/CSS/JavaScriptなどを記述し、画面や機能を実装する作業。デザインと実装の橋渡し工程にあたる。' },
  { term: 'プラグイン', desc: '既存システムに機能を追加する拡張モジュール。便利な反面、競合や脆弱性リスクがあるため、導入時は保守性も確認する。' },
  { term: 'プラットフォーム', desc: 'サービスやシステムが動く基盤環境のこと。Web、SNS、ECなど文脈で指す対象が変わるため、会話時に範囲を明示するのが重要。' },
  { term: 'ロジック', desc: '処理や判断の筋道。仕様レビューでは「どう実現するか」だけでなく、「なぜその条件分岐にするか」の根拠を示すことが大切。' },
  { term: 'ターゲット', desc: '施策で最も届けたい対象ユーザー層。ペルソナより広い概念で、年齢・課題・利用シーンなどの軸で定義すると施策精度が上がる。' },
  { term: 'レイアウト', desc: '情報要素の配置設計。可読性・視線誘導・優先順位を整えるための基本要素で、ワイヤーフレームとセットで検討する。' },
  { term: 'ドキュメント', desc: '仕様書、議事録、運用手順などの文書全般。目的と対象読者を明確にして管理すると、引き継ぎや合意形成の品質が安定する。' },
  { term: 'リリース', desc: '機能やサイトを本番環境へ公開する工程。公開前後のチェック項目、告知、ロールバック手順まで含めて設計するのが実務では重要。' },
  { term: 'セキュリティ', desc: '情報漏えい・改ざん・不正利用を防ぐための対策全般。認証・権限・入力検証・ログ管理などを継続運用として設計する必要がある。' },
  { term: 'ガイドライン', desc: '判断基準や運用ルールをまとめた指針。デザインや文章トーンなどを統一し、属人化と品質ブレを防ぐために活用する。' },
  { term: 'ブランド', desc: '企業やサービスが顧客に持たれる価値認識の総体。ロゴだけではなく、体験・言葉・対応品質まで含めて一貫性を作る概念。' },
  { term: 'LP', desc: 'ランディングページの略。特定の訴求目的に絞って成果行動へ導く単一ページで、広告施策やキャンペーンと相性が良い。' },
  { term: 'API', desc: 'システム同士がデータや機能をやり取りするための接続インターフェース。外部連携や自動化を進める上で中核となる。' },
  { term: 'CSS', desc: 'Webページの見た目を定義するスタイル言語。HTMLが構造、CSSが見た目を担い、保守性を高めるため設計ルール化が重要。' },
  { term: 'HTML', desc: 'Webページの構造を記述するマークアップ言語。見出し・本文・リンクなど意味づけされた構造が、SEOやアクセシビリティにも影響する。' },
  { term: 'CPC', desc: 'クリック単価。広告1クリックあたりの費用を示す指標で、配信効率や入札調整の判断材料として使う。' },
  { term: 'DAU', desc: 'Daily Active Users。1日あたりのアクティブ利用者数で、日次の利用状況や継続率の兆候を把握する指標。' },
  { term: 'MAU', desc: 'Monthly Active Users。1か月あたりのアクティブ利用者数で、サービス規模や定着度を把握する基礎指標。' },
  { term: 'PM', desc: 'プロジェクトマネージャー。進行・品質・コスト・リスクを統括し、関係者調整を担う役割。ディレクターとの責務境界を明確化することが重要。' },
  { term: 'UGC', desc: 'User Generated Content。ユーザーが自発的に作成・投稿するコンテンツ。信頼性や拡散力が高く、コミュニティ運営にも有効。' },
  { term: 'CX', desc: 'Customer Experience。顧客が接点全体を通じて得る体験価値。UXが画面中心なのに対し、CXは購買前後も含む広い概念。' },
  { term: 'SQL', desc: 'データベースを操作するための問い合わせ言語。集計・抽出・更新の基礎となり、分析や運用改善の現場で頻繁に使われる。' },
  { term: 'スキーマ', desc: 'データや情報の構造定義。データベース設計や構造化データ（Schema.org）の文脈で使われ、項目・型・関係性を明確にする。' },
  { term: 'ASO', desc: 'App Store Optimization。アプリストア内での検索順位や獲得率を高める最適化施策。SEOのアプリ版に近い考え方。' },
  { term: 'GMV', desc: 'Gross Merchandise Volume。流通総額を示す指標で、ECやマーケットプレイスで取扱規模を評価するときに使う。' },
  { term: 'FAQ', desc: 'Frequently Asked Questions。よくある質問と回答を整理した情報セット。問い合わせ削減と自己解決率向上に役立つ。' },
  { term: 'MFI', desc: 'Mobile-First Index。Googleがモバイル版コンテンツを主に評価して検索順位を決める仕組み。モバイル最適化の重要根拠になる。' },
  { term: 'ワイヤーフレーム', desc: '画面の情報配置や導線を検討するための設計図。デザイン前に構造を固め、レビューと合意形成を早める目的で使う。' },
  { term: 'ペルソナ', desc: '代表ユーザー像を具体化した仮想人物モデル。意思決定時に「誰のためか」を揃え、体験設計の軸をぶらさないために使う。' },
  { term: 'コンバージョン', desc: '問い合わせ・購入・資料請求など、成果とみなす行動の到達地点。施策評価や改善優先度を決める基準になる。' },
  { term: 'CVR', desc: 'コンバージョン率。訪問者数に対して成果到達した割合を示す指標で、導線や訴求の有効性を測るときに用いる。' },
  { term: 'スコープ', desc: 'プロジェクトで実施する範囲と実施しない範囲。曖昧なまま進むと工数超過や認識ずれが起きやすく、初期に明確化が必要。' },
  { term: 'バリデーション', desc: '入力値やデータの正当性を検証する処理。誤入力や不正データによる障害を防ぎ、品質と安全性を担保する。' },
  { term: 'オンボーディング', desc: '新規ユーザーが価値体験に到達するまでを支援する導入設計。初回離脱を減らし継続利用につなげる。' },
  { term: 'プロトタイプ', desc: '実装前に操作感や導線を検証する試作品。早い段階で課題を発見し、開発コストの高い手戻りを抑える目的で使う。' },
  { term: 'フロントエンド / バックエンド', desc: 'フロントエンドは画面側の実装、バックエンドはサーバー側の処理。責務分担を明確にすると進行管理と品質管理がしやすい。' },
  { term: 'フロントエンド', desc: 'ユーザーが直接見る画面側の実装領域。HTML/CSS/JavaScriptなどで構成され、見た目と操作体験を担う。' },
  { term: 'バックエンド', desc: 'データ処理・認証・API連携などを担うサーバー側の実装領域。画面からは見えないが、機能の土台となる。' },
  { term: 'レスポンシブ', desc: '画面サイズに応じてレイアウトを最適化する設計。PC・スマホ・タブレットで可読性と操作性を維持する基本対応。' },
  { term: 'リターゲティング', desc: '一度接触したユーザーに再アプローチする広告配信手法。検討層への再訴求でCV獲得効率の改善を狙う。' },
  { term: 'CTA', desc: 'Call To Action。ユーザーに次の行動を促す導線要素で、文言・配置・視認性が成果率に直結する。' },
  { term: 'FV', desc: 'ファーストビュー。スクロールせず最初に表示される領域で、第一印象や離脱率に大きく影響する重要エリア。' },
  { term: 'ガントチャート', desc: 'タスクと期間を時系列で可視化する進行管理表。依存関係や遅延を把握しやすく、関係者の認識合わせに有効。' },
  { term: 'バッファ', desc: '遅延や不確実性に備えて確保する余裕時間・余裕工数。計画段階で設定すると炎上リスクを下げられる。' },
  { term: 'マイルストーン', desc: 'プロジェクト進行上の重要な通過点。節目を明確にすることで、進捗確認と意思決定のタイミングを揃えられる。' },
  { term: '仕様書', desc: '機能・画面・データ・挙動などを定義した文書。実装・テスト・運用の共通参照として品質と再現性を支える。' },
  { term: 'クリエイティブ', desc: '広告やコンテンツで用いる表現物（画像・動画・コピーなど）の総称。目的と指標に沿った改善運用が重要。' },
  { term: 'オーガニック', desc: '広告費を使わず自然流入で獲得したトラフィックや成果。中長期の資産型集客を評価するときの基本概念。' },
  { term: 'LLM', desc: '大規模言語モデル。大量の文章を学習し、要約・生成・分類・推論などを行うAIの基盤モデル。AI活用の前提知識として頻出する。' },
  { term: 'RAG', desc: '検索拡張生成。社内文書やナレッジベースを検索し、その結果を踏まえてAIに回答させる構成。精度と根拠を両立しやすい。' },
  { term: 'MCP', desc: 'Model Context Protocol。AIと外部ツールやデータを安全に接続するための連携プロトコル。ツール接続の共通ルールとして注目される。' },
  { term: 'プロンプト', desc: 'AIへの指示文。目的・制約・出力形式・判断基準を明確に書くほど、期待に近いアウトプットを得やすくなる。' },
  { term: 'コンテキストウィンドウ', desc: 'AIが一度に扱える情報量の上限。長文入力や大量資料を渡すときは、この枠を意識して情報を絞る必要がある。' },
  { term: 'ハルシネーション', desc: 'AIがもっともらしい誤情報を生成する現象。重要な判断や公開前の文章では、必ず根拠確認と事実確認が必要になる。' },
  { term: 'ガードレール', desc: 'AIの誤作動や逸脱を防ぐための制約設計。禁止事項、承認条件、出力形式、チェック工程をあらかじめ定義しておく考え方。' },
  { term: 'マルチモーダル', desc: 'テキストだけでなく、画像・音声・動画など複数の情報形式をまとめて扱えるAIの性質。制作や分析の幅を大きく広げる。' },
  { term: 'ファインチューニング', desc: '既存モデルを特定用途向けに追加学習して、回答の傾向や精度を調整する手法。汎用モデルとの差別化に使われる。' },
  { term: 'ベクトル検索', desc: '文章や画像を意味の近さで検索する仕組み。RAGやナレッジ検索でよく使われ、単語一致では拾えない関連情報を探せる。' },
  { term: '推論', desc: 'AIが与えられた情報から結論や次の行動を導く処理。単なる要約ではなく、判断や比較を伴う場面で重要になる。' },
  { term: '知識ベース', desc: '社内ルール、FAQ、手順書、仕様書などを整理した参照情報群。AI活用では、この整備状況が回答品質に直結する。' },
  { term: 'ワークフロー自動化', desc: '定型的な確認・転記・要約・通知などの流れを、AIや連携ツールで自動化する考え方。小さな業務改善の積み重ねに効く。' },
  { term: 'AIエージェント', desc: '目標に対して複数ステップを自律的に進めるAI。調査、実装、検証、修正のような一連の流れを任せる設計で活用が進む。' },
  { term: 'LTV', desc: '顧客生涯価値。1顧客が継続利用を通じて生み出す総利益を評価する指標。' },
  { term: 'EFO', desc: '入力フォーム最適化。入力負荷やエラーを減らし、離脱を抑えて完了率を高める改善。' },
  { term: 'CV', desc: 'コンバージョン。問い合わせ・資料請求・購入など、成果地点となる行動のこと。' },
  { term: 'CTR', desc: 'クリック率。表示回数に対してクリックされた割合を示し、訴求力を測る指標。' },
  { term: 'CPA', desc: '顧客獲得単価。1件の成果獲得に要した費用で、広告効率を判断する基本指標。' },
  { term: 'CPM', desc: 'インプレッション単価。1000回表示あたりの費用を示す、広告配信の基準単価。' },
  { term: 'バミる', desc: '予約を入れること。広告業界の一部で使う俗語で、会食や会場確保の文脈で登場。' },
  { term: 'ペラ', desc: '1枚ものの簡易資料。企画初期の方向合わせや、要点共有のたたき台として使う。' },
  { term: '鉛筆なめなめ', desc: 'ざっくり工数や費用を見積ること。初期検討で概算感を出すときの実務表現。' },
  { term: '積み戻し', desc: '一度外した要件を再びスコープへ戻すこと。影響範囲の再確認が必須になる対応。' },
  { term: '寝かせる', desc: '即断せず一晩置いて再判断すること。判断品質を上げるための現場的な運用。' },
  { term: '赤入れ祭り', desc: '短期間に修正指示が集中する状態。優先順位と役割分担が崩れると破綻しやすい。' },
  { term: '温度感合わせ', desc: '関係者の期待値や認識差をそろえること。序盤に行うほど手戻りを防ぎやすい。' },
];

const GLOSSARY_TERM_USAGE = {
  'サイト': 333,
  'ユーザー': 273,
  'データ': 169,
  'デザイン': 168,
  '管理': 167,
  '検索': 153,
  '広告': 153,
  'クライアント': 121,
  '仕様': 110,
  '構造': 84,
  'エンジニア': 83,
  'リスク': 81,
  'システム': 64,
  'ビジネス': 63,
  '分析': 63,
  'サービス': 61,
  'SNS': 57,
  'コンテンツ': 55,
  'SEO': 54,
  'テスト': 52,
  'UI': 48,
  'プロセス': 44,
  'KPI': 43,
  'UX': 32,
  'CV': 29,
  'CPA': 23,
  'CMS': 21,
  'KGI': 19,
  'QA': 15,
  'WBS': 15,
  'LTV': 14,
  'ROI': 14,
  'OKR': 8,
  'EFO': 6,
  'GA4': 6,
  'IA': 6,
  'CTA': 5,
  'LPO': 5,
  'CTR': 4,
  'OGP': 4,
  'MEO': 3,
  'フェーズ': 20,
  'サイトマップ': 16,
  'データベース': 23,
  'コーディング': 19,
  'プラグイン': 18,
  'プラットフォーム': 17,
  'ロジック': 18,
  'ターゲット': 27,
  'レイアウト': 19,
  'ドキュメント': 31,
  'リリース': 26,
  'セキュリティ': 19,
  'ガイドライン': 16,
  'ブランド': 17,
  'LP': 5,
  'API': 2,
  'CSS': 5,
  'HTML': 4,
  'CPC': 3,
  'DAU': 2,
  'MAU': 2,
  'PM': 2,
  'UGC': 2,
  'CX': 2,
  'SQL': 2,
  'スキーマ': 4,
  'ASO': 2,
  'GMV': 2,
  'FAQ': 4,
  'MFI': 2,
  '3C分析': 0,
  'PEST分析': 0,
  '要件定義': 27,
  'ワイヤーフレーム': 23,
  'ペルソナ': 22,
  'コンバージョン': 18,
  'CVR': 8,
  'スコープ': 8,
  'バリデーション': 7,
  'オンボーディング': 7,
  'プロトタイプ': 6,
  'フロントエンド / バックエンド': 12,
  'フロントエンド': 6,
  'バックエンド': 6,
  'レスポンシブ': 5,
  'リターゲティング': 5,
  'CTA': 4,
  'FV': 4,
  'ガントチャート': 10,
  'バッファ': 8,
  'マイルストーン': 4,
  '仕様書': 41,
  'クリエイティブ': 27,
  'オーガニック': 3,
  'P/L': 3,
  'SLA': 1,
  'コンペ': 1,
  'BRD': 0,
  'CPM': 0,
  'CRO': 0,
  'RACI': 0,
  'RFP': 0,
  'SOW': 0,
  'UAT': 0,
  'ディレ森': 0,
  'バミる': 0,
  'ペラ': 0,
  '鉛筆なめなめ': 0,
  '温度感合わせ': 0,
  '寝かせる': 0,
  '積み戻し': 0,
  '赤入れ祭り': 0,
  'LLM': 0,
  'RAG': 0,
  'MCP': 0,
  'プロンプト': 0,
  'ハルシネーション': 0,
  'ガードレール': 0,
  'マルチモーダル': 0,
  'コンテキストウィンドウ': 0,
  'ファインチューニング': 0,
  'ベクトル検索': 0,
  '推論': 0,
  '知識ベース': 0,
  'ワークフロー自動化': 0,
};

const DICT_KUN_GUIDE_MAP = {
  'ux': 'UX設計',
  'ui': 'UI設計（ワイヤーフレーム/プロトタイプ作成）',
  'seo': 'SEO（検索最適化/構造化データ/コアウェブバイタル対応）',
  'schema': 'メタデータ設計（SEO・OGP・構造化データ）',
  'schemaorg': 'メタデータ設計（SEO・OGP・構造化データ）',
  'schema.org': 'メタデータ設計（SEO・OGP・構造化データ）',
  'スキーマ': 'プログラム仕様書作成',
  'ogp': 'メタデータ設計（SEO・OGP・構造化データ）',
  'wbs': 'WBS（ワークブレークダウンストラクチャー）',
  'kpi': 'KPI・KGI設定',
  'kgi': 'KPI・KGI設定',
  'okr': 'OKR策定',
  'cms': 'CMS運用フロー計画',
  'qa': 'QAエンジニアとのコミュニケーション',
  'rag': 'RAG向け情報設計',
  'llmo': 'LLMO（大規模言語モデル最適化）',
  'llm': 'AI時代のディレクションについて',
  'mcp': 'AI協業ディレクション',
  'notebooklm': 'NotebookLM',
  'perplexity': 'Perplexity',
  'cursor': 'Cursor',
  'windsurf': 'Windsurf',
  'v0': 'v0',
  'bolt': 'Bolt.new',
  'boltnew': 'Bolt.new',
  'gamma': 'Gamma',
  'fireflies': 'Fireflies.ai',
  'descript': 'Descript',
  'lovable': 'Lovable',
  'linear': 'Linear',
  'claude': 'Claude',
  'codex': 'Codex',
  'relume': 'Relume',
  'antigravity': 'Antigravity',
  'できるくん': 'できるくんAI',
  'エージェント': 'AI協業ディレクション',
  'ハルシネーション': 'AI運用ガバナンス',
  'ガードレール': 'AI運用ガバナンス',
  '推論': 'AI時代のディレクションについて',
  '会議要約': 'Fireflies.ai',
};

const DICT_KUN_SYNONYM_GROUPS = [
  ['納期', '締切', '締め切り', 'デッドライン', '遅延', '遅れ', 'スケジュール', '進行管理', 'wbs', 'バッファ', 'マイルストーン'],
  ['要件', '要件定義', '仕様', '仕様書', 'rfd', 'brd'],
  ['品質', 'qa', 'テスト', '受け入れ', 'uat', '不具合', 'バグ'],
  ['見積', '見積もり', '工数', '予算', 'pl', 'p/l', 'roi'],
  ['ユーザー', '顧客', 'ターゲット', 'ペルソナ', 'ux', 'cx'],
  ['画面', 'ui', 'デザイン', 'ワイヤーフレーム', 'レイアウト', 'プロトタイプ'],
  ['検索', 'seo', 'llmo', 'aso', 'meo'],
  ['獲得', '集客', 'cv', 'cvr', 'cpa', 'cta', 'lp', 'ランディングページ', 'コンバージョン'],
  ['運用', '改善', 'pdca', '分析', 'ga4', 'ダッシュボード'],
  ['ai', 'llm', 'rag', 'mcp', 'エージェント', 'プロンプト', 'ハルシネーション', 'ガードレール'],
  ['スキーマ', 'schema', 'schema.org', '構造化データ', 'jsonld', 'json-ld', 'データベース', 'sql', 'メタデータ'],
];

const SEARCH_STOPWORDS = new Set([
  'って', 'とは', 'どう', 'どこ', 'なに', '何', 'です', 'ます', 'したい', 'する', 'やり方', '方法',
  '教えて', '知りたい', 'について', 'の', 'を', 'に', 'は', 'が', 'で', 'と', 'も', 'か', 'ね', 'よ',
]);

const state = {
  categories: [],
  recentArticles: [],
  curriculumByLevel: {},
  articleIndex: [],
  articleMap: new Map(),
  articleIdByTitle: new Map(),
  isAdmin: false,
  currentTool: '基本',
  selectedLevel: Number(localStorage.getItem(STORAGE_KEYS.level) || '1'),
  progress: new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.progress) || '[]')),
  bookmarks: new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.bookmarks) || '[]')),
  toolPref: localStorage.getItem(STORAGE_KEYS.toolPref) || '基本',
  currentArticleId: null,
  currentCategoryId: null,
  categoryGroupFilter: 'dictionary',
  categoryNavExpanded: false,
  currentView: 'home',
  useEmbeddedData: false,
  commentsByArticle: COMMENTS_SERVER_ENABLED ? {} : JSON.parse(localStorage.getItem(STORAGE_KEYS.comments) || '{}'),
  commentName: COMMENTS_SERVER_ENABLED ? '' : (localStorage.getItem(STORAGE_KEYS.commentName) || ''),
  notePosts: [],
  noteFeedLoaded: false,
  articleOverrides: JSON.parse(localStorage.getItem(STORAGE_KEYS.articleOverrides) || '{}'),
  deletedArticles: new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.deletedArticles) || '[]')),
  commentsLoadedByArticle: new Set(),
  toolFilter: null,
  tagFilter: null,
  hashtagFilter: null,
  featureRequests: [],
  featureRequestsLoaded: false,
  userGlossaryTerms: COMMENTS_SERVER_ENABLED ? [] : JSON.parse(localStorage.getItem(STORAGE_KEYS.glossaryTerms) || '[]'),
  glossaryBaseOverrides: (() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.glossaryBaseOverrides) || '{}');
      return raw && typeof raw === 'object' ? raw : {};
    } catch {
      return {};
    }
  })(),
  glossaryBaseDeleted: new Set((() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.glossaryBaseDeleted) || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  })()),
  userGlossaryLoaded: false,
  serverGlossaryBaseOverrides: {},
  serverGlossaryBaseDeleted: new Set(),
  serverGlossaryBaseLoaded: false,
  glossarySort: localStorage.getItem(STORAGE_KEYS.glossarySort) || 'freq',
  toolsSort: localStorage.getItem(STORAGE_KEYS.toolsSort) || 'usage',
  analyticsSummary: null,
  adminKey: '',
  adminKeyChangeExpanded: false,
  articleCreateMode: 'source',
  articleEditorMode: localStorage.getItem(STORAGE_KEYS.articleEditorMode) || 'markdown',
  articleKeywordTagCache: new Map(),
  toolsKeywordWarmupInFlight: false,
  toolsKeywordWarmupTriedIds: new Set(),
  serverArticleOverrideChecked: new Set(),
  commentNotifySeen: new Set((() => {
    try {
      const raw = JSON.parse(localStorage.getItem(COMMENT_NOTIFY_SEEN_KEY) || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  })()),
  commentNotifyPollTimer: null,
  selectedEditorImage: null,
  editors: (() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.editors) || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  })(),
  editorsLoaded: false,
  hashtagModalRequestId: 0,
  featureRequestEditId: '',
  featureRequestEditCategory: 'その他',
};

let modalEscapeHandlerBound = false;

function getOpenModalElements() {
  return [...document.querySelectorAll('.admin-modal.open, .fr-modal.open')];
}

function closeModalById(modalId) {
  switch (String(modalId || '')) {
    case 'commentComposeModal':
      closeCommentComposer();
      return true;
    case 'featureRequestModal':
      closeFeatureRequestModal();
      return true;
    case 'glossaryTermModal':
      closeGlossaryTermModal();
      return true;
    case 'editorModal':
      closeEditorModal();
      return true;
    case 'adminModal':
      closeAdmin();
      return true;
    case 'articleEditModal':
      closeArticleEditor();
      return true;
    case 'articleCreateModal':
      closeCreateArticleModal();
      return true;
    case 'dictKunModal':
      closeDictionaryKunChat();
      return true;
    case 'homeUpdateDetailModal':
      closeHomeUpdateDetail();
      return true;
    case 'hashtagModal':
      closeHashtagModal();
      return true;
    case 'glossaryInlineModal':
      closeGlossaryTermDetailModal();
      return true;
    case 'articleImageModal':
      closeArticleImageModal();
      return true;
    default:
      return false;
  }
}

function closeTopmostOpenModal() {
  const openModals = getOpenModalElements();
  if (!openModals.length) return false;

  let target = null;
  let topZ = -Infinity;
  for (const modal of openModals) {
    const raw = Number.parseInt(window.getComputedStyle(modal).zIndex || '0', 10);
    const z = Number.isFinite(raw) ? raw : 0;
    if (!target || z > topZ || z === topZ) {
      target = modal;
      topZ = z;
    }
  }
  if (!target) return false;
  if (closeModalById(target.id)) return true;

  target.classList.remove('open');
  return true;
}

function bindModalEscapeHandler() {
  if (modalEscapeHandlerBound) return;
  modalEscapeHandlerBound = true;
  const onEscape = (event) => {
    const key = String(event && event.key ? event.key : '');
    const code = String(event && event.code ? event.code : '');
    const keyCode = Number(event && typeof event.keyCode !== 'undefined' ? event.keyCode : 0);
    const which = Number(event && typeof event.which !== 'undefined' ? event.which : 0);
    const isEscapeKey = key === 'Escape' || key === 'Esc' || code === 'Escape' || keyCode === 27 || which === 27;
    if (!isEscapeKey) return;
    const closed = closeTopmostOpenModal();
    if (!closed) return;
    event.preventDefault();
    event.stopPropagation();
  };
  // capture で拾って、入力フォーカス中でも取りこぼさないようにする
  document.addEventListener('keydown', onEscape, true);
}

function buildRoute(view, articleId) {
  const params = new URLSearchParams();

  if (view === 'article' && articleId) {
    params.set('view', 'article');
    params.set('id', String(articleId));
  } else if (view === 'category' && articleId) {
    params.set('view', 'category');
    params.set('id', String(articleId));
  } else if (SIMPLE_ROUTE_VIEWS.has(view)) {
    params.set('view', view);
  }

  const query = params.toString();
  return query ? `${window.location.pathname}?${query}` : window.location.pathname;
}

function parseRoute() {
  const params = new URLSearchParams(window.location.search || '');
  const view = (params.get('view') || '').trim();
  const id = (params.get('id') || '').trim();

  if (view === 'article' && id) return { view: 'article', articleId: id };
  if (view === 'category' && id) return { view: 'category', articleId: id };
  if (SIMPLE_ROUTE_VIEWS.has(view)) return { view, articleId: null };

  const raw = (window.location.hash || '').replace(/^#\/?/, '').trim();
  if (SIMPLE_ROUTE_VIEWS.has(raw)) return { view: raw, articleId: null };
  if (raw.startsWith('article/')) {
    return { view: 'article', articleId: decodeURIComponent(raw.slice('article/'.length)) };
  }
  if (raw.startsWith('category/')) {
    return { view: 'category', articleId: decodeURIComponent(raw.slice('category/'.length)) };
  }

  return { view: 'home', articleId: null };
}

function routeFromInlineOnclick(rawOnclick) {
  const raw = String(rawOnclick || '');
  if (!raw) return '';

  const articleMatch = raw.match(/showArticle\('([^']+)'\)/);
  if (articleMatch && articleMatch[1]) return buildRoute('article', articleMatch[1]);

  const categoryMatch = raw.match(/showCategory\('([^']+)'\)/);
  if (categoryMatch && categoryMatch[1]) return buildRoute('category', categoryMatch[1]);

  if (/showGlossaryView\(/.test(raw)) return buildRoute('glossary', null);
  if (/showDictionaryTopView\(/.test(raw)) return buildRoute('dictionary', null);
  if (/showAppendixTopView\(/.test(raw)) return buildRoute('appendix', null);
  if (/showFeatureRequestsView\(/.test(raw) || /goRequestsPage\(/.test(raw)) return buildRoute('requests', null);
  if (/showCommentsView\(/.test(raw) || /goCommentsPage\(/.test(raw)) return buildRoute('comments', null);
  if (/showEditorsView\(/.test(raw)) return buildRoute('editors', null);

  const viewMatch = raw.match(/showView\('([^']+)'\)/);
  if (viewMatch && viewMatch[1]) {
    const view = viewMatch[1];
    if (view === 'home') return buildRoute('home', null);
    if (view === 'tools') return buildRoute('tools', null);
    if (view === 'glossary') return buildRoute('glossary', null);
    if (view === 'dictionary') return buildRoute('dictionary', null);
    if (view === 'appendix') return buildRoute('appendix', null);
    if (view === 'requests') return buildRoute('requests', null);
    if (view === 'comments') return buildRoute('comments', null);
    if (view === 'editors') return buildRoute('editors', null);
  }

  return '';
}

function enableModifierOpenInNewTab() {
  if (window.__MODIFIER_OPEN_ENABLED__) return;
  window.__MODIFIER_OPEN_ENABLED__ = true;

  document.addEventListener('click', (event) => {
    if (!event || event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (!event.metaKey && !event.ctrlKey) return;
    if (IS_FILE_PROTOCOL) return;

    const anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (anchor) return;

    const node = event.target && event.target.closest ? event.target.closest('[onclick]') : null;
    if (!node) return;
    const rawOnclick = node.getAttribute('onclick') || '';
    const route = routeFromInlineOnclick(rawOnclick);
    if (!route) return;

    const opened = safeWindowOpen(route, '_blank', 'noopener,noreferrer');
    if (opened) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

function safeWindowOpen(url, target = '_blank', features = 'noopener,noreferrer') {
  const href = String(url || '');
  // Regression guard: on mobile, X intent is always same-tab (no extra blank page).
  if (window.innerWidth <= 768 && /^https?:\/\/(x|twitter)\.com\/intent\/tweet/i.test(href)) {
    window.location.href = href;
    return null;
  }
  return window.open(href, target, features);
}

function renderCurrentGlossaryView() {
  renderCategoryJumpGroups('glossaryCategoryNavList', {
    includeGlossaryInAppendix: true,
    glossaryActive: true,
  });
  const input = document.getElementById('glossarySearchInput');
  renderGlossaryPage(input ? input.value : '');
}

function refreshLocalGlossaryViews() {
  renderGlossary();
  renderCurrentGlossaryView();
  renderStats();
}

async function ensureEditorsLoaded() {
  if (!COMMENTS_SERVER_ENABLED) return false;
  if (state.editorsLoaded) return true;
  const ok = await loadEditorsFromServer(300).catch(() => false);
  return !!ok;
}

function updateModeButtonsForView(view) {
  const buttons = document.querySelectorAll('.mode-btn');
  if (!buttons.length) return;
  buttons.forEach((btn) => {
    const btnMode = String(btn.getAttribute('data-mode') || '').trim() || 'search';
    btn.classList.toggle('active', btnMode === 'search');
  });
}

function syncHistory(view, articleId, replace = false) {
  if (IS_FILE_PROTOCOL) return;

  const route = buildRoute(view, articleId);
  const payload = { view, articleId: articleId || null };

  const currentRoute = window.location.pathname + window.location.search;
  if (currentRoute === route
    && history.state
    && history.state.view === payload.view
    && history.state.articleId === payload.articleId) {
    return;
  }

  if (replace || !history.state) {
    history.replaceState(payload, '', route);
    return;
  }

  history.pushState(payload, '', route);
}

async function applyRouteState(route, { sync = false, replace = false } = {}) {
  const safeRoute = route && typeof route === 'object' ? route : { view: 'home', articleId: null };
  if (safeRoute.view === 'article' && safeRoute.articleId) {
    await showArticle(safeRoute.articleId, { skipHistory: true, replaceHistory: replace });
    if (sync) syncHistory('article', safeRoute.articleId, replace);
    return;
  }
  if (safeRoute.view === 'category' && safeRoute.articleId) {
    showCategory(safeRoute.articleId, { skipHistory: true, replaceHistory: replace });
    if (sync) syncHistory('category', safeRoute.articleId, replace);
    return;
  }
  if (safeRoute.view === 'glossary') {
    showGlossaryView({ skipHistory: true });
    if (sync) syncHistory('glossary', null, replace);
    return;
  }
  if (safeRoute.view === 'dictionary') {
    showDictionaryTopView({ skipHistory: true, replaceHistory: replace });
    if (sync) syncHistory('dictionary', null, replace);
    return;
  }
  if (safeRoute.view === 'appendix') {
    showAppendixTopView({ skipHistory: true, replaceHistory: replace });
    if (sync) syncHistory('appendix', null, replace);
    return;
  }
  if (safeRoute.view === 'requests') {
    await showFeatureRequestsView({ skipHistory: true });
    if (sync) syncHistory('requests', null, replace);
    return;
  }
  if (safeRoute.view === 'comments') {
    await showCommentsView({ skipHistory: true });
    if (sync) syncHistory('comments', null, replace);
    return;
  }
  if (safeRoute.view === 'editors') {
    showEditorsView({ skipHistory: true });
    if (sync) syncHistory('editors', null, replace);
    return;
  }
  // 運用上、toolsはhomeへ集約
  showView('home', { skipHistory: true });
  if (sync) syncHistory('home', null, replace);
}

function saveSet(key, setObj) {
  localStorage.setItem(key, JSON.stringify([...setObj]));
}

function saveArticleOverrides() {
  localStorage.setItem(STORAGE_KEYS.articleOverrides, JSON.stringify(state.articleOverrides));
}

function saveDeletedArticles() {
  saveSet(STORAGE_KEYS.deletedArticles, state.deletedArticles);
}

function isArticleDeleted(articleId) {
  const id = String(articleId || '');
  return FORCE_HIDDEN_ARTICLE_IDS.has(id) || state.deletedArticles.has(id);
}

function isForceHiddenArticle(articleId) {
  return FORCE_HIDDEN_ARTICLE_IDS.has(String(articleId || ''));
}

function syncArticleIdMap() {
  state.articleIdByTitle = new Map();
  (state.articleIndex || []).forEach((a) => state.articleIdByTitle.set(a.title, a.id));
}

function canonicalCategoryNameByArticleId(articleId) {
  const id = String(articleId || '').trim();
  if (!id) return '';
  const cats = state.categories || [];
  for (let i = 0; i < cats.length; i += 1) {
    const cat = cats[i];
    const items = (cat && cat.items) || [];
    if (items.some((x) => String((x && x.id) || '').trim() === id)) {
      return normalizeDisplayText((cat && cat.name) || '');
    }
  }
  return '';
}

function applyCachedArticleOverrides() {
  Object.entries(state.articleOverrides || {}).forEach(([id, article]) => {
    state.articleMap.set(id, article);
    updateArticleIndexEntry(id, article);
  });
}

function updateArticleIndexEntry(articleId, article) {
  const canonicalCat = canonicalCategoryNameByArticleId(articleId);
  const normalized = {
    id: String(articleId || article.id || ''),
    title: normalizeDisplayText(article.title || articleId || ''),
    cat: normalizeDisplayText(canonicalCat || article.cat || 'ツール・効率化'),
    tags: Array.isArray(article.tags) ? article.tags : [],
    updatedAt: article.updatedAt || article.updated_at || article.ts || BASE_CONTENT_UPDATED_AT,
  };
  if (!normalized.id) return;

  const upsertTo = (arr) => {
    const idx = arr.findIndex((x) => String(x.id) === normalized.id);
    if (idx >= 0) {
      arr[idx] = {
        ...arr[idx],
        ...normalized,
      };
      return;
    }
    arr.unshift({ ...normalized });
  };

  const sortByUpdatedDesc = (arr) => {
    arr.sort((a, b) => {
      const ta = new Date(a.updatedAt || a.updated_at || a.ts || BASE_CONTENT_UPDATED_AT).getTime();
      const tb = new Date(b.updatedAt || b.updated_at || b.ts || BASE_CONTENT_UPDATED_AT).getTime();
      return tb - ta;
    });
  };

  const ensureCategoryItem = () => {
    const cat = (state.categories || []).find((c) => normalizeDisplayText(c && c.name ? c.name : '') === normalized.cat);
    if (!cat) return;
    if (!Array.isArray(cat.items)) cat.items = [];
    const exists = cat.items.some((item) => String(item && item.id ? item.id : '') === normalized.id);
    if (!exists) {
      cat.items.unshift({ id: normalized.id, title: normalized.title });
    } else {
      cat.items = cat.items.map((item) => (
        String(item && item.id ? item.id : '') === normalized.id
          ? { ...item, title: normalized.title, id: normalized.id }
          : item
      ));
    }
  };

  upsertTo(state.articleIndex);
  upsertTo(state.recentArticles);
  sortByUpdatedDesc(state.articleIndex);
  sortByUpdatedDesc(state.recentArticles);
  ensureCategoryItem();
  state.articleKeywordTagCache.delete(normalized.id);
  syncArticleIdMap();
}

function articleUpdatedAtTs(article) {
  if (!article || typeof article !== 'object') return 0;
  const raw = article.updatedAt || article.updated_at || article.ts || article.createdAt || article.created_at || '';
  const ts = new Date(String(raw || '')).getTime();
  return Number.isFinite(ts) ? ts : 0;
}

function articleHasRenderableContent(article) {
  if (!article || typeof article !== 'object') return false;
  if (!article.content || typeof article.content !== 'object') return false;
  const basic = article.content['基本'] || Object.values(article.content)[0] || '';
  return String(basic || '').trim().length > 0;
}

function shouldPreferIncomingArticle(current, incoming) {
  if (!incoming || typeof incoming !== 'object') return false;
  if (!current || typeof current !== 'object') return true;

  const currentTs = articleUpdatedAtTs(current);
  const incomingTs = articleUpdatedAtTs(incoming);
  if (incomingTs > currentTs) return true;
  if (incomingTs < currentTs) return false;

  if (!articleHasRenderableContent(current) && articleHasRenderableContent(incoming)) return true;
  return false;
}

function pickLatestTimestamp(...candidates) {
  let picked = '';
  let pickedTs = -1;
  candidates.forEach((raw) => {
    const s = String(raw || '').trim();
    if (!s) return;
    const ts = Date.parse(s);
    const n = Number.isFinite(ts) ? ts : -1;
    if (!picked || n > pickedTs) {
      picked = s;
      pickedTs = n;
    }
  });
  return picked || BASE_CONTENT_UPDATED_AT;
}

function maxKnownArticleTimestamp() {
  let maxTs = -1;
  const scan = (arr) => {
    (arr || []).forEach((a) => {
      const ts = articleUpdatedAtTs(a);
      if (ts > maxTs) maxTs = ts;
    });
  };
  scan(state.articleIndex);
  scan(state.recentArticles);
  return maxTs > 0 ? maxTs : Date.parse(BASE_CONTENT_UPDATED_AT);
}

function normalizeDisplayText(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/Ｐ\/Ｌ/g, 'P/L')
    .replace(/ＰＬ/g, 'P/L')
    .replace(/P\/L\/ROI/g, 'P/L・ROI')
    .replace(/PL\/ROI/g, 'P/L・ROI')
    .replace(/P\/L\/BS/g, 'P/L・B/S')
    .replace(/PL\/BS/g, 'P/L・B/S')
    .replace(/\bPL\b/g, 'P/L')
    .replace(/ワードプレス/g, 'WordPress')
    .replace(/Vibe\s*Coding/gi, 'バイブコーディング')
    .replace(/Vibeコーディング/g, 'バイブコーディング');
}

function formatNumberWithComma(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0';
  return Math.max(0, Math.trunc(n)).toLocaleString('en-US');
}

function setMetaContent(selector, content) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute('content', String(content || ''));
}

function setCanonicalUrl(url) {
  const el = document.querySelector('link[rel="canonical"]');
  if (el) el.setAttribute('href', String(url || PUBLIC_BASE_URL));
}

function upsertJsonLd(id, payload) {
  if (!document || !document.head) return;
  let el = document.getElementById(id);
  if (!payload) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(payload);
}

function buildPublicRouteUrl(view, articleId) {
  if (view === 'article' && articleId) {
    return `${PUBLIC_BASE_URL}?view=article&id=${encodeURIComponent(articleId)}`;
  }
  if (view === 'category' && articleId) {
    return `${PUBLIC_BASE_URL}?view=category&id=${encodeURIComponent(articleId)}`;
  }
  if (view && SIMPLE_ROUTE_VIEWS.has(view)) {
    return `${PUBLIC_BASE_URL}?view=${encodeURIComponent(view)}`;
  }
  return PUBLIC_BASE_URL;
}

function summarizeSeoText(text, max = 110) {
  const clean = normalizeDisplayText(stripHtmlToText(text || '')).replace(/\s+/g, ' ').trim();
  if (!clean) return DEFAULT_SEO_DESCRIPTION;
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

function updateStructuredDataForRoute(view, payload = {}) {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '一般社団法人ディレクションサポート協会',
    url: PUBLIC_BASE_URL,
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Note.app',
    url: PUBLIC_BASE_URL,
    description: DEFAULT_SEO_DESCRIPTION,
    inLanguage: 'ja',
  };

  upsertJsonLd('jsonld-org', org);

  if (view === 'article' && payload.article) {
    const article = payload.article;
    const articleId = payload.articleId || article.id || '';
    const url = buildPublicRouteUrl('article', articleId);
    const body = resolveToolContent(article, '基本') || Object.values(article.content || {})[0] || '';
    const desc = summarizeSeoText(body || `${article.cat}に関するディレクションノート記事です。`, 140);
    const datePublished = article.createdAt || article.created_at || article.updatedAt || article.updated_at || BASE_CONTENT_UPDATED_AT;
    const dateModified = article.updatedAt || article.updated_at || datePublished || BASE_CONTENT_UPDATED_AT;
    const articleLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: normalizeDisplayText(article.title || articleId || 'ノート記事'),
      description: desc,
      inLanguage: 'ja',
      mainEntityOfPage: url,
      url,
      image: [DEFAULT_OG_IMAGE],
      articleSection: normalizeDisplayText(article.cat || 'ディレクション'),
      keywords: (article.tags || []).map((t) => normalizeDisplayText(tagLabel(t))).filter(Boolean),
      datePublished,
      dateModified,
      author: {
        '@type': 'Organization',
        name: '一般社団法人ディレクションサポート協会',
      },
      publisher: {
        '@type': 'Organization',
        name: '一般社団法人ディレクションサポート協会',
      },
    };
    const categoryName = normalizeDisplayText(article.cat || 'ディレクション');
    const categoryId = findCategoryIdByName(article.cat || '');
    const groupKey = categoryId ? categoryGroupKeyByCategoryId(categoryId) : '';
    const groupName = groupKey ? categoryGroupLabelByKey(groupKey) : '';
    const groupTopUrl = groupKey ? buildPublicRouteUrl(categoryGroupTopViewByKey(groupKey)) : PUBLIC_BASE_URL;
    const breadcrumbItems = [
      { '@type': 'ListItem', position: 1, name: 'Note.app', item: PUBLIC_BASE_URL },
    ];
    if (groupName) {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: breadcrumbItems.length + 1,
        name: groupName,
        item: groupTopUrl,
      });
    }
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: breadcrumbItems.length + 1,
      name: categoryName,
      item: buildPublicRouteUrl('category', categoryId || ''),
    });
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: breadcrumbItems.length + 1,
      name: normalizeDisplayText(article.title || articleId),
      item: url,
    });
    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    };
    upsertJsonLd('jsonld-website', website);
    upsertJsonLd('jsonld-page', articleLd);
    upsertJsonLd('jsonld-breadcrumb', breadcrumbLd);
    return;
  }

  if (view === 'glossary') {
    const collectionLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: '用語集 | Note.app',
      url: buildPublicRouteUrl('glossary'),
      description: 'ディレクション実務でよく使う用語を確認できる用語集です。',
      inLanguage: 'ja',
    };
    upsertJsonLd('jsonld-website', website);
    upsertJsonLd('jsonld-page', collectionLd);
    upsertJsonLd('jsonld-breadcrumb', null);
    return;
  }

  if (view === 'comments') {
    const collectionLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'コメント一覧 | Note.app',
      url: buildPublicRouteUrl('comments'),
      description: 'Note.app の最新コメント一覧です。質問や相談を時系列で確認できます。',
      inLanguage: 'ja',
    };
    upsertJsonLd('jsonld-website', website);
    upsertJsonLd('jsonld-page', collectionLd);
    upsertJsonLd('jsonld-breadcrumb', null);
    return;
  }

  if (view === 'dictionary' || view === 'appendix') {
    const isAppendix = view === 'appendix';
    const collectionLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${isAppendix ? 'Appendix' : 'ノート'}トップ | Note.app`,
      url: buildPublicRouteUrl(view),
      description: isAppendix
        ? 'Appendixカテゴリの一覧ページです。'
        : 'ノートカテゴリの一覧ページです。',
      inLanguage: 'ja',
    };
    upsertJsonLd('jsonld-website', website);
    upsertJsonLd('jsonld-page', collectionLd);
    upsertJsonLd('jsonld-breadcrumb', null);
    return;
  }

  upsertJsonLd('jsonld-website', website);
  upsertJsonLd('jsonld-page', null);
  upsertJsonLd('jsonld-breadcrumb', null);
}

function updateSeoForRoute(view, payload = {}) {
  let title = DEFAULT_SEO_TITLE;
  let description = DEFAULT_SEO_DESCRIPTION;
  let url = buildPublicRouteUrl(view, payload.articleId || null);

  if (view === 'article' && payload.article) {
    const article = payload.article;
    const body = resolveToolContent(article, '基本') || Object.values(article.content || {})[0] || '';
    title = `${normalizeDisplayText(article.title)} | Note.app`;
    description = summarizeSeoText(body || `${article.cat}に関するディレクションノート記事です。`);
    url = buildPublicRouteUrl('article', payload.articleId || article.id || null);
  } else if (view === 'category' && payload.categoryName) {
    const name = normalizeDisplayText(payload.categoryName);
    title = `${name} | Note.app`;
    description = `${name} に関するディレクションノートの記事一覧です。実務で迷いやすいテーマをカテゴリ単位で確認できます。`;
  } else if (view === 'glossary') {
    title = '用語集 | Note.app';
    description = 'ディレクション実務でよく使う用語を、頻出順や五十音順で確認できる用語集です。';
  } else if (view === 'requests') {
    title = '要望一覧 | Note.app';
    description = 'Note.app に寄せられた要望一覧です。改善アイデアや追加してほしい項目を確認できます。';
  } else if (view === 'comments') {
    title = 'コメント一覧 | Note.app';
    description = 'Note.app に投稿されたコメント一覧です。質問・相談・フィードバックを新着順で確認できます。';
  } else if (view === 'dictionary') {
    title = 'ノートトップ | Note.app';
    description = 'ノートカテゴリの一覧からカテゴリトップへ移動できます。';
  } else if (view === 'appendix') {
    title = 'Appendixトップ | Note.app';
    description = 'Appendixカテゴリと用語集への導線をまとめたトップページです。';
  } else if (view === 'editors') {
    title = '編集メンバー | Note.app';
    description = 'Note.app の編集メンバープロフィール一覧です。';
  }

  document.title = title;
  setMetaContent('meta[name="description"]', description);
  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[property="og:url"]', url);
  setMetaContent('meta[name="twitter:title"]', title);
  setMetaContent('meta[name="twitter:description"]', description);
  setCanonicalUrl(url);
  updateStructuredDataForRoute(view, payload);
}


function getExpandedTools(article) {
  const base = Array.isArray(article && article.tools) ? [...article.tools] : ['基本'];
  const filteredBase = FEATURE_VIBE_TOOLING_ENABLED
    ? base
    : base.filter((tool) => !DISABLED_ARTICLE_TOOLS.has(tool));
  if (!filteredBase.length) filteredBase.push('基本');

  const out = [];
  for (const tool of filteredBase) {
    if (!out.includes(tool)) out.push(tool);
    if (!FEATURE_VIBE_TOOLING_ENABLED) continue;
    const exts = TOOL_VARIANT_EXTENSIONS[tool] || [];
    for (const ext of exts) {
      if (!out.includes(ext)) out.push(ext);
    }
  }
  return out;
}

function toolDisplayName(tool) {
  if (tool === '基本') return '共通';
  return normalizeDisplayText(tool);
}

function resolveToolContent(article, tool) {
  if (!article || !article.content) return '';
  if (article.content[tool]) return article.content[tool];

  if (tool === 'Codex' || tool === 'Claude Code' || tool === 'Antigravity' || tool === 'Relume' || tool === 'できるくんAI') {
    if (article.content['バイブコーディング']) {
      return `<div class="tool-note"><div class="tool-note-label vibe">${tool}</div><p>このツール向けの専用解説は準備中です。いまはバイブコーディング版を表示しています。</p></div>${article.content['バイブコーディング']}`;
    }
  }

  if (article.content['基本']) {
    return `<div class="tool-note"><div class="tool-note-label">${toolDisplayName(tool)}</div><p>このツール向けの専用解説は準備中です。いまは共通版を表示しています。</p></div>${article.content['基本']}`;
  }

  return '';
}

function tagLabel(tag) {
  if (tag === 'figma') return 'Figma';
  if (tag === 'vibe') return 'バイブコーディング';
  if (tag === 'wp') return 'WordPress';
  if (tag === 'codex') return 'Codex';
  if (tag === 'claude_code') return 'Claude Code';
  if (tag === 'antigravity') return 'Antigravity';
  return tag;
}


const HASHTAG_STOPWORDS = new Set([
  ...SEARCH_STOPWORDS,
  'する', 'される', 'できる', 'ため', 'こと', 'もの', 'これ', 'それ', 'こちら', 'そちら',
  'どこ', 'なぜ', 'どうして', 'ます', 'です', 'ある', 'いる', 'ない', 'よう', 'ので', 'から',
  'そして', 'また', 'など', '今回', 'この', 'その', '各', '基本', '共通', '対応', '運用',
]);

function toPlainText(html) {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isNounLikeHashtagToken(token) {
  const t = String(token || '').trim();
  if (!t) return false;

  // ひらがなのみは助詞・活用語が多いため除外
  if (/^[ぁ-んー]+$/.test(t)) return false;

  // 助詞終わり・活用語尾を除外
  if (/(ではなく|じゃなく|している|してる|された|される|できる|だった|です|ます|ない|なる|いる|ある|よう|ため|から|まで|より)$/.test(t)) return false;
  if (/(する|した|して|され|れる|られる|たい|らしい|っぽい)$/.test(t)) return false;
  if (/[のをにへでとがはもやかねよ]$/.test(t)) return false;
  if (/^[のをにへでとがはもやかねよ].*/.test(t)) return false;
  if (/[のをにへでとがはもやかねよ][一-龠々]$/.test(t)) return false;
  if (t.length <= 3 && /[ぁ-ん]/.test(t) && /[一-龠々]/.test(t)) return false;

  return true;
}

function extractKeywordHashtagsFromContent(content, maxCount = 5) {
  const text = normalizeDisplayText(toPlainText(content || ''));
  if (!text) return [];

  // 名詞寄りに絞るため、ひらがな単独抽出は行わない
  const regex = /[A-Za-z][A-Za-z0-9+/_\.-]{2,20}|[ァ-ヶー]{2,12}|[一-龠々]{2,8}|[一-龠々][ぁ-ん]{1,4}/g;
  const counts = new Map();
  const matches = text.match(regex) || [];

  matches.forEach((raw) => {
    const token = String(raw || '').trim();
    if (!token) return;
    if (!FEATURE_VIBE_TOOLING_ENABLED && DISABLED_HASHTAG_KEYS.has(normalizeHashtagKey(token))) return;
    const low = token.toLowerCase();
    if (HASHTAG_STOPWORDS.has(token) || HASHTAG_STOPWORDS.has(low)) return;
    if (/^\d+$/.test(token)) return;
    if (!isNounLikeHashtagToken(token)) return;
    counts.set(token, (counts.get(token) || 0) + 1);
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .slice(0, maxCount)
    .map(([token]) => token);
}

function renderArticleTags(article, tool) {
  const el = document.getElementById('articleTagsHeader');
  if (!el || !article) return;

  const TOOL_TAG_KEYS = new Set(['figma', 'vibe', 'wp', 'codex', 'claude_code', 'antigravity', 'relume', 'できるくんai']);
  const staticTags = (article.tags || [])
    .map((t) => ({ className: t, label: tagLabel(t) }))
    .filter((x) => {
      const raw = String(x.label || '').trim();
      if (!raw) return false;
      if (!FEATURE_VIBE_TOOLING_ENABLED && DISABLED_HASHTAG_KEYS.has(normalizeHashtagKey(raw))) return false;
      if (TOOL_TAG_KEYS.has(String(x.className || '').toLowerCase())) return true;
      const normalized = raw.replace(/^#/, '').trim();
      return isNounLikeHashtagToken(normalized);
    });

  const hasManualTags = staticTags.length > 0;
  let keywordTags = [];
  if (!hasManualTags && tool === '基本') {
    const keywords = extractKeywordHashtagsFromContent(resolveToolContent(article, tool), 5);
    keywordTags = keywords.map((k) => ({
      className: 'keyword',
      label: `#${k}`,
    })).filter((x) => FEATURE_VIBE_TOOLING_ENABLED || !DISABLED_HASHTAG_KEYS.has(normalizeHashtagKey(x.label)));
  }

  const merged = [...staticTags, ...keywordTags];
  const seen = new Set();
  const deduped = merged.filter((x) => {
    const k = x.label.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  el.innerHTML = deduped.map((x) => {
    const raw = String(x.label || '');
    const normalized = raw.replace(/^#/, '').trim();
    if (!normalized) return '';
    return `<button class="tag ${x.className}" type="button" onclick="openHashtagModal('${escapeForSingleQuote(normalized)}')">${escapeHtml(raw)}</button>`;
  }).join('');
}

function getArticleTagSeedsForEditor(article, maxCount = 12) {
  if (!article || typeof article !== 'object') return [];
  const out = [];
  const seen = new Set();
  const pushTag = (raw) => {
    const tag = normalizeEditableTag(raw);
    if (!tag || seen.has(tag)) return;
    seen.add(tag);
    out.push(tag);
  };

  (article.tags || []).forEach((tag) => pushTag(tag));
  if (out.length > 0) {
    return out.slice(0, maxCount);
  }

  getArticleKeywordTags(article, maxCount).forEach((tag) => pushTag(tag));
  return out.slice(0, maxCount);
}

function escapeForSingleQuote(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function normalizeHashtagKey(value) {
  return normalizeDisplayText(String(value || '')).replace(/^#/, '').trim().toLowerCase();
}

function getArticleKeywordTags(article, maxCount = 20) {
  if (!article || !article.id) return [];
  const key = String(article.id);
  const cached = state.articleKeywordTagCache.get(key);
  if (Array.isArray(cached)) return cached;

  const basicContent = resolveToolContent(article, '基本');
  const extracted = extractKeywordHashtagsFromContent(basicContent, maxCount);
  state.articleKeywordTagCache.set(key, extracted);
  return extracted;
}

function articleMatchesHashtag(article, hashtag) {
  const target = normalizeHashtagKey(hashtag);
  if (!target || !article) return true;
  if (!FEATURE_VIBE_TOOLING_ENABLED && DISABLED_HASHTAG_KEYS.has(target)) return false;

  const tagMatches = (article.tags || []).some((t) => normalizeHashtagKey(tagLabel(t)) === target);
  if (tagMatches) return true;

  return getArticleKeywordTags(article, 20).some((k) => normalizeHashtagKey(k) === target);
}

function applyHashtagFilter(tag) {
  const normalized = normalizeHashtagKey(tag) || null;
  state.hashtagFilter = normalized;
  if (state.currentView !== 'home') showView('home');
  renderRecentList();
  closeMobileSidebar();
  closeMobileMenu();
  if (normalized) toast('#' + normalized + ' で絞り込みました', 'success');
}

function clearHashtagFilter() {
  state.hashtagFilter = null;
  renderRecentList();
  closeMobileSidebar();
}

async function getHashtagRelatedArticles(hashtag, options = {}) {
  const target = normalizeHashtagKey(hashtag);
  const currentArticleId = String(options.currentArticleId || state.currentArticleId || '');
  if (!target) return [];

  const currentArticle = currentArticleId ? (state.articleMap.get(currentArticleId) || state.articleIndex.find((a) => a.id === currentArticleId) || null) : null;
  const currentCat = normalizeSearchText(currentArticle && currentArticle.cat ? currentArticle.cat : '');

  const primary = (state.articleIndex || [])
    .filter((article) => article && article.id && !isArticleDeleted(article.id))
    .filter((article) => article.id !== currentArticleId)
    .filter((article) => articleMatchesHashtag(article, target))
    .map((article) => {
      const sameCategory = currentCat && normalizeSearchText(article.cat || '') === currentCat ? 1 : 0;
      const ts = article.updatedAt || article.updated_at || article.ts || BASE_CONTENT_UPDATED_AT;
      return {
        article,
        sameCategory,
        time: new Date(ts).getTime() || 0,
      };
    });

  const merged = [...primary];
  if (merged.length < 6) {
    const exists = new Set(merged.map((x) => x.article.id));
    const fallbackCandidates = (state.articleIndex || [])
      .filter((article) => article && article.id && !isArticleDeleted(article.id))
      .filter((article) => article.id !== currentArticleId)
      .filter((article) => !exists.has(article.id))
      .sort((a, b) => {
        const ta = new Date(a.updatedAt || a.updated_at || a.ts || BASE_CONTENT_UPDATED_AT).getTime();
        const tb = new Date(b.updatedAt || b.updated_at || b.ts || BASE_CONTENT_UPDATED_AT).getTime();
        return tb - ta;
      })
      .slice(0, 48);

    for (const article of fallbackCandidates) {
      const full = await loadArticle(article.id);
      if (!full) continue;
      const bodyText = normalizeSearchText(stripHtmlToText(resolveToolContent(full, '基本')));
      if (!bodyText || !bodyText.includes(target)) continue;

      const sameCategory = currentCat && normalizeSearchText(article.cat || '') === currentCat ? 1 : 0;
      const ts = article.updatedAt || article.updated_at || article.ts || BASE_CONTENT_UPDATED_AT;
      merged.push({
        article,
        sameCategory,
        time: new Date(ts).getTime() || 0,
      });
      exists.add(article.id);
      if (merged.length >= 12) break;
    }
  }

  return merged
    .sort((a, b) => b.sameCategory - a.sameCategory || b.time - a.time || String(a.article.title || '').localeCompare(String(b.article.title || ''), 'ja'))
    .map((entry) => entry.article);
}

async function renderHashtagModal(tag) {
  const modal = document.getElementById('hashtagModal');
  const title = document.getElementById('hashtagModalTitle');
  const sub = document.getElementById('hashtagModalSub');
  const list = document.getElementById('hashtagModalList');
  const moreBtn = document.getElementById('hashtagModalMoreBtn');
  if (!modal || !title || !sub || !list || !moreBtn) return;

  const normalized = normalizeHashtagKey(tag);
  if (!normalized) return;
  const requestId = ++state.hashtagModalRequestId;
  const currentArticle = state.currentArticleId ? (state.articleMap.get(state.currentArticleId) || state.articleIndex.find((a) => a.id === state.currentArticleId) || null) : null;

  title.textContent = `#${normalized}`;
  sub.textContent = '関連記事を探しています...';
  list.innerHTML = '<div class="article-row note-row is-placeholder hashtag-related-empty"><span class="article-title-row">関連記事を検索中...</span></div>';
  const related = (await getHashtagRelatedArticles(normalized, { currentArticleId: state.currentArticleId })).slice(0, 8);
  if (requestId !== state.hashtagModalRequestId) return;
  sub.textContent = related.length
    ? `${formatNumberWithComma(related.length)}件の関連記事があります`
    : 'このタグに近い関連記事はまだ少なめです';

  list.innerHTML = related.length
    ? related.map((article) => {
      const date = formatPostDateTime(article.updatedAt || article.updated_at || article.ts || BASE_CONTENT_UPDATED_AT);
      const currentCat = currentArticle && currentArticle.cat ? normalizeSearchText(currentArticle.cat) : '';
      const sameCategory = currentCat && normalizeSearchText(article.cat || '') === currentCat;
      return `<button class="hashtag-related-item${sameCategory ? ' is-same-category' : ''}" type="button" onclick="openArticleFromHashtagModal('${escapeForSingleQuote(article.id)}')">
        ${renderCategoryBadge(article.cat)}
        <span class="hashtag-related-main">
          <span class="article-title-row">${escapeHtml(normalizeDisplayText(article.title))}</span>
          <span class="hashtag-related-meta">${sameCategory ? '同じカテゴリ' : escapeHtml(normalizeDisplayText(article.cat || '関連記事'))}${date ? ` ・ ${escapeHtml(date)}` : ''}</span>
        </span>
        <span class="article-arrow">›</span>
      </button>`;
    }).join('')
    : '<div class="article-row note-row is-placeholder hashtag-related-empty"><span class="article-title-row">関連記事は準備中です</span><span class="glossary-row-desc">一覧で同じタグの記事をまとめて見られます。</span></div>';

  moreBtn.onclick = () => {
    closeHashtagModal();
    applyHashtagFilter(normalized);
  };
}

function openHashtagModal(tag) {
  const modal = document.getElementById('hashtagModal');
  const normalized = normalizeHashtagKey(tag);
  if (!modal || !normalized) return;
  modal.classList.add('open');
  renderHashtagModal(normalized).catch(() => {
    const sub = document.getElementById('hashtagModalSub');
    const list = document.getElementById('hashtagModalList');
    if (sub) sub.textContent = '関連記事の取得に失敗しました';
    if (list) list.innerHTML = '<div class="article-row note-row is-placeholder hashtag-related-empty"><span class="article-title-row">時間をおいて再度お試しください</span></div>';
  });
}

function closeHashtagModal() {
  const modal = document.getElementById('hashtagModal');
  if (modal) modal.classList.remove('open');
}

async function openArticleFromHashtagModal(articleId) {
  closeHashtagModal();
  await showArticle(articleId);
}

function normalizeGlossaryInlineKey(value) {
  return normalizeSearchText(value || '').replace(/\s+/g, '');
}

function buildGlossaryInlineLookup() {
  const lookup = new Map();
  (getGlossaryTermsMerged() || []).forEach((item) => {
    if (!item || !item.term || !item.desc) return;
    const key = normalizeGlossaryInlineKey(item.term);
    if (!key || lookup.has(key)) return;
    lookup.set(key, {
      term: normalizeDisplayText(item.term),
      desc: normalizeDisplayText(item.desc),
    });
  });
  return lookup;
}

function openGlossaryTermDetailModal(termText) {
  const key = normalizeGlossaryInlineKey(termText);
  if (!key) return;
  const lookup = buildGlossaryInlineLookup();
  const item = lookup.get(key);
  if (!item) {
    toast('用語が見つかりませんでした', 'error');
    return;
  }

  const modal = document.getElementById('glossaryInlineModal');
  const title = document.getElementById('glossaryInlineTitle');
  const desc = document.getElementById('glossaryInlineDesc');
  if (!modal || !title || !desc) return;

  title.textContent = item.term;
  desc.textContent = item.desc;
  modal.classList.add('open');
}

function closeGlossaryTermDetailModal() {
  const modal = document.getElementById('glossaryInlineModal');
  if (modal) modal.classList.remove('open');
}

function openArticleImageModal(src, alt = '') {
  const modal = document.getElementById('articleImageModal');
  const image = document.getElementById('articleImageModalImg');
  if (!modal || !image || !src) return;
  image.src = src;
  image.alt = alt || '記事画像';
  modal.classList.add('open');
}

function closeArticleImageModal() {
  const modal = document.getElementById('articleImageModal');
  const image = document.getElementById('articleImageModalImg');
  if (modal) modal.classList.remove('open');
  if (image) {
    image.src = '';
    image.alt = '記事画像';
  }
}

function ensureArticleBodyGlossaryBinding() {
  const body = document.getElementById('articleBody');
  if (!body) return;

  body.querySelectorAll('img').forEach((img) => {
    const src = String(img.getAttribute('src') || '').trim();
    if (!src) return;
    img.classList.add('article-zoomable-image');
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');
    if (!img.getAttribute('aria-label')) img.setAttribute('aria-label', '画像を拡大表示');
  });

  if (body.dataset.glossaryBound === '1') return;

  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (supportsHover) {
    // PC: ホバーでツールチップ表示
    const tooltip = document.getElementById('glossaryTooltip');
    const tooltipTerm = document.getElementById('glossaryTooltipTerm');
    const tooltipDesc = document.getElementById('glossaryTooltipDesc');
    body.addEventListener('mouseover', (event) => {
      const trigger = event.target && event.target.closest
        ? event.target.closest('.glossary-inline-term')
        : null;
      if (!trigger || !tooltip) return;
      const key = normalizeGlossaryInlineKey(trigger.getAttribute('data-term') || trigger.textContent || '');
      const lookup = buildGlossaryInlineLookup();
      const item = lookup.get(key);
      if (!item) return;
      if (tooltipTerm) tooltipTerm.textContent = item.term;
      if (tooltipDesc) tooltipDesc.textContent = item.desc;
      const rect = trigger.getBoundingClientRect();
      const left = Math.min(Math.max(8, rect.left), window.innerWidth - 340);
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${rect.bottom + 8}px`;
      tooltip.classList.add('visible');
      tooltip.setAttribute('aria-hidden', 'false');
    });
    body.addEventListener('mouseout', (event) => {
      const trigger = event.target && event.target.closest
        ? event.target.closest('.glossary-inline-term')
        : null;
      if (!trigger || !tooltip) return;
      tooltip.classList.remove('visible');
      tooltip.setAttribute('aria-hidden', 'true');
    });
  } else {
    // モバイル: クリックでモーダル表示
    body.addEventListener('click', (event) => {
      const trigger = event.target && event.target.closest
        ? event.target.closest('.glossary-inline-term')
        : null;
      if (!trigger) return;
      event.preventDefault();
      event.stopPropagation();
      openGlossaryTermDetailModal(trigger.getAttribute('data-term') || trigger.textContent || '');
    });
  }

  body.addEventListener('click', (event) => {
    const image = event.target && event.target.closest
      ? event.target.closest('.article-zoomable-image')
      : null;
    if (!image) return;
    if (image.closest('a')) return;
    event.preventDefault();
    event.stopPropagation();
    openArticleImageModal(image.getAttribute('src') || '', image.getAttribute('alt') || '');
  });

  body.addEventListener('keydown', (event) => {
    const image = event.target && event.target.closest
      ? event.target.closest('.article-zoomable-image')
      : null;
    if (!image) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openArticleImageModal(image.getAttribute('src') || '', image.getAttribute('alt') || '');
  });
  body.dataset.glossaryBound = '1';
}

function injectGlossaryInlineTerms(rawHtml) {
  if (!rawHtml) return '';
  const sourceTerms = (getGlossaryTermsMerged() || [])
    .map((item) => normalizeDisplayText(item && item.term ? item.term : '').trim())
    .filter((term) => term.length >= 2);
  const uniqueTerms = [...new Set(sourceTerms)]
    .sort((a, b) => b.length - a.length);
  if (!uniqueTerms.length) return rawHtml;

  const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const terms = uniqueTerms.map((term) => {
    const compact = String(term).replace(/\s+/g, '');
    const asciiToken = /^[A-Za-z0-9][A-Za-z0-9+/_\.-]*$/.test(compact);
    const slashVariant = term.includes('/')
      ? term.split('/').map((part) => escapeRegExp(part.trim())).join('\\s*\\/\\s*')
      : escapeRegExp(term);
    const pattern = asciiToken
      ? new RegExp(`(?<![A-Za-z0-9])${slashVariant}(?![A-Za-z0-9])`, 'gi')
      : new RegExp(slashVariant, 'g');
    return { term, pattern };
  });

  const collectMatches = (text) => {
    const found = [];
    terms.forEach(({ term, pattern }) => {
      pattern.lastIndex = 0;
      let m = pattern.exec(text);
      while (m) {
        const idx = Number(m.index || 0);
        const raw = String(m[0] || '');
        if (raw) {
          found.push({ index: idx, length: raw.length, raw, term });
        }
        if (m[0] === '') {
          pattern.lastIndex += 1;
        }
        m = pattern.exec(text);
      }
    });

    if (!found.length) return [];

    found.sort((a, b) => {
      if (a.index !== b.index) return a.index - b.index;
      if (a.length !== b.length) return b.length - a.length;
      return 0;
    });

    const selected = [];
    let cursor = -1;
    found.forEach((m) => {
      if (m.index < cursor) return;
      selected.push(m);
      cursor = m.index + m.length;
    });
    return selected;
  };

  const template = document.createElement('template');
  template.innerHTML = rawHtml;

  const blockedTags = new Set([
    'A', 'BUTTON', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION',
    'SCRIPT', 'STYLE', 'CODE', 'PRE',
  ]);

  const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT);
  const targets = [];
  let node = walker.nextNode();
  while (node) {
    const parent = node.parentElement;
    const text = node.nodeValue || '';
    if (
      parent
      && !blockedTags.has(parent.tagName)
      && !parent.closest('.glossary-inline-term')
      && text.trim()
    ) {
      if (collectMatches(text).length) {
        targets.push(node);
      }
    }
    node = walker.nextNode();
  }

  targets.forEach((textNode) => {
    const text = textNode.nodeValue || '';
    const matches = collectMatches(text);
    if (!matches.length) return;
    const frag = document.createDocumentFragment();
    let cursor = 0;

    matches.forEach((match) => {
      const index = Number(match.index || 0);
      const term = String(match.raw || '');
      if (!term) return;
      if (index > cursor) {
        frag.appendChild(document.createTextNode(text.slice(cursor, index)));
      }

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'glossary-inline-term';
      btn.setAttribute('data-term', term);
      btn.setAttribute('aria-label', `用語集を開く: ${term}`);
      btn.textContent = term;
      frag.appendChild(btn);
      cursor = index + term.length;
    });

    if (cursor < text.length) {
      frag.appendChild(document.createTextNode(text.slice(cursor)));
    }
    textNode.parentNode.replaceChild(frag, textNode);
  });

  return template.innerHTML;
}

async function loadJson(path) {
  const bust = `v=${encodeURIComponent(CONTENT_ASSET_VERSION)}`;
  const url = String(path).includes('?') ? `${path}&${bust}` : `${path}?${bust}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load: ${path}`);
  return res.json();
}

async function loadArticleIndexFromServer(limit = 500) {
  if (!COMMENTS_SERVER_ENABLED) return null;
  const n = Math.max(1, Math.min(5000, Number(limit) || 500));
  const data = await fetchCommentsApi(`?action=article_index&limit=${encodeURIComponent(String(n))}`);
  if (!data || !data.ok || !Array.isArray(data.articles)) return null;
  return data.articles;
}

async function loadStaticArticleFromServer(articleId) {
  if (!COMMENTS_SERVER_ENABLED || !articleId) return null;
  const data = await fetchCommentsApi(`?action=article_static_get&article_id=${encodeURIComponent(String(articleId))}`);
  if (!data || typeof data !== 'object') {
    throw new Error('failed to load static article');
  }
  if (data.ok !== true) {
    throw new Error(String(data.error || 'failed to load static article'));
  }
  if (!data.article || typeof data.article !== 'object') return null;
  return data.article;
}


function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggle');
  const menuIcon = document.getElementById('themeToggleMenu');
  const logo = document.getElementById('brandLogo');
  const icon = theme === 'light' ? '☀︎' : '☾';
  if (btn) btn.textContent = icon;
  if (menuIcon) menuIcon.textContent = icon;
  if (logo) logo.src = theme === 'dark' ? './img/logo-dictionaryapp-dark.svg' : './img/logo-dictionaryapp-light.svg';
}

function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  const fallback = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = saved || fallback;
  applyTheme(theme);
}

function toggleTheme() {
  const current = document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  localStorage.setItem(STORAGE_KEYS.theme, next);
  applyTheme(next);
}

function safeRun(label, fn) {
  try {
    return fn();
  } catch (err) {
    console.error(`[render:${label}]`, err);
    return null;
  }
}


async function init() {
  initTheme();
  applyDictKunRingQueryFlags();
  syncDictKunFabRingState();
  let initStep = 'boot';

  try {
    initStep = 'load-content';
    const isFileProtocol = window.location.protocol === 'file:';
    const embedded = window.DIR_DATA;
    const hydrateEmbeddedArticles = (embeddedData) => {
      if (!embeddedData || !embeddedData.articles || typeof embeddedData.articles !== 'object') return;
      Object.keys(embeddedData.articles).forEach((id) => {
        if (!id || state.articleMap.has(id)) return;
        state.articleMap.set(id, embeddedData.articles[id]);
      });
    };
    hydrateEmbeddedArticles(embedded);

    if (isFileProtocol && embedded) {
      state.useEmbeddedData = true;
      state.categories = embedded.categories || [];
      state.recentArticles = embedded.articleIndex || [];
      state.articleIndex = embedded.articleIndex || [];
      state.curriculumByLevel = {};

      if (embedded.articles) {
        Object.keys(embedded.articles).forEach((id) => {
          state.articleMap.set(id, embedded.articles[id]);
        });
      }
    } else {
      try {
        const articleIndexPromise = COMMENTS_SERVER_ENABLED
          ? loadArticleIndexFromServer(500).then((rows) => rows || loadJson('./data/articles/index.json'))
          : loadJson('./data/articles/index.json');

        const [categories, articleIndex] = await Promise.all([
          loadJson('./data/categories.json'),
          articleIndexPromise,
        ]);

        state.categories = Array.isArray(categories) ? categories : [];
        state.recentArticles = Array.isArray(articleIndex) ? articleIndex : [];
        state.articleIndex = Array.isArray(articleIndex) ? articleIndex : [];
        state.curriculumByLevel = {};
        hydrateEmbeddedArticles(embedded);
      } catch (loadErr) {
        const embeddedFallback = window.DIR_DATA;
        if (embeddedFallback) {
          state.useEmbeddedData = true;
          state.categories = Array.isArray(embeddedFallback.categories) ? embeddedFallback.categories : [];
          state.recentArticles = Array.isArray(embeddedFallback.articleIndex) ? embeddedFallback.articleIndex : [];
          state.articleIndex = Array.isArray(embeddedFallback.articleIndex) ? embeddedFallback.articleIndex : [];
          state.curriculumByLevel = {};
          if (embeddedFallback.articles) {
            Object.keys(embeddedFallback.articles).forEach((id) => {
              state.articleMap.set(id, embeddedFallback.articles[id]);
            });
          }
        } else {
          throw loadErr;
        }
      }
    }

    syncArticleIdMap();

    initStep = 'apply-overrides';
    if (!COMMENTS_SERVER_ENABLED) applyCachedArticleOverrides();

    initStep = 'render-core';
    safeRun('cat-list', () => renderCatList());
    safeRun('category-top-nav', () => renderCategoryTopNavigations());
    safeRun('home-curriculum-tracks', () => renderHomeCurriculumTracks());
    safeRun('home-updates', () => renderHomeUpdates());
    safeRun('recent-list', () => renderRecentList());
    safeRun('editors', () => renderEditorsView());
    renderNoteFeed().catch((err) => console.error('[render:note-feed]', err));

    if (COMMENTS_SERVER_ENABLED) {
      state.glossaryBaseOverrides = {};
      state.glossaryBaseDeleted = new Set();
      await syncServerStateToUi({
        articles: true,
        analytics: true,
        comments: true,
        glossary: true,
        requests: true,
        commentsLimit: 30,
        requestsLimit: 120,
        glossaryLimit: 300,
        render: true,
        currentArticleComments: false,
      }).catch(() => false);
    } else {
      safeRun('stats', () => renderStats());
      safeRun('glossary', () => {
        renderGlossary();
        renderCurrentGlossaryView();
      });
      renderLatestComments();
    }

    syncCommentNotifyBaseline();
    startCommentNotificationWatcher();
    initStep = 'bind-ui';
    applyLevelSelection();
    bindCommentComposerEvents();
    bindModalEscapeHandler();
    enableModifierOpenInNewTab();
    syncRequestPostButton();
    syncEditorManageButton();
    syncHeaderAdminMenu();
    document.addEventListener('click', (event) => {
      const wrap = document.getElementById('headerAdminMenu');
      if (!wrap || !wrap.classList.contains('is-open')) return;
      if (wrap.contains(event.target)) return;
      closeHeaderAdminMenu();
    });
    await tryRestoreAdminSession();

    initStep = 'route';
    const initial = parseRoute();
    await applyRouteState(initial, { sync: true, replace: true });
    const mainEl = document.querySelector('.main');
    if (mainEl) mainEl.addEventListener('scroll', syncHeaderCompactState, { passive: true });
    window.addEventListener('scroll', syncHeaderCompactState, { passive: true });
    syncHeaderCompactState();
  } catch (e) {
    const msg = e && e.message ? e.message : String(e);
    window.__BOOT_DIAG__ = {
      step: initStep,
      message: msg,
      href: window.location.href,
      protocol: window.location.protocol,
      hasEmbeddedData: !!window.DIR_DATA,
      ts: new Date().toISOString(),
    };
    console.error('[init failed]', window.__BOOT_DIAG__, e);
    toast(`データの読み込みに失敗しました（${initStep}）`, 'error');
  }
}

function setHomeRequestCount(count) {
  const homeRequest = document.getElementById('homeRequestTotal');
  if (homeRequest) homeRequest.textContent = formatNumberWithComma(count);
}

function renderStats() {
  const total = (state.articleIndex || []).length;
  const displayTotal = Math.max(total, 120);

  const articleCountEl = document.getElementById('articleCount');
  if (articleCountEl) articleCountEl.textContent = formatNumberWithComma(displayTotal);

  const glossaryCountEl = document.getElementById('glossaryCount');
  const mergedGlossaryCount = getGlossaryTermsMerged().length;
  const baseGlossaryCount = Array.isArray(GLOSSARY_TERMS) ? GLOSSARY_TERMS.length : 0;
  const glossaryCount = Math.max(mergedGlossaryCount, baseGlossaryCount);
  if (glossaryCountEl) glossaryCountEl.textContent = formatNumberWithComma(glossaryCount);

  const localCommentTotal = Object.values(state.commentsByArticle || {})
    .reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
  const localRequestTotal = state.featureRequestsLoaded
    ? (state.featureRequests || []).length
    : getFeatureRequestsLocal().length;

  const pvServer = Number(state.analyticsSummary && state.analyticsSummary.pv_total);
  const uuServer = Number(state.analyticsSummary && state.analyticsSummary.uu_total);
  const commentServer = Number(state.analyticsSummary && state.analyticsSummary.comment_total);
  const requestServer = Number(state.analyticsSummary && state.analyticsSummary.request_total);

  const pvTotal = (COMMENTS_SERVER_ENABLED && Number.isFinite(pvServer) && pvServer >= 0) ? pvServer : 0;
  const uuTotal = (COMMENTS_SERVER_ENABLED && Number.isFinite(uuServer) && uuServer >= 0) ? uuServer : 0;
  const commentTotal = (COMMENTS_SERVER_ENABLED && Number.isFinite(commentServer) && commentServer >= 0) ? commentServer : localCommentTotal;
  const requestCount = (COMMENTS_SERVER_ENABLED && Number.isFinite(requestServer) && requestServer >= 0) ? requestServer : localRequestTotal;

  const homeComment = document.getElementById('homeCommentTotal');
  if (homeComment) homeComment.textContent = formatNumberWithComma(commentTotal);
  setHomeRequestCount(requestCount);

  const homePv = document.getElementById('homePvToday');
  const homeUu = document.getElementById('homeUuToday');
  if (homePv) homePv.textContent = formatNumberWithComma(pvTotal);
  if (homeUu) homeUu.textContent = formatNumberWithComma(uuTotal);
}

function renderCatList() {
  const list = document.getElementById('catList');
  const inlineList = document.getElementById('homeInlineCatList');
  const isMobile = window.innerWidth <= 768;
  const html = state.categories.map((cat) => {
    const visibleItems = (cat.items || []).filter((item) => {
      const id = item.id || state.articleIdByTitle.get(item.title) || '';
      return id ? !isArticleDeleted(id) : true;
    });
    const catIdEsc = escapeForSingleQuote(cat.id || '');
    const catItemsId = `cat-items-${String(cat.id || '').replace(/[^a-zA-Z0-9_-]/g, '-')}`;
    return `
      <div class="cat-section">
        <div class="cat-header ${state.currentCategoryId === cat.id && state.currentView === 'category' ? 'active' : ''} ${isMobile ? 'open' : ''}" role="button" tabindex="0" aria-expanded="${isMobile ? 'true' : 'false'}" aria-controls="${catItemsId}" onclick="showCategory('${catIdEsc}')" onkeydown="handleCatHeaderKeydown(event, '${catIdEsc}')" data-cat="${escapeHtml(cat.id || '')}">
          <span class="cat-icon">${cat.icon}</span>
          <span class="cat-name">${normalizeDisplayText(cat.name)}</span>
          <span class="cat-count">${formatNumberWithComma(visibleItems.length)}</span>
          <button class="cat-arrow" type="button" aria-label="カテゴリの項目を開閉" onclick="toggleCat(event, this)"><span aria-hidden="true">›</span></button>
        </div>
        <div class="cat-items ${isMobile ? 'open' : ''}" id="${catItemsId}">
          ${visibleItems.map((item) => `
            <div class="cat-item" onclick="openArticleByTitle('${escapeForSingleQuote(item.title || '')}', '${escapeForSingleQuote(item.id || '')}')">${normalizeDisplayText(item.title)}</div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
  if (list) list.innerHTML = html;
  if (inlineList) inlineList.innerHTML = html;
  renderMobileCategoryGrid();
  renderMenuTagCloud();
}

function renderMenuTagCloud() {
  const root = document.getElementById('menuTagCloud');
  if (!root) return;
  root.style.display = 'none';

  const counts = new Map();
  (state.articleIndex || []).forEach((a) => {
    if (isArticleDeleted(a.id)) return;
    (a.tags || []).forEach((t) => {
      const key = normalizeHashtagKey(tagLabel(t));
      if (!key) return;
      if (!FEATURE_VIBE_TOOLING_ENABLED && DISABLED_HASHTAG_KEYS.has(key)) return;
      counts.set(key, (counts.get(key) || 0) + 1);
    });
  });

  const top = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([k, n]) => ({ key: k, count: n }));

  if (!top.length) {
    root.innerHTML = '';
    return;
  }

  root.style.display = 'flex';

  root.innerHTML = top.map((x) => {
    const esc = escapeForSingleQuote(x.key);
    const safe = escapeHtml(x.key);
    return '<button class="menu-tag-chip" type="button" onclick="applyHashtagFilter(\'' + esc + '\'); closeMobileSidebar();">#' + safe + ' (' + x.count + ')</button>';
  }).join('');
}

function renderMobileCategoryGrid() {
  const root = document.getElementById('mobileCategoryGrid');
  if (!root) return;

  root.innerHTML = (state.categories || []).map((cat) => {
    const visibleItems = (cat.items || []).filter((item) => {
      const id = item.id || state.articleIdByTitle.get(item.title) || '';
      return id ? !isArticleDeleted(id) : true;
    });

    return `
      <button class="mobile-cat-btn" type="button" onclick="openMobileCategoryFromGrid('${cat.id}')">
        <span class="mobile-cat-name"><span>${cat.icon}</span><span>${normalizeDisplayText(cat.name)}</span></span>
        <span class="mobile-cat-count">${formatNumberWithComma(visibleItems.length)}</span>
      </button>
    `;
  }).join('');
}

function openMobileCategoryFromGrid(categoryId) {
  closeMobileSidebar();
  showCategory(categoryId);
}

function categoryBadgeClass(catName) {
  const c = normalizeDisplayText(catName || '');
  if (c.includes('企画・プロデュース')) return 'cat-planning';
  if (c.includes('情報設計・仕様設計')) return 'cat-ia';
  if (c.includes('制作・開発ディレクション')) return 'cat-production';
  if (c.includes('ディレクター失敗談')) return 'cat-failure';
  if (c.includes('サービス運営・運用')) return 'cat-operation';
  if (c.includes('プロモーション')) return 'cat-promotion';
  if (c.includes('ライティング')) return 'cat-writing';
  if (c.includes('ツール・効率化')) return 'cat-tools';
  if (c.includes('採用')) return 'cat-recruit';
  return 'cat-default';
}

const CATEGORY_THEME_CLASSES = [
  'cat-planning',
  'cat-ia',
  'cat-production',
  'cat-failure',
  'cat-operation',
  'cat-promotion',
  'cat-writing',
  'cat-tools',
  'cat-recruit',
  'cat-default',
];

const CATEGORY_PHASE_META = {
  planning: {
    phases: ['企画', '要件定義'],
    phaseKeys: ['planning', 'requirements'],
    note: '上流の方向性設計を担うフェーズです。',
  },
  ia: {
    phases: ['要件定義', '設計'],
    phaseKeys: ['requirements', 'design'],
    note: '情報構造と仕様を固めるフェーズです。',
  },
  production: {
    phases: ['進捗管理', '実装', 'テスト'],
    phaseKeys: ['progress', 'implementation', 'testing'],
    note: '制作・開発を前に進める実行フェーズです。',
  },
  failure: {
    phases: ['全フェーズ横断'],
    phaseKeys: ['all'],
    note: '失敗パターンを横断的に学び、再発防止に活かすカテゴリです。',
  },
  operation: {
    phases: ['運用', '改善'],
    phaseKeys: ['operations', 'growth'],
    note: 'リリース後に成果を伸ばす運用フェーズです。',
  },
  promotion: {
    phases: ['運用', 'グロース'],
    phaseKeys: ['operations', 'growth'],
    note: '集客・改善を回し続けるフェーズです。',
  },
  writing: {
    phases: ['設計', '実装', '運用'],
    phaseKeys: ['design', 'implementation', 'operations'],
    note: '情報設計から改善まで文章で品質を支えるカテゴリです。',
  },
  tools: {
    phases: ['全工程'],
    phaseKeys: ['all'],
    note: '企画から運用まで、全工程を支える実践ツール群です。',
  },
  recruit: {
    phases: ['体制構築'],
    phaseKeys: ['all'],
    note: 'プロジェクト運営を支える人材設計・採用フェーズです。',
  },
  default: {
    phases: ['全体'],
    phaseKeys: ['all'],
    note: 'ディレクション業務全体に関わるカテゴリです。',
  },
};

function categoryPhaseMeta(catName) {
  const key = categoryBadgeClass(catName || '');
  if (key === 'cat-planning') return CATEGORY_PHASE_META.planning;
  if (key === 'cat-ia') return CATEGORY_PHASE_META.ia;
  if (key === 'cat-production') return CATEGORY_PHASE_META.production;
  if (key === 'cat-failure') return CATEGORY_PHASE_META.failure;
  if (key === 'cat-operation') return CATEGORY_PHASE_META.operation;
  if (key === 'cat-promotion') return CATEGORY_PHASE_META.promotion;
  if (key === 'cat-writing') return CATEGORY_PHASE_META.writing;
  if (key === 'cat-tools') return CATEGORY_PHASE_META.tools;
  if (key === 'cat-recruit') return CATEGORY_PHASE_META.recruit;
  return CATEGORY_PHASE_META.default;
}

function renderCategoryPhaseGuide(catName, options = {}) {
  const { hideDiagram = false } = options;
  const block = document.getElementById('categoryPhaseBlock');
  const chips = document.getElementById('categoryPhaseChips');
  const note = document.getElementById('categoryPhaseNote');
  const diagram = document.getElementById('categoryPhaseDiagram');
  if (!block || !chips || !note || !diagram) return;

  const meta = categoryPhaseMeta(catName);
  chips.innerHTML = (meta.phases || []).map((p) => `<span class="category-phase-chip">${escapeHtml(p)}</span>`).join('');
  note.textContent = meta.note || '';
  const activeKeys = new Set(meta.phaseKeys || []);
  diagram.querySelectorAll('[data-phase-key]').forEach((el) => {
    const key = String(el.getAttribute('data-phase-key') || '').trim();
    const active = activeKeys.has('all') || (key && activeKeys.has(key));
    el.classList.toggle('is-active', active);
  });
  diagram.style.display = hideDiagram ? 'none' : '';
  block.style.display = 'block';
}

function categoryDescription(cat) {
  if (!cat) return '';
  if (cat.isCurriculumTrack) return String(cat.description || '').trim();
  if (String(cat.id || '') === 'failure_cases') {
    return '失敗から学ぼう。ディレクターの一次情報として、現場で起きた失敗と再発防止策をアーカイブしています。';
  }
  if (String(cat.id || '') === 'tools') {
    return 'AI制作・開発ツールの使い分け';
  }
  return `${normalizeDisplayText(cat.name || '')} に関する項目をカテゴリ単位でまとめて確認できます。`;
}

function getVisibleCurriculumTracks() {
  return (RECOMMENDED_CURRICULUM_CATEGORIES || []).filter((track) => {
    if (!track || !track.id) return false;
    if (!FEATURE_VIBE_TOOLING_ENABLED && track.id === 'track_vibe_coding') return false;
    return true;
  });
}

function normalizeCategoryGroupFilter(value) {
  const key = normalizeDisplayText(value).toLocaleLowerCase('en-US');
  if (key === 'appendix') return 'appendix';
  return 'dictionary';
}

function categoryGroupLabelByKey(groupKey) {
  return normalizeCategoryGroupFilter(groupKey) === 'appendix' ? 'Appendix' : 'ノート';
}

function categoryGroupTopViewByKey(groupKey) {
  return normalizeCategoryGroupFilter(groupKey) === 'appendix' ? 'appendix' : 'dictionary';
}

function categoryGroupKeyByCategory(category) {
  if (!category || typeof category !== 'object') return 'dictionary';
  const id = String(category.id || '').trim();
  if (APPENDIX_CATEGORY_IDS.has(id)) return 'appendix';
  const name = normalizeDisplayText(category.name || '');
  if (name.includes('ツール') || name.includes('採用') || name.includes('失敗談')) return 'appendix';
  return 'dictionary';
}

function categoryGroupKeyByCategoryId(categoryId) {
  const found = (state.categories || []).find((c) => c && c.id === categoryId);
  return categoryGroupKeyByCategory(found);
}

function getFilteredCategoriesByGroup(groupKey) {
  const safeGroup = normalizeCategoryGroupFilter(groupKey);
  return (state.categories || []).filter((c) => c && c.id && categoryGroupKeyByCategory(c) === safeGroup);
}

function setCategoryGroup(nextGroupKey) {
  const next = normalizeCategoryGroupFilter(nextGroupKey);
  state.categoryGroupFilter = next;
  renderCategoryTopNavigations();

  if (state.currentView === 'category' && state.currentCategoryId) renderCategoryView(state.currentCategoryId);
  if (state.currentView === 'glossary') renderCurrentGlossaryView();
}

function showCategoryGroupTopView(groupKey, options = {}) {
  const { skipHistory = false, replaceHistory = false } = options;
  const normalizedGroup = normalizeCategoryGroupFilter(groupKey);
  const view = categoryGroupTopViewByKey(normalizedGroup);
  setCategoryGroup(normalizedGroup);
  showView(view, { skipHistory: true });
  if (!skipHistory) syncHistory(view, null, replaceHistory);
}

function showDictionaryTopView(options = {}) {
  showCategoryGroupTopView('dictionary', options);
}

function showAppendixTopView(options = {}) {
  showCategoryGroupTopView('appendix', options);
}

function getCurriculumCategoryById(categoryId) {
  const track = getVisibleCurriculumTracks().find((x) => x && x.id === categoryId);
  if (track) return { ...track, isCurriculumTrack: true };
  return (state.categories || []).find((c) => c && c.id === categoryId) || null;
}

function renderHomeCurriculumTracks() {
  const root = document.getElementById('homeTrackGrid');
  if (!root) return;
  const tracks = getVisibleCurriculumTracks();
  root.classList.toggle('is-scroll-mode', tracks.length >= 5);
  root.innerHTML = tracks.map((track) => `
    <button class="feature-card home-track-card" type="button" onclick="openCurriculumTrack('${track.id}')">
      <span class="feature-icon">${track.icon}</span>
      <span class="feature-title">${escapeHtml(normalizeDisplayText(track.name))}</span>
      <span class="feature-desc">${escapeHtml(normalizeDisplayText(track.description))}</span>
    </button>
  `).join('');
}

function renderCategoryBadge(catName) {
  const safeText = escapeHtml(normalizeDisplayText(catName || ''));
  const cls = categoryBadgeClass(catName);
  return `<span class="article-cat-badge ${cls}">${safeText}</span>`;
}

function renderAppendixGlossaryChip(active = false) {
  if (active) return '<button class="filter-chip cat-glossary active" type="button" disabled>用語集</button>';
  return '<button class="filter-chip cat-glossary" type="button" onclick="setCategoryGroup(\'appendix\'); showGlossaryView()">用語集</button>';
}

function renderSectionPanel({ title = '', panelClass = '', bodyHtml = '', ariaLabel = '' } = {}) {
  const panelClasses = ['ui-section-panel', panelClass].filter(Boolean).join(' ');
  const normalizedTitle = normalizeDisplayText(title || '');
  const normalizedAria = normalizeDisplayText(ariaLabel || normalizedTitle || 'セクション');
  const panelHead = normalizedTitle ? `
      <div class="ui-section-panel-head">
        <div class="ui-section-panel-title">${escapeHtml(normalizedTitle)}</div>
      </div>
  ` : '';
  return `
    <section class="${panelClasses}" aria-label="${escapeHtml(normalizedAria)}">
      ${panelHead}
      ${bodyHtml}
    </section>
  `;
}

const HOME_CATEGORY_PRIMARY_SPECS = [
  { label: '企画・プロデュース', aliases: ['企画・プロデュース'] },
  { label: '情報設計・仕様設計', aliases: ['情報設計・仕様設計', '情報設計', '仕様設計'] },
  { label: '制作・開発ディレクション', aliases: ['制作・開発ディレクション', '制作・開発'] },
  { label: 'サービス運営・運用', aliases: ['サービス運営・運用', 'サービス運用'] },
  { label: 'プロモーション', aliases: ['プロモーション'] },
  { label: 'ライティング', aliases: ['ライティング'] },
];

const HOME_CATEGORY_AUX_SPECS = [
  { label: '用語集', type: 'glossary' },
  { label: 'ツール・効率化', aliases: ['ツール・効率化', 'ツール'] },
  { label: 'ディレクター採用', aliases: ['ディレクター採用', '採用'] },
  { label: 'ディレクター失敗談', ids: ['failure_cases'], aliases: ['ディレクター失敗談', '失敗談'] },
];

function findCategoryByQuickSpec(spec) {
  const categories = state.categories || [];
  const ids = new Set((spec.ids || []).map((id) => String(id || '').trim()).filter(Boolean));
  const aliases = (spec.aliases || [spec.label || ''])
    .map((v) => normalizeDisplayText(v))
    .filter(Boolean);

  if (ids.size) {
    const hitById = categories.find((cat) => cat && ids.has(String(cat.id || '').trim()));
    if (hitById) return hitById;
  }

  for (const alias of aliases) {
    const exact = categories.find((cat) => normalizeDisplayText(cat && cat.name) === alias);
    if (exact) return exact;
  }

  for (const alias of aliases) {
    const partial = categories.find((cat) => {
      const name = normalizeDisplayText(cat && cat.name);
      return name && (name.includes(alias) || alias.includes(name));
    });
    if (partial) return partial;
  }
  return null;
}

function renderHomeQuickCategoryChip(spec, { secondary = false } = {}) {
  const label = normalizeDisplayText(spec.label || '');
  const commonClasses = ['filter-chip', 'category-quickmap-chip'];
  if (secondary) commonClasses.push('is-secondary');

  if (spec.type === 'glossary') {
    return `<button class="${commonClasses.join(' ')} cat-glossary" type="button" onclick="setCategoryGroup('appendix'); showGlossaryView()">${escapeHtml(label)}</button>`;
  }

  const category = findCategoryByQuickSpec(spec);
  if (!category || !category.id) {
    return `<button class="${commonClasses.join(' ')} is-missing" type="button" disabled>${escapeHtml(label)}</button>`;
  }

  const categoryName = normalizeDisplayText(category.name || label);
  const catClass = categoryBadgeClass(categoryName);
  return `<button class="${commonClasses.join(' ')} ${catClass}" type="button" onclick="showCategory('${escapeForSingleQuote(category.id)}')">${escapeHtml(label)}</button>`;
}

function renderCategoryJumpGroups(target, options = {}) {
  const root = typeof target === 'string' ? document.getElementById(target) : target;
  if (!root) return;

  const {
    activeCategoryId = '',
    includeGlossaryInAppendix = false,
    glossaryActive = false,
    groupKeys = null,
  } = options;

  const allowedGroupSet = Array.isArray(groupKeys) && groupKeys.length
    ? new Set(groupKeys.map((x) => normalizeCategoryGroupFilter(x)))
    : null;

  const groupOptions = allowedGroupSet
    ? CATEGORY_GROUP_OPTIONS.filter((group) => allowedGroupSet.has(group.key))
    : CATEGORY_GROUP_OPTIONS;

  const sections = groupOptions.map((group) => {
    const cats = getFilteredCategoriesByGroup(group.key);
    const chips = cats.map((c) => {
      const label = normalizeDisplayText(c.name);
      const catClass = categoryBadgeClass(label);
      if (String(c.id) === String(activeCategoryId || '')) {
        return `<button class="filter-chip ${catClass} active" type="button" disabled>${escapeHtml(label)}</button>`;
      }
      return `<button class="filter-chip ${catClass}" type="button" onclick="showCategory('${escapeForSingleQuote(c.id)}')">${escapeHtml(label)}</button>`;
    });

    if (group.key === 'appendix' && includeGlossaryInAppendix) {
      chips.unshift(renderAppendixGlossaryChip(glossaryActive));
    }

    if (!chips.length) {
      chips.push('<span class="filter-chip" aria-disabled="true">カテゴリ準備中</span>');
    }

    const isHomeTop = root.id === 'homeCategoryNavList';
    const groupTitle = isHomeTop
      ? (group.key === 'appendix' ? 'Appendixトップ' : 'ノートトップ')
      : `${normalizeDisplayText(group.label)}カテゴリ`;
    const groupTitleLinkAttrs = isHomeTop
      ? ` data-group-top-link="1" role="button" tabindex="0" onclick="showCategoryGroupTopView('${escapeHtml(group.key)}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();showCategoryGroupTopView('${escapeHtml(group.key)}');}"`
      : '';
    return `
      <section class="category-nav-group" data-group-key="${escapeHtml(group.key)}">
        <div class="category-nav-group-title"${groupTitleLinkAttrs}>
          <span class="category-nav-group-text">${escapeHtml(groupTitle)}</span>
        </div>
        <div class="filter-chip-group category-chip-nav category-nav-group-chips">${chips.join('')}</div>
      </section>
    `;
  });

  const panelAriaLabel = root.id === 'homeCategoryNavList' ? 'カテゴリクイックナビ' : 'カテゴリへジャンプ';

  root.innerHTML = renderSectionPanel({
    title: '',
    ariaLabel: panelAriaLabel,
    panelClass: 'category-jump-panel',
    bodyHtml: `
      <div class="category-jump-panel-grid">
        ${sections.join('')}
      </div>
    `,
  });
}

function renderHomeCategoryNav() {
  const nav = document.getElementById('homeCategoryNavList');
  if (!nav) return;
  const primaryChips = HOME_CATEGORY_PRIMARY_SPECS.map((spec) => renderHomeQuickCategoryChip(spec)).join('');
  const auxChips = HOME_CATEGORY_AUX_SPECS.map((spec) => renderHomeQuickCategoryChip(spec, { secondary: true })).join('');

  nav.innerHTML = renderSectionPanel({
    title: 'カテゴリから探す',
    ariaLabel: 'カテゴリから探す',
    panelClass: 'category-jump-panel category-quickmap-panel',
    bodyHtml: `
      <div class="category-quickmap-subhead">
        <p class="category-quickmap-copy">気になるテーマを押して、関連ノートをまとめて探せます。</p>
        <div class="category-quickmap-badge">
          <span class="category-quickmap-badge-dot" aria-hidden="true"></span>
          10カテゴリ
        </div>
      </div>
      <div class="category-quickmap-block">
        <div class="category-quickmap-row">
          <div class="category-quickmap-label">主カテゴリ</div>
          <div class="filter-chip-group category-quickmap-chips">${primaryChips}</div>
        </div>
        <div class="category-quickmap-row">
          <div class="category-quickmap-label">補助カテゴリ</div>
          <div class="filter-chip-group category-quickmap-chips">${auxChips}</div>
        </div>
      </div>
    `,
  });
}

function renderDictionaryTopCategoryNav() {
  renderCategoryJumpGroups('dictionaryTopCategoryNavList', { groupKeys: ['dictionary'] });
}

function renderAppendixTopCategoryNav() {
  renderCategoryJumpGroups('appendixTopCategoryNavList', {
    groupKeys: ['appendix'],
    includeGlossaryInAppendix: true,
  });
}

function getCategoryTopItemHint(cat) {
  const catId = String(cat && cat.id ? cat.id : '').trim();
  return '';
}

function renderCategoryGroupTopList(target, groupKey, options = {}) {
  const { includeGlossary = false } = options;
  const root = typeof target === 'string' ? document.getElementById(target) : target;
  if (!root) return;
  const categories = getFilteredCategoriesByGroup(groupKey);
  const rows = [];
  if (includeGlossary) {
    rows.push(`
      <div class="article-row glossary-row category-top-row" onclick="setCategoryGroup('appendix'); showGlossaryView()">
        <span class="article-cat-badge cat-tools">用語</span>
        <span class="glossary-row-main">
          <span class="article-title-row">用語集</span>
        </span>
        <span class="article-arrow">›</span>
      </div>
    `);
  }
  rows.push(...categories.map((cat) => {
    const label = normalizeDisplayText(cat.name);
    const catId = escapeForSingleQuote(cat.id);
    const hint = getCategoryTopItemHint(cat);
    return `
      <div class="article-row glossary-row category-top-row" onclick="showCategory('${catId}')">
        ${renderCategoryBadge(label)}
        <span class="glossary-row-main">
          <span class="article-title-row">${escapeHtml(label)}</span>
          ${hint ? `<span class="glossary-row-desc">${escapeHtml(hint)}</span>` : ''}
        </span>
        <span class="article-arrow">›</span>
      </div>
    `;
  }));
  if (!rows.length) {
    root.innerHTML = '<div class="article-row note-row is-placeholder"><span class="article-title-row">カテゴリ準備中です</span></div>';
    return;
  }
  root.innerHTML = rows.join('');
}

function renderCategoryTopNavigations() {
  renderHomeCategoryNav();
  renderDictionaryTopCategoryNav();
  renderAppendixTopCategoryNav();
  renderCategoryGroupTopList('dictionaryTopCategoryList', 'dictionary');
  renderCategoryGroupTopList('appendixTopCategoryList', 'appendix', { includeGlossary: true });
}

function getHomeUpdates() {
  const toDateTs = (raw) => {
    const s = String(raw || '').trim();
    if (!s) return 0;
    const ts = Date.parse(s.replace(/\//g, '-'));
    return Number.isFinite(ts) ? ts : 0;
  };

  const manual = (HOME_UPDATES || []).map((u) => ({
    date: String(u && u.date ? u.date : '').trim(),
    title: normalizeDisplayText(String(u && u.title ? u.title : '').trim()),
    body: normalizeDisplayText(String(u && u.body ? u.body : '').trim()),
    link: String(u && u.link ? u.link : '').trim(),
  })).filter((u) => u.title || u.body);

  return manual
    .map((u, i) => ({ ...u, __ts: toDateTs(u.date), __i: i }))
    .sort((a, b) => {
      if (b.__ts !== a.__ts) return b.__ts - a.__ts;
      return a.__i - b.__i;
    })
    .slice(0, HOME_UPDATE_LIMIT)
    .map(({ __ts, __i, ...u }) => u);
}

function buildHomeUpdateLine(item) {
  const title = normalizeDisplayText(String(item && item.title ? item.title : '').trim());
  const body = normalizeDisplayText(String(item && item.body ? item.body : '').trim());
  if (title && body) return `${title}：${body}`;
  return title || body || 'アップデート';
}

let bodyScrollLockDepth = 0;
let bodyScrollLockY = 0;

function lockBodyScroll() {
  if (bodyScrollLockDepth === 0) {
    bodyScrollLockY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${bodyScrollLockY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }
  bodyScrollLockDepth += 1;
}

function unlockBodyScroll() {
  if (bodyScrollLockDepth <= 0) return;
  bodyScrollLockDepth -= 1;
  if (bodyScrollLockDepth === 0) {
    const y = Math.abs(parseInt(document.body.style.top || '0', 10)) || bodyScrollLockY || 0;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, y);
  }
}

function openHomeUpdateDetail(index) {
  if (window.innerWidth >= 901) return;
  const updates = getHomeUpdates();
  const safeIndex = Number(index);
  const item = updates[safeIndex];
  if (!item) return;
  const modal = document.getElementById('homeUpdateDetailModal');
  const dateEl = document.getElementById('homeUpdateDetailDate');
  const bodyEl = document.getElementById('homeUpdateDetailBody');
  const shareBtn = document.getElementById('homeUpdateDetailShareBtn');
  if (!modal || !dateEl || !bodyEl) return;
  dateEl.textContent = String(item.date || '').trim() || formatPostDateTime(new Date().toISOString()).slice(0, 10);
  bodyEl.textContent = buildHomeUpdateLine(item);
  if (shareBtn) {
    shareBtn.onclick = () => postSingleHomeUpdateOnX(safeIndex);
  }
  const willOpen = !modal.classList.contains('open');
  if (willOpen) lockBodyScroll();
  modal.classList.add('open');
}

function closeHomeUpdateDetail() {
  const modal = document.getElementById('homeUpdateDetailModal');
  const shareBtn = document.getElementById('homeUpdateDetailShareBtn');
  if (!modal) return;
  if (shareBtn) {
    shareBtn.onclick = null;
  }
  if (modal.classList.contains('open')) {
    unlockBodyScroll();
  }
  modal.classList.remove('open');
}

function renderHomeUpdates() {
  const list = document.getElementById('homeUpdateList');
  if (!list) return;
  const canOpenDetail = window.innerWidth < 901;

  const updates = getHomeUpdates();
  if (!updates.length) {
    list.innerHTML = '<div class="article-row note-row is-placeholder"><span class="article-title-row">更新情報は準備中です</span></div>';
    return;
  }

  const rows = updates.map((u, idx) => {
    const date = escapeHtml(String(u.date || '').trim() || formatPostDateTime(new Date().toISOString()));
    const line = escapeHtml(buildHomeUpdateLine(u));
    const lineHtml = `<span class="home-update-marquee"><span class="home-update-link">${line}</span></span>`;
    const rowClass = canOpenDetail ? 'recent-row home-update-item' : 'recent-row home-update-item no-cursor';
    return renderUnifiedListRow({
      rowClasses: rowClass,
      onClick: canOpenDetail ? `openHomeUpdateDetail(${idx})` : '',
      badgeHtml: '<span class="article-cat-badge home-update-dot-badge">更新</span>',
      titleHtml: lineHtml,
      metaHtml: `<span class="note-meta list-row-meta">${date}</span>`,
    });
  }).join('');

  list.innerHTML = `<div class="home-update-list">${rows}</div>`;
}

function postHomeUpdatesOnX() {
  const updates = getHomeUpdates();
  if (!updates.length) {
    toast('ポストできる更新情報がありません', 'error');
    return;
  }

  const lines = updates.map((u) => {
    const line = buildHomeUpdateLine(u);
    return line ? `・${line}` : '';
  }).filter(Boolean);

  const text = [
    '【最近の機能アップデート】ディレクションノートβ',
    ...lines.slice(0, HOME_UPDATE_LIMIT),
    '',
    '#ディレクションノートβ #Webディレクション',
  ].join('\n');

  const intent = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(PUBLIC_BASE_URL)}`;
  openXIntent(intent, 720, 760);
}

function postSingleHomeUpdateOnX(index) {
  const updates = getHomeUpdates();
  const item = updates[Number(index)];
  if (!item) {
    toast('ポスト対象の更新情報が見つかりません', 'error');
    return;
  }

  const line = buildHomeUpdateLine(item);
  const text = [
    `【最近の機能アップデート】ディレクションノートβ`,
    `● ${line}`,
    '',
    '#ディレクションノートβ #Webディレクション',
  ].filter(Boolean).join('\n');

  const targetUrl = sanitizeUrl(String(item.link || '').trim()) || PUBLIC_BASE_URL;
  const intent = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(targetUrl)}`;
  openXIntent(intent, 720, 760);
}

function openXIntent(intentUrl, width = 720, height = 760) {
  if (!intentUrl) return;
  safeWindowOpen(intentUrl, '_blank', `noopener,noreferrer,width=${width},height=${height}`);
}

function isCompactMobileLayout() {
  return window.innerWidth <= 640;
}

function toggleCategoryNavExpanded() {
  state.categoryNavExpanded = !state.categoryNavExpanded;
  if (state.currentView === 'category' && state.currentCategoryId) {
    renderCategoryView(state.currentCategoryId);
  }
}

function buildCategoryItemToolLabel(categoryId, article, fallbackTitle = '') {
  if (String(categoryId || '') !== 'tools') return '';

  const names = [...new Set(
    getExpandedTools(article || {})
      .map((tool) => normalizeDisplayText(toolDisplayName(tool)))
      .filter(Boolean)
  )].filter((name) => name !== '共通');

  if (!names.length) {
    const fallback = normalizeDisplayText(fallbackTitle || '');
    if (fallback && !/全般/.test(fallback)) names.push(fallback);
  }

  return names.join(' / ');
}

function parseUsageKeywordList(raw) {
  const normalizeUsageKeywordText = (value) => normalizeDisplayText(value).replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');

  if (Array.isArray(raw)) {
    return raw
      .map((part) => normalizeUsageKeywordText(part))
      .filter(Boolean);
  }

  const text = normalizeUsageKeywordText(raw);
  if (!text) return [];
  return text
    .split(/[\/／|,、・]/)
    .map((part) => normalizeUsageKeywordText(part))
    .filter(Boolean);
}

function buildCategoryItemUsageKeywordLabel(categoryId, articleId, article, fallbackTitle = '', item = null) {
  if (String(categoryId || '') !== 'tools') return '';

  const explicit = [
    ...(parseUsageKeywordList(item && item.usageKeywordLabel)),
    ...(parseUsageKeywordList(item && item.usageKeyword)),
    ...(parseUsageKeywordList(item && item.usageKeywords)),
    ...(parseUsageKeywordList(article && article.usageKeywordLabel)),
    ...(parseUsageKeywordList(article && article.usageKeyword)),
    ...(parseUsageKeywordList(article && article.usageKeywords)),
  ];
  if (explicit.length) {
    const seen = new Set();
    const deduped = explicit.filter((kw) => {
      const key = normalizeHashtagKey(kw);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return deduped.slice(0, 4).join(' / ');
  }

  const normalizedTitle = normalizeHashtagKey((article && article.title) || fallbackTitle || '');
  const seen = new Set();
  const derived = getArticleKeywordTags(article, 12)
    .map((kw) => normalizeDisplayText(kw))
    .filter(Boolean)
    .filter((kw) => {
      const key = normalizeHashtagKey(kw);
      if (!key) return false;
      if (key === normalizedTitle) return false;
      if (TOOLS_USAGE_KEYWORD_STOPWORDS.has(key)) return false;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 4);

  return derived.join(' / ');
}

function warmToolsCategoryKeywordData(items) {
  const list = Array.isArray(items) ? items : [];
  if (!list.length) return;
  if (state.toolsKeywordWarmupInFlight) return;

  const missingIds = list
    .map((it) => String((it && it.id) || '').trim())
    .filter(Boolean)
    .filter((id) => (
      !articleHasRenderableContent(state.articleMap.get(id))
      && !state.toolsKeywordWarmupTriedIds.has(id)
    ));

  if (!missingIds.length) return;
  missingIds.forEach((id) => state.toolsKeywordWarmupTriedIds.add(id));

  state.toolsKeywordWarmupInFlight = true;
  Promise.allSettled(missingIds.map((id) => loadArticle(id)))
    .catch(() => {
      // noop
    })
    .finally(() => {
      state.toolsKeywordWarmupInFlight = false;
      if (state.currentView === 'category' && state.currentCategoryId === 'tools') {
        renderCategoryView('tools');
      }
    });
}

function sortToolsCategoryItems(items) {
  const list = Array.isArray(items) ? [...items] : [];
  const mode = state.toolsSort === 'kana' ? 'kana' : 'usage';

  if (mode === 'kana') {
    return list.sort((a, b) => normalizeDisplayText(a.title).localeCompare(normalizeDisplayText(b.title), 'ja'));
  }

  // Usage order follows curated category item order.
  return list;
}

function syncToolsSortButtons(isToolsCategory) {
  document.querySelectorAll('[data-tools-sort]').forEach((btn) => {
    const activeMode = isToolsCategory ? (state.toolsSort === 'kana' ? 'kana' : 'usage') : '';
    btn.classList.toggle('active', btn.getAttribute('data-tools-sort') === activeMode);
  });
}

function setToolsSort(mode) {
  const next = mode === 'kana' ? 'kana' : 'usage';
  state.toolsSort = next;
  localStorage.setItem(STORAGE_KEYS.toolsSort, state.toolsSort);
  if (state.currentView === 'category' && state.currentCategoryId === 'tools') {
    renderCategoryView('tools');
  }
}

function renderCategoryView(categoryId) {
  const cat = getCurriculumCategoryById(categoryId);
  if (!cat) return false;

  let items = (cat.items || [])
    .map((item) => {
      const id = item.id || state.articleIdByTitle.get(item.title) || '';
      if (!id || isArticleDeleted(id)) return null;
      const indexEntry = (state.articleIndex || []).find((a) => a.id === id) || {};
      const mapArticle = state.articleMap.get(id) || {};
      const rawTs = pickLatestTimestamp(
        indexEntry.updatedAt, indexEntry.updated_at, indexEntry.ts,
        mapArticle.updatedAt, mapArticle.updated_at, mapArticle.ts,
      );
      const title = normalizeDisplayText(item.title);
      return {
        id,
        title,
        updatedAt: rawTs,
        usageKeywordLabel: buildCategoryItemUsageKeywordLabel(cat.id, id, mapArticle, title, item),
      };
    })
    .filter(Boolean);

  if (String(categoryId || '') === 'tools') {
    warmToolsCategoryKeywordData(items);
  }

  if (cat.isCurriculumTrack) {
    items = items.slice(0, 10);
  }

  const title = normalizeDisplayText(cat.name);
  const viewClass = categoryBadgeClass(title);
  const crumb = document.getElementById('categoryNameCrumb');
  const groupCrumb = document.getElementById('categoryGroupCrumb');
  const groupSep = document.getElementById('categoryGroupSep');
  const kicker = document.getElementById('categoryKicker');
  const titleEl = document.getElementById('categoryTitle');
  const sub = document.getElementById('categorySub');
  const count = document.getElementById('categoryArticleCount');
  const nav = document.getElementById('categoryNavList');
  const list = document.getElementById('categoryArticleList');
  const toolsSortRow = document.getElementById('categoryToolsSortRow');
  const view = document.getElementById('categoryView');

  if (!cat.isCurriculumTrack) {
    state.categoryGroupFilter = categoryGroupKeyByCategory(cat);
  }

  if (view) {
    CATEGORY_THEME_CLASSES.forEach((cls) => view.classList.remove(cls));
    view.classList.add(viewClass);
  }

  if (crumb) crumb.textContent = title;
  if (groupCrumb) {
    if (cat.isCurriculumTrack) {
      groupCrumb.textContent = '';
      groupCrumb.style.display = 'none';
      groupCrumb.classList.remove('breadcrumb-home-link');
      groupCrumb.onclick = null;
    } else {
      groupCrumb.textContent = categoryGroupLabelByKey(state.categoryGroupFilter);
      groupCrumb.style.display = '';
      groupCrumb.classList.add('breadcrumb-home-link');
      groupCrumb.onclick = () => showCategoryGroupTopView(state.categoryGroupFilter);
    }
  }
  if (groupSep) groupSep.style.display = cat.isCurriculumTrack ? 'none' : '';
  if (kicker) kicker.textContent = cat.kicker ? String(cat.kicker) : 'CATEGORY / GLOSSARY';
  if (titleEl) titleEl.textContent = title;
  if (sub) sub.textContent = categoryDescription(cat);
  if (count) count.textContent = `${items.length} 項目`;
  const phaseBlock = document.getElementById('categoryPhaseBlock');
  if (phaseBlock) phaseBlock.style.display = 'none';


  if (nav) {
    if (cat.isCurriculumTrack) {
      const categories = getVisibleCurriculumTracks();
      const isMobile = isCompactMobileLayout();
      const limit = 4;
      let visibleCategories = categories;

      if (isMobile && !state.categoryNavExpanded && categories.length > limit) {
        visibleCategories = categories.slice(0, limit);
        if (!visibleCategories.some((c) => c.id === categoryId)) {
          const activeCat = categories.find((c) => c.id === categoryId);
          if (activeCat) {
            visibleCategories = [...visibleCategories.slice(0, Math.max(0, limit - 1)), activeCat];
          }
        }
        const seen = new Set();
        visibleCategories = visibleCategories.filter((c) => {
          if (seen.has(c.id)) return false;
          seen.add(c.id);
          return true;
        });
      }

      const chips = visibleCategories.map((c) => {
        const active = c.id === categoryId;
        const label = normalizeDisplayText(c.name);
        if (active) {
          return `<button class="filter-chip active" type="button" disabled>${escapeHtml(label)}</button>`;
        }
        return `<button class="filter-chip" type="button" onclick="showCategory('${c.id}')">${escapeHtml(label)}</button>`;
      });

      if (isMobile && categories.length > limit) {
        const hiddenCount = Math.max(0, categories.length - visibleCategories.length);
        const moreLabel = state.categoryNavExpanded ? '閉じる' : `もっと見る${hiddenCount > 0 ? `（+${hiddenCount}）` : ''}`;
        chips.push(`<button class="filter-chip category-nav-more" type="button" onclick="toggleCategoryNavExpanded()">${moreLabel}</button>`);
      }

      nav.innerHTML = chips.join('');
    } else {
      renderCategoryJumpGroups(nav, {
        activeCategoryId: categoryId,
        includeGlossaryInAppendix: true,
      });
    }
  }

  const isToolsCategory = String(categoryId || '') === 'tools';
  if (toolsSortRow) {
    toolsSortRow.hidden = !isToolsCategory;
  }
  syncToolsSortButtons(isToolsCategory);

  if (list) {
    if (!items.length) {
      list.innerHTML = '<div class="article-row note-row is-placeholder"><span class="article-title-row">このカテゴリの項目は準備中です</span></div>';
    } else {
      const ordered = isToolsCategory
        ? sortToolsCategoryItems(items)
        : [...items].sort((a, b) => {
            const aGeneral = /全般/.test(a.title) ? 1 : 0;
            const bGeneral = /全般/.test(b.title) ? 1 : 0;
            if (aGeneral !== bGeneral) return bGeneral - aGeneral;
            return 0;
          });

      list.innerHTML = ordered.map((it) => {
        const isGeneral = /全般/.test(it.title);
        const kindText = isGeneral ? '全般' : '項目';
        const kindClass = isGeneral ? ' is-general' : '';
        const usageLine = it.usageKeywordLabel
          ? `<span class="category-item-tool">${escapeHtml(it.usageKeywordLabel)}</span>`
          : '';
        return `
          <div class="article-row note-row category-item-row${kindClass}" onclick="showArticle('${it.id}')">
            <span class="category-item-kind${kindClass}">${kindText}</span>
            <span class="category-item-main">
              <span class="article-title-row">${it.title}</span>
              ${usageLine}
            </span>
            <span class="note-meta">${escapeHtml(formatPostDateTime(it.updatedAt))}</span>
            <span class="article-arrow">›</span>
          </div>
        `;
      }).join('');
    }
  }

  document.querySelectorAll('.cat-header').forEach((h) => {
    h.classList.toggle('active', h.dataset.cat === categoryId);
  });

  return true;
}

function showCategory(categoryId, options = {}) {
  const { skipHistory = false, replaceHistory = false } = options;
  closeMobileSidebar();
  if (state.currentCategoryId !== categoryId) {
    state.categoryNavExpanded = false;
  }
  state.currentCategoryId = categoryId;
  if (!renderCategoryView(categoryId)) {
    toast('カテゴリが見つかりません', 'error');
    return;
  }
  const currentCategory = getCurriculumCategoryById(categoryId);
  updateSeoForRoute('category', {
    articleId: categoryId,
    categoryName: currentCategory ? currentCategory.name : categoryId,
  });
  showView('category', { skipHistory: true });
  if (!skipHistory) syncHistory('category', categoryId, replaceHistory);
}

function openCurriculumTrack(categoryId) {
  if (!getVisibleCurriculumTracks().some((x) => x.id === categoryId)) {
    toast('このカテゴリは現在非表示です', 'error');
    return;
  }
  showCategory(categoryId);
}

function renderUnifiedListRow({
  rowClasses = '',
  badgeHtml = '',
  titleHtml = '',
  metaHtml = '',
  actionHtml = '',
  arrow = '›',
  onClick = '',
  href = '',
  external = false,
} = {}) {
  const tag = href ? 'a' : 'div';
  const attrs = [];
  if (href) {
    attrs.push(`href="${escapeHtml(href)}"`);
    if (external) attrs.push('target="_blank" rel="noopener noreferrer"');
  } else if (onClick) {
    attrs.push(`onclick="${onClick}"`);
  }
  const className = ['article-row', 'note-row', 'list-row', rowClasses].filter(Boolean).join(' ');
  const rightHtml = [
    metaHtml || '',
    actionHtml || '',
    arrow ? `<span class="article-arrow list-row-arrow">${escapeHtml(arrow)}</span>` : '',
  ].join('');
  return `
    <${tag} class="${className}" ${attrs.join(' ')}>
      ${badgeHtml}
      <span class="list-row-main">
        <span class="article-title-row list-row-title">${titleHtml}</span>
      </span>
      <span class="list-row-right">${rightHtml}</span>
    </${tag}>
  `;
}

function renderRecentList() {
  const list = document.getElementById('recentList');
  if (!list) return;
  const activeHashtag = state.hashtagFilter;
  const visibleArticles = state.recentArticles
    .filter((a) => !isArticleDeleted(a.id))
    .filter((a) => articleMatchesHashtag(a, activeHashtag))
    .map((a, i) => {
      const mapArticle = state.articleMap.get(a.id) || {};
      const rawTs = pickLatestTimestamp(
        a.updatedAt, a.updated_at, a.ts,
        mapArticle.updatedAt, mapArticle.updated_at, mapArticle.ts,
      );
      const tsNum = Date.parse(rawTs) || 0;
      return { a, i, rawTs, tsNum };
    })
    .sort((x, y) => {
      if (y.tsNum !== x.tsNum) return y.tsNum - x.tsNum;
      return x.i - y.i;
    })
    .slice(0, HOME_RECENT_LIMIT)
    .map((x) => ({ ...x.a, __recentTs: x.rawTs }));

  const topBar = activeHashtag
    ? `
      <div class="article-row note-row no-cursor">
        <span class="article-cat-badge">#${escapeHtml(activeHashtag)}</span>
        <span class="article-title-row">同じハッシュタグの記事を表示中</span>
        <button type="button" class="btn-ghost btn-compact" onclick="clearHashtagFilter()">解除</button>
      </div>`
    : '';

  const rows = visibleArticles.map((a) => {
    const rawTs = a.__recentTs || a.updatedAt || a.updated_at || a.ts || BASE_CONTENT_UPDATED_AT;
    const date = formatHomeMetaDateTime(rawTs);
    return renderUnifiedListRow({
      rowClasses: 'recent-row',
      onClick: `showArticle('${escapeForSingleQuote(String(a.id || ''))}')`,
      badgeHtml: renderCategoryBadge(a.cat),
      titleHtml: escapeHtml(normalizeDisplayText(a.title)),
      metaHtml: `<span class="note-meta list-row-meta">${escapeHtml(date)}</span>`,
    });
  }).join('');

  const empty = '<div class="article-row note-row is-placeholder"><span class="article-title-row">該当する記事がありません</span></div>';
  list.innerHTML = `${topBar}${rows || empty}`;
}

function normalizeGlossaryTermItem(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const term = normalizeDisplayText(String(raw.term || '').trim());
  const desc = normalizeDisplayText(String(raw.description || raw.desc || '').trim());
  if (!term || !desc) return null;
  return {
    id: String(raw.id || ''),
    term,
    desc,
    name: normalizeDisplayText(String(raw.name || raw.author_name || '匿名').trim()) || '匿名',
    ts: String(raw.ts || raw.created_at || new Date().toISOString()),
  };
}

function saveGlossaryTerms() {
  localStorage.setItem(STORAGE_KEYS.glossaryTerms, JSON.stringify(state.userGlossaryTerms || []));
}

function saveGlossaryBaseOverrides() {
  localStorage.setItem(STORAGE_KEYS.glossaryBaseOverrides, JSON.stringify(state.glossaryBaseOverrides || {}));
}

function saveGlossaryBaseDeleted() {
  saveSet(STORAGE_KEYS.glossaryBaseDeleted, state.glossaryBaseDeleted || new Set());
}

function baseGlossaryKey(term) {
  return normalizeDisplayText(String(term || '')).trim().toLowerCase();
}

function getGlossaryTermsMerged() {
  const out = [];
  const seen = new Set();
  const handledBaseKeys = new Set();
  const push = (x) => {
    const norm = normalizeGlossaryTermItem(x);
    if (!norm) return;
    const key = `${norm.term}__${norm.desc}`.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(norm);
  };

  const baseDeletedSource = COMMENTS_SERVER_ENABLED ? state.serverGlossaryBaseDeleted : state.glossaryBaseDeleted;
  const baseOverrideSource = COMMENTS_SERVER_ENABLED ? state.serverGlossaryBaseOverrides : state.glossaryBaseOverrides;

  (GLOSSARY_TERMS || []).forEach((x) => {
    const k = baseGlossaryKey(x.term || x.desc || '');
    if (!k) return;
    handledBaseKeys.add(k);
    if (baseDeletedSource && baseDeletedSource.has(k)) return;

    const override = baseOverrideSource ? baseOverrideSource[k] : null;
    if (override && typeof override === 'object') {
      push({
        id: `base:${k}`,
        term: override.term,
        desc: override.desc,
        description: override.desc,
        name: override.name || 'DiSA',
        ts: override.ts || new Date().toISOString(),
      });
      return;
    }

    push({
      id: `base:${k}`,
      term: x.term,
      desc: x.desc,
      description: x.desc,
      name: 'DiSA',
      ts: '2026-03-26T00:00:00+09:00',
    });
  });

  Object.entries(baseOverrideSource || {}).forEach(([k, override]) => {
    if (!k || handledBaseKeys.has(k)) return;
    if (baseDeletedSource && baseDeletedSource.has(k)) return;
    if (!override || typeof override !== 'object') return;
    push({
      id: `base:${k}`,
      term: override.term,
      desc: override.desc,
      description: override.desc,
      name: override.name || 'DiSA',
      ts: override.ts || new Date().toISOString(),
    });
  });

  (state.userGlossaryTerms || []).forEach(push);
  return out;
}


async function loadGlossaryBaseOverridesFromServer() {
  if (!COMMENTS_SERVER_ENABLED) return false;
  const data = await fetchCommentsApi('?action=glossary_base_list');
  if (!data || !data.ok || !Array.isArray(data.items)) return false;

  const overrides = {};
  const deleted = new Set();

  data.items.forEach((item) => {
    const key = baseGlossaryKey(item && item.base_key ? item.base_key : '');
    if (!key) return;
    const status = String(item && item.status ? item.status : 'visible').toLowerCase();
    if (status === 'deleted') {
      deleted.add(key);
      return;
    }
    const term = normalizeDisplayText(String(item && item.term ? item.term : '').trim());
    const desc = normalizeDisplayText(String(item && item.description ? item.description : '').trim());
    if (!term || !desc) return;
    overrides[key] = {
      term,
      desc,
      name: normalizeDisplayText(String(item && item.author_name ? item.author_name : 'DiSA').trim()) || 'DiSA',
      ts: String(item && item.updated_at ? item.updated_at : new Date().toISOString()),
    };
  });

  state.serverGlossaryBaseOverrides = overrides;
  state.serverGlossaryBaseDeleted = deleted;
  state.serverGlossaryBaseLoaded = true;
  return true;
}

async function loadGlossaryTermsFromServer(limit = 300) {
  if (!COMMENTS_SERVER_ENABLED) return false;
  const n = Math.max(1, Math.min(500, Number(limit) || 300));
  const data = await fetchCommentsApi(`?action=glossary_list&limit=${encodeURIComponent(String(n))}`);
  if (!data || !data.ok || !Array.isArray(data.terms)) return false;
  state.userGlossaryTerms = data.terms
    .map(normalizeGlossaryTermItem)
    .filter(Boolean)
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
  state.userGlossaryLoaded = true;
  saveGlossaryTerms();
  return true;
}

function renderGlossary() {
  const root = document.getElementById('glossaryList');
  if (!root) return;
  root.innerHTML = sortGlossaryTerms(getGlossaryTermsMerged()).slice(0, 8).map((g) => `
    <div class="glossary-item">
      <div class="glossary-term">${normalizeDisplayText(g.term)}</div>
      <div class="glossary-desc">${normalizeDisplayText(g.desc)}</div>
    </div>
  `).join('');
}

function getGlossaryUsageCount(term) {
  return Number(GLOSSARY_TERM_USAGE[normalizeDisplayText(String(term || '')).trim()] || 0);
}

function sortGlossaryTerms(terms) {
  const items = Array.isArray(terms) ? [...terms] : [];
  if (state.glossarySort === 'kana') {
    return items.sort((a, b) => normalizeDisplayText(a.term).localeCompare(normalizeDisplayText(b.term), 'ja'));
  }
  return items.sort((a, b) => {
    const freqDiff = getGlossaryUsageCount(b.term) - getGlossaryUsageCount(a.term);
    if (freqDiff !== 0) return freqDiff;
    return normalizeDisplayText(a.term).localeCompare(normalizeDisplayText(b.term), 'ja');
  });
}

function syncGlossarySortButtons() {
  document.querySelectorAll('[data-glossary-sort]').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-glossary-sort') === state.glossarySort);
  });
}

function renderGlossaryPage(keyword = '') {
  const list = document.getElementById('glossaryArticleList');
  const count = document.getElementById('glossaryTermCount');
  if (!list) return;

  const q = String(keyword || '').trim().toLowerCase();
  const filtered = sortGlossaryTerms(getGlossaryTermsMerged().filter((g) => {
    if (!q) return true;
    const text = `${g.term} ${g.desc}`.toLowerCase();
    return text.includes(q);
  }));

  if (count) count.textContent = `${formatNumberWithComma(filtered.length)} 件`;
  syncGlossarySortButtons();

  if (!filtered.length) {
    list.innerHTML = '<div class="article-row note-row is-placeholder"><span class="article-title-row">該当する用語がありません</span></div>';
    return;
  }

  list.innerHTML = filtered.map((g) => {
    const adminActions = (state.isAdmin && g.id)
      ? `<span class="glossary-row-actions admin-row-actions">
          <button class="admin-article-btn admin-row-btn" type="button" onclick="event.stopPropagation();editGlossaryTerm('${escapeForSingleQuote(String(g.id))}')">編集</button>
          <button class="admin-article-btn danger admin-row-btn" type="button" onclick="event.stopPropagation();deleteGlossaryTerm('${escapeForSingleQuote(String(g.id))}')">削除</button>
        </span>`
      : '';
    return `
      <div class="article-row note-row glossary-row">
        <span class="article-cat-badge">TERM</span>
        <span class="glossary-row-main">
          <span class="article-title-row">${escapeHtml(normalizeDisplayText(g.term))}</span>
          <span class="glossary-row-desc">${escapeHtml(normalizeDisplayText(g.desc))}</span>
        </span>
        ${adminActions}
      </div>
    `;
  }).join('');
}

function setGlossarySort(mode) {
  state.glossarySort = mode === 'kana' ? 'kana' : 'freq';
  localStorage.setItem(STORAGE_KEYS.glossarySort, state.glossarySort);
  const input = document.getElementById('glossarySearchInput');
  renderGlossaryPage(input ? input.value : '');
}

function showGlossaryView(options = {}) {
  const { skipHistory = false } = options;
  state.categoryGroupFilter = 'appendix';
  renderCategoryTopNavigations();
  renderCurrentGlossaryView();
  updateSeoForRoute('glossary');
  showView('glossary', { skipHistory: true });
  if (!skipHistory) syncHistory('glossary', null, false);
  if (COMMENTS_SERVER_ENABLED) {
    loadGlossaryTermsFromServer(300).then((ok) => {
      if (ok) {
        renderGlossary();
        renderCurrentGlossaryView();
      }
    }).catch(() => {});
  }
}

function getRecentVisibleComments(limit = HOME_COMMENT_LIMIT) {
  const all = [];
  Object.entries(state.commentsByArticle || {}).forEach(([articleId, comments]) => {
    (comments || []).forEach((c) => {
      all.push({ articleId, ...c });
    });
  });
  all.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
  return all.filter((c) => !isArticleDeleted(c.articleId) || state.isAdmin).slice(0, limit);
}

function saveCommentNotifySeen() {
  try {
    localStorage.setItem(COMMENT_NOTIFY_SEEN_KEY, JSON.stringify([...state.commentNotifySeen].slice(-300)));
  } catch (_) {}
}

function commentNotifyKey(item) {
  return String(item && (item.id || `${item.articleId}:${item.ts || ''}:${item.body || ''}`));
}

function syncCommentNotifyBaseline() {
  const recent = getRecentVisibleComments(30);
  recent.forEach((c) => state.commentNotifySeen.add(commentNotifyKey(c)));
  saveCommentNotifySeen();
}

function notifyNewCommentsIfNeeded() {
  const recent = getRecentVisibleComments(30);
  const fresh = [];
  for (const c of recent) {
    const key = commentNotifyKey(c);
    if (state.commentNotifySeen.has(key)) continue;
    state.commentNotifySeen.add(key);
    fresh.push(c);
  }
  if (!fresh.length) return;
  saveCommentNotifySeen();

  const latest = fresh[0];
  const titleById = new Map((state.articleIndex || []).map((a) => [a.id, normalizeDisplayText(a.title)]));
  const articleTitle = titleById.get(latest.articleId) || normalizeDisplayText(latest.articleId || '');
  const body = `${normalizeDisplayText(latest.name || '匿名')}: ${normalizeDisplayText((latest.body || '').replace(/\s+/g, ' ').trim()).slice(0, 48)}`;

  if (!('Notification' in window)) {
    toast(`新着コメント ${formatNumberWithComma(fresh.length)}件`, 'success');
    return;
  }

  const sendNotification = () => {
    try {
      const n = new Notification(`Note.app 新着コメント ${formatNumberWithComma(fresh.length)}件`, {
        body: `${articleTitle} / ${body}`,
        tag: 'dic-new-comment',
      });
      n.onclick = () => {
        window.focus();
        showArticle(latest.articleId);
      };
    } catch (_) {
      toast(`新着コメント ${formatNumberWithComma(fresh.length)}件`, 'success');
    }
  };

  if (Notification.permission === 'granted') {
    sendNotification();
    return;
  }

  if (Notification.permission === 'default') {
    Notification.requestPermission().then((perm) => {
      if (perm === 'granted') sendNotification();
      else toast(`新着コメント ${formatNumberWithComma(fresh.length)}件`, 'success');
    }).catch(() => toast(`新着コメント ${formatNumberWithComma(fresh.length)}件`, 'success'));
    return;
  }

  toast(`新着コメント ${formatNumberWithComma(fresh.length)}件`, 'success');
}

function startCommentNotificationWatcher() {
  if (!COMMENTS_SERVER_ENABLED) return;
  if (state.commentNotifyPollTimer) clearInterval(state.commentNotifyPollTimer);

  state.commentNotifyPollTimer = setInterval(async () => {
    try {
      const ok = await hydrateCommentsFromServer(30);
      if (!ok) return;
      renderLatestComments();
      notifyNewCommentsIfNeeded();
    } catch (_) {}
  }, COMMENT_NOTIFY_POLL_MS);
}

function renderLatestComments() {
  const list = document.getElementById('latestCommentList');
  if (!list) return;

  const recent = getRecentVisibleComments(HOME_COMMENT_LIMIT);

  if (!recent.length) {
    list.innerHTML = '<div class="article-row note-row is-placeholder"><span class="article-title-row">まだコメントはありません</span></div>';
    return;
  }

  const categoryById = new Map((state.articleIndex || []).map((a) => [a.id, normalizeDisplayText(a.cat || '')]));
  list.innerHTML = recent.map((c) => {
    const date = formatHomeMetaDateTime(c.ts);
    const catName = categoryById.get(c.articleId) || '';
    const catClass = categoryBadgeClass(catName);
    const rawBody = (c.body || '').replace(/\s+/g, ' ').trim();
    const commentTitle = rawBody.length > HOME_COMMENT_EXCERPT_MAX
      ? `${rawBody.slice(0, HOME_COMMENT_EXCERPT_MAX)}…`
      : rawBody;
    return renderUnifiedListRow({
      rowClasses: `recent-row ${catClass}`,
      onClick: `showArticle('${escapeForSingleQuote(String(c.articleId || ''))}')`,
      badgeHtml: renderCategoryBadge(catName),
      titleHtml: escapeHtml(commentTitle || 'コメント'),
      metaHtml: `<span class="note-meta list-row-meta">${escapeHtml(date)}</span>`,
    });
  }).join('');
}

function renderCommentsIndexView() {
  const list = document.getElementById('commentIndexList');
  const countPill = document.getElementById('commentIndexCountPill');
  if (!list || !countPill) return;

  const recent = getRecentVisibleComments(COMMENT_INDEX_LIMIT);
  countPill.textContent = `${formatNumberWithComma(recent.length)} 件`;

  if (!recent.length) {
    list.innerHTML = '<div class="article-row note-row is-placeholder"><span class="article-title-row">まだコメントはありません</span></div>';
    return;
  }

  const categoryById = new Map((state.articleIndex || []).map((a) => [a.id, normalizeDisplayText(a.cat || '')]));
  const titleById = new Map((state.articleIndex || []).map((a) => [a.id, normalizeDisplayText(a.title || a.id || '')]));
  list.innerHTML = recent.map((c) => {
    const commentId = String(c.id || '').trim();
    const articleId = String(c.articleId || '').trim();
    const date = formatPostDateTime(c.ts);
    const catName = categoryById.get(articleId) || '';
    const catClass = categoryBadgeClass(catName);
    const articleTitle = titleById.get(articleId) || normalizeDisplayText(articleId || '');
    const rawBody = normalizeDisplayText(String(c.body || '').trim());
    const author = normalizeDisplayText(c.name || '匿名');
    const adminActions = (state.isAdmin && commentId && articleId)
      ? `<span class="request-row-actions admin-row-actions list-row-head-actions">
          <button class="admin-article-btn admin-row-btn" type="button" onclick="event.stopPropagation();editComment('${escapeForSingleQuote(commentId)}','${escapeForSingleQuote(articleId)}')">編集</button>
          <button class="admin-article-btn danger admin-row-btn" type="button" onclick="event.stopPropagation();deleteComment('${escapeForSingleQuote(commentId)}','${escapeForSingleQuote(articleId)}')">削除</button>
        </span>`
      : '';
    return `
      <div class="article-row note-row request-row list-row list-row--stack ${catClass}" onclick="showArticle('${escapeForSingleQuote(articleId)}')">
        <span class="request-row-head list-row-head">
          ${renderCategoryBadge(catName)}
          <span class="request-meta-text">${escapeHtml(author)}</span>
          ${adminActions}
        </span>
        <span class="request-row-main list-row-main-block">
          <span class="article-title-row">${escapeHtml(articleTitle)}</span>
          <span class="request-row-body">${escapeHtml(rawBody || 'コメント')}</span>
        </span>
        <span class="request-row-meta list-row-right list-row-right-wrap">
          <span class="request-meta-text">${escapeHtml(date)}</span>
        </span>
      </div>
    `;
  }).join('');
}

function formatFeedDate(raw) {
  if (!raw) return '';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function sanitizeNoteTitle(raw) {
  return normalizeDisplayText(String(raw || '').replace(/[【】]/g, '').trim());
}

function formatPostDateTime(raw) {
  if (!raw) return '';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return y + '/' + m + '/' + day + ' ' + hh + ':' + mm;
}

function formatHomeMetaDateTime(raw) {
  return formatPostDateTime(raw);
}

function renderNoteList(items, loading = false) {
  const list = document.getElementById('noteList');
  if (!list) return;

  if (loading) {
    list.innerHTML = '<div class="article-row note-row is-placeholder"><span class="article-title-row">note記事を読み込み中...</span></div>';
    return;
  }

  if (!items.length) {
    list.innerHTML = renderUnifiedListRow({
      rowClasses: 'recent-row',
      href: 'https://note.com/disa_pr',
      external: true,
      badgeHtml: '<span class="article-cat-badge">note</span>',
      titleHtml: '最新記事はnoteプロフィールから確認できます',
      arrow: '↗',
    });
    return;
  }

  list.innerHTML = items.map((item) => renderUnifiedListRow({
    rowClasses: 'recent-row',
    href: String(item.link || ''),
    external: true,
    badgeHtml: '<span class="article-cat-badge">note</span>',
    titleHtml: escapeHtml(sanitizeNoteTitle(item.title)),
    metaHtml: `<span class="note-meta list-row-meta">${item.date ? escapeHtml(item.date) : ''}</span>`,
    arrow: '↗',
  })).join('');
}

function normalizeForNoteMatch(text) {
  return normalizeDisplayText(text || '').toLowerCase().replace(/\s+/g, '');
}

function normalizeKeywordToken(token) {
  return normalizeDisplayText(String(token || ''))
    .toLowerCase()
    .replace(/^#/, '')
    .replace(/[^a-z0-9ぁ-んァ-ヶ一-龠々ー+/_\.-]/gi, '')
    .trim();
}

function collectArticleKeywordsForNote(article) {
  if (!article) return [];

  const raw = [
    normalizeDisplayText(article.title || ''),
    normalizeDisplayText(article.cat || ''),
    ...((article.tags || []).map((t) => tagLabel(t))),
  ];

  const basicContent = article.content && article.content['基本'] ? article.content['基本'] : '';
  const extracted = extractKeywordHashtagsFromContent(basicContent, 12);
  raw.push(...extracted.map((k) => '#' + k));

  const out = [];
  const seen = new Set();

  raw.forEach((txt) => {
    splitSearchWords(txt).forEach((w) => {
      const key = normalizeKeywordToken(w);
      if (!key || key.length < 2) return;
      if (HASHTAG_STOPWORDS.has(key)) return;
      if (seen.has(key)) return;
      seen.add(key);
      out.push(key);
    });
  });

  return out.slice(0, 24);
}

function collectNoteKeywords(post) {
  const text = [post.title || '', post.description || '', post.content || ''].join(' ');
  const out = [];
  const seen = new Set();

  splitSearchWords(text).forEach((w) => {
    const key = normalizeKeywordToken(w);
    if (!key || key.length < 2) return;
    if (HASHTAG_STOPWORDS.has(key)) return;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(key);
  });

  return out.slice(0, 40);
}

function getRelatedNotePosts(article, limit = NOTE_RELATED_LIMIT) {
  if (!article || !state.notePosts.length) return [];

  const articleKeywords = collectArticleKeywordsForNote(article);
  if (!articleKeywords.length) return state.notePosts.slice(0, limit);

  const titleNorm = normalizeForNoteMatch(article.title || '');
  const catNorm = normalizeForNoteMatch(article.cat || '');

  const scored = state.notePosts.map((post, index) => {
    const noteKeywords = collectNoteKeywords(post);
    const noteSet = new Set(noteKeywords);

    let score = 0;
    let hitCount = 0;

    articleKeywords.forEach((kw) => {
      if (noteSet.has(kw)) {
        hitCount += 1;
        score += 3;
      }
    });

    const noteTitleNorm = normalizeForNoteMatch(post.title || '');
    if (titleNorm && noteTitleNorm.includes(titleNorm)) score += 6;
    if (catNorm && noteTitleNorm.includes(catNorm)) score += 2;

    const noteBodyNorm = normalizeForNoteMatch((post.description || '') + ' ' + (post.content || ''));
    if (titleNorm && noteBodyNorm.includes(titleNorm)) score += 2;

    score += Math.min(hitCount, 5);

    return { post, index, score, hitCount };
  });

  const matched = scored
    .filter((x) => x.score > 0)
    .sort((a, b) => (b.score - a.score) || (b.hitCount - a.hitCount) || (a.index - b.index))
    .map((x) => x.post);

  if (matched.length >= limit) return matched.slice(0, limit);

  const used = new Set(matched.map((p) => p.link));
  const fill = state.notePosts.filter((p) => !used.has(p.link));
  return [...matched, ...fill].slice(0, limit);
}

function renderArticleNoteList(article, loading = false) {
  const list = document.getElementById('articleNoteList');
  if (!list) return;

  if (loading) {
    list.innerHTML = '<div class="article-row note-row is-placeholder"><span class="article-title-row">関連するnote記事を読み込み中...</span></div>';
    return;
  }

  const items = getRelatedNotePosts(article, NOTE_RELATED_LIMIT);
  if (!items.length) {
    list.innerHTML = `
      <a class="article-row note-row" href="https://note.com/disa_pr" target="_blank" rel="noopener noreferrer">
        <span class="article-cat-badge">note</span>
        <span class="article-title-row">関連する記事はnoteプロフィールから確認できます</span>
        <span class="article-arrow">↗</span>
      </a>
    `;
    return;
  }

  list.innerHTML = items.map((item) => `
    <a class="article-row note-row" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">
      <span class="article-cat-badge">note</span>
      <span class="article-title-row">${escapeHtml(sanitizeNoteTitle(item.title))}</span>
      <span class="note-meta">${item.date ? escapeHtml(item.date) : ''}</span>
      <span class="article-arrow">↗</span>
    </a>
  `).join('');
}

function parseNoteRss(xmlText) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, 'application/xml');
  if (xml.querySelector('parsererror')) throw new Error('Invalid RSS XML');

  return [...xml.querySelectorAll('item')]
    .map((item) => ({
      title: sanitizeNoteTitle((item.querySelector('title')?.textContent || '').trim()),
      link: (item.querySelector('link')?.textContent || '').trim(),
      date: formatFeedDate((item.querySelector('pubDate')?.textContent || '').trim()),
      description: (item.querySelector('description')?.textContent || '').trim(),
      content: (item.querySelector('content\:encoded')?.textContent || '').trim(),
    }))
    .filter((item) => item.title && item.link)
    .slice(0, NOTE_HOME_LIMIT);
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/rss+xml, application/xml, text/xml, text/plain, */*',
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
  return res.text();
}

async function fetchNotePosts() {
  const readers = [
    async () => {
      // 1. サーバーサイドの PHP プロキシを最優先
      const json = await loadJson(`./api/note-rss.php?limit=${NOTE_HOME_LIMIT}`);
      if (!json || !json.ok || !Array.isArray(json.items)) throw new Error('local proxy failed');
      return (json.items || [])
        .slice(0, NOTE_HOME_LIMIT)
        .map((item) => ({
          title: sanitizeNoteTitle(item.title || ''),
          link: item.link || '',
          date: item.date || formatFeedDate(item.pubDate || ''),
          description: item.description || '',
          content: item.content || item.description || '',
        }))
        .filter((item) => item.title && item.link);
    },
    async () => parseNoteRss(await fetchText(NOTE_RSS_URL)),
    async () => parseNoteRss(await fetchText(`https://api.allorigins.win/raw?url=${encodeURIComponent(NOTE_RSS_URL)}`)),
    async () => {
      const json = await loadJson(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(NOTE_RSS_URL)}&api_key=&count=${NOTE_HOME_LIMIT}`);
      if (json.status !== 'ok') throw new Error('rss2json failed');
      return (json.items || [])
        .slice(0, NOTE_HOME_LIMIT)
        .map((item) => ({
          title: sanitizeNoteTitle(item.title || ''),
          link: item.link || '',
          date: formatFeedDate(item.pubDate || ''),
          description: item.description || '',
          content: item.content || '',
        }))
        .filter((item) => item.title && item.link);
    },
  ];

  for (const reader of readers) {
    try {
      const posts = await reader();
      if (posts && posts.length) return posts;
    } catch (err) {
      console.warn('Note feed reader failed:', err);
    }
  }
  return [];
}

async function renderNoteFeed() {
  state.noteFeedLoaded = false;
  renderNoteList([], true);
  const posts = await fetchNotePosts();
  state.notePosts = posts;
  state.noteFeedLoaded = true;
  renderNoteList(posts.slice(0, NOTE_HOME_LIMIT));

}

function getCurrentCurriculum() {
  return state.curriculumByLevel[String(state.selectedLevel)] || [];
}

function renderCurriculum() {
  const progressFill = document.getElementById('progressFill');
  const progressLabel = document.getElementById('progressLabel');
  const curriculumRoot = document.getElementById('curriculum');
  if (!progressFill || !progressLabel || !curriculumRoot) return;

  const data = getCurrentCurriculum().filter((c) => {
    const id = c.id || resolveArticleIdByTitleSmart(c.title, c.cat || "");
    return !isArticleDeleted(id);
  });
  const done = data.filter((c) => {
    const id = c.id || resolveArticleIdByTitleSmart(c.title, c.cat || "");
    return state.progress.has(id);
  }).length;

  const pct = data.length ? Math.round((done / data.length) * 100) : 0;
  progressFill.style.width = `${pct}%`;
  progressLabel.textContent = `${done} / ${data.length} 完了`;

  curriculumRoot.innerHTML = data.map((c) => {
    const id = c.id || resolveArticleIdByTitleSmart(c.title, c.cat || "");
    const isDone = state.progress.has(id);
    const encTitle = encodeURIComponent(c.title || "");
    const encCat = encodeURIComponent(c.cat || "");
    return `
      <div class="curriculum-item" onclick="openArticleByTitle(decodeURIComponent('${encTitle}'), '${id}', decodeURIComponent('${encCat}'))">
        <div class="curr-num">${c.num}</div>
        <div class="curr-content">
          <div class="curr-cat">${normalizeDisplayText(c.cat)}</div>
          <div class="curr-title">${normalizeDisplayText(c.title)}</div>
          <div class="curr-desc">${normalizeDisplayText(c.desc)}</div>
        </div>
        <div class="curr-status ${isDone ? 'done' : ''}" onclick="toggleProgress('${id}'); event.stopPropagation()"></div>
      </div>
    `;
  }).join('');
}



function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function linkifyUrls(text) {
  const escaped = escapeHtml(text);
  return escaped.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}

function saveComments() {
  if (COMMENTS_SERVER_ENABLED) return;
  localStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(state.commentsByArticle));
}

function normalizeCommentRecord(raw) {
  if (!raw) return null;
  return {
    id: String(raw.id ?? ''),
    name: String(raw.name ?? raw.author_name ?? '匿名'),
    body: String(raw.body ?? ''),
    ts: String(raw.ts ?? raw.created_at ?? new Date().toISOString()),
    articleId: String(raw.article_id ?? raw.articleId ?? ''),
  };
}

async function fetchCommentsApi(query, options) {
  if (!COMMENTS_SERVER_ENABLED) return null;
  try {
    const requestOptions = { ...(options || {}) };
    const method = String(requestOptions.method || 'GET').toUpperCase();
    let url = COMMENTS_API_ENDPOINT + (query || '');
    if (method === 'GET') {
      const sep = url.includes('?') ? '&' : '?';
      url += `${sep}_ts=${Date.now()}`;
      requestOptions.cache = 'no-store';
    }
    const res = await fetch(url, requestOptions);
    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (!res.ok) {
      return data || { ok: false, error: `HTTP ${res.status}` };
    }
    return data;
  } catch {
    return { ok: false, error: 'network error' };
  }
}


function normalizeServerArticle(raw, fallbackId = '') {
  if (!raw || typeof raw !== 'object') return null;
  const out = JSON.parse(JSON.stringify(raw));
  if (!out.id) out.id = fallbackId;
  if (!out.id) return null;
  if (!out.content || typeof out.content !== 'object') out.content = {};
  if (!out.content['基本']) {
    out.content['基本'] = '<p>このページのコンテンツはまもなく追加されます。</p>';
  }
  if (!out.cat) out.cat = 'ツール・効率化';
  if (!out.title) out.title = String(out.id);
  return out;
}

async function loadArticleOverrideFromServer(articleId) {
  if (!COMMENTS_SERVER_ENABLED || !articleId) return null;
  const data = await fetchCommentsApi(`?action=article_get&article_id=${encodeURIComponent(String(articleId))}`);
  if (!data || !data.ok || !data.article) return null;
  return normalizeServerArticle(data.article, String(articleId));
}

async function loadArticleOverridesFromServer(limit = 500) {
  if (!COMMENTS_SERVER_ENABLED) return false;
  const n = Number(limit) || 500;
  const data = await fetchCommentsApi(`?action=article_list&limit=${encodeURIComponent(String(n))}`);
  if (!data || !data.ok || !Array.isArray(data.articles)) return false;

  const nextOverrides = {};

  data.articles.forEach((raw) => {
    const article = normalizeServerArticle(raw, String(raw && raw.id ? raw.id : ''));
    if (!article || !article.id) return;
    const current = state.articleMap.get(article.id);
    const staticIndex = (state.articleIndex || []).find((x) => String(x && x.id ? x.id : '') === String(article.id));
    const staticTs = articleUpdatedAtTs(staticIndex || {});
    const incomingTs = articleUpdatedAtTs(article);
    let shouldAdopt = shouldPreferIncomingArticle(current, article);
    if (!current && staticTs > 0 && incomingTs < staticTs) {
      shouldAdopt = false;
    }
    if (shouldAdopt) {
      state.articleMap.set(article.id, article);
      updateArticleIndexEntry(article.id, article);
    }
    nextOverrides[article.id] = article;
    state.serverArticleOverrideChecked.add(article.id);
  });

  state.articleOverrides = COMMENTS_SERVER_ENABLED ? nextOverrides : { ...state.articleOverrides, ...nextOverrides };
  // サーバーに存在する記事は、端末ローカルの古い「非表示」フラグを解除する
  if (state.deletedArticles && state.deletedArticles.size) {
    let dirty = false;
    Object.keys(nextOverrides).forEach((id) => {
      if (state.deletedArticles.has(id)) {
        state.deletedArticles.delete(id);
        dirty = true;
      }
    });
    if (dirty) saveSet(STORAGE_KEYS.deletedArticles, state.deletedArticles);
  }
  saveArticleOverrides();
  return true;
}

async function upsertArticleOverrideToServer(articleId, article) {
  if (!COMMENTS_SERVER_ENABLED) return { ok: false, error: 'server disabled' };
  const editorKey = state.isAdmin ? state.adminKey : '';
  const data = await fetchCommentsApi('', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(editorKey ? { 'X-Editor-Key': editorKey } : {}),
    },
    body: JSON.stringify({
      action: 'article_upsert',
      payload: {
        article_id: articleId,
        article,
        ...(editorKey ? { editor_key: editorKey } : {}),
      },
    }),
  });
  return data || { ok: false, error: 'unknown error' };
}

async function deleteArticleOverrideFromServer(articleId) {
  if (!COMMENTS_SERVER_ENABLED) return { ok: false, error: 'server disabled' };
  const editorKey = state.isAdmin ? state.adminKey : '';
  const data = await fetchCommentsApi('', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(editorKey ? { 'X-Editor-Key': editorKey } : {}),
    },
    body: JSON.stringify({
      action: 'article_delete',
      payload: {
        article_id: articleId,
        ...(editorKey ? { editor_key: editorKey } : {}),
      },
    }),
  });
  return data || { ok: false, error: 'unknown error' };
}


function renderUnifiedViews(options = {}) {
  const {
    stats = true,
    categoryLists = true,
    recent = true,
    curriculum = true,
    latestComments = true,
    glossary = true,
    featureRequests = false,
    editors = false,
    categoryView = true,
    currentArticleComments = false,
  } = options;

  if (stats) renderStats();
  if (categoryLists) {
    renderCatList();
    renderCategoryTopNavigations();
    renderHomeCurriculumTracks();
  }
  if (recent) renderRecentList();
  if (curriculum) renderCurriculum();
  if (categoryView && state.currentView === 'category' && state.currentCategoryId) {
    renderCategoryView(state.currentCategoryId);
  }
  if (latestComments) renderLatestComments();
  if (state.currentView === 'comments') renderCommentsIndexView();
  if (glossary) {
    renderGlossary();
    renderCurrentGlossaryView();
  }
  if (currentArticleComments && state.currentArticleId) {
    renderComments(state.currentArticleId);
  }
  if (featureRequests && state.currentView === 'requests') {
    return renderFeatureRequestsView();
  }
  if (editors && state.currentView === 'editors') {
    renderEditorsView();
  }
  return Promise.resolve();
}

async function syncServerStateToUi(options = {}) {
  if (!COMMENTS_SERVER_ENABLED) return false;
  const {
    articles = false,
    analytics = true,
    comments = true,
    glossary = true,
    glossaryBase = true,
    requests = true,
    editors = false,
    commentsLimit = 30,
    requestsLimit = 120,
    glossaryLimit = 300,
    render = true,
    currentArticleComments = false,
  } = options;

  if (articles) await loadArticleOverridesFromServer(500).catch(() => false);
  if (analytics) await loadAnalyticsSummaryFromServer().catch(() => false);
  if (comments) await hydrateCommentsFromServer(commentsLimit).catch(() => false);
  if (glossary) await loadGlossaryTermsFromServer(glossaryLimit).catch(() => false);
  if (glossaryBase) await loadGlossaryBaseOverridesFromServer().catch(() => false);
  if (requests) await loadFeatureRequestsFromServer(requestsLimit).catch(() => false);
  if (editors) await loadEditorsFromServer(300).catch(() => false);

  if (render) {
    await renderUnifiedViews({
      stats: true,
      latestComments: true,
      glossary,
      featureRequests: requests,
      editors,
      currentArticleComments,
    });
  }

  return true;
}

async function loadAnalyticsSummaryFromServer() {
  if (!COMMENTS_SERVER_ENABLED) return false;
  const data = await fetchCommentsApi("?action=metrics_summary");
  if (!data || !data.ok || !data.metrics || typeof data.metrics !== "object") return false;
  state.analyticsSummary = {
    pv_total: Number(data.metrics.pv_total || 0),
    uu_total: Number(data.metrics.uu_total || 0),
    pv_today: Number(data.metrics.pv_today || 0),
    uu_today: Number(data.metrics.uu_today || 0),
    comment_total: Number(data.metrics.comment_total || 0),
    request_total: Number(data.metrics.request_total || 0),
  };
  return true;
}

async function hydrateCommentsFromServer(limit) {
  if (!COMMENTS_SERVER_ENABLED) return false;
  const n = Number(limit) || 30;
  const data = await fetchCommentsApi("?recent=" + encodeURIComponent(String(n)));
  if (!data || !data.ok || !Array.isArray(data.comments)) return false;

  const grouped = {};
  data.comments.map(normalizeCommentRecord).filter(Boolean).forEach((c) => {
    if (!c.articleId) return;
    if (!grouped[c.articleId]) grouped[c.articleId] = [];
    grouped[c.articleId].push({ id: c.id, name: c.name, body: c.body, ts: c.ts });
  });

  const next = {};
  const loaded = new Set();
  Object.entries(grouped).forEach(([articleId, arr]) => {
    arr.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
    next[articleId] = arr.slice(0, 100);
    loaded.add(articleId);
  });

  // Server is source of truth when available.
  state.commentsByArticle = next;
  state.commentsLoadedByArticle = loaded;

  saveComments();
  renderStats();
  return true;
}

async function loadCommentsForArticle(articleId, force) {
  if (!articleId || !COMMENTS_SERVER_ENABLED) return false;
  if (!force && state.commentsLoadedByArticle.has(articleId)) return true;

  const data = await fetchCommentsApi('?article_id=' + encodeURIComponent(articleId));
  if (!data || !data.ok || !Array.isArray(data.comments)) return false;

  const arr = data.comments
    .map(normalizeCommentRecord)
    .filter(Boolean)
    .map((c) => ({ id: c.id, name: c.name, body: c.body, ts: c.ts }))
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
    .slice(0, 100);

  state.commentsByArticle[articleId] = arr;
  state.commentsLoadedByArticle.add(articleId);
  saveComments();
  renderStats();
  return true;
}

async function postCommentToServer(articleId, payload) {
  const data = await fetchCommentsApi('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ article_id: articleId, name: payload.name, body: payload.body }),
  });
  return !!(data && data.ok);
}

async function deleteCommentFromServer(articleId, commentId) {
  const editorKey = state.isAdmin ? state.adminKey : "";
  const data = await fetchCommentsApi("", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(editorKey ? { "X-Editor-Key": editorKey } : {}),
    },
    body: JSON.stringify({
      article_id: articleId,
      comment_id: commentId,
      ...(editorKey ? { editor_key: editorKey } : {}),
    }),
  });
  return data || { ok: false, error: 'unknown error' };
}

function openCommentComposer() {
  if (!state.currentArticleId) {
    toast('記事を開いてから投稿してください', 'error');
    return;
  }
  const modal = document.getElementById('commentComposeModal');
  const nameInput = document.getElementById('commentNameInput');
  const bodyInput = document.getElementById('commentBodyInput');
  if (!modal) return;

  if (nameInput) nameInput.value = state.commentName || '';
  if (bodyInput && !bodyInput.value) bodyInput.value = '';

  modal.classList.add('open');
  setTimeout(() => {
    if (bodyInput) bodyInput.focus();
  }, 50);
}

function bindCommentComposerEvents() {
  const openBtn = document.getElementById('openCommentComposerBtn');
  const submitBtn = document.getElementById('submitCommentBtn');
  const closeBtn = document.getElementById('closeCommentComposerBtn');
  const closeXBtn = document.getElementById('commentComposeCloseX');
  const bodyInput = document.getElementById('commentBodyInput');
  const nameInput = document.getElementById('commentNameInput');

  if (openBtn) openBtn.addEventListener('click', openCommentComposer);
  if (submitBtn) submitBtn.addEventListener('click', addComment);
  if (closeBtn) closeBtn.addEventListener('click', closeCommentComposer);
  if (closeXBtn) closeXBtn.addEventListener('click', closeCommentComposer);

  const submitByShortcut = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      addComment();
    }
  };
  if (bodyInput) bodyInput.addEventListener('keydown', submitByShortcut);
  if (nameInput) nameInput.addEventListener('keydown', submitByShortcut);
}

function closeCommentComposer() {
  const modal = document.getElementById('commentComposeModal');
  if (modal) modal.classList.remove('open');
}

function resolveCommentArticleId(commentId, articleId) {
  const requested = String(articleId || '').trim();
  if (requested) return requested;

  const current = String(state.currentArticleId || '').trim();
  if (current && Array.isArray(state.commentsByArticle[current])) {
    const hit = state.commentsByArticle[current].some((c) => String(c && c.id) === String(commentId));
    if (hit) return current;
  }

  const entries = Object.entries(state.commentsByArticle || {});
  for (let i = 0; i < entries.length; i += 1) {
    const [aid, comments] = entries[i];
    if (!Array.isArray(comments)) continue;
    const hit = comments.some((c) => String(c && c.id) === String(commentId));
    if (hit) return String(aid);
  }
  return '';
}

function refreshCommentUiAfterMutation(targetArticleId) {
  const activeArticleId = String(state.currentArticleId || '').trim();
  if (activeArticleId && activeArticleId === String(targetArticleId || '')) {
    renderComments(activeArticleId);
  }
  if (state.currentView === 'comments') {
    renderCommentsIndexView();
  }
  renderLatestComments();
  renderStats();
}

function renderComments(articleId) {
  const panel = document.getElementById('commentPanel');
  const list = document.getElementById('commentList');
  const nameInput = document.getElementById('commentNameInput');
  if (!panel || !list) return;

  panel.style.display = articleId ? 'block' : 'none';
  if (!articleId) {
    closeCommentComposer();
    return;
  }

  if (nameInput) nameInput.value = state.commentName || '';

  const comments = state.commentsByArticle[articleId] || [];
  if (!comments.length) {
    list.innerHTML = '<div class="comment-item"><div class="comment-body">まだコメントはありません。</div></div>';
    return;
  }

  list.innerHTML = comments.map((c) => {
    const date = formatHomeMetaDateTime(c.ts);
    return `
      <div class="comment-item">
        <div class="comment-head">
          <div>
            <span class="comment-author">${escapeHtml(c.name || '匿名')}</span>
            <span class="comment-date"> ${date}</span>
          </div>
          ${state.isAdmin ? `<span class="comment-admin-actions admin-row-actions"><button class="admin-article-btn admin-row-btn" type="button" onclick="editComment('${escapeHtml(c.id)}')">編集</button><button class="admin-article-btn danger admin-row-btn" type="button" onclick="deleteComment('${escapeHtml(c.id)}')">削除</button></span>` : ''}
        </div>
        <div class="comment-body">${linkifyUrls(c.body)}</div>
      </div>
    `;
  }).join('');
}

async function addComment() {
  const articleId = state.currentArticleId;
  if (!articleId) return;

  const nameInput = document.getElementById("commentNameInput");
  const bodyInput = document.getElementById("commentBodyInput");
  if (!nameInput || !bodyInput) return;

  const name = (nameInput.value || "").trim();
  const body = (bodyInput.value || "").trim();
  if (!body) {
    toast("コメント本文を入力してください", "error");
    return;
  }

  state.commentName = name;
  if (!COMMENTS_SERVER_ENABLED) {
    localStorage.setItem(STORAGE_KEYS.commentName, name);
  }

  if (COMMENTS_SERVER_ENABLED) {
    const synced = await postCommentToServer(articleId, { name: name || "匿名", body });
    if (!synced) {
      toast("サーバーへの投稿に失敗しました。通信環境を確認して再試行してください", "error");
      return;
    }

    bodyInput.value = "";
    closeCommentComposer();
    await syncServerStateToUi({
      analytics: true,
      comments: true,
      glossary: false,
      requests: false,
      commentsLimit: 30,
      render: true,
      currentArticleComments: true,
    });
    toast("コメントを投稿しました", "success");
    return;
  }

  const item = {
    id: String(Date.now()) + "_" + Math.random().toString(36).slice(2, 8),
    name: name || "匿名",
    body: body,
    ts: new Date().toISOString(),
  };

  if (!state.commentsByArticle[articleId]) state.commentsByArticle[articleId] = [];
  state.commentsByArticle[articleId].unshift(item);
  state.commentsByArticle[articleId] = state.commentsByArticle[articleId].slice(0, 100);

  saveComments();
  bodyInput.value = "";
  renderComments(articleId);
  renderLatestComments();
  closeCommentComposer();
  toast("コメントを保存しました", "success");
}

async function editComment(commentId, articleId = '') {
  const targetArticleId = resolveCommentArticleId(commentId, articleId);
  if (!targetArticleId || !state.commentsByArticle[targetArticleId]) return;
  if (!state.isAdmin) {
    toast('編集は管理者パスワード入力後のみ実行できます', 'error');
    return;
  }

  const current = (state.commentsByArticle[targetArticleId] || []).find((c) => String(c.id) === String(commentId));
  if (!current) {
    toast('コメントが見つかりません', 'error');
    return;
  }

  const nextBody = prompt('コメントを編集', current.body || '');
  if (nextBody === null) return;
  if (!nextBody.trim()) {
    toast('コメント本文を入力してください', 'error');
    return;
  }

  const localOnly = String(commentId).includes('_');
  if (COMMENTS_SERVER_ENABLED && !localOnly) {
    const commentsLimit = state.currentView === 'comments' ? COMMENT_INDEX_LIMIT : 30;
    const data = await fetchCommentsApi('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update',
        payload: {
          comment_id: String(commentId),
          body: nextBody.trim(),
          editor_key: state.adminKey,
        },
      }),
    });
    if (!data || !data.ok) {
      toast(`更新に失敗しました${data && data.error ? `（${data.error}）` : ''}`, 'error');
      return;
    }
    await syncServerStateToUi({
      analytics: true,
      comments: true,
      glossary: false,
      requests: false,
      commentsLimit,
      render: true,
      currentArticleComments: state.currentArticleId === targetArticleId,
    });
    toast('コメントを更新しました', 'success');
    return;
  }

  state.commentsByArticle[targetArticleId] = (state.commentsByArticle[targetArticleId] || []).map((c) => (
    String(c.id) === String(commentId)
      ? { ...c, body: nextBody.trim() }
      : c
  ));
  saveComments();
  refreshCommentUiAfterMutation(targetArticleId);
  toast('コメントを更新しました', 'success');
}

async function deleteComment(commentId, articleId = '') {
  const targetArticleId = resolveCommentArticleId(commentId, articleId);
  if (!targetArticleId || !state.commentsByArticle[targetArticleId]) return;
  if (!state.isAdmin) {
    toast("削除は管理者パスワード入力後のみ実行できます", "error");
    return;
  }

  const localOnly = String(commentId).includes("_");

  if (COMMENTS_SERVER_ENABLED && !localOnly && state.isAdmin) {
    const deleted = await deleteCommentFromServer(targetArticleId, commentId);
    if (!(deleted && deleted.ok)) {
      const reason = deleted && deleted.error ? `（${deleted.error}）` : '';
      toast(`削除に失敗しました${reason}`, "error");
      return;
    }

    const commentsLimit = state.currentView === 'comments' ? COMMENT_INDEX_LIMIT : 30;
    await syncServerStateToUi({
      analytics: true,
      comments: true,
      glossary: false,
      requests: false,
      commentsLimit,
      render: true,
      currentArticleComments: state.currentArticleId === targetArticleId,
    });
    toast("コメントを削除しました", "success");
    return;
  }

  state.commentsByArticle[targetArticleId] = (state.commentsByArticle[targetArticleId] || []).filter((c) => c.id !== commentId);
  saveComments();
  refreshCommentUiAfterMutation(targetArticleId);
  toast("コメントを削除しました", "success");
}

function stripHtmlToText(html) {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitSearchWords(text) {
  const normalized = normalizeSearchText(text)
    .replace(/[!?！？。、，．・「」『』【】\[\]（）()]/g, ' ')
    .replace(/[^a-z0-9ぁ-んァ-ヶ一-龠々ー/+._\-\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) return [];

  return normalized
    .split(' ')
    .map((w) => w.trim())
    .filter((w) => w.length >= 2 && !SEARCH_STOPWORDS.has(w));
}

function collectDictionaryKeywords() {
  const set = new Set();

  (state.articleIndex || []).forEach((article) => {
    const parts = [article.title || '', article.cat || '', ...((article.tags || []).map((t) => tagLabel(t)))];
    parts.forEach((part) => {
      splitSearchWords(part).forEach((token) => {
        if (token.length >= 2) set.add(token);
      });
    });
  });

  getAllGlossaryTerms().forEach((g) => {
    splitSearchWords(g.term).forEach((token) => {
      if (token.length >= 2) set.add(token);
    });
  });

  return [...set];
}

function compactSearchToken(value) {
  return normalizeSearchText(value || '').replace(/\s+/g, '');
}

function buildDictionarySynonymMap() {
  const map = new Map();
  DICT_KUN_SYNONYM_GROUPS.forEach((group) => {
    const normalized = group
      .map((item) => compactSearchToken(item))
      .filter(Boolean);
    normalized.forEach((token) => {
      if (!map.has(token)) map.set(token, new Set());
      const bucket = map.get(token);
      normalized.forEach((sibling) => bucket.add(sibling));
    });
  });
  return map;
}

const DICT_KUN_SYNONYM_MAP = buildDictionarySynonymMap();

function expandDictionarySearchTokens(tokens) {
  const seed = [...new Set((tokens || []).map((x) => compactSearchToken(x)).filter(Boolean))];
  const out = new Set(seed);
  const queue = [...seed];

  while (queue.length) {
    const token = queue.shift();
    DICT_KUN_SYNONYM_MAP.forEach((synonyms, key) => {
      if (!(token === key || token.includes(key) || key.includes(token))) return;
      synonyms.forEach((syn) => {
        if (out.has(syn)) return;
        out.add(syn);
        queue.push(syn);
      });
    });
  }
  return [...out];
}

function getAllGlossaryTerms() {
  const merged = getGlossaryTermsMerged();
  return Array.isArray(merged) && merged.length ? merged : (GLOSSARY_TERMS || []);
}

function tokenizeForSearch(text) {
  const normalizedQuestion = normalizeDictionaryQuestion(text) || normalizeSearchText(text);
  const compactQuery = compactSearchToken(normalizedQuestion);
  const directTokens = splitSearchWords(normalizedQuestion);
  const dictionaryTokens = collectDictionaryKeywords()
    .filter((kw) => compactQuery.includes(compactSearchToken(kw)))
    .slice(0, 16);

  const base = [...new Set([normalizedQuestion, ...directTokens, ...dictionaryTokens])]
    .map((token) => compactSearchToken(token))
    .filter((token) => token.length >= 2 && !SEARCH_STOPWORDS.has(token));

  return expandDictionarySearchTokens(base);
}

function normalizeDictionaryQuestion(text) {
  return normalizeSearchText(text)
    .replace(/について教えて/g, '')
    .replace(/とは何/g, '')
    .replace(/とは/g, '')
    .replace(/を教えて/g, '')
    .replace(/って何/g, '')
    .replace(/ってなに/g, '')
    .replace(/なに/g, '')
    .replace(/何/g, '')
    .replace(/教えて/g, '')
    .replace(/\?/g, '')
    .trim();
}

function findDirectDictionaryMatches(query) {
  const normalized = normalizeDictionaryQuestion(query);
  if (!normalized) return [];

  const normalizedCompact = compactSearchToken(normalized);
  const expandedTokens = expandDictionarySearchTokens([normalizedCompact, ...splitSearchWords(normalized)]);
  const direct = [];

  for (const article of (state.articleIndex || [])) {
    if (!article || !article.id || isArticleDeleted(article.id)) continue;
    const title = compactSearchToken(article.title || '');
    const cat = compactSearchToken(article.cat || '');
    const tags = (article.tags || []).map((t) => compactSearchToken(tagLabel(t)));
    const keywords = getArticleKeywordTags(article, 20).map((t) => compactSearchToken(t));
    let score = 0;

    if (title === normalizedCompact) score += 100;
    else if (title === normalizedCompact) score += 96;
    else if (title.includes(normalized)) score += 60;

    if (cat === normalizedCompact) score += 30;
    if (tags.some((tag) => tag === normalizedCompact)) score += 24;
    if (keywords.some((kw) => kw === normalizedCompact)) score += 20;

    expandedTokens.forEach((token) => {
      if (!token || token.length < 2) return;
      if (title === token) score += 36;
      else if (title.includes(token)) score += 16;
      if (cat.includes(token)) score += 8;
      if (tags.some((tag) => tag.includes(token))) score += 8;
      if (keywords.some((kw) => kw.includes(token))) score += 6;
    });

    if (score > 0) {
      direct.push({ article, score });
    }
  }

  return direct.sort((a, b) => b.score - a.score);
}

function pickRepresentativeArticleForKeyword(keyword) {
  const normalized = normalizeDictionaryQuestion(keyword) || normalizeSearchText(keyword);
  if (!normalized) return null;
  const compact = normalized.replace(/\s+/g, '');
  const candidates = (state.articleIndex || []).filter((article) => article && article.id && !isArticleDeleted(article.id));
  let best = null;

  candidates.forEach((article) => {
    const title = normalizeSearchText(article.title || '');
    const cat = normalizeSearchText(article.cat || '');
    const tags = (article.tags || []).map((t) => normalizeSearchText(tagLabel(t)));
    let score = 0;

    if (title === normalized || title.replace(/\s+/g, '') === compact) score += 120;
    else if (title.includes(normalized) || title.replace(/\s+/g, '').includes(compact)) score += 80;

    if (cat.includes(normalized)) score += 24;
    if (tags.some((tag) => tag === normalized || tag.includes(normalized))) score += 20;
    if (getArticleKeywordTags(article, 12).some((tag) => {
      const key = normalizeHashtagKey(tag);
      return key === compact || key.includes(compact);
    })) score += 16;

    if (!best || score > best.score) best = { article, score };
  });

  return best && best.score > 0 ? best.article : null;
}

function findGuidedDictionaryMatch(query) {
  const normalized = normalizeDictionaryQuestion(query);
  const compact = normalized.replace(/\s+/g, '');
  if (!compact) return null;

  const guided = Object.entries(DICT_KUN_GUIDE_MAP)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([alias]) => compact.includes(normalizeSearchText(alias).replace(/\s+/g, '')));

  if (guided) {
    const articleId = resolveArticleIdByTitleSmart(guided[1], '');
    const article = (state.articleIndex || []).find((x) => x.id === articleId);
    if (article && !isArticleDeleted(article.id)) return article;
  }

  const glossaryHit = getAllGlossaryTerms()
    .map((item) => normalizeDisplayText(item.term || ''))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .find((term) => compact.includes(normalizeSearchText(term).replace(/\s+/g, '')));

  if (glossaryHit) {
    const article = pickRepresentativeArticleForKeyword(glossaryHit);
    if (article) return article;
  }

  return pickRepresentativeArticleForKeyword(normalized);
}

function findGlossaryMatchesForQuery(query, limit = 3) {
  const normalized = normalizeDictionaryQuestion(query) || normalizeSearchText(query);
  const compact = compactSearchToken(normalized);
  if (!compact) return [];

  const tokens = expandDictionarySearchTokens([compact, ...splitSearchWords(normalized)])
    .map((token) => compactSearchToken(token))
    .filter((token) => token.length >= 2 && !SEARCH_STOPWORDS.has(token));

  const scored = [];
  for (const item of getAllGlossaryTerms()) {
    if (!item) continue;
    const term = normalizeDisplayText(item.term || '').trim();
    const desc = normalizeDisplayText(item.desc || '').trim();
    if (!term) continue;

    const termCompact = compactSearchToken(term);
    const descCompact = compactSearchToken(desc);
    let score = 0;

    if (termCompact === compact) score += 160;
    else if (termCompact.includes(compact) || compact.includes(termCompact)) score += 80;
    if (descCompact.includes(compact)) score += 14;

    tokens.forEach((token) => {
      if (!token) return;
      if (termCompact === token) score += 48;
      else if (termCompact.includes(token)) score += 18;
      if (descCompact.includes(token)) score += 6;
    });

    if (score > 0) scored.push({ term, desc, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, Math.min(5, Number(limit) || 3)));
}

function scoreArticleForQuery(article, queryNorm, tokens) {
  const title = compactSearchToken(article.title || '');
  const cat = compactSearchToken(article.cat || '');
  const tags = (article.tags || []).map((t) => compactSearchToken(tagLabel(t)));
  const keywordTags = getArticleKeywordTags(article, 20).map((t) => compactSearchToken(t));
  const haystack = `${title} ${cat} ${tags.join(' ')} ${keywordTags.join(' ')}`;
  const queryCompact = compactSearchToken(queryNorm);

  let score = 0;
  if (queryCompact && title === queryCompact) score += 120;
  else if (queryCompact && title.includes(queryCompact)) score += 42;
  if (queryCompact && cat.includes(queryCompact)) score += 22;
  if (queryCompact && haystack.includes(queryCompact)) score += 10;

  for (const tk of tokens) {
    if (!tk) continue;
    if (title === tk) score += 34;
    else if (title.includes(tk)) score += 14;

    if (cat.includes(tk)) score += 10;
    if (tags.some((tag) => tag.includes(tk))) score += 8;
    if (keywordTags.some((tag) => tag.includes(tk))) score += 8;
    if (haystack.includes(tk)) score += 4;
  }
  return score;
}

function scoreArticleContentForQuery(article, queryNorm, tokens) {
  if (!article) return 0;
  const bodyHtml = resolveToolContent(article, '基本') || '';
  const plain = normalizeSearchText(stripHtmlToText(normalizeDisplayText(bodyHtml)));
  if (!plain) return 0;
  const queryCompact = compactSearchToken(queryNorm);

  let score = 0;
  if (queryCompact && plain.includes(queryCompact)) score += 16;
  for (const tk of tokens) {
    if (!tk) continue;
    if (plain.includes(tk)) score += 6;
  }
  return score;
}

async function rerankDictionaryCandidatesWithContent(scored, queryNorm, tokens, limit = 3) {
  const base = Array.isArray(scored) ? scored.slice(0, 8) : [];
  if (!base.length) return [];

  const enriched = await Promise.all(base.map(async (item) => {
    const articleMeta = item && item.article ? item.article : null;
    if (!articleMeta || !articleMeta.id) return null;
    const loaded = await loadArticle(articleMeta.id);
    if (!loaded) return { article: articleMeta, score: Number(item.score || 0) };
    const contentScore = scoreArticleContentForQuery(loaded, queryNorm, tokens);
    const mergedMeta = {
      ...articleMeta,
      title: loaded.title || articleMeta.title,
      cat: loaded.cat || articleMeta.cat,
      tags: Array.isArray(loaded.tags) ? loaded.tags : (articleMeta.tags || []),
    };
    return { article: mergedMeta, score: Number(item.score || 0) + contentScore };
  }));

  return enriched
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function appendDictKunMessage(role, html) {
  const log = document.getElementById('dictKunLog');
  if (!log) return;
  const div = document.createElement('div');
  div.className = `dict-msg ${role}`;
  const meta = role === 'user' ? 'あなた' : 'ノートくん';
  div.innerHTML = `<span class="meta">${meta}</span>${html}`;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function ensureDictKunGreeting() {
  const log = document.getElementById('dictKunLog');
  if (!log) return;
  if (log.childElementCount > 0) return;
  appendDictKunMessage('bot', '質問ありがとう。ノートデータから近い答えを探してみるよ。');
}

function syncDictKunFabRingState() {
  const wrap = document.querySelector('.kun-fab-ring-wrap');
  if (!wrap) return;
  const dismissed = localStorage.getItem(STORAGE_KEYS.dictKunRingDismissed) === '1';
  wrap.classList.toggle('is-ring-dismissed', dismissed);
}

function dismissDictKunFabRing() {
  localStorage.setItem(STORAGE_KEYS.dictKunRingDismissed, '1');
  syncDictKunFabRingState();
}

function applyDictKunRingQueryFlags() {
  let params = null;
  try {
    params = new URLSearchParams(window.location.search || '');
  } catch {
    return;
  }
  const ring = String(params.get('ring') || '').trim().toLowerCase();
  if (ring !== 'reset') return;

  localStorage.removeItem(STORAGE_KEYS.dictKunRingDismissed);
  params.delete('ring');

  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash || ''}`;
  if ((window.location.protocol === 'http:' || window.location.protocol === 'https:')
    && history
    && typeof history.replaceState === 'function') {
    history.replaceState(history.state || null, '', nextUrl);
  }
}

function openDictionaryKunChat() {
  dismissDictKunFabRing();
  const modal = document.getElementById('dictKunModal');
  if (!modal) return;
  modal.classList.add('open');
  ensureDictKunGreeting();
  const input = document.getElementById('dictKunInput');
  setTimeout(() => { if (input) input.focus(); }, 40);
}

function closeDictionaryKunChat() {
  const modal = document.getElementById('dictKunModal');
  if (modal) modal.classList.remove('open');
}

function handleDictionaryKunKey(event) {
  const isImeComposing = event.isComposing || event.keyCode === 229;
  if (isImeComposing) return;

  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendDictionaryKunQuestion();
  }
}

async function answerFromDictionary(query) {
  const guidedArticle = findGuidedDictionaryMatch(query);
  const directMatches = findDirectDictionaryMatches(query);
  const queryNorm = normalizeDictionaryQuestion(query) || normalizeSearchText(query);
  const tokens = tokenizeForSearch(query);

  const candidates = (state.articleIndex || []).filter((a) => !isArticleDeleted(a.id));
  const scoredBase = (directMatches.length ? directMatches : candidates
    .map((a) => ({ article: a, score: scoreArticleForQuery(a, queryNorm, tokens) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score));

  const scored = [];
  const seen = new Set();
  const pushArticle = (article, score) => {
    if (!article || !article.id || seen.has(article.id)) return;
    seen.add(article.id);
    scored.push({ article, score });
  };

  if (guidedArticle) pushArticle(guidedArticle, 999);
  scoredBase.forEach((item) => pushArticle(item.article, item.score));
  const reranked = await rerankDictionaryCandidatesWithContent(scored, queryNorm, tokens, 3);
  const finalScored = reranked.length ? reranked : scored.slice(0, 3);

  if (!finalScored.length) {
    const glossaryMatches = findGlossaryMatchesForQuery(query, 3);
    if (glossaryMatches.length) {
      const top = glossaryMatches[0];
      const relatedLinks = [];
      const seen = new Set();
      glossaryMatches.forEach((item) => {
        const article = pickRepresentativeArticleForKeyword(item.term);
        if (!article || !article.id || seen.has(article.id)) return;
        seen.add(article.id);
        relatedLinks.push(article);
      });

      const descPreview = top.desc.length > 110 ? `${top.desc.slice(0, 110)}…` : top.desc;
      return {
        text: `用語集だと「${normalizeDisplayText(top.term)}」が近いです。${descPreview}`,
        links: relatedLinks.slice(0, 3),
      };
    }

    return {
      text: '近い記事が見つからなかったよ。短い単語で聞くと探しやすいです。例えば「UX」「要件定義」「WBS」みたいに聞いてみて。',
      links: []
    };
  }

  const top = finalScored[0].article;
  const guidedHit = !!(guidedArticle && guidedArticle.id === top.id);
  const directHit = directMatches.length > 0 && directMatches[0].article && directMatches[0].article.id === top.id;
  const summary = guidedHit
    ? `「${normalizeDisplayText(top.title)}」がいちばん近いです。まずはこの記事を見ればOK。`
    : directHit
      ? `「${normalizeDisplayText(top.title)}」の記事が近いです。これを見ればOK。`
      : `いちばん近いのは「${normalizeDisplayText(top.title)}」です。まずこの記事を見るのがおすすめ。`;

  return {
    text: summary,
    links: finalScored.map((x) => x.article),
  };
}

function suggestDictKunAdvice(query) {
  const q = normalizeSearchText(query).replace(/\s+/g, '');

  if (q.includes('要件定義')) {
    return [
      '目的・対象ユーザー・成功条件の3点を最初に揃える',
      '要望は「課題→要件」の順で整理する',
      '優先度をMust/Should/Couldで分ける',
    ];
  }

  if (q.includes('wbs') || q.includes('進行管理') || q.includes('スケジュール')) {
    return [
      '成果物ベースでタスク分解する',
      '担当者と期限を1行で明記する',
      '依存関係のあるタスクを先に可視化する',
    ];
  }

  if (q.includes('qa') || q.includes('品質') || q.includes('テスト')) {
    return [
      '受け入れ条件を先に定義する',
      '再現手順・期待値・実際の挙動をセットで記録する',
      '致命度で優先順位を揃える',
    ];
  }

  return [
    'まずは基本版を読み、要点を3つメモする',
    '実案件に当てはめて目的・担当・期限を明確にする',
    '迷いが残る箇所はコメントに残して改善につなげる',
  ];
}

async function sendDictionaryKunQuestion() {
  const input = document.getElementById('dictKunInput');
  if (!input) return;

  const q = (input.value || '').trim();
  if (!q) return;

  appendDictKunMessage('user', escapeHtml(q));
  input.value = '';

  const res = await answerFromDictionary(q);
  const topLinks = (res.links || []).slice(0, 3);
  const linksHtml = topLinks.length
    ? `<div class="dict-links">${topLinks.map((a, index) => `<button class="dict-link-btn" onclick="showArticle('${a.id}'); closeDictionaryKunChat();">${index === 0 ? 'この記事を見る: ' : ''}${escapeHtml(normalizeDisplayText(a.title))}</button>`).join('')}</div>`
    : '';

  appendDictKunMessage('bot', `${escapeHtml(res.text)}${linksHtml}`);
}

async function loadArticle(id) {
  if (!id) return null;

  const applyServerOverrideIfNeeded = async () => {
    if (!COMMENTS_SERVER_ENABLED) return;
    if (state.serverArticleOverrideChecked.has(id)) {
      const cachedOverride = normalizeServerArticle((state.articleOverrides || {})[id], id);
      if (cachedOverride && !state.articleMap.has(id)) {
        state.articleMap.set(id, cachedOverride);
        updateArticleIndexEntry(id, cachedOverride);
      }
      return;
    }
    state.serverArticleOverrideChecked.add(id);
    const override = await loadArticleOverrideFromServer(id);
    if (!override) return;
    const current = state.articleMap.get(id);
    if (shouldPreferIncomingArticle(current, override)) {
      state.articleMap.set(id, override);
      updateArticleIndexEntry(id, override);
    }
    state.articleOverrides[id] = override;
    saveArticleOverrides();
  };

  if (state.articleMap.has(id)) {
    if (!state.useEmbeddedData) {
      try {
        const sourceArticle = COMMENTS_SERVER_ENABLED
          ? await loadStaticArticleFromServer(id)
          : await loadJson(`./data/articles/${id}.json`);
        if (sourceArticle) {
          const current = state.articleMap.get(id);
          if (shouldPreferIncomingArticle(current, sourceArticle)) {
            state.articleMap.set(id, sourceArticle);
            updateArticleIndexEntry(id, sourceArticle);
          }
        }
      } catch {
        // noop: keep current cached article when static file is unavailable
      }
    }
    await applyServerOverrideIfNeeded();
    return state.articleMap.get(id) || null;
  }

  if (state.useEmbeddedData && window.DIR_DATA && window.DIR_DATA.articles) {
    const embeddedArticle = window.DIR_DATA.articles[id] || null;
    if (embeddedArticle) {
      state.articleMap.set(id, embeddedArticle);
      await applyServerOverrideIfNeeded();
      renderStats();
      return state.articleMap.get(id);
    }
    await applyServerOverrideIfNeeded();
    return state.articleMap.get(id) || null;
  }

  try {
    const article = COMMENTS_SERVER_ENABLED
      ? (await loadStaticArticleFromServer(id))
      : (await loadJson(`./data/articles/${id}.json`));
    if (!article) throw new Error('article not found');
    state.articleMap.set(id, article);
    await applyServerOverrideIfNeeded();
    renderStats();
    return state.articleMap.get(id) || article;
  } catch {
    await applyServerOverrideIfNeeded();
    return state.articleMap.get(id) || null;
  }
}


function sanitizeArticleHtml(rawHtml) {
  if (!rawHtml) return '';

  const template = document.createElement('template');
  template.innerHTML = String(rawHtml);

  const allowedTags = new Set(['P', 'BR', 'UL', 'OL', 'LI', 'STRONG', 'EM', 'B', 'I', 'H1', 'H2', 'H3', 'H4', 'BLOCKQUOTE', 'CODE', 'PRE', 'A', 'DIV', 'SPAN', 'IFRAME', 'IMG']);
  const allowedDivClasses = new Set(['highlight', 'video-embed']);

  const walk = (node) => {
    if (!node || !node.childNodes) return;
    [...node.childNodes].forEach((child) => {
      if (child.nodeType !== Node.ELEMENT_NODE) return walk(child);

      const tag = child.tagName.toUpperCase();
      if (!allowedTags.has(tag)) {
        const text = document.createTextNode(child.textContent || '');
        child.replaceWith(text);
        return;
      }

      [...child.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = String(attr.value || '').trim();

        if (name.startsWith('on') || name === 'style') {
          child.removeAttribute(attr.name);
          return;
        }

        if (tag === 'A') {
          if (name === 'href') {
            if (!/^https?:\/\//i.test(value)) child.removeAttribute('href');
            return;
          }
          if (name === 'target' || name === 'rel') return;
          child.removeAttribute(attr.name);
          return;
        }

        if (tag === 'IFRAME') {
          if (name === 'src') {
            if (!/^https:\/\/www\.youtube\.com\/embed\/[A-Za-z0-9_-]{11}/.test(value)) child.removeAttribute('src');
            return;
          }
          if (['title', 'loading', 'referrerpolicy', 'allow', 'allowfullscreen'].includes(name)) return;
          child.removeAttribute(attr.name);
          return;
        }

        if (tag === 'IMG') {
          if (name === 'src') {
            if (!/^(https?:\/\/|\/|\.\.?\/|data:image\/(?:png|jpe?g|webp|gif);base64,|data:image\/svg\+xml(?:;[^,]*)?,)/i.test(value)) child.removeAttribute('src');
            return;
          }
          if (['alt', 'loading', 'decoding', 'referrerpolicy', 'width', 'height', 'class'].includes(name)) return;
          child.removeAttribute(attr.name);
          return;
        }

        if (name === 'class' && tag === 'DIV') {
          const kept = value.split(/\s+/).filter((c) => allowedDivClasses.has(c));
          if (kept.length) child.setAttribute('class', kept.join(' '));
          else child.removeAttribute('class');
          return;
        }

        if (name === 'class') {
          child.removeAttribute('class');
          return;
        }

        child.removeAttribute(attr.name);
      });

      if (tag === 'A') {
        child.setAttribute('target', '_blank');
        child.setAttribute('rel', 'noopener noreferrer');
      }
      if (tag === 'IMG') {
        if (!child.getAttribute('loading')) child.setAttribute('loading', 'lazy');
        if (!child.getAttribute('decoding')) child.setAttribute('decoding', 'async');
      }

      walk(child);
    });
  };

  walk(template.content);
  return template.innerHTML;
}

function renderArticleHtml(rawHtml) {
  if (!rawHtml) return '';
  const safeHtml = sanitizeArticleHtml(rawHtml);
  const rewrittenHtml = safeHtml
    .replaceAll('https://drsp.cc/dic/', 'https://drsp.cc/app/note/')
    .replaceAll('https://drsp.cc/dic', 'https://drsp.cc/app/note')
    .replaceAll('/dic/', '/app/note/');

  const urlPattern = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})[^\s<]*)/g;

  const extractYouTubeId = (text) => {
    if (!text) return null;
    const src = String(text).trim();

    const direct = src.match(/^(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})[^\s<]*)$/);
    if (direct) return direct[2];

    const markdown = src.match(/^\[[^\]]*\]\((https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})[^)]*)\)$/);
    if (markdown) return markdown[2];

    const anchor = src.match(/^<a[^>]+href=["'](https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})[^"']*)["'][^>]*>.*<\/a>$/i);
    if (anchor) return anchor[2];

    return null;
  };

  const converted = rewrittenHtml.replace(/<p>([\s\S]*?)<\/p>/g, (block, inner) => {
    const id = extractYouTubeId(inner);
    if (id) {
      return `
<div class="video-embed">
  <iframe src="https://www.youtube.com/embed/${id}" title="YouTube video" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>
`;
    }
    return block.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  });
  return injectGlossaryInlineTerms(converted);
}


function resolveArticleIdByTitleSmart(title, preferredCat = '') {
  if (!title) return '';

  const direct = state.articleIdByTitle.get(title);
  if (direct) return direct;

  const queryNorm = normalizeSearchText(title);
  const tokens = tokenizeForSearch(title);
  const prefNorm = normalizeSearchText(preferredCat || '');

  let best = null;
  let bestScore = 0;

  for (const article of (state.articleIndex || [])) {
    const aid = article.id;
    if (!aid) continue;
    if (isArticleDeleted(aid) && !state.isAdmin) continue;

    let base = scoreArticleForQuery(article, queryNorm, tokens);

    if (prefNorm) {
      const catNorm = normalizeSearchText(article.cat || '');
      if (catNorm.includes(prefNorm) || prefNorm.includes(catNorm)) {
        base += 4;
      }
    }

    if (base > bestScore) {
      best = aid;
      bestScore = base;
    }
  }

  return best && bestScore > 0 ? best : title;
}

async function openArticleByTitle(title, explicitId, preferredCat) {
  closeMobileSidebar();
  closeMobileMenu();
  const id = explicitId || resolveArticleIdByTitleSmart(title, preferredCat || "");
  if (isArticleDeleted(id) && !state.isAdmin) {
    toast('このページは非公開になっています', 'error');
    return;
  }
  await showArticle(id);
}


function findCategoryIdByName(catName) {
  const target = normalizeDisplayText(catName || '').trim();
  if (!target) return null;
  const list = state.categories || [];
  for (const c of list) {
    if (!c) continue;
    const name = normalizeDisplayText(c.name || '').trim();
    if (name === target) return c.id || null;
  }
  return null;
}

function normalizeEyebrow(article) {
  const raw = normalizeDisplayText((article && article.eyebrow ? article.eyebrow : '').trim());
  if (!raw) return (article && article.cat) ? article.cat : 'ディレクション';
  if (raw === '新規記事') return (article && article.cat) ? article.cat : 'ディレクション';

  const map = {
    'PLANNING': '企画・プロデュース',
    'INFORMATION ARCHITECTURE': '情報設計・仕様設計',
    'PRODUCTION DIRECTION': '制作・開発ディレクション',
    'OPERATIONS': 'サービス運営・運用',
    'PROMOTION': 'プロモーション',
    'WRITING': 'ライティング',
    'TOOLS': 'ツール・効率化',
    'HIRING': 'ディレクター採用',
    'UI DESIGN': '情報設計・仕様設計',
    'COMMUNICATION': '制作・開発ディレクション',
    'PROJECT OPS': '制作・開発ディレクション',
    'GROWTH': 'プロモーション',
    'DIRECTION': 'ディレクション',
  };

  const upper = raw.toUpperCase();
  if (map[upper]) return map[upper];
  if (/[A-Z]/.test(raw) && article && article.cat) return article.cat;
  return raw;
}

function renderArticleUpdatedAt(article) {
  const el = document.getElementById('articleUpdatedAt');
  if (!el) return;
  if (!article || typeof article !== 'object') {
    el.textContent = '';
    return;
  }
  const raw = pickLatestTimestamp(
    article.updatedAt, article.updated_at, article.ts,
    article.createdAt, article.created_at,
  );
  const date = formatPostDateTime(raw);
  el.textContent = date ? `更新日 ${date}` : '';
}

async function showArticle(id, options = {}) {
  const { skipHistory = false, replaceHistory = false } = options;
  closeMobileSidebar();
  closeMobileMenu();
  state.currentArticleId = id;
  const articleGroupEl = document.getElementById('articleGroup');
  const articleGroupSepEl = document.getElementById('articleGroupSep');
  const articleCatEl = document.getElementById('articleCat');
  const articleCatSepEl = document.getElementById('articleCatSep');

  const setCrumbLinkState = (el, active, onclick) => {
    if (!el) return;
    if (active) {
      el.classList.add('breadcrumb-home-link');
      el.onclick = onclick;
    } else {
      el.classList.remove('breadcrumb-home-link');
      el.onclick = null;
    }
  };

  const setArticleBreadcrumb = ({
    groupLabel = '',
    groupOnclick = null,
    catLabel = '',
    catOnclick = null,
  } = {}) => {
    const hasGroup = !!groupLabel;
    const hasCat = !!catLabel;

    if (articleGroupEl) {
      articleGroupEl.textContent = groupLabel || '';
      articleGroupEl.style.display = hasGroup ? '' : 'none';
    }
    setCrumbLinkState(articleGroupEl, hasGroup && typeof groupOnclick === 'function', groupOnclick);

    if (articleCatEl) {
      articleCatEl.textContent = catLabel || '';
      articleCatEl.style.display = hasCat ? '' : 'none';
    }
    setCrumbLinkState(articleCatEl, hasCat && typeof catOnclick === 'function', catOnclick);

    if (articleGroupSepEl) articleGroupSepEl.style.display = hasGroup && hasCat ? '' : 'none';
    if (articleCatSepEl) articleCatSepEl.style.display = (hasGroup || hasCat) ? '' : 'none';
  };

  const article = await loadArticle(id);

  // 端末ローカルの古い非表示フラグで、サーバー配信済み記事が見えなくなる問題を回避する
  if (isArticleDeleted(id) && !state.isAdmin) {
    if (!isForceHiddenArticle(id) && article) {
      state.deletedArticles.delete(id);
      saveSet(STORAGE_KEYS.deletedArticles, state.deletedArticles);
    } else {
      toast('このページは非公開になっています', 'error');
      showView('home', { skipHistory: true });
      return;
    }
  }

  if (!article) {
    setArticleBreadcrumb({
      groupLabel: 'ノート',
      groupOnclick: () => {
        showDictionaryTopView();
      },
    });
    document.getElementById('articleName').textContent = id;
    document.getElementById('articleEyebrow').textContent = 'DIRECTION';
    document.getElementById('articleTitle').textContent = id;
    renderArticleUpdatedAt(null);
    renderArticleEditorMeta(null);
    document.getElementById('articleTagsHeader').innerHTML = '';
    const toolTabsEl = document.getElementById('toolTabs');
    toolTabsEl.innerHTML = '';
    toolTabsEl.style.display = 'none';
    document.getElementById('articleBody').innerHTML = `
      <p>このページのコンテンツはまもなく追加されます。</p>
      <div class="highlight">DiSAがブラッシュアップ中のコンテンツです。お楽しみに！</div>
    `;
    renderArticleSiblingNav(id);
    updateSeoForRoute('article', {
      articleId: id,
      article: { id, title: id, cat: 'ノート', content: { 基本: 'このページのコンテンツはまもなく追加されます。' } },
    });
    renderComments('');
    syncAdminArticleActions();
    showView('article', { skipHistory: true });
    if (!skipHistory) syncHistory('article', id, replaceHistory);
    return;
  }

  const displayCat = canonicalCategoryNameByArticleId(id) || normalizeDisplayText(article.cat);
  const articleForView = { ...article, cat: displayCat };
  const catId = findCategoryIdByName(displayCat);
  if (catId) {
    const groupKey = categoryGroupKeyByCategoryId(catId);
    setArticleBreadcrumb({
      groupLabel: categoryGroupLabelByKey(groupKey),
      groupOnclick: () => {
        showCategoryGroupTopView(groupKey);
      },
      catLabel: displayCat,
      catOnclick: () => {
        setCategoryGroup(groupKey);
        showCategory(catId);
      },
    });
  } else {
    setArticleBreadcrumb({
      catLabel: displayCat,
    });
  }
  document.getElementById('articleName').textContent = normalizeDisplayText(article.title);
  document.getElementById('articleEyebrow').textContent = normalizeEyebrow(articleForView);
  document.getElementById('articleTitle').textContent = normalizeDisplayText(article.title);
  renderArticleUpdatedAt(articleForView);
  renderArticleEditorMeta(articleForView);
  updateSeoForRoute('article', { articleId: id, article: articleForView });


  const expandedTools = getExpandedTools(article);
  const visibleTools = expandedTools.filter((tool) => tool !== '基本');

  state.currentTool = visibleTools.includes(state.toolPref)
    ? state.toolPref
    : (visibleTools[0] || '基本');

  renderArticleTags(article, state.currentTool);

  const toolTabsEl = document.getElementById('toolTabs');
  toolTabsEl.innerHTML = visibleTools.map((tool) => `
    <button class="tool-tab ${tool === state.currentTool ? 'active' : ''}"
      onclick="switchTool('${id}', '${tool}', this)">${toolDisplayName(tool)}</button>
  `).join('');
  toolTabsEl.style.display = visibleTools.length ? 'flex' : 'none';

  document.getElementById('articleBody').innerHTML = renderArticleHtml(normalizeDisplayText(resolveToolContent(article, state.currentTool)));
  ensureArticleBodyGlossaryBinding();
  renderArticleSiblingNav(id);
  await loadCommentsForArticle(id, true);
  renderComments(id);
  syncAdminArticleActions();
  showView('article', { skipHistory: true });
  if (!skipHistory) syncHistory('article', id, replaceHistory);
}

function buildArticleSequence() {
  return (state.articleIndex || [])
    .filter((a) => a && a.id && !isArticleDeleted(a.id))
    .slice()
    .sort((a, b) => {
      const ta = new Date(a.updatedAt || a.updated_at || a.ts || BASE_CONTENT_UPDATED_AT).getTime();
      const tb = new Date(b.updatedAt || b.updated_at || b.ts || BASE_CONTENT_UPDATED_AT).getTime();
      return tb - ta;
    });
}

function renderArticleSiblingNav(currentArticleId) {
  const root = document.getElementById('articleSiblingNav');
  const prevBtn = document.getElementById('articlePrevBtn');
  const nextBtn = document.getElementById('articleNextBtn');
  if (!root || !prevBtn || !nextBtn) return;

  const seq = buildArticleSequence();
  const currentIndex = seq.findIndex((a) => String(a.id) === String(currentArticleId || ''));
  if (currentIndex < 0) {
    root.style.display = 'none';
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  const prevArticle = seq[currentIndex + 1] || null;
  const nextArticle = seq[currentIndex - 1] || null;

  root.style.display = 'grid';

  if (prevArticle) {
    prevBtn.disabled = false;
    prevBtn.onclick = () => showArticle(prevArticle.id);
    prevBtn.innerHTML = `<span class="article-sibling-dir">‹ 前の記事</span><span class="article-sibling-title">${escapeHtml(normalizeDisplayText(prevArticle.title || ''))}</span>`;
  } else {
    prevBtn.disabled = true;
    prevBtn.onclick = null;
    prevBtn.innerHTML = '<span class="article-sibling-dir">‹ 前の記事</span><span class="article-sibling-title">これより前はありません</span>';
  }

  if (nextArticle) {
    nextBtn.disabled = false;
    nextBtn.onclick = () => showArticle(nextArticle.id);
    nextBtn.innerHTML = `<span class="article-sibling-dir">次の記事 ›</span><span class="article-sibling-title">${escapeHtml(normalizeDisplayText(nextArticle.title || ''))}</span>`;
  } else {
    nextBtn.disabled = true;
    nextBtn.onclick = null;
    nextBtn.innerHTML = '<span class="article-sibling-dir">次の記事 ›</span><span class="article-sibling-title">これより新しい記事はありません</span>';
  }
}

async function switchTool(articleId, tool, btn) {
  const article = await loadArticle(articleId);
  if (!article) return;
  state.currentTool = tool;
  state.toolPref = tool;
  localStorage.setItem(STORAGE_KEYS.toolPref, tool);
  document.querySelectorAll('.tool-tab').forEach((t) => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('articleBody').innerHTML = renderArticleHtml(normalizeDisplayText(resolveToolContent(article, tool)));
  ensureArticleBodyGlossaryBinding();
  renderArticleTags(article, tool);
}

function syncBookmarkButton() {
  const btn = document.getElementById('bookmarkBtn');
  if (!btn || !state.currentArticleId) return;
  const on = state.bookmarks.has(state.currentArticleId);
  btn.textContent = on ? '★ ブックマーク済み' : '☆ ブックマーク';
  btn.classList.toggle('active', on);
}

function toggleBookmark() {
  if (!state.currentArticleId) return;
  if (state.bookmarks.has(state.currentArticleId)) state.bookmarks.delete(state.currentArticleId);
  else state.bookmarks.add(state.currentArticleId);
  saveSet(STORAGE_KEYS.bookmarks, state.bookmarks);
  syncBookmarkButton();
}

function buildPublicArticleUrl(articleId) {
  const host = 'https://drsp.cc/app/note';
  return `${host}/?view=article&id=${encodeURIComponent(articleId)}`;
}

function shareArticleOnX() {
  if (!state.currentArticleId) {
    toast('記事を開いてから共有してください', 'error');
    return;
  }

  const article = state.articleMap.get(state.currentArticleId) || state.articleIndex.find((a) => a.id === state.currentArticleId);
  const title = normalizeDisplayText((article && article.title) ? article.title : state.currentArticleId);
  const text = `「${title}」
#ノートapp #ディレクションノートβ`;
  const url = buildPublicArticleUrl(state.currentArticleId);
  const intent = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

  openXIntent(intent, 640, 720);
}

function toggleProgress(articleId) {
  if (state.progress.has(articleId)) state.progress.delete(articleId);
  else state.progress.add(articleId);
  saveSet(STORAGE_KEYS.progress, state.progress);
  renderCurriculum();
  updateLearnMobileBar();
}

function getCurriculumArticleIds() {
  return getCurrentCurriculum()
    .map((c) => c.id || resolveArticleIdByTitleSmart(c.title, c.cat || ""))
    .filter(Boolean);
}

function getNextCurriculumArticleId(currentId) {
  const ids = getCurriculumArticleIds();
  if (!ids.length) return null;

  const currentIndex = ids.indexOf(currentId);
  if (currentIndex >= 0) {
    for (let i = currentIndex + 1; i < ids.length; i += 1) {
      if (!state.progress.has(ids[i])) return ids[i];
    }
  }

  for (const id of ids) {
    if (!state.progress.has(id)) return id;
  }
  return null;
}

function toggleCurrentArticleProgress() {
  if (!state.currentArticleId) return;
  toggleProgress(state.currentArticleId);
}

async function openNextCurriculumArticle() {
  const nextId = getNextCurriculumArticleId(state.currentArticleId);
  if (!nextId) {
    toast('今のレベルはすべて完了しています', 'success');
    return;
  }
  await showArticle(nextId);
}

function updateLearnMobileBar() {
  // 学習導線を廃止したため no-op
}

function handleCatHeaderKeydown(event, categoryId) {
  if (!event) return;
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    showCategory(categoryId);
  }
}

function toggleCat(event, el) {
  if (event) event.stopPropagation();
  const header = event ? el.closest('.cat-header') : el;
  if (!header) return;
  const items = header.nextElementSibling;
  const willOpen = !header.classList.contains('open');
  header.classList.toggle('open', willOpen);
  header.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  if (items) items.classList.toggle('open', willOpen);
}

function scrollViewportTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

  const scroller = document.scrollingElement || document.documentElement || document.body;
  if (scroller) scroller.scrollTop = 0;

  // Main pane is the actual scroll container in this app layout.
  const main = document.querySelector('.main');
  if (main) {
    main.scrollTop = 0;
    if (typeof main.scrollTo === 'function') {
      main.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }
}

function syncHeaderRouteButtons() {
  const activeRoute = (state.currentView === 'requests' || state.currentView === 'comments' || state.currentView === 'glossary' || state.currentView === 'editors')
    ? state.currentView
    : '';
  document.querySelectorAll('.header-route-btn').forEach((btn) => {
    const route = String(btn.getAttribute('data-route') || '').trim();
    const isActive = !!activeRoute && route === activeRoute;
    btn.classList.toggle('route-active', isActive);
    if (isActive) btn.setAttribute('aria-current', 'page');
    else btn.removeAttribute('aria-current');
  });
}

function showView(view, options = {}) {
  const { skipHistory = false, replaceHistory = false } = options;
  const homeViewEl = document.getElementById('homeView');
  const articleViewEl = document.getElementById('articleView');
  const categoryViewEl = document.getElementById('categoryView');
  const dictionaryTopViewEl = document.getElementById('dictionaryTopView');
  const appendixTopViewEl = document.getElementById('appendixTopView');
  const toolsViewEl = document.getElementById('toolsView');
  const requestsViewEl = document.getElementById('requestsView');
  const commentsViewEl = document.getElementById('commentsView');
  const glossaryViewEl = document.getElementById('glossaryView');
  const editorsViewEl = document.getElementById('editorsView');

  if (homeViewEl) homeViewEl.style.display = 'none';
  if (articleViewEl) articleViewEl.classList.remove('visible');
  if (categoryViewEl) categoryViewEl.classList.remove('visible');
  if (dictionaryTopViewEl) dictionaryTopViewEl.classList.remove('visible');
  if (appendixTopViewEl) appendixTopViewEl.classList.remove('visible');
  if (toolsViewEl) toolsViewEl.classList.remove('visible');
  if (requestsViewEl) requestsViewEl.classList.remove('visible');
  if (commentsViewEl) commentsViewEl.classList.remove('visible');
  if (glossaryViewEl) glossaryViewEl.classList.remove('visible');
  if (editorsViewEl) editorsViewEl.classList.remove('visible');

  if (view === 'home' && homeViewEl) homeViewEl.style.display = 'block';
  else if (view === 'article' && articleViewEl) articleViewEl.classList.add('visible');
  else if (view === 'category' && categoryViewEl) categoryViewEl.classList.add('visible');
  else if (view === 'dictionary' && dictionaryTopViewEl) dictionaryTopViewEl.classList.add('visible');
  else if (view === 'appendix' && appendixTopViewEl) appendixTopViewEl.classList.add('visible');
  else if (view === 'glossary' && glossaryViewEl) glossaryViewEl.classList.add('visible');
  else if (view === 'tools' && toolsViewEl) toolsViewEl.classList.add('visible');
  else if (view === 'requests' && requestsViewEl) requestsViewEl.classList.add('visible');
  else if (view === 'comments' && commentsViewEl) commentsViewEl.classList.add('visible');
  else if (view === 'editors' && editorsViewEl) editorsViewEl.classList.add('visible');

  state.currentView = view;
  syncHeaderRouteButtons();
  if (view === 'home') updateSeoForRoute('home');
  else if (view === 'dictionary') updateSeoForRoute('dictionary');
  else if (view === 'appendix') updateSeoForRoute('appendix');
  else if (view === 'requests') updateSeoForRoute('requests');
  else if (view === 'comments') updateSeoForRoute('comments');
  else if (view === 'editors') updateSeoForRoute('editors');
  scrollViewportTop();
  syncHeaderCompactState();

  if (view === 'home' && COMMENTS_SERVER_ENABLED) {
    hydrateCommentsFromServer(30).then(() => {
      renderLatestComments();
      renderStats();
    }).catch(() => {});
  }
  document.body.classList.toggle('article-view-open', view === 'article');
  if (view === 'article') clearSearchInput();
  updateModeButtonsForView(view);
  updateMobileBottomNav();
  if (view !== 'home') closeMobileMenu();
  closeHeaderAdminMenu();
  if (!skipHistory) {
    const articleId = view === 'article' ? state.currentArticleId : null;
    syncHistory(view, articleId, replaceHistory);
  }
  syncAdminArticleActions();
  updateLearnMobileBar();
}

function setMode(mode, btn) {
  document.querySelectorAll('.mode-btn').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  showView('home');
  if (window.innerWidth <= 768) openMobileSidebar();
}

function applyLevelSelection() {
  document.querySelectorAll('.level-card').forEach((c) => c.classList.remove('selected'));
  const picked = document.querySelector(`.level-${state.selectedLevel}`);
  if (picked) picked.classList.add('selected');
}

function selectLevel(level, el) {
  state.selectedLevel = Number(level);
  localStorage.setItem(STORAGE_KEYS.level, String(level));
  document.querySelectorAll('.level-card').forEach((c) => c.classList.remove('selected'));
  el.classList.add('selected');
  renderCurriculum();
  updateLearnMobileBar();
  toast(`レベル ${level} を設定しました`, 'success');
}

function normalizeSearchText(text) {
  return normalizeDisplayText(text || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function syncSearchClearButton(rawQuery) {
  const clearBtn = document.getElementById('searchClearBtn');
  if (!clearBtn) return;
  clearBtn.classList.toggle('visible', String(rawQuery || '').trim().length > 0);
}

function handleSearchInput(inputEl) {
  const value = inputEl ? inputEl.value : '';
  const sidebar = document.getElementById('sidebarSearchInput');
  const main = document.getElementById('mainSearchInput');
  const mobile = document.getElementById('mobileSearchInput');
  if (sidebar && inputEl && inputEl.id !== 'sidebarSearchInput' && sidebar.value !== value) sidebar.value = value;
  if (main && inputEl && inputEl.id !== 'mainSearchInput' && main.value !== value) main.value = value;
  if (mobile && inputEl && inputEl.id !== 'mobileSearchInput' && mobile.value !== value) mobile.value = value;
  filterItems(value);
}

function handleMobileSearchInput(inputEl) {
  const value = inputEl ? inputEl.value : '';
  const sidebar = document.getElementById('sidebarSearchInput');
  const main = document.getElementById('mainSearchInput');
  if (sidebar) sidebar.value = value;
  if (main) main.value = value;
  openMobileSidebar();
  filterItems(value);
}

function clearSearchInput(opts = {}) {
  const input = document.getElementById('sidebarSearchInput');
  const main = document.getElementById('mainSearchInput');
  const mobile = document.getElementById('mobileSearchInput');
  if (input) {
    input.value = '';
    if (opts.focus) input.focus();
  }
  if (main) main.value = '';
  if (mobile) mobile.value = '';
  filterItems('');
}

function filterItems(q) {
  const sections = document.querySelectorAll('.cat-section');
  const query = normalizeSearchText(q);
  syncSearchClearButton(q);

  if (!query) {
    sections.forEach((section) => {
      const header = section.querySelector('.cat-header');
      const itemsWrap = section.querySelector('.cat-items');
      const items = section.querySelectorAll('.cat-item');
      section.style.display = '';
      items.forEach((i) => { i.style.display = ''; });
      if (header && itemsWrap) {
        header.classList.remove('open');
        itemsWrap.classList.remove('open');
      }
    });
    return;
  }

  sections.forEach((section) => {
    const header = section.querySelector('.cat-header');
    const itemsWrap = section.querySelector('.cat-items');
    const items = section.querySelectorAll('.cat-item');

    let matchedCount = 0;
    items.forEach((i) => {
      const hit = normalizeSearchText(i.textContent).includes(query);
      i.style.display = hit ? '' : 'none';
      if (hit) matchedCount += 1;
    });

    const catName = normalizeSearchText(section.querySelector('.cat-name')?.textContent || '');
    const catHit = catName.includes(query);
    const visible = catHit || matchedCount > 0;
    section.style.display = visible ? '' : 'none';

    if (header && itemsWrap && visible) {
      header.classList.add('open');
      itemsWrap.classList.add('open');
      if (catHit && matchedCount === 0) {
        items.forEach((i) => { i.style.display = ''; });
      }
    }
  });
}

function openMobileSidebar() {
  if (window.innerWidth > 768) return;
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (!sidebar || !overlay) return;
  sidebar.classList.add('mobile-open');
  overlay.classList.add('open');
  closeMobileMenu();
  updateMobileBottomNav();
}

function closeMobileSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('mobile-open');
  if (overlay) overlay.classList.remove('open');
  updateMobileBottomNav();
}

function toggleMobileMenu() {
  const panel = document.getElementById('mobileMenuPanel');
  const overlay = document.getElementById('mobileMenuOverlay');
  if (!panel || !overlay) return;
  const willOpen = !panel.classList.contains('open');
  panel.classList.toggle('open', willOpen);
  overlay.classList.toggle('open', willOpen);
  if (willOpen) closeMobileSidebar();
}

function closeMobileMenu() {
  const panel = document.getElementById('mobileMenuPanel');
  const overlay = document.getElementById('mobileMenuOverlay');
  if (panel) panel.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

function openMobileSearchDrawer() {
  if (window.innerWidth > 768) return;
  openMobileSidebar();
  const mobile = document.getElementById('mobileSearchInput');
  const sidebar = document.getElementById('sidebarSearchInput');
  if (sidebar) {
    if (mobile && mobile.value) sidebar.value = mobile.value;
    filterItems(sidebar.value || '');
    setTimeout(() => sidebar.focus(), 40);
  }
}

function goProgressFromBottomNav() {
  showView('home');
}

function updateMobileBottomNav() {
  // Bottom nav removed: keep as compatibility no-op.
}

function syncHeaderCompactState() {
  const header = document.querySelector('.header');
  if (!header) return;
  // PCでもヘッダーは固定表示。スクロール時の縮小/変形を無効化。
  header.classList.remove('is-scrolled');
}

function syncAdminArticleActions() {
  const wrap = document.getElementById('adminArticleActions');
  if (!wrap) return;
  const canShow = state.isAdmin && state.currentView === 'article' && !!state.currentArticleId;
  wrap.classList.toggle('visible', canShow);
}

function syncRequestPostButton() {
  const btn = document.getElementById('requestPostBtn');
  if (!btn) return;
  btn.style.display = state.isAdmin ? 'none' : 'inline-flex';
}

function syncEditorManageButton() {
  const btn = document.getElementById('editorManageBtn');
  if (!btn) return;
  btn.style.display = (state.isAdmin && !isMobileAdminRestricted()) ? 'inline-flex' : 'none';
}

function syncHeaderAdminMenu() {
  const wrap = document.getElementById('headerAdminMenu');
  const btn = document.getElementById('headerAdminMenuBtn');
  if (!wrap || !btn) return;
  const isAdmin = !!state.isAdmin;
  if (!isAdmin) wrap.classList.remove('is-open');
  wrap.classList.toggle('is-admin', isAdmin);
  btn.textContent = isAdmin ? '運営メニュー ▾' : '管理者キー';
  btn.setAttribute('aria-expanded', wrap.classList.contains('is-open') ? 'true' : 'false');

  const mobileCreateBtn = document.getElementById('mobileCreateArticleBtn');
  if (mobileCreateBtn) mobileCreateBtn.style.display = isAdmin ? 'block' : 'none';
}

function closeHeaderAdminMenu() {
  const wrap = document.getElementById('headerAdminMenu');
  if (!wrap) return;
  wrap.classList.remove('is-open');
  const btn = document.getElementById('headerAdminMenuBtn');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

function toggleHeaderAdminMenu(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  if (!state.isAdmin) {
    closeHeaderAdminMenu();
    showAdmin();
    return;
  }
  const wrap = document.getElementById('headerAdminMenu');
  if (!wrap) return;
  const willOpen = !wrap.classList.contains('is-open');
  wrap.classList.toggle('is-open', willOpen);
  const btn = document.getElementById('headerAdminMenuBtn');
  if (btn) btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
}

function buildArticleCreateId(rawId, title) {
  const normalizeId = (value) => String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[._-]+|[._-]+$/g, '')
    .slice(0, 120);

  const direct = normalizeId(rawId);
  if (direct) return direct;
  const fromTitle = normalizeId(title);
  const seed = fromTitle || 'article';
  return `${seed}_${Date.now()}`;
}

function articleIdExists(id) {
  const key = String(id || '').trim();
  if (!key) return false;
  if (state.articleMap.has(key)) return true;
  return (state.articleIndex || []).some((item) => String(item && item.id ? item.id : '') === key);
}

function setArticleCreateNotice(msg = '', type = '') {
  const el = document.getElementById('articleCreateNotice');
  if (!el) return;
  el.textContent = msg;
  el.className = `admin-key-notice${type ? ` ${type}` : ''}`;
}

function normalizeArticleCreateMode(mode) {
  return mode === 'source' ? 'source' : 'manual';
}

function setArticleCreateMode(mode) {
  state.articleCreateMode = normalizeArticleCreateMode(mode);
  const isSource = state.articleCreateMode === 'source';
  const manualBtn = document.getElementById('articleCreateModeManual');
  const sourceBtn = document.getElementById('articleCreateModeSource');
  const manualFields = document.getElementById('articleCreateManualFields');
  const sourceWrap = document.getElementById('articleCreateSourceWrap');
  const hint = document.getElementById('articleCreateModeHint');
  const sourceInput = document.getElementById('articleCreateSourceUrlInput');
  const submitBtn = document.getElementById('articleCreateSubmitBtn');

  if (manualBtn) manualBtn.classList.toggle('active', !isSource);
  if (sourceBtn) sourceBtn.classList.toggle('active', isSource);
  if (manualFields) manualFields.style.display = isSource ? 'none' : 'grid';
  if (sourceWrap) sourceWrap.style.display = isSource ? 'block' : 'none';
  if (hint) {
    hint.textContent = isSource
      ? '参考URLだけ入力すると、要点をリライトした本文下書きを自動作成します。'
      : 'まっさらな本文テンプレートを作成します。';
  }
  if (submitBtn) {
    submitBtn.textContent = isSource ? '読み取りして作成' : '作成して編集';
  }
  if (!isSource && sourceInput) sourceInput.value = '';
}

function populateArticleCreateCategoryOptions() {
  const select = document.getElementById('articleCreateCategoryInput');
  if (!select) return;
  const current = normalizeDisplayText((select.value || '').trim());
  const names = [];
  const seen = new Set();
  (state.categories || []).forEach((cat) => {
    const name = normalizeDisplayText((cat && cat.name) || '');
    if (!name || seen.has(name)) return;
    seen.add(name);
    names.push(name);
  });
  if (!names.length) names.push('ツール・効率化');
  select.innerHTML = names.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('');
  if (current && names.includes(current)) {
    select.value = current;
    return;
  }
  select.value = names[0];
}

function clearArticleCreateForm() {
  const titleInput = document.getElementById('articleCreateTitleInput');
  const idInput = document.getElementById('articleCreateIdInput');
  const categoryInput = document.getElementById('articleCreateCategoryInput');
  const eyebrowInput = document.getElementById('articleCreateEyebrowInput');
  const tagsInput = document.getElementById('articleCreateTagsInput');
  const sourceInput = document.getElementById('articleCreateSourceUrlInput');
  if (titleInput) titleInput.value = '';
  if (idInput) idInput.value = '';
  if (categoryInput) categoryInput.value = normalizeDisplayText((state.categories[0] && state.categories[0].name) || 'ツール・効率化');
  if (eyebrowInput) eyebrowInput.value = '';
  if (tagsInput) tagsInput.value = '';
  if (sourceInput) sourceInput.value = '';
  setArticleCreateMode('source');
  setArticleCreateNotice('', '');
}

function openCreateArticleModal() {
  if (!state.isAdmin) {
    showAdmin();
    return;
  }
  closeHeaderAdminMenu();
  closeMobileMenu();
  populateArticleCreateCategoryOptions();
  clearArticleCreateForm();
  const modal = document.getElementById('articleCreateModal');
  if (!modal) return;
  modal.classList.add('open');
  const sourceInput = document.getElementById('articleCreateSourceUrlInput');
  const titleInput = document.getElementById('articleCreateTitleInput');
  setTimeout(() => {
    if (state.articleCreateMode === 'source' && sourceInput) {
      sourceInput.focus();
      return;
    }
    if (titleInput) titleInput.focus();
  }, 40);
}

function closeCreateArticleModal() {
  const modal = document.getElementById('articleCreateModal');
  if (modal) modal.classList.remove('open');
}

function buildArticleDraftBodyFromSourceUrl(sourceUrl) {
  const safeUrl = sanitizeUrl(sourceUrl || '');
  if (!safeUrl) {
    return '<p>本文を入力してください。</p>';
  }
  const escaped = escapeHtml(safeUrl);
  return `<p>参考URL: <a href="${escaped}" target="_blank" rel="noopener noreferrer">${escaped}</a></p><p>要点を整理して本文を作成してください。</p>`;
}

async function fetchArticleSourceDigestFromServer(sourceUrl) {
  if (!COMMENTS_SERVER_ENABLED) return { ok: false, error: 'server disabled' };
  const editorKey = state.isAdmin ? state.adminKey : '';
  const data = await fetchCommentsApi('', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(editorKey ? { 'X-Editor-Key': editorKey } : {}),
    },
    body: JSON.stringify({
      action: 'article_source_digest',
      payload: {
        source_url: sourceUrl,
        ...(editorKey ? { editor_key: editorKey } : {}),
      },
    }),
  });
  return data || { ok: false, error: 'unknown error' };
}

function normalizeDigestLine(raw, max = 140) {
  const text = normalizeDisplayText(String(raw || '').trim()).replace(/\s+/g, ' ');
  if (!text) return '';
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function buildArticleDraftBodyFromSourceDigest(sourceUrl, source = {}, articleTitle = '') {
  const safeUrl = sanitizeUrl(sourceUrl || source.url || '');
  const safeTitle = normalizeDigestLine(source.title || '', 120);
  const safeDescription = normalizeDigestLine(source.description || '', 220);
  const pointPool = []
    .concat(Array.isArray(source.summary_points) ? source.summary_points : [])
    .concat(Array.isArray(source.headings) ? source.headings : [])
    .concat(Array.isArray(source.paragraphs) ? source.paragraphs : []);
  const points = [];
  const seen = new Set();
  pointPool.forEach((item) => {
    if (points.length >= 5) return;
    const line = normalizeDigestLine(item, 120);
    if (!line || seen.has(line)) return;
    seen.add(line);
    points.push(line);
  });
  const paraPool = Array.isArray(source.paragraphs) ? source.paragraphs : [];
  const paragraphs = [];
  const paraSeen = new Set();
  paraPool.forEach((item) => {
    if (paragraphs.length >= 3) return;
    const line = normalizeDigestLine(item, 220);
    if (!line || paraSeen.has(line)) return;
    paraSeen.add(line);
    paragraphs.push(line);
  });

  const escapedUrl = safeUrl ? escapeHtml(safeUrl) : '';
  const escapedTitle = escapeHtml(safeTitle || normalizeDisplayText(articleTitle || '参考サイト'));
  const escapedDescription = escapeHtml(safeDescription || '参考サイトの内容をもとに、本文のたたきを生成しました。公開前に必ず一次情報を確認してください。');
  const pointsHtml = points.length
    ? `<ul class="point-list">${points.map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul>`
    : '<p>参考URLから要点を抽出中です。本文を追記してください。</p>';
  const paragraphHtml = paragraphs.length
    ? paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')
    : '<p>背景や前提を追記してください。</p>';

  return [
    '<h3>10秒でわかる！要点まとめ</h3>',
    pointsHtml,
    '<h3>1. 概要</h3>',
    `<p>${escapedDescription}</p>`,
    '<h3>2. 参考サイトのポイント（リライト下書き）</h3>',
    paragraphHtml,
    '<h3>3. 参考情報</h3>',
    `<p>参考タイトル: ${escapedTitle}</p>`,
    escapedUrl ? `<p>参考URL: <a href="${escapedUrl}" target="_blank" rel="noopener noreferrer">${escapedUrl}</a></p>` : '<p>参考URL: なし</p>',
    '<div class="highlight">この本文は参考サイトをもとに生成した下書きです。公開前に内容の確認と追記を行ってください。</div>',
  ].join('\n');
}

async function submitCreateArticle() {
  if (!state.isAdmin) {
    showAdmin();
    return;
  }
  const titleInput = document.getElementById('articleCreateTitleInput');
  const idInput = document.getElementById('articleCreateIdInput');
  const categoryInput = document.getElementById('articleCreateCategoryInput');
  const eyebrowInput = document.getElementById('articleCreateEyebrowInput');
  const tagsInput = document.getElementById('articleCreateTagsInput');
  const sourceInput = document.getElementById('articleCreateSourceUrlInput');
  if (!titleInput || !idInput || !categoryInput || !eyebrowInput || !tagsInput || !sourceInput) return;

  const createMode = normalizeArticleCreateMode(state.articleCreateMode);
  const sourceUrlRaw = String(sourceInput.value || '').trim();
  const sourceUrl = sourceUrlRaw ? sanitizeUrl(sourceUrlRaw) : '';
  const category = normalizeDisplayText((categoryInput.value || '').trim()) || 'ツール・効率化';
  let title = '';
  let articleId = '';
  let eyebrow = '';
  let tags = [];
  let draftBody = '<p>本文を入力してください。</p>';

  if (createMode === 'source') {
    if (!sourceUrlRaw || !sourceUrl) {
      setArticleCreateNotice('URLを読ませる場合は、参考URL（http(s)）を入力してください', 'error');
      return;
    }
    if (!COMMENTS_SERVER_ENABLED) {
      setArticleCreateNotice('URL読み取りはサーバーモードでのみ利用できます', 'error');
      return;
    }

    setArticleCreateNotice('参考URLの本文を読み取り中です...', '');
    const digest = await fetchArticleSourceDigestFromServer(sourceUrl);
    if (!digest || !digest.ok || !digest.source) {
      setArticleCreateNotice(`参考URLの読み取りに失敗しました${digest && digest.error ? `（${digest.error}）` : ''}`, 'error');
      return;
    }

    const source = digest.source || {};
    const digestTitle = normalizeDisplayText((source.title || '').trim());
    const host = normalizeDisplayText(String(source.host || '').replace(/^www\./, '').trim());
    const stamp = formatPostDateTime(new Date().toISOString()).replace(/\s/g, '');
    title = digestTitle || (host ? `${host} 参考リライト` : `参考リライト ${stamp}`);
    articleId = buildArticleCreateId('', title);
    eyebrow = '参考リライト';
    tags = [];
    draftBody = buildArticleDraftBodyFromSourceDigest(sourceUrl, digest.source || {}, title);
    setArticleCreateNotice('参考URLから本文下書きを生成しました', 'success');
  } else {
    title = normalizeDisplayText((titleInput.value || '').trim());
    if (!title) {
      setArticleCreateNotice('記事タイトルを入力してください', 'error');
      return;
    }
    articleId = buildArticleCreateId(idInput.value || '', title);
    if (!articleId) {
      setArticleCreateNotice('記事IDを生成できませんでした', 'error');
      return;
    }
    if (articleIdExists(articleId)) {
      setArticleCreateNotice('同じ記事IDがすでに存在します。記事IDを変更してください', 'error');
      return;
    }
    eyebrow = normalizeDisplayText((eyebrowInput.value || '').trim()) || category || '新規記事';
    tags = parseEditorTagsInput(tagsInput.value || '');
  }

  if (!articleId) {
    setArticleCreateNotice('記事IDを生成できませんでした', 'error');
    return;
  }

  const now = new Date().toISOString();
  const next = {
    id: articleId,
    title,
    cat: category,
    eyebrow,
    tags,
    content: {
      '基本': draftBody,
    },
    createdAt: now,
    updatedAt: now,
  };

  if (COMMENTS_SERVER_ENABLED) {
    const result = await upsertArticleOverrideToServer(articleId, next);
    if (!result || !result.ok) {
      setArticleCreateNotice(`記事作成に失敗しました${result && result.error ? `（${result.error}）` : ''}`, 'error');
      return;
    }
  }

  state.articleMap.set(articleId, next);
  updateArticleIndexEntry(articleId, next);
  state.articleOverrides[articleId] = next;
  state.serverArticleOverrideChecked.add(articleId);
  saveArticleOverrides();

  closeCreateArticleModal();
  await showArticle(articleId);
  await showArticleEditor();
  toast('新規記事を作成しました。本文を編集してください', 'success');
}

function isMobileAdminRestricted() {
  const ua = String((navigator && navigator.userAgent) || '');
  return /Android.+Mobile|iPhone|iPod|Windows Phone|webOS|BlackBerry/i.test(ua);
}

function normalizeEditableTag(value) {
  const t = normalizeDisplayText(String(value || ''))
    .normalize('NFKC')
    .replace(/^#+/, '')
    .trim();
  if (!t) return '';
  const compact = t.replace(/\s+/g, '');
  if (!compact) return '';
  const lowered = /^[A-Za-z0-9_./+-]+$/.test(compact) ? compact.toLowerCase() : compact;
  return lowered.slice(0, 32);
}

function parseEditorTagsInput(raw) {
  const text = String(raw || '').trim();
  if (!text) return [];
  const expanded = text
    .replace(/＃/g, '#')
    .replace(/#/g, ' #')
    .trim();
  const parts = expanded.split(/[\s,、，]+/g);
  const out = [];
  const seen = new Set();
  parts.forEach((part) => {
    const token = String(part || '').trim();
    if (!token) return;
    const normalizedToken = token.startsWith('#') ? token : `#${token}`;
    const tag = normalizeEditableTag(normalizedToken);
    if (!tag || seen.has(tag)) return;
    seen.add(tag);
    out.push(tag);
  });
  return out.slice(0, 12);
}

function normalizeArticleEditorProfile(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const id = String(raw.id || raw.editorId || '').trim();
  const name = normalizeDisplayText(String(raw.name || raw.editorName || '').trim());
  const role = normalizeDisplayText(String(raw.role || raw.editorRole || '').trim());
  const bio = normalizeDisplayText(String(raw.bio || raw.editorBio || '').trim());
  const xHandle = normalizeEditorHandle(raw.xHandle || raw.x_handle || raw.x || '');
  const avatarUrl = sanitizeUrl(raw.avatarUrl || raw.avatar_url || raw.avatar || '');
  if (!name && !id) return null;
  return { id, name, role, bio, xHandle, avatarUrl };
}

function getArticleEditorProfile(article) {
  if (!article || typeof article !== 'object') return null;
  const embedded = normalizeArticleEditorProfile(
    article.editor || article.editorProfile || article.editorInfo || null
  );
  const editorId = String(article.editorId || '').trim();
  if (!editorId) return embedded && embedded.name ? embedded : null;
  const found = getEditorsSorted().find((item) => String(item.id) === editorId);
  if (!found) return embedded && embedded.name ? embedded : null;
  const preferDefined = (primary, fallback) => (
    primary === undefined || primary === null ? fallback : primary
  );
  const merged = normalizeArticleEditorProfile({
    id: editorId,
    name: preferDefined(found.name, embedded && embedded.name),
    role: preferDefined(found.role, embedded && embedded.role),
    bio: preferDefined(found.bio, embedded && embedded.bio),
    xHandle: preferDefined(found.xHandle, embedded && embedded.xHandle),
    avatarUrl: preferDefined(found.avatarUrl, embedded && embedded.avatarUrl),
  });
  return merged && merged.name ? merged : null;
}

function fillArticleEditorForm(profile) {
  const select = document.getElementById('articleEditEditorSelect');
  const nameInput = document.getElementById('articleEditEditorName');
  const roleInput = document.getElementById('articleEditEditorRole');
  const xInput = document.getElementById('articleEditEditorX');
  const bioInput = document.getElementById('articleEditEditorBio');
  const avatarInput = document.getElementById('articleEditEditorAvatar');
  if (!select || !nameInput || !roleInput || !xInput || !bioInput || !avatarInput) return;
  const p = profile || null;
  select.value = (p && p.id) ? String(p.id) : '';
  nameInput.value = p && p.name ? p.name : '';
  roleInput.value = p && p.role ? p.role : '';
  xInput.value = p && p.xHandle ? `@${p.xHandle}` : '';
  bioInput.value = p && p.bio ? p.bio : '';
  avatarInput.value = p && p.avatarUrl ? p.avatarUrl : '';
}

function populateArticleEditorSelect(selectedId = '') {
  const select = document.getElementById('articleEditEditorSelect');
  if (!select) return;
  const current = String(selectedId || '').trim();
  const list = getEditorsSorted();
  const hasCurrent = current && list.some((item) => String(item.id) === current);
  const options = ['<option value="">未設定</option>'];
  list.forEach((item) => {
    const id = String(item.id || '');
    if (!id) return;
    const label = `${normalizeDisplayText(item.name || '編集メンバー')} / ${normalizeDisplayText(item.role || '編集メンバー')}`;
    options.push(`<option value="${escapeHtml(id)}">${escapeHtml(label)}</option>`);
  });
  if (current && !hasCurrent) {
    options.push(`<option value="${escapeHtml(current)}">この記事の編集メンバー（保存済み）</option>`);
  }
  select.innerHTML = options.join('');
  select.value = current;
}

function applySelectedEditorToArticleForm() {
  const select = document.getElementById('articleEditEditorSelect');
  if (!select) return;
  const pickedId = String(select.value || '').trim();
  if (!pickedId) {
    fillArticleEditorForm(null);
    return;
  }
  const found = getEditorsSorted().find((item) => String(item.id) === pickedId);
  if (!found) return;
  fillArticleEditorForm(normalizeArticleEditorProfile(found));
}

function getAvailableArticleCategoryNames() {
  const out = [];
  const seen = new Set();
  const pushName = (raw) => {
    const name = normalizeDisplayText(raw || '').trim();
    const key = normalizeSearchText(name);
    if (!name || !key || seen.has(key)) return;
    seen.add(key);
    out.push(name);
  };
  (state.categories || []).forEach((cat) => {
    pushName(cat && cat.name ? cat.name : '');
  });
  (state.articleIndex || []).forEach((article) => {
    pushName(article && article.cat ? article.cat : '');
  });
  return out;
}

function populateArticleCategorySelect(selectedName = '') {
  const select = document.getElementById('articleEditCategorySelect');
  if (!select) return;
  const current = normalizeDisplayText(String(selectedName || '').trim());
  const names = getAvailableArticleCategoryNames();
  const optionKeys = new Set(names.map((name) => normalizeSearchText(name)));
  const currentKey = normalizeSearchText(current);
  const options = names.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`);

  if (current && currentKey && !optionKeys.has(currentKey)) {
    options.unshift(`<option value="${escapeHtml(current)}">${escapeHtml(current)}（現在値）</option>`);
  }
  if (!options.length) {
    options.push('<option value="ディレクション">ディレクション</option>');
  }

  select.innerHTML = options.join('');
  if (current) select.value = current;
  if (!select.value) select.selectedIndex = 0;
}

function collectArticleEditorProfileFromForm() {
  const select = document.getElementById('articleEditEditorSelect');
  const nameInput = document.getElementById('articleEditEditorName');
  const roleInput = document.getElementById('articleEditEditorRole');
  const xInput = document.getElementById('articleEditEditorX');
  const bioInput = document.getElementById('articleEditEditorBio');
  const avatarInput = document.getElementById('articleEditEditorAvatar');
  if (!select || !nameInput || !roleInput || !xInput || !bioInput || !avatarInput) return null;

  const pickedId = String(select.value || '').trim();
  if (!pickedId) return null;
  const picked = getEditorsSorted().find((item) => String(item.id) === pickedId);
  if (picked) {
    const profile = normalizeArticleEditorProfile(picked);
    return (profile && profile.name) ? profile : null;
  }

  // 旧データ互換: 一覧に存在しないIDが保存されている記事だけ、非表示フィールド値で維持する
  const legacy = normalizeArticleEditorProfile({
    id: pickedId,
    name: normalizeDisplayText((nameInput.value || '').trim()),
    role: normalizeDisplayText((roleInput.value || '').trim()),
    xHandle: normalizeEditorHandle((xInput.value || '').trim()),
    bio: normalizeDisplayText((bioInput.value || '').trim()),
    avatarUrl: sanitizeUrl((avatarInput.value || '').trim()),
  });
  return (legacy && legacy.name) ? legacy : null;
}

function renderArticleEditorMeta(article) {
  const root = document.getElementById('articleEditorMeta');
  if (!root) return;
  const profile = getArticleEditorProfile(article);
  if (!profile || !profile.name) {
    root.style.display = 'none';
    root.innerHTML = '';
    return;
  }
  const xUrl = editorXUrl(profile.xHandle);
  const xLabel = profile.xHandle ? `@${profile.xHandle}` : '';
  root.style.display = 'flex';
  root.innerHTML = `
    <img class="article-editor-avatar" src="${escapeHtml(editorAvatarUrl(profile))}" alt="${escapeHtml(profile.name)}">
    <span class="article-editor-text">
      <span class="article-editor-name">${escapeHtml(profile.name)}</span>
      ${profile.role ? `<span class="article-editor-role">${escapeHtml(profile.role)}</span>` : ''}
      ${xUrl ? `<a class="article-editor-x" href="${escapeHtml(xUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(xLabel)}</a>` : ''}
    </span>
  `;
}

async function showArticleEditor() {
  if (!state.isAdmin || !state.currentArticleId) return;
  const article = state.articleMap.get(state.currentArticleId);
  if (!article) return;

  closeMobileSidebar();
  closeMobileMenu();

  const tool = state.currentTool || '基本';
  const source = (article.content && article.content[tool])
    || (article.content && article.content['基本'])
    || '';

  const label = document.getElementById('articleEditToolLabel');
  const titleInput = document.getElementById('articleEditTitleInput');
  const categorySelect = document.getElementById('articleEditCategorySelect');
  const tagsInput = document.getElementById('articleEditTagsInput');
  const area = document.getElementById('articleEditContent');
  const mdArea = document.getElementById('articleEditMarkdown');
  const modal = document.getElementById('articleEditModal');
  const editorSelect = document.getElementById('articleEditEditorSelect');
  if (!label || !titleInput || !categorySelect || !tagsInput || !area || !mdArea || !modal || !editorSelect) return;

  label.textContent = `編集中タブ: ${toolDisplayName(tool)}`;
  titleInput.value = normalizeDisplayText(article.title || '');
  const currentCategory = normalizeDisplayText(article.cat || canonicalCategoryNameByArticleId(state.currentArticleId) || 'ディレクション');
  populateArticleCategorySelect(currentCategory);
  tagsInput.value = getArticleTagSeedsForEditor(article, 12).map((t) => `#${normalizeDisplayText(t)}`).join(' ');
  await ensureEditorsLoaded().catch(() => false);
  const articleEditor = getArticleEditorProfile(article);
  populateArticleEditorSelect(articleEditor && articleEditor.id ? articleEditor.id : '');
  fillArticleEditorForm(articleEditor);
  area.setAttribute('contenteditable', 'true');
  area.innerHTML = sanitizeArticleHtml(source);
  bindArticleEditorEvents();
  bindArticleEditorFilePicker();
  clearEditorImageSelection();
  const sourceText = String(source || '');
  const heavyInlineImage = /data:image\/[a-zA-Z0-9.+-]+(?:;[^,]*)?,[A-Za-z0-9+/=]{12000,}/.test(sourceText);
  mdArea.value = heavyInlineImage ? '' : htmlToMarkdown(sourceText);
  modal.classList.add('open');
  const preferredMode = heavyInlineImage ? 'rich' : (state.articleEditorMode || 'markdown');
  setArticleEditorMode(preferredMode);
  if (heavyInlineImage) {
    toast('大きな画像を含むため、リッチ編集モードで開きました', 'success');
  }

  setTimeout(() => {
    if (state.articleEditorMode === 'markdown') {
      mdArea.focus();
      return;
    }
    area.focus();
    try { placeCaretAtEnd(area); } catch (_) {}
  }, 60);
}

function closeArticleEditor() {
  const modal = document.getElementById('articleEditModal');
  if (modal) modal.classList.remove('open');
  clearEditorImageSelection();
}

async function saveArticleEdits() {
  if (!state.isAdmin || !state.currentArticleId) return;
  const article = await loadArticle(state.currentArticleId);
  if (!article) return;

  const tool = state.currentTool || '基本';
  const titleInput = document.getElementById('articleEditTitleInput');
  const categorySelect = document.getElementById('articleEditCategorySelect');
  const tagsInput = document.getElementById('articleEditTagsInput');
  const area = document.getElementById('articleEditContent');
  const mdArea = document.getElementById('articleEditMarkdown');
  if (!titleInput || !categorySelect || !tagsInput || !area || !mdArea) return;

  const nextTitle = normalizeDisplayText((titleInput.value || '').trim());
  if (!nextTitle) {
    toast('記事タイトルが空です', 'error');
    titleInput.focus();
    return;
  }

  const editMode = normalizeArticleEditorMode(state.articleEditorMode);
  let body = '';
  let plain = '';

  if (editMode === 'markdown') {
    plain = (mdArea.value || '').replace(/ +/g, ' ').trim();
    if (!plain) {
      toast('本文が空です', 'error');
      return;
    }
    body = sanitizeArticleHtml(markdownToHtml(mdArea.value || ''));
  } else {
    body = sanitizeArticleHtml((area.innerHTML || '').trim());
    plain = (area.textContent || '').replace(/ +/g, ' ').trim();
    if (!plain) {
      toast('本文が空です', 'error');
      return;
    }
  }

  const next = JSON.parse(JSON.stringify(article));
  next.title = nextTitle;
  const previousCategory = normalizeDisplayText(article.cat || '').trim();
  const selectedCategory = normalizeDisplayText((categorySelect.value || '').trim())
    || previousCategory
    || 'ディレクション';
  next.cat = selectedCategory;
  const previousEyebrowRaw = normalizeDisplayText((article.eyebrow || '').trim());
  const previousEyebrowLabel = normalizeEyebrow(article);
  if (!previousEyebrowRaw || previousEyebrowLabel === previousCategory) {
    next.eyebrow = selectedCategory;
  }
  if (!next.content) next.content = {};
  next.content[tool] = body;
  next.tags = parseEditorTagsInput(tagsInput.value || '');
  const editorProfile = collectArticleEditorProfileFromForm();
  if (editorProfile) {
    next.editorId = editorProfile.id || '';
    next.editor = editorProfile;
  } else {
    delete next.editorId;
    delete next.editor;
    delete next.editorProfile;
    delete next.editorInfo;
  }
  // Keep updatedAt monotonic so local/static fallback never overwrites just-saved edits.
  const nowTs = Date.now();
  const baseTs = Math.max(articleUpdatedAtTs(article), maxKnownArticleTimestamp(), nowTs);
  next.updatedAt = new Date(baseTs + 1000).toISOString();

  if (COMMENTS_SERVER_ENABLED) {
    const result = await upsertArticleOverrideToServer(state.currentArticleId, next);
    if (!result || !result.ok) {
      toast(`記事の保存に失敗しました${result && result.error ? `（${result.error}）` : ''}`, 'error');
      return;
    }
  }

  state.articleMap.set(state.currentArticleId, next);
  updateArticleIndexEntry(state.currentArticleId, next);
  state.articleOverrides[state.currentArticleId] = next;
  state.serverArticleOverrideChecked.add(state.currentArticleId);
  saveArticleOverrides();

  closeArticleEditor();
  await showArticle(state.currentArticleId, { skipHistory: true, replaceHistory: true });

  if (COMMENTS_SERVER_ENABLED) {
    await syncServerStateToUi({
      articles: true,
      analytics: true,
      comments: false,
      glossary: false,
      requests: false,
      render: true,
      currentArticleComments: false,
    });
  } else {
    renderStats();
  }

  toast('記事を保存しました', 'success');
}

function placeCaretAtEnd(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  if (!sel) return;
  sel.removeAllRanges();
  sel.addRange(range);
}

function normalizeArticleEditorMode(mode) {
  return mode === 'rich' ? 'rich' : 'markdown';
}

function setArticleEditorMode(mode) {
  const next = normalizeArticleEditorMode(mode);
  const prev = normalizeArticleEditorMode(state.articleEditorMode);
  const area = document.getElementById('articleEditContent');
  const mdArea = document.getElementById('articleEditMarkdown');

  if (area && mdArea && prev !== next) {
    if (next === 'markdown') {
      const richHtml = String(area.innerHTML || '').trim();
      if (richHtml) {
        mdArea.value = htmlToMarkdown(richHtml);
      }
    } else {
      const md = String(mdArea.value || '').trim();
      if (md) {
        area.innerHTML = sanitizeArticleHtml(markdownToHtml(md));
      } else if (!String(area.innerHTML || '').trim()) {
        area.innerHTML = '<p></p>';
      }
    }
  }

  state.articleEditorMode = next;
  localStorage.setItem(STORAGE_KEYS.articleEditorMode, next);
  clearEditorImageSelection();

  const modal = document.getElementById('articleEditModal');
  const mdBtn = document.getElementById('articleEditModeMarkdown');
  const richBtn = document.getElementById('articleEditModeRich');
  if (modal) modal.classList.toggle('is-markdown', next === 'markdown');
  if (mdBtn) mdBtn.classList.toggle('active', next === 'markdown');
  if (richBtn) richBtn.classList.toggle('active', next === 'rich');
}
function htmlToMarkdown(html) {
  if (!html) return '';

  const root = document.createElement('div');
  root.innerHTML = String(html);

  const toMd = (node) => {
    if (!node) return '';
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || '';
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const tag = (node.tagName || '').toLowerCase();
    const inner = Array.from(node.childNodes).map(toMd).join('');
    const text = (inner || '').trim();

    if (tag === 'h1') return `# ${text}\n\n`;
    if (tag === 'h2') return `## ${text}\n\n`;
    if (tag === 'h3') return `### ${text}\n\n`;
    if (tag === 'h4') return `#### ${text}\n\n`;
    if (tag === 'p') return `${text}\n\n`;
    if (tag === 'br') return '\n';
    if (tag === 'strong' || tag === 'b') return `**${text}**`;
    if (tag === 'em' || tag === 'i') return `*${text}*`;
    if (tag === 'code') return `\`${text}\``;
    if (tag === 'a') {
      const href = (node.getAttribute('href') || '').trim();
      if (href) return `[${text}](${href})`;
      return text;
    }
    if (tag === 'img') {
      const src = (node.getAttribute('src') || '').trim();
      if (!src) return '';
      const alt = (node.getAttribute('alt') || '').trim();
      if (/^data:image\//i.test(src)) {
        return `![${alt}](inline-image)\n\n`;
      }
      return `![${alt}](${src})\n\n`;
    }
    if (tag === 'blockquote') return `> ${text}\n\n`;
    if (tag === 'li') return `- ${text}\n`;
    if (tag === 'ul' || tag === 'ol') return `${inner}\n`;
    return inner;
  };

  const out = Array.from(root.childNodes).map(toMd).join('')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return out;
}

function markdownInlineToHtml(raw) {
  let t = escapeHtml(String(raw || ''));
  t = t.replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+|\/[^\s)]+|\.\.?\/[^\s)]+|data:image\/(?:png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+|data:image\/svg\+xml(?:;[^,]*)?,[^)\s]+)\)/gi, '<img src="$2" alt="$1">');
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return t;
}

function clearEditorImageSelection() {
  const area = document.getElementById('articleEditContent');
  if (area) {
    area.querySelectorAll('img.editor-image-selected').forEach((img) => img.classList.remove('editor-image-selected'));
  }
  state.selectedEditorImage = null;
}

function selectEditorImage(img) {
  if (!img) return;
  clearEditorImageSelection();
  img.classList.add('editor-image-selected');
  state.selectedEditorImage = img;
}

function removeSelectedEditorImage() {
  const selected = state.selectedEditorImage;
  if (!selected || !selected.parentNode) {
    toast('削除する画像を選択してください', 'error');
    return;
  }
  const parent = selected.parentElement;
  selected.remove();
  if (parent && parent.tagName === 'P' && !(parent.textContent || '').trim() && parent.querySelectorAll('*').length === 0) {
    parent.remove();
  }
  state.selectedEditorImage = null;
  toast('画像を削除しました', 'success');
}

function bindArticleEditorEvents() {
  const area = document.getElementById('articleEditContent');
  if (!area || area.dataset.editorBound === '1') return;

  area.addEventListener('click', (event) => {
    const target = event.target;
    if (target && target.tagName === 'IMG') {
      selectEditorImage(target);
      return;
    }
    clearEditorImageSelection();
  });

  area.addEventListener('keydown', (event) => {
    if ((event.key === 'Backspace' || event.key === 'Delete') && state.selectedEditorImage) {
      event.preventDefault();
      removeSelectedEditorImage();
    }
  });

  area.dataset.editorBound = '1';
}

function bindArticleEditorFilePicker() {
  const input = document.getElementById('articleEditImageFileInput');
  const area = document.getElementById('articleEditContent');
  if (!input || !area || input.dataset.bound === '1') return;

  input.addEventListener('change', async () => {
    const file = input.files && input.files[0] ? input.files[0] : null;
    if (!file) return;
    const fileName = String(file.name || '').toLowerCase();
    const imageLike = /^image\//i.test(file.type || '') || /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(fileName);
    if (!imageLike) {
      toast('画像ファイルを選択してください', 'error');
      input.value = '';
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast('画像は20MB以下にしてください', 'error');
      input.value = '';
      return;
    }

    try {
      const dataUrl = await fileToOptimizedImageDataUrl(file);
      if (!/^data:image\/(?:png|jpeg|jpg|webp|gif);base64,/i.test(dataUrl) && !/^data:image\/svg\+xml(?:;[^,]*)?,/i.test(dataUrl)) {
        throw new Error('invalid-image-data');
      }
      const altRaw = window.prompt('代替テキスト（任意）', file.name.replace(/\.[^.]+$/, '')) || '';
      const alt = String(altRaw).trim();
      area.focus();
      const html = `<p><img src="${dataUrl}" alt="${escapeHtml(alt)}"></p>`;
      document.execCommand('insertHTML', false, html);
      toast('画像を追加しました', 'success');
    } catch (err) {
      const reason = err && err.message ? `（${String(err.message)}）` : '';
      toast(`画像の読み込みに失敗しました${reason}`, 'error');
    } finally {
      input.value = '';
    }
  });

  input.dataset.bound = '1';
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('read-failed'));
    reader.readAsDataURL(file);
  });
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image-decode-failed'));
    img.src = src;
  });
}

async function fileToOptimizedImageDataUrl(file) {
  const original = await fileToDataUrl(file);
  if (/^data:image\/svg\+xml(?:;[^,]*)?,/i.test(original)) return original;
  let img;
  try {
    img = await loadImageElement(original);
  } catch {
    return original;
  }

  const maxEdge = 1600;
  const width = Number(img.naturalWidth || img.width || 0);
  const height = Number(img.naturalHeight || img.height || 0);
  if (!width || !height) return original;

  const scale = Math.min(1, maxEdge / Math.max(width, height));
  const targetW = Math.max(1, Math.round(width * scale));
  const targetH = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return original;
  ctx.drawImage(img, 0, 0, targetW, targetH);

  const webp = canvas.toDataURL('image/webp', 0.82);
  if (/^data:image\/webp;base64,/i.test(webp)) return webp;
  const jpeg = canvas.toDataURL('image/jpeg', 0.85);
  if (/^data:image\/jpeg;base64,/i.test(jpeg)) return jpeg;
  return original;
}

function editorInsertImage() {
  const srcRaw = window.prompt('画像URLを入力してください（https:// または /app/note/img/...）', '/app/note/img/');
  if (!srcRaw) return;
  const src = String(srcRaw).trim();
  if (!src) return;
  if (!/^(https?:\/\/|\/|\.\.?\/)/i.test(src)) {
    toast('画像URLの形式が正しくありません', 'error');
    return;
  }
  const alt = String(window.prompt('代替テキスト（任意）', '') || '').trim();
  const area = document.getElementById('articleEditContent');
  if (!area) return;
  area.focus();
  const html = `<p><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"></p>`;
  document.execCommand('insertHTML', false, html);
}

function editorPickImageFromDevice() {
  const input = document.getElementById('articleEditImageFileInput');
  if (!input) return;
  input.value = '';
  input.click();
}

function markdownToHtml(md) {
  const lines = String(md || '').replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let inUl = false;
  let inOl = false;
  let inCode = false;
  let codeBuf = [];
  let para = [];

  const flushPara = () => {
    if (!para.length) return;
    out.push(`<p>${markdownInlineToHtml(para.join('<br>'))}</p>`);
    para = [];
  };

  const closeLists = () => {
    if (inUl) { out.push('</ul>'); inUl = false; }
    if (inOl) { out.push('</ol>'); inOl = false; }
  };

  for (const lineRaw of lines) {
    const line = lineRaw || '';

    if (/^```/.test(line.trim())) {
      flushPara();
      closeLists();
      if (!inCode) {
        inCode = true;
        codeBuf = [];
      } else {
        out.push(`<pre><code>${escapeHtml(codeBuf.join('\\n'))}</code></pre>`);
        inCode = false;
        codeBuf = [];
      }
      continue;
    }

    if (inCode) {
      codeBuf.push(lineRaw);
      continue;
    }

    if (!line.trim()) {
      flushPara();
      closeLists();
      continue;
    }

    const h = line.match(/^(#{1,6})\s+(.+)$/);
    if (h) {
      flushPara();
      closeLists();
      const lv = Math.min(6, h[1].length);
      out.push(`<h${lv}>${markdownInlineToHtml(h[2].trim())}</h${lv}>`);
      continue;
    }

    const bq = line.match(/^>\s?(.*)$/);
    if (bq) {
      flushPara();
      closeLists();
      out.push(`<blockquote>${markdownInlineToHtml(bq[1].trim())}</blockquote>`);
      continue;
    }

    const ul = line.match(/^[-*+]\s+(.+)$/);
    if (ul) {
      flushPara();
      if (inOl) { out.push('</ol>'); inOl = false; }
      if (!inUl) { out.push('<ul>'); inUl = true; }
      out.push(`<li>${markdownInlineToHtml(ul[1].trim())}</li>`);
      continue;
    }

    const ol = line.match(/^\d+\.\s+(.+)$/);
    if (ol) {
      flushPara();
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (!inOl) { out.push('<ol>'); inOl = true; }
      out.push(`<li>${markdownInlineToHtml(ol[1].trim())}</li>`);
      continue;
    }

    para.push(line.trim());
  }

  if (inCode) {
    out.push(`<pre><code>${escapeHtml(codeBuf.join('\\n'))}</code></pre>`);
  }
  flushPara();
  closeLists();

  return out.join('\n').trim();
}

function editorCommand(cmd, value) {
  const area = document.getElementById('articleEditContent');
  if (!area) return;
  area.focus();
  document.execCommand(cmd, false, value || null);
}

function editorFormat(tag) {
  if (!tag) return;
  editorCommand('formatBlock', tag.toUpperCase());
}

function editorInsertLink() {
  const url = window.prompt('リンクURLを入力してください', 'https://');
  if (!url) return;
  const safe = String(url).trim();
  if (!safe) return;
  editorCommand('createLink', safe);
}

function editorInsertHighlight() {
  const area = document.getElementById('articleEditContent');
  if (!area) return;
  area.focus();
  document.execCommand('insertHTML', false, '<div class="highlight">重要ポイントを入力</div>');
}

function editorInsertYouTube() {
  const url = window.prompt('YouTube URLを入力してください', 'https://www.youtube.com/watch?v=');
  if (!url) return;
  const safe = String(url).trim();
  if (!safe) return;
  const area = document.getElementById('articleEditContent');
  if (!area) return;
  area.focus();
  document.execCommand('insertHTML', false, `<p>${escapeHtml(safe)}</p>`);
}

async function deleteCurrentArticle() {
  if (!state.isAdmin || !state.currentArticleId) return;
  const ok = window.confirm('この記事を削除しますか？（一覧から非表示になります）');
  if (!ok) return;

  const articleId = String(state.currentArticleId);
  if (COMMENTS_SERVER_ENABLED) {
    const deleted = await deleteArticleOverrideFromServer(articleId);
    if (!(deleted && deleted.ok)) {
      const reason = deleted && deleted.error ? `（${deleted.error}）` : '';
      toast(`記事の削除に失敗しました${reason}`, 'error');
      return;
    }
  }

  state.deletedArticles.add(articleId);
  saveDeletedArticles();

  state.articleMap.delete(articleId);
  state.articleIndex = (state.articleIndex || []).filter((a) => String(a && a.id ? a.id : '') !== articleId);
  if (state.articleOverrides && state.articleOverrides[articleId]) {
    delete state.articleOverrides[articleId];
    saveArticleOverrides();
  }
  state.serverArticleOverrideChecked.delete(articleId);

  if (COMMENTS_SERVER_ENABLED) {
    await syncServerStateToUi({
      articles: true,
      analytics: true,
      comments: false,
      glossary: false,
      glossaryBase: false,
      requests: false,
      editors: false,
      render: true,
      currentArticleComments: false,
    });
  } else {
    renderStats();
    renderCatList();
    renderRecentList();
    renderCurriculum();
    renderLatestComments();
  }

  showView('home');
  toast('記事を削除しました', 'success');
}

function refreshUiAfterAdminModeChange() {
  syncAdminArticleActions();
  syncRequestPostButton();
  syncEditorManageButton();
  syncHeaderAdminMenu();
  syncAdminKeyChangeVisibility();
  renderLatestComments();
  if (state.currentArticleId) renderComments(state.currentArticleId);
  if (state.currentView === 'requests') renderFeatureRequestsView();
  if (state.currentView === 'comments') renderCommentsIndexView();
  if (state.currentView === 'glossary') renderCurrentGlossaryView();
  if (state.currentView === 'editors') renderEditorsView();
}

function setAdminKeyChangeNotice(msg = '', type = '') {
  const el = document.getElementById('adminKeyChangeNotice');
  if (!el) return;
  el.textContent = msg;
  el.className = `admin-key-notice${type ? ` ${type}` : ''}`;
}

function syncAdminModeStatus() {
  const statusEl = document.getElementById('adminModeStatus');
  if (!statusEl) return;
  const isOn = !!state.isAdmin;
  statusEl.textContent = isOn ? 'EDIT MODE' : 'EDIT MODE OFF';
  statusEl.className = `admin-status ${isOn ? 'on' : 'off'}`;
}

function clearAdminKeyChangeForm() {
  const ids = ['adminCurrentKeyInput', 'adminNewKeyInput', 'adminNewKeyConfirmInput'];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  setAdminKeyChangeNotice('', '');
}

function syncAdminKeyChangeVisibility() {
  const box = document.getElementById('adminKeyChangeBox');
  const toggleWrap = document.getElementById('adminKeyToggleWrap');
  const toggleBtn = document.getElementById('adminKeyToggleBtn');
  const canChange = !!state.isAdmin;

  if (toggleWrap) toggleWrap.style.display = canChange ? 'block' : 'none';
  if (box) box.style.display = canChange && state.adminKeyChangeExpanded ? 'block' : 'none';
  if (toggleBtn) {
    toggleBtn.textContent = state.adminKeyChangeExpanded ? '管理者キー変更を閉じる' : '管理者キーを変更';
  }
  if (!canChange || !state.adminKeyChangeExpanded) {
    clearAdminKeyChangeForm();
  }
  syncAdminModeStatus();
}

function toggleAdminKeyChangeBox(forceExpand) {
  if (!state.isAdmin) {
    setAdminKeyChangeNotice('管理者モードでログインしてください', 'error');
    return;
  }
  if (typeof forceExpand === 'boolean') {
    state.adminKeyChangeExpanded = forceExpand;
  } else {
    state.adminKeyChangeExpanded = !state.adminKeyChangeExpanded;
  }
  syncAdminKeyChangeVisibility();
  if (state.adminKeyChangeExpanded) {
    const firstInput = document.getElementById('adminCurrentKeyInput');
    if (firstInput) setTimeout(() => firstInput.focus(), 40);
  }
}

function saveAdminSession(key) {
  try {
    sessionStorage.setItem(ADMIN_SESSION_KEY, String(key || ''));
    sessionStorage.setItem(ADMIN_SESSION_AT, String(Date.now()));
  } catch (_) {}
}

function clearAdminSession() {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_AT);
  } catch (_) {}
}

async function tryRestoreAdminSession() {
  let key = '';
  let ts = 0;
  try {
    key = String(sessionStorage.getItem(ADMIN_SESSION_KEY) || '').trim();
    ts = Number(sessionStorage.getItem(ADMIN_SESSION_AT) || '0');
  } catch (_) {
    key = '';
    ts = 0;
  }
  if (!key) return false;
  if (!ts || (Date.now() - ts) > ADMIN_SESSION_TTL_MS) {
    clearAdminSession();
    return false;
  }

  let ok = false;
  let networkError = false;
  if (COMMENTS_SERVER_ENABLED) {
    const data = await fetchCommentsApi('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify_editor',
        payload: { editor_key: key },
      }),
    });
    ok = !!(data && data.ok);
    networkError = !!(data && data.ok === false && String(data.error || '').toLowerCase() === 'network error');
  } else {
    ok = key.length >= 4;
  }

  // 一時的な通信失敗で管理者モードが勝手に外れる体験を防ぐ。
  // 実操作時はサーバー側で都度 editor_key を検証するため、ここではセッションを保持する。
  if (!ok && networkError) {
    state.isAdmin = true;
    state.adminKey = key;
    const editBadge = document.getElementById('editBadge');
    if (editBadge) editBadge.classList.add('visible');
    refreshUiAfterAdminModeChange();
    saveAdminSession(key);
    return true;
  }

  if (!ok) {
    clearAdminSession();
    return false;
  }

  state.isAdmin = true;
  state.adminKey = key;
  const editBadge = document.getElementById('editBadge');
  if (editBadge) editBadge.classList.add('visible');
  refreshUiAfterAdminModeChange();
  saveAdminSession(key);
  return true;
}

function exitAdminMode(showToast = true) {
  state.isAdmin = false;
  state.adminKey = '';
  state.adminKeyChangeExpanded = false;
  clearAdminSession();
  const editBadge = document.getElementById('editBadge');
  if (editBadge) editBadge.classList.remove('visible');
  refreshUiAfterAdminModeChange();
  closeAdmin();
  if (showToast) toast('編集モードを終了しました', 'success');
}

function showAdmin() {
  const adminModal = document.getElementById('adminModal');
  const adminKeyInput = document.getElementById('adminKeyInput');
  const adminError = document.getElementById('adminError');
  if (!adminModal || !adminKeyInput || !adminError) {
    toast('管理者モーダルの初期化に失敗しました', 'error');
    return;
  }

  // ほかのモバイル系パネルが開いていても、管理者モーダルを優先して開く
  closeMobileMenu();
  closeHeaderAdminMenu();

  adminError.style.display = 'none';
  state.adminKeyChangeExpanded = false;
  syncAdminKeyChangeVisibility();
  adminModal.classList.remove('open');
  // force reflow to avoid edge cases where open class toggle is ignored
  void adminModal.offsetWidth;
  adminModal.classList.add('open');

  if (state.isAdmin) {
    adminKeyInput.focus();
    return;
  }

  adminKeyInput.value = '';
  setTimeout(() => adminKeyInput.focus(), 80);
}

function closeAdmin() {
  const modal = document.getElementById('adminModal');
  state.adminKeyChangeExpanded = false;
  syncAdminKeyChangeVisibility();
  if (modal) modal.classList.remove('open');
}

async function verifyAdmin() {
  const keyInput = document.getElementById('adminKeyInput');
  const errorEl = document.getElementById('adminError');
  if (!keyInput || !errorEl) return;
  const key = (keyInput.value || '').trim();
  if (!key) {
    errorEl.style.display = 'block';
    return;
  }

  let ok = false;
  if (COMMENTS_SERVER_ENABLED) {
    const data = await fetchCommentsApi('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify_editor',
        payload: { editor_key: key },
      }),
    });
    ok = !!(data && data.ok);
  } else {
    ok = key.length >= 4;
  }

  if (ok) {
    state.isAdmin = true;
    state.adminKey = key;
    state.adminKeyChangeExpanded = false;
    saveAdminSession(key);
    closeAdmin();
    const editBadge = document.getElementById('editBadge');
    if (editBadge) editBadge.classList.add('visible');
    refreshUiAfterAdminModeChange();
    toast('編集モードに入りました', 'success');
  } else {
    errorEl.style.display = 'block';
    keyInput.style.borderColor = 'var(--red)';
    setTimeout(() => {
      keyInput.style.borderColor = '';
    }, 1000);
  }
}

async function changeAdminKey() {
  if (!state.isAdmin) {
    setAdminKeyChangeNotice('管理者モードでログインしてください', 'error');
    return;
  }
  const currentInput = document.getElementById('adminCurrentKeyInput');
  const newInput = document.getElementById('adminNewKeyInput');
  const confirmInput = document.getElementById('adminNewKeyConfirmInput');
  if (!newInput || !confirmInput) return;

  const currentKey = String((currentInput && currentInput.value) || state.adminKey || '').trim();
  const newKey = String(newInput.value || '').trim();
  const confirmKey = String(confirmInput.value || '').trim();

  if (!newKey || !confirmKey) {
    setAdminKeyChangeNotice('新しい管理者キーを入力してください', 'error');
    return;
  }
  if (newKey !== confirmKey) {
    setAdminKeyChangeNotice('新しい管理者キーと確認入力が一致しません', 'error');
    return;
  }
  if (newKey.length < 4) {
    setAdminKeyChangeNotice('新しい管理者キーは4文字以上にしてください', 'error');
    return;
  }

  if (!COMMENTS_SERVER_ENABLED) {
    setAdminKeyChangeNotice('ローカル表示モードでは変更できません', 'error');
    return;
  }

  setAdminKeyChangeNotice('管理者キーを更新中です...', '');
  const data = await fetchCommentsApi('', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(state.adminKey ? { 'X-Editor-Key': state.adminKey } : {}),
    },
    body: JSON.stringify({
      action: 'editor_key_update',
      payload: {
        current_editor_key: currentKey,
        new_editor_key: newKey,
        new_editor_key_confirm: confirmKey,
        editor_key: state.adminKey,
      },
    }),
  });

  if (!data || !data.ok) {
    setAdminKeyChangeNotice(`更新に失敗しました${data && data.error ? `（${data.error}）` : ''}`, 'error');
    return;
  }

  state.adminKey = newKey;
  saveAdminSession(newKey);
  clearAdminKeyChangeForm();
  setAdminKeyChangeNotice('管理者キーを更新しました', 'success');
  toast('管理者キーを更新しました', 'success');
}

let toastTimer;
function toast(msg, type = 'success') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

window.showView = showView;
window.showArticle = showArticle;
window.openArticleByTitle = openArticleByTitle;
window.showCategory = showCategory;
window.openCurriculumTrack = openCurriculumTrack;
window.toggleCategoryNavExpanded = toggleCategoryNavExpanded;
window.switchTool = switchTool;
window.toggleCat = toggleCat;
window.handleCatHeaderKeydown = handleCatHeaderKeydown;
window.setMode = setMode;
window.selectLevel = selectLevel;
window.filterItems = filterItems;
window.openHashtagModal = openHashtagModal;
window.closeHashtagModal = closeHashtagModal;
window.openArticleFromHashtagModal = openArticleFromHashtagModal;
window.openGlossaryTermDetailModal = openGlossaryTermDetailModal;
window.closeGlossaryTermDetailModal = closeGlossaryTermDetailModal;
window.openArticleImageModal = openArticleImageModal;
window.closeArticleImageModal = closeArticleImageModal;
window.applyHashtagFilter = applyHashtagFilter;
window.clearHashtagFilter = clearHashtagFilter;
window.handleSearchInput = handleSearchInput;
window.clearSearchInput = clearSearchInput;
window.showAdmin = showAdmin;
window.closeAdmin = closeAdmin;
window.verifyAdmin = verifyAdmin;
window.exitAdminMode = exitAdminMode;
window.toggleAdminKeyChangeBox = toggleAdminKeyChangeBox;
window.changeAdminKey = changeAdminKey;
window.clearAdminKeyChangeForm = clearAdminKeyChangeForm;
window.toggleHeaderAdminMenu = toggleHeaderAdminMenu;
window.closeHeaderAdminMenu = closeHeaderAdminMenu;
window.openCreateArticleModal = openCreateArticleModal;
window.closeCreateArticleModal = closeCreateArticleModal;
window.setArticleCreateMode = setArticleCreateMode;
window.submitCreateArticle = submitCreateArticle;
window.toggleProgress = toggleProgress;
window.toggleBookmark = toggleBookmark;
window.shareArticleOnX = shareArticleOnX;
window.editorCommand = editorCommand;
window.editorFormat = editorFormat;
window.editorInsertLink = editorInsertLink;
window.editorInsertImage = editorInsertImage;
window.editorPickImageFromDevice = editorPickImageFromDevice;
window.removeSelectedEditorImage = removeSelectedEditorImage;
window.editorInsertHighlight = editorInsertHighlight;
window.editorInsertYouTube = editorInsertYouTube;
window.toggleTheme = toggleTheme;
window.addComment = addComment;
window.editComment = editComment;
window.deleteComment = deleteComment;
window.toggleCurrentArticleProgress = toggleCurrentArticleProgress;
window.openNextCurriculumArticle = openNextCurriculumArticle;
window.openCommentComposer = openCommentComposer;
window.closeCommentComposer = closeCommentComposer;
window.openArticleEditor = showArticleEditor;
window.closeArticleEditor = closeArticleEditor;
window.saveArticleEdits = saveArticleEdits;
window.setArticleEditorMode = setArticleEditorMode;
window.applySelectedEditorToArticleForm = applySelectedEditorToArticleForm;
window.deleteCurrentArticle = deleteCurrentArticle;
window.openDictionaryKunChat = openDictionaryKunChat;
window.closeDictionaryKunChat = closeDictionaryKunChat;
window.handleDictionaryKunKey = handleDictionaryKunKey;
window.sendDictionaryKunQuestion = sendDictionaryKunQuestion;
window.openMobileSidebar = openMobileSidebar;
window.closeMobileSidebar = closeMobileSidebar;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.openMobileSearchDrawer = openMobileSearchDrawer;
window.handleMobileSearchInput = handleMobileSearchInput;
window.openMobileCategoryFromGrid = openMobileCategoryFromGrid;
window.goProgressFromBottomNav = goProgressFromBottomNav;
window.postHomeUpdatesOnX = postHomeUpdatesOnX;
window.postSingleHomeUpdateOnX = postSingleHomeUpdateOnX;

// ── FEATURE REQUEST MODAL ──
const FR_STORAGE_KEY = 'dir_feature_requests';
const FR_COOLDOWN_KEY = 'dir_feature_requests_last_submit';
const GT_COOLDOWN_KEY = 'dir_glossary_last_submit';

function openFeatureRequestModal() {
  const modal = document.getElementById('featureRequestModal');
  if (!modal) return;
  clearFeatureRequestForm();
  modal.classList.add('open');
  closeMobileSidebar();
}

function openFeatureRequestEditModal(request) {
  const modal = document.getElementById('featureRequestModal');
  if (!modal) return;

  clearFeatureRequestForm();
  state.featureRequestEditId = String(request && request.id ? request.id : '').trim();
  state.featureRequestEditCategory = normalizeDisplayText((request && request.category) || 'その他') || 'その他';

  const titleEl = modal.querySelector('.fr-title');
  const metaEl = modal.querySelector('.fr-meta');
  const submitBtn = document.getElementById('frSubmitBtn');

  if (titleEl) titleEl.textContent = '📝 要望を編集';
  if (metaEl) metaEl.textContent = 'タイトルと要望本文を編集して更新できます。';
  if (submitBtn) submitBtn.textContent = '更新🐮';

  const nameInput = document.getElementById('frName');
  const titleInput = document.getElementById('frTitle');
  const bodyInput = document.getElementById('frBody');
  const linkInput = document.getElementById('frLink');
  if (nameInput) nameInput.value = normalizeDisplayText((request && request.name) || '匿名') || '匿名';
  if (titleInput) titleInput.value = normalizeDisplayText((request && request.title) || '');
  if (bodyInput) bodyInput.value = normalizeDisplayText((request && request.body) || '');
  if (linkInput) linkInput.value = String((request && request.link) || '').trim();

  modal.classList.add('open');
  closeMobileSidebar();
}

function closeFeatureRequestModal() {
  const modal = document.getElementById('featureRequestModal');
  if (!modal) return;
  modal.classList.remove('open');
}

function clearFeatureRequestForm() {
  ['frName', 'frTitle', 'frBody', 'frLink'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  state.featureRequestEditId = '';
  state.featureRequestEditCategory = 'その他';
  const cat = document.getElementById('frCategory');
  if (cat) cat.value = 'その他';
  const modal = document.getElementById('featureRequestModal');
  const titleEl = modal ? modal.querySelector('.fr-title') : null;
  const metaEl = modal ? modal.querySelector('.fr-meta') : null;
  const submitBtn = document.getElementById('frSubmitBtn');
  if (titleEl) titleEl.textContent = '📝 要望を投稿';
  if (metaEl) metaEl.textContent = '改善点や追加したい機能を投稿できます。';
  if (submitBtn) submitBtn.textContent = '送信🐮';
  setFrNotice('', '');
}

function setFrNotice(msg, type) {
  const el = document.getElementById('frNotice');
  if (!el) return;
  el.textContent = msg;
  el.className = 'fr-notice' + (type ? ` ${type} visible` : '');
}

function openGlossaryTermModal() {
  const modal = document.getElementById('glossaryTermModal');
  if (!modal) return;
  clearGlossaryTermForm();
  modal.classList.add('open');
  closeMobileSidebar();
}

function closeGlossaryTermModal() {
  const modal = document.getElementById('glossaryTermModal');
  if (!modal) return;
  modal.classList.remove('open');
}

function clearGlossaryTermForm() {
  const editId = document.getElementById('gtEditId');
  const title = document.getElementById('glossaryTermModalTitle');
  const submitBtn = document.getElementById('gtSubmitBtn');

  if (editId) editId.value = '';
  ['gtName', 'gtTerm', 'gtDesc'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  if (title) title.textContent = '📘 用語を追加';
  if (submitBtn) submitBtn.textContent = '送信🐮';
  setGtNotice('', '');
}

function setGtNotice(msg, type) {
  const el = document.getElementById('gtNotice');
  if (!el) return;
  el.textContent = msg;
  el.className = 'fr-notice' + (type ? ` ${type} visible` : '');
}

async function submitGlossaryTerm() {
  const hp = (document.getElementById('gtHp')?.value || '').trim();
  if (hp) { setGtNotice('送信に失敗しました。', 'error'); return; }

  const editingId = String(document.getElementById('gtEditId')?.value || '').trim();
  const isEditing = !!editingId;
  const now = Date.now();
  if (!isEditing) {
    const prev = Number(localStorage.getItem(GT_COOLDOWN_KEY) || '0');
    if (now - prev < 12000) { setGtNotice('連続投稿は12秒待ってからお願いします。', 'error'); return; }
  }

  const name = (document.getElementById('gtName')?.value || '').trim() || '匿名';
  const term = (document.getElementById('gtTerm')?.value || '').trim();
  const desc = (document.getElementById('gtDesc')?.value || '').trim();

  if (!term) { setGtNotice('用語を入力してください。', 'error'); return; }
  if (!desc) { setGtNotice('説明を入力してください。', 'error'); return; }

  if (isEditing) {
    const termIdStr = String(editingId);
    const isBaseTerm = termIdStr.startsWith('base:');
    const baseKey = termIdStr.replace(/^base:/, '').trim();

    if (isBaseTerm && baseKey) {
      if (COMMENTS_SERVER_ENABLED) {
        const data = await fetchCommentsApi('', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'glossary_base_set',
            payload: {
              base_key: baseKey,
              term: term.trim(),
              description: desc.trim(),
              name: (name || '匿名').trim() || '匿名',
              editor_key: state.adminKey,
            },
          }),
        });
        if (!data || !data.ok) {
          setGtNotice(`用語の更新に失敗しました${data && data.error ? `（${data.error}）` : ''}`, 'error');
          return;
        }
        await syncServerStateToUi({
          analytics: true,
          comments: false,
          glossary: true,
          glossaryBase: true,
          requests: false,
          glossaryLimit: 300,
          render: true,
          currentArticleComments: false,
        });
      } else {
        state.glossaryBaseOverrides[baseKey] = {
          term: normalizeDisplayText(term.trim()),
          desc: normalizeDisplayText(desc.trim()),
          name: normalizeDisplayText(((name || '匿名').trim() || '匿名')),
          ts: new Date().toISOString(),
        };
        state.glossaryBaseDeleted.delete(baseKey);
        saveGlossaryBaseOverrides();
        saveGlossaryBaseDeleted();
        refreshLocalGlossaryViews();
      }

      clearGlossaryTermForm();
      closeGlossaryTermModal();
      toast('用語を更新しました', 'success');
      return;
    }

    const localOnly = termIdStr.includes('_');
    if (COMMENTS_SERVER_ENABLED && !localOnly) {
      const data = await fetchCommentsApi('', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'glossary_update',
          payload: {
            id: termIdStr,
            term: term.trim(),
            description: desc.trim(),
            name: (name || '匿名').trim() || '匿名',
            editor_key: state.adminKey,
          },
        }),
      });
      if (!data || !data.ok) {
        setGtNotice(`用語の更新に失敗しました${data && data.error ? `（${data.error}）` : ''}`, 'error');
        return;
      }
      state.userGlossaryLoaded = false;
      await syncServerStateToUi({
        analytics: true,
        comments: false,
        glossary: true,
        glossaryBase: true,
        requests: false,
        glossaryLimit: 300,
        render: true,
        currentArticleComments: false,
      });
    } else {
      state.userGlossaryTerms = (state.userGlossaryTerms || []).map((x) => {
        if (String(x.id) !== termIdStr) return x;
        return {
          ...x,
          term: normalizeDisplayText(term.trim()),
          desc: normalizeDisplayText(desc.trim()),
          description: normalizeDisplayText(desc.trim()),
          name: normalizeDisplayText(((name || '匿名').trim() || '匿名')),
        };
      });
      saveGlossaryTerms();
      refreshLocalGlossaryViews();
    }

    clearGlossaryTermForm();
    closeGlossaryTermModal();
    toast('用語を更新しました', 'success');
    return;
  }

  const item = {
    id: `${now}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    term,
    description: desc,
    ts: new Date().toISOString(),
  };

  if (COMMENTS_SERVER_ENABLED) {
    const data = await fetchCommentsApi('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'glossary_add', payload: item }),
    });
    if (!data || !data.ok) {
      const message = (data && data.error) ? String(data.error) : 'サーバー保存に失敗しました。';
      setGtNotice(message, 'error');
      return;
    }

    state.userGlossaryLoaded = false;
  } else {
    const next = [item, ...(state.userGlossaryTerms || [])]
      .map(normalizeGlossaryTermItem)
      .filter(Boolean)
      .slice(0, 300);
    state.userGlossaryTerms = next;
    saveGlossaryTerms();
  }

  localStorage.setItem(GT_COOLDOWN_KEY, String(now));
  clearGlossaryTermForm();
  closeGlossaryTermModal();
  if (COMMENTS_SERVER_ENABLED) {
    await syncServerStateToUi({
      analytics: true,
      comments: false,
      glossary: true,
      glossaryBase: true,
      requests: false,
      render: true,
      currentArticleComments: false,
    });
  } else {
    refreshLocalGlossaryViews();
  }
  toast('用語を追加しました', 'success');
}

async function submitFeatureRequest() {
  const hp = (document.getElementById('frHp')?.value || '').trim();
  if (hp) { setFrNotice('送信に失敗しました。', 'error'); return; }

  const editingId = String(state.featureRequestEditId || '').trim();
  const isEditing = !!editingId;
  const now = Date.now();
  if (!isEditing) {
    const prev = Number(localStorage.getItem(FR_COOLDOWN_KEY) || '0');
    if (now - prev < 12000) { setFrNotice('連続投稿は12秒待ってからお願いします。', 'error'); return; }
  }

  const title = (document.getElementById('frTitle')?.value || '').trim();
  const body = (document.getElementById('frBody')?.value || '').trim();
  if (!title) { setFrNotice('要望タイトルを入力してください。', 'error'); return; }
  if (!body) { setFrNotice('詳細を入力してください。', 'error'); return; }

  const name = (document.getElementById('frName')?.value || '').trim();
  const category = (
    document.getElementById('frCategory')?.value
    || (isEditing ? state.featureRequestEditCategory : 'その他')
    || 'その他'
  );
  const rawLink = (document.getElementById('frLink')?.value || '').trim();
  let link = '';
  try { const u = new URL(rawLink); if (/^https?:$/.test(u.protocol)) link = u.href; } catch { /* noop */ }

  const item = {
    id: isEditing ? editingId : `${now}_${Math.random().toString(36).slice(2, 8)}`,
    name: name || '匿名',
    title,
    category,
    body,
    link,
    ts: new Date().toISOString(),
  };

  const localOnly = isEditing && String(editingId).includes('_');
  if (COMMENTS_SERVER_ENABLED && isEditing && !localOnly) {
    const data = await fetchCommentsApi('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'fr_update',
        payload: {
          id: String(editingId),
          title: title.trim(),
          body: body.trim(),
          category: normalizeDisplayText((category || 'その他').trim()) || 'その他',
          link: link.trim(),
          name: normalizeDisplayText((name || '匿名').trim()) || '匿名',
          editor_key: state.adminKey,
        },
      }),
    });
    if (!data || !data.ok) {
      const message = (data && data.error) ? String(data.error) : 'サーバー更新に失敗しました。';
      setFrNotice(message, 'error');
      return;
    }

    state.featureRequestsLoaded = false;
    await loadFeatureRequestsFromServer(120);
  } else if (COMMENTS_SERVER_ENABLED) {
    const data = await fetchCommentsApi('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'fr_add', payload: item }),
    });
    if (!data || !data.ok) {
      const message = (data && data.error) ? String(data.error) : 'サーバー保存に失敗しました。';
      setFrNotice(message, 'error');
      return;
    }

    state.featureRequestsLoaded = false;
    await loadFeatureRequestsFromServer(120);
  } else if (isEditing) {
    const list = getFeatureRequestsLocal().map((x) => (
      String(x.id) === String(editingId)
        ? {
            ...x,
            title: normalizeDisplayText(title.trim()),
            body: normalizeDisplayText(body.trim()),
            category: normalizeDisplayText(((category || 'その他').trim() || 'その他')),
            link: link.trim(),
            name: normalizeDisplayText(((name || '匿名').trim() || '匿名')),
          }
        : x
    ));
    localStorage.setItem(FR_STORAGE_KEY, JSON.stringify(list.slice(0, 120)));
  } else {
    let list = [];
    try { list = JSON.parse(localStorage.getItem(FR_STORAGE_KEY) || '[]'); } catch { /* noop */ }
    list.unshift(item);
    localStorage.setItem(FR_STORAGE_KEY, JSON.stringify(list.slice(0, 60)));
  }

  if (!isEditing) {
    localStorage.setItem(FR_COOLDOWN_KEY, String(now));
  }

  clearFeatureRequestForm();
  closeFeatureRequestModal();
  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur();
  }
  if (COMMENTS_SERVER_ENABLED) {
    await syncServerStateToUi({
      analytics: true,
      comments: false,
      glossary: false,
      requests: true,
      requestsLimit: 120,
      render: true,
      currentArticleComments: false,
    });
  } else {
    await renderFeatureRequestsView();
    renderStats();
  }
  toast(isEditing ? '要望を更新しました' : '要望を投稿しました', 'success');
}

function normalizeFeatureRequestItem(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const ts = String(raw.ts || raw.created_at || '').trim() || new Date().toISOString();
  return {
    id: String(raw.id || ''),
    name: normalizeDisplayText(String(raw.name || raw.author_name || '匿名').trim()) || '匿名',
    title: normalizeDisplayText(String(raw.title || '').trim()),
    category: normalizeDisplayText(String(raw.category || 'その他').trim()) || 'その他',
    body: normalizeDisplayText(String(raw.body || '').trim()),
    link: String(raw.link || '').trim(),
    ts,
  };
}

function getFeatureRequestsLocal() {
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem(FR_STORAGE_KEY) || '[]');
  } catch {
    list = [];
  }
  return (Array.isArray(list) ? list : [])
    .map(normalizeFeatureRequestItem)
    .filter((x) => x && x.title)
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
}

async function loadFeatureRequestsFromServer(limit = 120) {
  if (!COMMENTS_SERVER_ENABLED) return false;
  const n = Math.max(1, Math.min(300, Number(limit) || 120));
  const data = await fetchCommentsApi(`?action=fr_list&limit=${encodeURIComponent(String(n))}`);
  if (!data || !data.ok || !Array.isArray(data.requests)) return false;

  state.featureRequests = data.requests
    .map(normalizeFeatureRequestItem)
    .filter((x) => x && x.title)
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
  state.featureRequestsLoaded = true;
  return true;
}

async function getFeatureRequests() {
  if (COMMENTS_SERVER_ENABLED) {
    if (!state.featureRequestsLoaded) {
      const ok = await loadFeatureRequestsFromServer(120);
      if (!ok) return [];
    }
    return state.featureRequests;
  }
  return getFeatureRequestsLocal();
}

async function renderFeatureRequestsView() {
  const grid = document.getElementById('featureRequestGrid');
  const countPill = document.getElementById('requestCountPill');
  if (!grid || !countPill) return;

  const requests = (await getFeatureRequests()).slice().sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
  countPill.textContent = `${formatNumberWithComma(requests.length)} 件`;
  setHomeRequestCount(requests.length);

  if (!requests.length) {
    grid.innerHTML = '<div class="article-row note-row is-placeholder"><span class="article-title-row">まだ要望は投稿されていません</span></div>';
    return;
  }

  grid.innerHTML = requests.map((item) => {
    const date = formatPostDateTime(item.ts);
    const safeTitle = escapeHtml(item.title);
    const bodyInline = (item.body || '')
      .replace(/\r?\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const safeBody = escapeHtml(bodyInline || '詳細は投稿時に未入力');
    const safeCategory = escapeHtml(item.category || 'その他');
    const safeName = escapeHtml(item.name || '匿名');
    const safeLink = item.link ? escapeHtml(item.link) : '';
    const linkMeta = item.link
      ? `<a class="request-meta-link" href="${safeLink}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">参考URL ↗</a>`
      : '';
    const adminActions = state.isAdmin
      ? `<span class="request-row-actions admin-row-actions list-row-head-actions">
          <button class="admin-article-btn admin-row-btn" type="button" onclick="event.stopPropagation();editFeatureRequest('${escapeForSingleQuote(String(item.id))}')">編集</button>
          <button class="admin-article-btn danger admin-row-btn" type="button" onclick="event.stopPropagation();deleteFeatureRequest('${escapeForSingleQuote(String(item.id))}')">削除</button>
        </span>`
      : '';
    return `
      <div class="article-row note-row request-row list-row list-row--stack">
        <span class="request-row-head list-row-head">
          <span class="article-cat-badge">${safeCategory}</span>
          ${adminActions}
        </span>
        <span class="request-row-main list-row-main-block">
          <span class="article-title-row">${safeTitle}</span>
          <span class="request-row-body">${safeBody}</span>
        </span>
        <span class="request-row-meta list-row-right list-row-right-wrap">
          <span class="request-meta-text">${safeName}</span>
          <span class="request-meta-sep" aria-hidden="true">•</span>
          <span class="request-meta-text">${escapeHtml(date)}</span>
          ${linkMeta}
        </span>
      </div>
    `;
  }).join('');
}

async function editFeatureRequest(requestId) {
  if (!state.isAdmin) return;
  const requests = await getFeatureRequests();
  const current = requests.find((x) => String(x.id) === String(requestId));
  if (!current) {
    toast('要望が見つかりません', 'error');
    return;
  }
  openFeatureRequestEditModal(current);
}

async function deleteFeatureRequest(requestId) {
  if (!state.isAdmin) return;
  if (!confirm('この要望を削除しますか？')) return;

  const localOnly = String(requestId).includes('_');
  if (COMMENTS_SERVER_ENABLED && !localOnly) {
    const data = await fetchCommentsApi('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'fr_delete',
        payload: {
          id: String(requestId),
          editor_key: state.adminKey,
        },
      }),
    });
    if (!data || !data.ok) {
      toast(`要望の削除に失敗しました${data && data.error ? `（${data.error}）` : ''}`, 'error');
      return;
    }
    state.featureRequestsLoaded = false;
    await loadFeatureRequestsFromServer(120);
  } else {
    const list = getFeatureRequestsLocal().filter((x) => String(x.id) !== String(requestId));
    localStorage.setItem(FR_STORAGE_KEY, JSON.stringify(list.slice(0, 120)));
  }

  if (COMMENTS_SERVER_ENABLED) {
    await syncServerStateToUi({
      analytics: true,
      comments: false,
      glossary: false,
      requests: true,
      requestsLimit: 120,
      render: true,
      currentArticleComments: false,
    });
  } else {
    await renderFeatureRequestsView();
    renderStats();
  }
  toast('要望を削除しました', 'success');
}

async function editGlossaryTerm(termId) {
  if (!state.isAdmin) return;
  const terms = getGlossaryTermsMerged();
  const current = terms.find((x) => String(x.id) === String(termId));
  if (!current) {
    toast('用語が見つかりません', 'error');
    return;
  }

  const modal = document.getElementById('glossaryTermModal');
  const title = document.getElementById('glossaryTermModalTitle');
  const submitBtn = document.getElementById('gtSubmitBtn');
  const editId = document.getElementById('gtEditId');
  const nameInput = document.getElementById('gtName');
  const termInput = document.getElementById('gtTerm');
  const descInput = document.getElementById('gtDesc');
  if (!modal || !title || !submitBtn || !editId || !nameInput || !termInput || !descInput) return;

  editId.value = String(termId);
  nameInput.value = current.name || '匿名';
  termInput.value = current.term || '';
  descInput.value = current.desc || '';
  title.textContent = '📘 用語を編集';
  submitBtn.textContent = '更新する';
  setGtNotice('', '');
  modal.classList.add('open');
  setTimeout(() => termInput.focus(), 40);
  closeMobileSidebar();
}

async function deleteGlossaryTerm(termId) {
  if (!state.isAdmin) return;
  if (!confirm('この用語を削除しますか？')) return;

  const termIdStr = String(termId);
  const isBaseTerm = termIdStr.startsWith('base:'), baseKey = termIdStr.replace(/^base:/, '').trim();
  if (isBaseTerm && baseKey) {
    if (COMMENTS_SERVER_ENABLED) {
      const data = await fetchCommentsApi('', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'glossary_base_delete',
          payload: {
            base_key: baseKey,
            editor_key: state.adminKey,
          },
        }),
      });
      if (!data || !data.ok) {
        toast(`用語の削除に失敗しました${data && data.error ? `（${data.error}）` : ''}`, 'error');
        return;
      }
      await syncServerStateToUi({
        analytics: true,
        comments: false,
        glossary: true,
        glossaryBase: true,
        requests: false,
        glossaryLimit: 300,
        render: true,
        currentArticleComments: false,
      });
    } else {
      state.glossaryBaseDeleted.add(baseKey);
      if (state.glossaryBaseOverrides && state.glossaryBaseOverrides[baseKey]) {
        delete state.glossaryBaseOverrides[baseKey];
      }
      saveGlossaryBaseDeleted();
      saveGlossaryBaseOverrides();

      refreshLocalGlossaryViews();
    }
    toast('用語を削除しました', 'success');
    return;
  }

  const localOnly = termIdStr.includes('_');
  if (COMMENTS_SERVER_ENABLED && !localOnly) {
    const data = await fetchCommentsApi('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'glossary_delete',
        payload: {
          id: String(termId),
          editor_key: state.adminKey,
        },
      }),
    });
    if (!data || !data.ok) {
      toast(`用語の削除に失敗しました${data && data.error ? `（${data.error}）` : ''}`, 'error');
      return;
    }
    state.userGlossaryLoaded = false;
    await syncServerStateToUi({
      analytics: true,
      comments: false,
      glossary: true,
      glossaryBase: true,
      requests: false,
      glossaryLimit: 300,
      render: true,
      currentArticleComments: false,
    });
  } else {
    state.userGlossaryTerms = (state.userGlossaryTerms || []).filter((x) => String(x.id) !== String(termId));
    saveGlossaryTerms();
  }

  if (!COMMENTS_SERVER_ENABLED) {
    refreshLocalGlossaryViews();
  }
  toast('用語を削除しました', 'success');
}
async function showFeatureRequestsView(options = {}) {
  const { skipHistory = false } = options;
  closeMobileSidebar();
  closeMobileMenu();

  const hasRequestsView = !!document.getElementById('requestsView');
  if (!hasRequestsView) {
    openFeatureRequestModal();
    return;
  }

  await renderFeatureRequestsView();
  updateSeoForRoute('requests');
  showView('requests', { skipHistory: true });
  if (!skipHistory) syncHistory('requests', null, false);
}

async function goRequestsPage() {
  try {
    await showFeatureRequestsView();
  } catch {
    window.location.href = './?view=requests';
  }
}

async function showCommentsView(options = {}) {
  const { skipHistory = false } = options;
  closeMobileSidebar();
  closeMobileMenu();

  renderCommentsIndexView();
  showView('comments', { skipHistory: true });
  if (!skipHistory) syncHistory('comments', null, false);

  if (COMMENTS_SERVER_ENABLED) {
    hydrateCommentsFromServer(COMMENT_INDEX_LIMIT).then((ok) => {
      if (!ok) return;
      renderCommentsIndexView();
      renderLatestComments();
      renderStats();
    }).catch(() => {});
  }
}

async function goCommentsPage() {
  try {
    await showCommentsView();
  } catch {
    window.location.href = './?view=comments';
  }
}

function sanitizeUrl(value) {
  const u = String(value || '').trim();
  if (!u) return '';
  if (!/^https?:\/\//i.test(u)) return '';
  return u;
}

function normalizeEditorHandle(raw) {
  let v = normalizeDisplayText(String(raw || '').trim());
  if (!v) return '';
  v = v.replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//i, '');
  v = v.replace(/^@+/, '');
  v = v.split(/[/?#]/)[0] || '';
  v = v.replace(/[^A-Za-z0-9_]/g, '');
  return v;
}

function editorXUrl(handle) {
  const h = normalizeEditorHandle(handle);
  return h ? `https://x.com/${h}` : '';
}

function editorAvatarUrl(item) {
  const custom = sanitizeUrl(item && item.avatarUrl ? item.avatarUrl : '');
  if (custom) return custom;
  const h = normalizeEditorHandle(item && item.xHandle ? item.xHandle : '');
  return h ? `https://unavatar.io/x/${encodeURIComponent(h)}` : './img/favicon-32x32.png';
}

function normalizeEditorItem(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const id = String(raw.id || '');
  const name = normalizeDisplayText(String(raw.name || '').trim());
  const role = normalizeDisplayText(String(raw.role || '').trim());
  const bio = normalizeDisplayText(String(raw.bio || '').trim());
  const xHandle = normalizeEditorHandle(raw.xHandle || raw.x || '');
  const avatarUrl = sanitizeUrl(raw.avatarUrl || raw.avatar || '');
  const ts = String(raw.ts || new Date().toISOString());
  if (!name) return null;
  return { id: id || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, name, role, bio, xHandle, avatarUrl, ts };
}

function saveEditors() {
  localStorage.setItem(STORAGE_KEYS.editors, JSON.stringify(state.editors || []));
}

function getEditorsSorted() {
  return (state.editors || [])
    .map(normalizeEditorItem)
    .filter(Boolean)
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
}

async function loadEditorsFromServer(limit = 300) {
  if (!COMMENTS_SERVER_ENABLED) return false;
  const n = Math.max(1, Math.min(500, Number(limit) || 300));
  const data = await fetchCommentsApi(`?action=editor_list&limit=${encodeURIComponent(String(n))}`);
  if (!data || !data.ok || !Array.isArray(data.editors)) return false;
  state.editors = data.editors.map((item) => normalizeEditorItem({
    id: item.id,
    name: item.name,
    role: item.role,
    bio: item.bio,
    xHandle: item.x_handle || item.xHandle || item.x,
    avatarUrl: item.avatar_url || item.avatarUrl || item.avatar,
    ts: item.updated_at || item.ts || item.created_at,
  })).filter(Boolean);
  state.editorsLoaded = true;
  saveEditors();
  return true;
}

async function upsertEditorProfileToServer(item) {
  if (!COMMENTS_SERVER_ENABLED) return { ok: false, error: 'server disabled' };
  const editorKey = state.isAdmin ? state.adminKey : '';
  const data = await fetchCommentsApi('', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(editorKey ? { 'X-Editor-Key': editorKey } : {}),
    },
    body: JSON.stringify({
      action: 'editor_upsert',
      payload: {
        id: item.id,
        name: item.name,
        role: item.role,
        bio: item.bio,
        x_handle: item.xHandle,
        avatar_url: item.avatarUrl,
        ...(editorKey ? { editor_key: editorKey } : {}),
      },
    }),
  });
  return data || { ok: false, error: 'unknown error' };
}

async function deleteEditorProfileFromServer(id) {
  if (!COMMENTS_SERVER_ENABLED) return { ok: false, error: 'server disabled' };
  const editorKey = state.isAdmin ? state.adminKey : '';
  const data = await fetchCommentsApi('', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(editorKey ? { 'X-Editor-Key': editorKey } : {}),
    },
    body: JSON.stringify({
      action: 'editor_delete',
      payload: {
        id: String(id || ''),
        ...(editorKey ? { editor_key: editorKey } : {}),
      },
    }),
  });
  return data || { ok: false, error: 'unknown error' };
}

async function fetchXProfileFromServer(xHandle) {
  if (!COMMENTS_SERVER_ENABLED) return { ok: false, error: 'server disabled' };
  const editorKey = state.isAdmin ? state.adminKey : '';
  const data = await fetchCommentsApi('', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(editorKey ? { 'X-Editor-Key': editorKey } : {}),
    },
    body: JSON.stringify({
      action: 'x_profile_fetch',
      payload: {
        x_handle: xHandle,
        ...(editorKey ? { editor_key: editorKey } : {}),
      },
    }),
  });
  return data || { ok: false, error: 'unknown error' };
}

function setEditorNotice(msg, type) {
  const el = document.getElementById('epNotice');
  if (!el) return;
  el.textContent = msg;
  el.className = `fr-notice${type ? ` ${type} visible` : ''}`;
}

function clearEditorForm() {
  const ids = ['epId', 'epName', 'epRole', 'epX', 'epBio', 'epAvatar'];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  setEditorNotice('', '');
}

function openEditorModal(id = '') {
  if (isMobileAdminRestricted()) {
    toast('モバイルでは編集メンバー追加は利用できません', 'error');
    return;
  }
  if (!state.isAdmin) {
    toast('編集メンバーの登録は管理者モードで利用できます', 'error');
    showAdmin();
    return;
  }
  closeMobileSidebar();
  closeMobileMenu();
  const modal = document.getElementById('editorModal');
  const nameInput = document.getElementById('epName');
  if (!modal) return;
  clearEditorForm();
  if (id) {
    const found = getEditorsSorted().find((x) => String(x.id) === String(id));
    if (found) {
      const map = {
        epId: found.id,
        epName: found.name,
        epRole: found.role,
        epX: found.xHandle ? `@${found.xHandle}` : '',
        epBio: found.bio,
        epAvatar: found.avatarUrl || '',
      };
      Object.entries(map).forEach(([key, value]) => {
        const el = document.getElementById(key);
        if (el) el.value = value;
      });
    }
  }
  modal.classList.add('open');
  setTimeout(() => {
    if (nameInput) nameInput.focus();
  }, 40);
}

function closeEditorModal() {
  const modal = document.getElementById('editorModal');
  if (!modal) return;
  modal.classList.remove('open');
}

function renderEditorsView() {
  const list = document.getElementById('editorList');
  const countPill = document.getElementById('editorCountPill');
  if (!list || !countPill) return;
  const editors = getEditorsSorted();
  countPill.textContent = `${editors.length} 人`;
  syncEditorManageButton();
  if (!editors.length) {
    list.innerHTML = '<div class="article-row note-row is-placeholder"><span class="article-title-row">まだ編集メンバープロフィールは登録されていません</span></div>';
    return;
  }
  list.innerHTML = editors.map((item) => {
    const xUrl = editorXUrl(item.xHandle);
    const xLabel = item.xHandle ? `@${item.xHandle}` : '';
    const actions = state.isAdmin
      ? `<div class="editor-actions admin-row-actions">
          <button class="admin-article-btn admin-row-btn" type="button" onclick="openEditorModal('${escapeForSingleQuote(item.id)}')">編集</button>
          <button class="admin-article-btn danger admin-row-btn" type="button" onclick="deleteEditorProfile('${escapeForSingleQuote(item.id)}')">削除</button>
        </div>`
      : '';
    return `<article class="editor-card">
      <img class="editor-avatar" src="${escapeHtml(editorAvatarUrl(item))}" alt="${escapeHtml(item.name)}">
      <div>
        <div class="editor-name">${escapeHtml(item.name)}</div>
        <div class="editor-role">${escapeHtml(item.role || '編集メンバー')}</div>
        ${xUrl ? `<a class="editor-x" href="${escapeHtml(xUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(xLabel)}</a>` : ''}
      </div>
      <div class="editor-bio">${escapeHtml(item.bio || 'プロフィール未設定')}</div>
      ${actions}
    </article>`;
  }).join('');
}

function showEditorsView(options = {}) {
  const { skipHistory = false } = options;
  closeMobileSidebar();
  closeMobileMenu();
  ensureEditorsLoaded().then((ok) => {
    if (ok) renderEditorsView();
  }).catch(() => {});
  renderEditorsView();
  showView('editors', { skipHistory: true });
  if (!skipHistory) syncHistory('editors', null, false);
}

async function submitEditorProfile() {
  if (!state.isAdmin) {
    setEditorNotice('管理者モードで操作してください', 'error');
    return;
  }
  const id = (document.getElementById('epId')?.value || '').trim();
  const name = normalizeDisplayText((document.getElementById('epName')?.value || '').trim());
  const role = normalizeDisplayText((document.getElementById('epRole')?.value || '').trim());
  const xHandle = normalizeEditorHandle((document.getElementById('epX')?.value || '').trim());
  const bio = normalizeDisplayText((document.getElementById('epBio')?.value || '').trim());
  const avatarUrl = sanitizeUrl((document.getElementById('epAvatar')?.value || '').trim());
  if (!name) {
    setEditorNotice('表示名は必須です', 'error');
    return;
  }
  const nextItem = normalizeEditorItem({
    id: id || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    role,
    xHandle,
    bio,
    avatarUrl,
    ts: new Date().toISOString(),
  });
  if (!nextItem) {
    setEditorNotice('入力内容を確認してください', 'error');
    return;
  }
  const list = getEditorsSorted();
  const idx = list.findIndex((x) => String(x.id) === String(nextItem.id));
  if (COMMENTS_SERVER_ENABLED) {
    const saved = await upsertEditorProfileToServer(nextItem);
    if (!saved || !saved.ok) {
      const reason = saved && saved.error ? `（${saved.error}）` : '';
      setEditorNotice(`保存に失敗しました${reason}`, 'error');
      toast(`編集メンバーの保存に失敗しました${reason}`, 'error');
      if (saved && /editor_key/i.test(String(saved.error || ''))) {
        showAdmin();
      }
      return;
    }
    await loadEditorsFromServer(300);
  } else {
    if (idx >= 0) list[idx] = nextItem;
    else list.unshift(nextItem);
    state.editors = list.slice(0, 200);
    saveEditors();
  }
  closeEditorModal();
  renderEditorsView();
  toast(id ? '編集メンバープロフィールを更新しました' : '編集メンバープロフィールを追加しました', 'success');
}

async function deleteEditorProfile(id) {
  if (!state.isAdmin) return;
  if (!confirm('この編集メンバープロフィールを削除しますか？')) return;
  if (COMMENTS_SERVER_ENABLED) {
    const deleted = await deleteEditorProfileFromServer(id);
    if (!deleted || !deleted.ok) {
      toast(`削除に失敗しました${deleted && deleted.error ? `（${deleted.error}）` : ''}`, 'error');
      return;
    }
    await loadEditorsFromServer(300);
  } else {
    state.editors = getEditorsSorted().filter((x) => String(x.id) !== String(id));
    saveEditors();
  }
  renderEditorsView();
  toast('編集メンバープロフィールを削除しました', 'success');
}

async function fillEditorProfileFromX() {
  if (!state.isAdmin) {
    setEditorNotice('管理者モードで操作してください', 'error');
    return;
  }
  const xInput = document.getElementById('epX');
  const nameInput = document.getElementById('epName');
  const bioInput = document.getElementById('epBio');
  const avatarInput = document.getElementById('epAvatar');
  if (!xInput || !nameInput || !bioInput || !avatarInput) return;
  const handle = normalizeEditorHandle(xInput.value || '');
  if (!handle) {
    setEditorNotice('Xアカウントを入力してください', 'error');
    return;
  }
  setEditorNotice('Xプロフィールを取得中です...', '');
  const data = await fetchXProfileFromServer(handle);
  if (!data || !data.ok || !data.profile) {
    setEditorNotice(`Xプロフィール取得に失敗しました${data && data.error ? `（${data.error}）` : ''}`, 'error');
    return;
  }
  const profile = data.profile || {};
  if (profile.name) nameInput.value = String(profile.name);
  if (typeof profile.description === 'string') bioInput.value = String(profile.description);
  if (profile.profile_image_url) avatarInput.value = String(profile.profile_image_url);
  xInput.value = '@' + (profile.username || handle);
  if (data.warning || !String(profile.description || '').trim()) {
    setEditorNotice('Xプロフィールを反映しました（プロフィール文は取得できない場合があります）', 'success');
    return;
  }
  setEditorNotice('Xプロフィールを反映しました', 'success');
}

// ── TOOLS VIEW ──
const TOOL_ICONS = {
  '基本': '📖', 'Figma': '📐', 'バイブコーディング': '🎸',
  'Codex': '🧠', 'Claude Code': '⌨', 'Antigravity': '🪐',
  'Relume': '🔷', 'Stitch': '🧵', 'できるくんAI': '🤖', 'WordPress': 'Ⓦ',
};

const TOOL_META = {
  '基本': {
    desc: '実務の土台になる考え方と進め方を確認',
    labels: ['基礎', '実務全般'],
  },
  'Figma': {
    desc: '画面設計・プロトタイプ作成・レビュー共有',
    labels: ['設計', 'UI'],
  },
  'バイブコーディング': {
    desc: 'AIと対話しながら実装を前に進める手法',
    labels: ['実装', 'AI補助'],
  },
  'Codex': {
    desc: 'コード生成や改修を伴走する開発支援AI',
    labels: ['実装', '自動化'],
  },
  'Claude Code': {
    desc: 'コード読解と改修を素早く進めるAI開発補助',
    labels: ['実装', 'AI補助'],
  },
  'Antigravity': {
    desc: '制作運用の自動化フローを組むための基盤',
    labels: ['自動化', '運用'],
  },
  'Relume': {
    desc: '情報設計とUI構成案を高速に作る支援ツール',
    labels: ['設計', '効率化'],
  },
  'Stitch': {
    desc: 'GoogleのUI生成ツールで画面叩き台を素早く作成',
    labels: ['設計', 'AI補助'],
  },
  'できるくんAI': {
    desc: '調査や文案生成などの作業を補助するAI',
    labels: ['分析', 'AI補助'],
  },
  'WordPress': {
    desc: '記事公開・SEO運用・更新管理を行うCMS',
    labels: ['CMS', 'SEO'],
  },
};

const TAG_ICONS = {
  figma: '📐', vibe: '🎸', wp: 'Ⓦ', codex: '🧠',
  claude_code: '⌨', antigravity: '🪐',
};

function showToolsView(options = {}) {
  // 「ツール・タグで探す」は非表示運用のため、用語集へ誘導
  showGlossaryView(options);
}

function getAllToolsFromArticles() {
  const seen = new Set();
  const tools = [];
  (state.articleIndex || []).forEach((a) => {
    getExpandedTools(a).forEach((t) => {
      if (!seen.has(t)) { seen.add(t); tools.push(t); }
    });
  });
  return tools;
}

function getAllTagsFromArticles() {
  const seen = new Set();
  const tags = [];
  (state.articleIndex || []).forEach((a) => {
    (a.tags || []).forEach((t) => {
      if (!seen.has(t)) { seen.add(t); tags.push(t); }
    });
  });
  return tags;
}

function getToolMeta(toolName) {
  const name = normalizeDisplayText(toolName || '');
  const meta = TOOL_META[name] || {};
  return {
    icon: TOOL_ICONS[name] || '🔧',
    desc: normalizeDisplayText(meta.desc || '関連する記事をまとめて確認できます'),
    labels: Array.isArray(meta.labels) ? meta.labels.map((x) => normalizeDisplayText(x)).filter(Boolean) : [],
  };
}

function getToolArticleCounts() {
  const counts = new Map();
  (state.articleIndex || []).forEach((article) => {
    if (!article || isArticleDeleted(article.id)) return;
    const tools = [...new Set(getExpandedTools(article))];
    tools.forEach((tool) => {
      counts.set(tool, (counts.get(tool) || 0) + 1);
    });
  });
  return counts;
}

function renderToolFilterCard(toolName, count) {
  const meta = getToolMeta(toolName);
  const labels = meta.labels.slice(0, 2);
  const labelsHtml = labels.length
    ? `<span class="tool-filter-labels">${labels.map((label) => `<span class="tool-filter-label">${escapeHtml(label)}</span>`).join('')}</span>`
    : '';
  return `
    <button class="tool-filter-card${state.toolFilter === toolName ? ' active' : ''}" type="button" onclick="selectToolFilter('${escapeForSingleQuote(toolName)}')">
      <span class="tool-filter-head">
        <span class="tool-filter-name-wrap">
          <span class="tool-filter-icon">${escapeHtml(meta.icon)}</span>
          <span class="tool-filter-name">${escapeHtml(toolName)}</span>
        </span>
        <span class="tool-filter-count">${formatNumberWithComma(count)}件</span>
      </span>
      <span class="tool-filter-desc">${escapeHtml(meta.desc)}</span>
      ${labelsHtml}
    </button>
  `;
}

function renderToolsView() {
  const allTools = getAllToolsFromArticles();
  const allTags = getAllTagsFromArticles();
  const toolCounts = getToolArticleCounts();
  const totalArticles = (state.articleIndex || []).filter((a) => a && !isArticleDeleted(a.id)).length;
  const sortedTools = [...allTools].sort((a, b) => {
    const countDiff = (toolCounts.get(b) || 0) - (toolCounts.get(a) || 0);
    if (countDiff) return countDiff;
    return String(a).localeCompare(String(b), 'ja');
  });

  const toolChipsEl = document.getElementById('toolFilterChips');
  toolChipsEl.classList.add('tool-filter-grid');
  toolChipsEl.innerHTML = [
    `<button class="tool-filter-card tool-filter-card-all${!state.toolFilter ? ' active' : ''}" type="button" onclick="selectToolFilter(null)">
      <span class="tool-filter-head">
        <span class="tool-filter-name-wrap">
          <span class="tool-filter-icon">🧭</span>
          <span class="tool-filter-name">すべてのツール</span>
        </span>
        <span class="tool-filter-count">${formatNumberWithComma(totalArticles)}件</span>
      </span>
      <span class="tool-filter-desc">用途ラベル付きで全体を俯瞰して選べます</span>
      <span class="tool-filter-labels"><span class="tool-filter-label">横断</span></span>
    </button>`,
    ...sortedTools.map((toolName) => renderToolFilterCard(toolName, toolCounts.get(toolName) || 0)),
  ].join('');

  const tagChipsEl = document.getElementById('tagFilterChips');
  if (allTags.length) {
    tagChipsEl.innerHTML = [
      `<button class="filter-chip${!state.tagFilter ? ' active' : ''}" onclick="selectTagFilter(null)">すべて</button>`,
      ...allTags.map((t) => {
        const icon = TAG_ICONS[t] ? TAG_ICONS[t] + ' ' : '';
        return `<button class="filter-chip${state.tagFilter === t ? ' active' : ''}" onclick="selectTagFilter('${t}')">${icon}#${tagLabel(t)}</button>`;
      }),
    ].join('');
    document.getElementById('toolsTagSection').style.display = '';
  } else {
    document.getElementById('toolsTagSection').style.display = 'none';
  }

  renderToolsArticleList();
}

function renderToolsArticleList() {
  const list = document.getElementById('toolsArticleList');
  const label = document.getElementById('toolsResultLabel');

  let articles = (state.articleIndex || []).filter((a) => !isArticleDeleted(a.id));
  if (state.toolFilter) {
    articles = articles.filter((a) => getExpandedTools(a).includes(state.toolFilter));
  }
  if (state.tagFilter) {
    articles = articles.filter((a) => (a.tags || []).includes(state.tagFilter));
  }

  label.textContent = `${formatNumberWithComma(articles.length)}件の記事`;

  list.innerHTML = articles.length
    ? articles.map((a) => `
        <div class="article-row" onclick="showArticle('${a.id}')">
          ${renderCategoryBadge(a.cat)}
          <span class="article-title-row">${normalizeDisplayText(a.title)}</span>
          <div class="article-tags">
            ${(a.tags || []).map((t) => `<span class="tag ${t}">${tagLabel(t)}</span>`).join('')}
          </div>
          <span class="article-arrow">›</span>
        </div>`).join('')
    : '<div class="article-row"><span class="article-title-row no-result-muted">条件に一致する記事がありません</span></div>';
}

function selectToolFilter(tool) {
  state.toolFilter = tool;
  renderToolsView();
}

function selectTagFilter(tag) {
  state.tagFilter = tag;
  renderToolsView();
}

window.showToolsView = showToolsView;
window.selectToolFilter = selectToolFilter;
window.selectTagFilter = selectTagFilter;
window.setCategoryGroup = setCategoryGroup;

window.openFeatureRequestModal = openFeatureRequestModal;
window.closeFeatureRequestModal = closeFeatureRequestModal;
window.clearFeatureRequestForm = clearFeatureRequestForm;
window.submitFeatureRequest = submitFeatureRequest;
window.openGlossaryTermModal = openGlossaryTermModal;
window.closeGlossaryTermModal = closeGlossaryTermModal;
window.clearGlossaryTermForm = clearGlossaryTermForm;
window.submitGlossaryTerm = submitGlossaryTerm;
window.showFeatureRequestsView = showFeatureRequestsView;
window.goRequestsPage = goRequestsPage;
window.showEditorsView = showEditorsView;
window.showDictionaryTopView = showDictionaryTopView;
window.showAppendixTopView = showAppendixTopView;
window.openEditorModal = openEditorModal;
window.closeEditorModal = closeEditorModal;
window.clearEditorForm = clearEditorForm;
window.submitEditorProfile = submitEditorProfile;
window.deleteEditorProfile = deleteEditorProfile;
window.fillEditorProfileFromX = fillEditorProfileFromX;
window.showGlossaryView = showGlossaryView;
window.renderGlossaryPage = renderGlossaryPage;
window.setGlossarySort = setGlossarySort;
window.editFeatureRequest = editFeatureRequest;
window.deleteFeatureRequest = deleteFeatureRequest;
window.editGlossaryTerm = editGlossaryTerm;
window.deleteGlossaryTerm = deleteGlossaryTerm;

window.addEventListener('popstate', async (event) => {
  const route = (event.state && event.state.view) ? event.state : parseRoute();
  await applyRouteState(route, { sync: false, replace: false });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeMobileSidebar();
    closeMobileMenu();
  }
  closeHeaderAdminMenu();
  updateMobileBottomNav();
  syncEditorManageButton();
  syncHeaderAdminMenu();
  syncHeaderCompactState();
});

window.addEventListener('visibilitychange', async () => {
  if (document.visibilityState !== 'visible') return;
  try {
    const ok = await hydrateCommentsFromServer(30);
    if (!ok) return;
    renderLatestComments();
  } catch (_) {}
});

bindModalEscapeHandler();
init();
