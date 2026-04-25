<?php

declare(strict_types=1);

ini_set('display_errors', '0');
ini_set('html_errors', '0');
error_reporting(E_ALL);
mb_internal_encoding('UTF-8');
date_default_timezone_set('Asia/Tokyo');

const DB_DIR = __DIR__ . '/data';
const DB_PATH = DB_DIR . '/dictionary.sqlite';
const LEGACY_DB_PATH = __DIR__ . '/../data/dictionary.sqlite';
const API_VERSION = '2026-03-29.sqlite.3';
const APP_BASE_URL = 'https://drsp.cc/app/note';


function loadApiConfig(): array
{
    static $config = null;
    if (is_array($config)) return $config;

    $path = __DIR__ . '/config.php';
    if (!is_file($path)) {
        $config = [];
        return $config;
    }

    $loaded = require $path;
    $config = is_array($loaded) ? $loaded : [];
    return $config;
}

try {
    $pdo = db();
    ensureSchema($pdo);

    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    if ($method === 'OPTIONS') {
        respond([], 204);
        exit;
    }

    if ($method === 'GET') {
        handleGet($pdo);
        exit;
    }

    if ($method === 'POST') {
        handlePost($pdo);
        exit;
    }

    if ($method === 'DELETE') {
        handleDelete($pdo);
        exit;
    }

    respond(['ok' => false, 'error' => 'Method not allowed'], 405);
} catch (Throwable $e) {
    respond(['ok' => false, 'error' => $e->getMessage()], 500);
}

function handleGet(PDO $pdo): void
{
    $action = sanitize($_GET['action'] ?? '', 40);
    if ($action === 'sitemap') {
        respondXml(buildSitemapXml($pdo));
        return;
    }

    if ($action === 'health') {
        respond([
            'ok' => true,
            'service' => 'dictionary-comments-sqlite',
            'version' => API_VERSION,
            'time' => gmdate('c'),
        ]);
        return;
    }

    $articleId = sanitize($_GET['article_id'] ?? ($_GET['page_key'] ?? ''), 191);
    $recent = toInt($_GET['recent'] ?? 0, 0);

    if ($action === 'list' || ($articleId !== '' && $action === '')) {
        respond([
            'ok' => true,
            'action' => 'list',
            'article_id' => $articleId,
            'comments' => listComments($pdo, $articleId),
        ]);
        return;
    }

    if ($action === 'recent' || $recent > 0) {
        respond([
            'ok' => true,
            'action' => 'recent',
            'comments' => recentComments($pdo, max(1, min(100, $recent === 0 ? 20 : $recent))),
        ]);
        return;
    }

    if ($action === 'fr_list') {
        $limit = max(1, min(300, toInt($_GET['limit'] ?? 120, 120)));
        respond([
            'ok' => true,
            'action' => 'fr_list',
            'requests' => listFeatureRequests($pdo, $limit),
        ]);
        return;
    }

    if ($action === 'glossary_list') {
        $limit = max(1, min(500, toInt($_GET['limit'] ?? 300, 300)));
        respond([
            'ok' => true,
            'action' => 'glossary_list',
            'terms' => listGlossaryTerms($pdo, $limit),
        ]);
        return;
    }

    if ($action === 'glossary_base_list') {
        respond([
            'ok' => true,
            'action' => 'glossary_base_list',
            'items' => listGlossaryBaseOverrides($pdo),
        ]);
        return;
    }

    if ($action === 'article_list') {
        $limit = max(1, min(500, toInt($_GET['limit'] ?? 300, 300)));
        respond([
            'ok' => true,
            'action' => 'article_list',
            'articles' => listArticleOverrides($pdo, $limit),
        ]);
        return;
    }

    if ($action === 'article_index') {
        $limit = max(1, min(5000, toInt($_GET['limit'] ?? 500, 500)));
        respond([
            'ok' => true,
            'action' => 'article_index',
            'articles' => listMergedArticleIndex($pdo, $limit),
        ]);
        return;
    }

    if ($action === 'article_get') {
        $articleId = sanitize($_GET['article_id'] ?? '', 191);
        respond([
            'ok' => true,
            'action' => 'article_get',
            'article_id' => $articleId,
            'article' => getArticleOverride($pdo, $articleId),
        ]);
        return;
    }

    if ($action === 'article_static_get') {
        $articleId = sanitize($_GET['article_id'] ?? '', 191);
        respond([
            'ok' => true,
            'action' => 'article_static_get',
            'article_id' => $articleId,
            'article' => loadVisibleStaticArticleById($pdo, $articleId),
        ]);
        return;
    }

    if ($action === 'editor_list') {
        $limit = max(1, min(500, toInt($_GET['limit'] ?? 300, 300)));
        respond([
            'ok' => true,
            'action' => 'editor_list',
            'editors' => listEditorProfiles($pdo, $limit),
        ]);
        return;
    }

    if ($action === 'metrics_summary') {
        respond([
            'ok' => true,
            'action' => 'metrics_summary',
            'metrics' => getMetricsSummary($pdo),
        ]);
        return;
    }

    if ($action === 'verify_editor') {
        respond(verifyEditor($pdo, []));
        return;
    }

    respond([
        'ok' => true,
        'service' => 'dictionary-comments-sqlite',
        'usage' => 'GET: ?action=health|sitemap|list|recent|fr_list|glossary_list|glossary_base_list|article_list|article_index|article_get|article_static_get|editor_list|metrics_summary, POST JSON: {action,payload} or legacy fields',
        'actions' => ['health', 'sitemap', 'list', 'recent', 'fr_list', 'glossary_list', 'glossary_base_list', 'article_list', 'article_index', 'article_get', 'article_static_get', 'editor_list', 'metrics_summary', 'verify_editor', 'editor_key_update', 'x_profile_fetch', 'article_source_digest', 'add', 'fr_add', 'glossary_add', 'metrics_track', 'update', 'delete', 'fr_update', 'fr_delete', 'glossary_update', 'glossary_delete', 'glossary_base_set', 'glossary_base_delete', 'article_upsert', 'article_delete', 'editor_upsert', 'editor_delete'],
    ]);
}

function handlePost(PDO $pdo): void
{
    $body = parseJsonBody();
    $action = sanitize($body['action'] ?? '', 40);
    $payload = is_array($body['payload'] ?? null) ? $body['payload'] : $body;

    if ($action === '') {
        $action = 'add';
    }

    switch ($action) {
        case 'add':
            respond(addComment($pdo, $payload));
            return;
        case 'fr_add':
            respond(addFeatureRequest($pdo, $payload));
            return;
        case 'glossary_add':
            respond(addGlossaryTerm($pdo, $payload));
            return;
        case 'metrics_track':
            respond(trackMetricsEvent($pdo, $payload));
            return;
        case 'verify_editor':
            respond(verifyEditor($pdo, $payload));
            return;
        case 'editor_key_update':
            respond(updateEditorKey($payload));
            return;
        case 'fr_update':
            requireEditorPayload($payload);
            respond(updateFeatureRequest($pdo, $payload));
            return;
        case 'fr_delete':
            requireEditorPayload($payload);
            respond(deleteFeatureRequest($pdo, $payload));
            return;
        case 'glossary_update':
            requireEditorPayload($payload);
            respond(updateGlossaryTerm($pdo, $payload));
            return;
        case 'glossary_delete':
            requireEditorPayload($payload);
            respond(deleteGlossaryTerm($pdo, $payload));
            return;
        case 'glossary_base_set':
            requireEditorPayload($payload);
            respond(setGlossaryBaseOverride($pdo, $payload));
            return;
        case 'glossary_base_delete':
            requireEditorPayload($payload);
            respond(deleteGlossaryBaseOverride($pdo, $payload));
            return;
        case 'article_upsert':
            requireEditorPayload($payload);
            respond(upsertArticleOverride($pdo, $payload));
            return;
        case 'article_delete':
            requireEditorPayload($payload);
            respond(deleteArticleOverride($pdo, $payload));
            return;
        case 'editor_upsert':
            requireEditorPayload($payload);
            respond(upsertEditorProfile($pdo, $payload));
            return;
        case 'editor_delete':
            requireEditorPayload($payload);
            respond(deleteEditorProfile($pdo, $payload));
            return;
        case 'x_profile_fetch':
            requireEditorPayload($payload);
            respond(fetchXProfile($payload));
            return;
        case 'article_source_digest':
            requireEditorPayload($payload);
            respond(fetchArticleSourceDigest($payload));
            return;
        case 'list':
            $articleId = sanitize($payload['article_id'] ?? ($payload['page_key'] ?? ''), 191);
            respond([
                'ok' => true,
                'action' => 'list',
                'article_id' => $articleId,
                'comments' => listComments($pdo, $articleId),
            ]);
            return;
        case 'recent':
            $limit = max(1, min(100, toInt($payload['recent'] ?? ($payload['limit'] ?? 20), 20)));
            respond([
                'ok' => true,
                'action' => 'recent',
                'comments' => recentComments($pdo, $limit),
            ]);
            return;
        case 'fr_list':
            $limit = max(1, min(300, toInt($payload['limit'] ?? 120, 120)));
            respond([
                'ok' => true,
                'action' => 'fr_list',
                'requests' => listFeatureRequests($pdo, $limit),
            ]);
            return;
        case 'glossary_list':
            $limit = max(1, min(500, toInt($payload['limit'] ?? 300, 300)));
            respond([
                'ok' => true,
                'action' => 'glossary_list',
                'terms' => listGlossaryTerms($pdo, $limit),
            ]);
            return;
        case 'glossary_base_list':
            respond([
                'ok' => true,
                'action' => 'glossary_base_list',
                'items' => listGlossaryBaseOverrides($pdo),
            ]);
            return;
        case 'article_list':
            $limit = max(1, min(500, toInt($payload['limit'] ?? 300, 300)));
            respond([
                'ok' => true,
                'action' => 'article_list',
                'articles' => listArticleOverrides($pdo, $limit),
            ]);
            return;
        case 'article_index':
            $limit = max(1, min(5000, toInt($payload['limit'] ?? 500, 500)));
            respond([
                'ok' => true,
                'action' => 'article_index',
                'articles' => listMergedArticleIndex($pdo, $limit),
            ]);
            return;
        case 'article_get':
            $articleId = sanitize($payload['article_id'] ?? '', 191);
            respond([
                'ok' => true,
                'action' => 'article_get',
                'article_id' => $articleId,
                'article' => getArticleOverride($pdo, $articleId),
            ]);
            return;
        case 'article_static_get':
            $articleId = sanitize($payload['article_id'] ?? '', 191);
            respond([
                'ok' => true,
                'action' => 'article_static_get',
                'article_id' => $articleId,
                'article' => loadVisibleStaticArticleById($pdo, $articleId),
            ]);
            return;
        case 'editor_list':
            $limit = max(1, min(500, toInt($payload['limit'] ?? 300, 300)));
            respond([
                'ok' => true,
                'action' => 'editor_list',
                'editors' => listEditorProfiles($pdo, $limit),
            ]);
            return;
        case 'update':
            requireEditorPayload($payload);
            respond(updateComment($pdo, $payload));
            return;
        case 'delete':
            requireEditorPayload($payload);
            respond(deleteCommentInternal($pdo, $payload));
            return;
        default:
            respond(['ok' => false, 'error' => 'Unknown action'], 400);
    }
}

function handleDelete(PDO $pdo): void
{
    $body = parseJsonBody();
    requireEditorPayload($body);
    respond(deleteCommentInternal($pdo, $body));
}

function listComments(PDO $pdo, string $articleId): array
{
    if ($articleId === '') return [];

    $stmt = $pdo->prepare('SELECT id, article_id, author_name, body, status, created_at, updated_at FROM comments WHERE article_id = :article_id AND status = "visible" ORDER BY created_at DESC LIMIT 100');
    $stmt->execute([':article_id' => $articleId]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

    return array_map('normalizeComment', $rows);
}

function recentComments(PDO $pdo, int $limit): array
{
    $stmt = $pdo->prepare('SELECT id, article_id, author_name, body, status, created_at, updated_at FROM comments WHERE status = "visible" ORDER BY created_at DESC LIMIT ' . $limit);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

    return array_map('normalizeComment', $rows);
}

function addComment(PDO $pdo, array $payload): array
{
    $articleId = sanitize($payload['article_id'] ?? ($payload['page_key'] ?? ''), 191);
    $authorName = sanitize($payload['name'] ?? ($payload['author_name'] ?? '匿名'), 60);
    $body = sanitize($payload['body'] ?? ($payload['message'] ?? ''), 2000);

    if ($articleId === '') throw new RuntimeException('article_id is required');
    if ($body === '') throw new RuntimeException('body is required');
    if ($authorName === '') $authorName = '匿名';

    $ipHash = hash('sha256', clientIp());
    enforceRateLimit($pdo, $ipHash, 'add', 8);

    $id = uuidv4();
    $now = nowIso();

    $stmt = $pdo->prepare('INSERT INTO comments (id, article_id, author_name, body, status, ip_hash, user_agent, created_at, updated_at) VALUES (:id, :article_id, :author_name, :body, "visible", :ip_hash, :user_agent, :created_at, :updated_at)');
    $stmt->execute([
        ':id' => $id,
        ':article_id' => $articleId,
        ':author_name' => $authorName,
        ':body' => $body,
        ':ip_hash' => $ipHash,
        ':user_agent' => sanitize($_SERVER['HTTP_USER_AGENT'] ?? '', 255),
        ':created_at' => $now,
        ':updated_at' => $now,
    ]);

    $row = fetchOne($pdo, 'SELECT id, article_id, author_name, body, status, created_at, updated_at FROM comments WHERE id = :id LIMIT 1', [':id' => $id]);

    return [
        'ok' => true,
        'action' => 'add',
        'id' => $id,
        'comment' => normalizeComment($row ?: []),
    ];
}

function updateComment(PDO $pdo, array $payload): array
{
    $commentId = sanitize($payload['comment_id'] ?? ($payload['id'] ?? ''), 64);
    $body = sanitize($payload['body'] ?? '', 2000);

    if ($commentId === '') throw new RuntimeException('comment_id is required');
    if ($body === '') throw new RuntimeException('body is required');

    $ipHash = hash('sha256', clientIp());
    enforceRateLimit($pdo, $ipHash, 'update', 12);

    $stmt = $pdo->prepare('UPDATE comments SET body = :body, status = "visible", updated_at = :updated_at WHERE id = :id');
    $stmt->execute([
        ':id' => $commentId,
        ':body' => $body,
        ':updated_at' => nowIso(),
    ]);

    return [
        'ok' => true,
        'action' => 'update',
        'updated' => $stmt->rowCount() > 0,
    ];
}

function deleteCommentInternal(PDO $pdo, array $payload): array
{
    $commentId = sanitize($payload['comment_id'] ?? ($payload['id'] ?? ''), 64);
    $articleId = sanitize($payload['article_id'] ?? ($payload['page_key'] ?? ''), 191);

    if ($commentId === '') throw new RuntimeException('comment_id is required');

    $ipHash = hash('sha256', clientIp());
    enforceRateLimit($pdo, $ipHash, 'delete', 12);

    $sql = 'UPDATE comments SET status = "deleted", deleted_at = :deleted_at, updated_at = :updated_at WHERE id = :id';
    $params = [
        ':id' => $commentId,
        ':deleted_at' => nowIso(),
        ':updated_at' => nowIso(),
    ];

    if ($articleId !== '') {
        $sql .= ' AND article_id = :article_id';
        $params[':article_id'] = $articleId;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    return [
        'ok' => true,
        'action' => 'delete',
        'deleted' => $stmt->rowCount() > 0,
    ];
}

function normalizeComment(array $row): array
{
    return [
        'id' => (string)($row['id'] ?? ''),
        'article_id' => (string)($row['article_id'] ?? ''),
        'page_key' => (string)($row['article_id'] ?? ''),
        'name' => (string)($row['author_name'] ?? '匿名'),
        'author_name' => (string)($row['author_name'] ?? '匿名'),
        'body' => (string)($row['body'] ?? ''),
        'status' => (string)($row['status'] ?? 'visible'),
        'ts' => (string)($row['created_at'] ?? nowIso()),
        'created_at' => (string)($row['created_at'] ?? nowIso()),
        'updated_at' => (string)($row['updated_at'] ?? nowIso()),
    ];
}

function listFeatureRequests(PDO $pdo, int $limit): array
{
    $stmt = $pdo->prepare('SELECT id, name, title, category, body, link, created_at FROM feature_requests WHERE status = "visible" ORDER BY created_at DESC LIMIT ' . $limit);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    return array_map('normalizeFeatureRequest', $rows);
}

function addFeatureRequest(PDO $pdo, array $payload): array
{
    $name = sanitize($payload['name'] ?? '匿名', 60);
    $title = sanitize($payload['title'] ?? '', 120);
    $category = sanitize($payload['category'] ?? 'その他', 40);
    $body = sanitize($payload['body'] ?? '', 2000);
    $link = sanitize($payload['link'] ?? '', 300);

    if ($title === '') throw new RuntimeException('title is required');
    if ($body === '') throw new RuntimeException('body is required');
    if ($name === '') $name = '匿名';
    if ($category === '') $category = 'その他';

    if ($link !== '' && !preg_match('/^https?:///i', $link)) {
        $link = '';
    }

    $ipHash = hash('sha256', clientIp());
    enforceRateLimit($pdo, $ipHash, 'fr_add', 10);

    $id = uuidv4();
    $now = nowIso();

    $stmt = $pdo->prepare('INSERT INTO feature_requests (id, name, title, category, body, link, status, ip_hash, user_agent, created_at) VALUES (:id, :name, :title, :category, :body, :link, "visible", :ip_hash, :user_agent, :created_at)');
    $stmt->execute([
        ':id' => $id,
        ':name' => $name,
        ':title' => $title,
        ':category' => $category,
        ':body' => $body,
        ':link' => $link,
        ':ip_hash' => $ipHash,
        ':user_agent' => sanitize($_SERVER['HTTP_USER_AGENT'] ?? '', 255),
        ':created_at' => $now,
    ]);

    $row = fetchOne($pdo, 'SELECT id, name, title, category, body, link, created_at FROM feature_requests WHERE id = :id LIMIT 1', [':id' => $id]);

    return [
        'ok' => true,
        'action' => 'fr_add',
        'id' => $id,
        'request' => normalizeFeatureRequest($row ?: []),
    ];
}


function updateFeatureRequest(PDO $pdo, array $payload): array
{
    $id = sanitize($payload['id'] ?? ($payload['request_id'] ?? ''), 64);
    $name = sanitize($payload['name'] ?? '匿名', 60);
    $title = sanitize($payload['title'] ?? '', 120);
    $category = sanitize($payload['category'] ?? 'その他', 40);
    $body = sanitize($payload['body'] ?? '', 2000);
    $link = sanitize($payload['link'] ?? '', 300);

    if ($id === '') throw new RuntimeException('id is required');
    if ($title === '') throw new RuntimeException('title is required');
    if ($body === '') throw new RuntimeException('body is required');
    if ($name === '') $name = '匿名';
    if ($category === '') $category = 'その他';

    if ($link !== '' && !preg_match('/^https?:\/\//i', $link)) {
        $link = '';
    }

    $stmt = $pdo->prepare('UPDATE feature_requests SET name = :name, title = :title, category = :category, body = :body, link = :link, status = "visible" WHERE id = :id');
    $stmt->execute([
        ':id' => $id,
        ':name' => $name,
        ':title' => $title,
        ':category' => $category,
        ':body' => $body,
        ':link' => $link,
    ]);

    $row = fetchOne($pdo, 'SELECT id, name, title, category, body, link, created_at FROM feature_requests WHERE id = :id LIMIT 1', [':id' => $id]);

    return [
        'ok' => true,
        'action' => 'fr_update',
        'updated' => $stmt->rowCount() > 0,
        'request' => normalizeFeatureRequest($row ?: []),
    ];
}

function deleteFeatureRequest(PDO $pdo, array $payload): array
{
    $id = sanitize($payload['id'] ?? ($payload['request_id'] ?? ''), 64);
    if ($id === '') throw new RuntimeException('id is required');

    $stmt = $pdo->prepare('UPDATE feature_requests SET status = "deleted" WHERE id = :id');
    $stmt->execute([':id' => $id]);

    return [
        'ok' => true,
        'action' => 'fr_delete',
        'deleted' => $stmt->rowCount() > 0,
    ];
}
function normalizeFeatureRequest(array $row): array
{
    return [
        'id' => (string)($row['id'] ?? ''),
        'name' => (string)($row['name'] ?? '匿名'),
        'title' => (string)($row['title'] ?? ''),
        'category' => (string)($row['category'] ?? 'その他'),
        'body' => (string)($row['body'] ?? ''),
        'link' => (string)($row['link'] ?? ''),
        'ts' => (string)($row['created_at'] ?? nowIso()),
        'created_at' => (string)($row['created_at'] ?? nowIso()),
    ];
}

function listGlossaryTerms(PDO $pdo, int $limit): array
{
    $stmt = $pdo->prepare('SELECT id, term, description, author_name, created_at FROM glossary_terms WHERE status = "visible" ORDER BY created_at DESC LIMIT ' . $limit);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    return array_map('normalizeGlossaryTerm', $rows);
}

function addGlossaryTerm(PDO $pdo, array $payload): array
{
    $term = sanitize($payload['term'] ?? '', 80);
    $description = sanitize($payload['description'] ?? ($payload['desc'] ?? ''), 0);
    $authorName = sanitize($payload['name'] ?? ($payload['author_name'] ?? '匿名'), 60);

    if ($term === '') throw new RuntimeException('term is required');
    if ($description === '') throw new RuntimeException('description is required');
    if ($authorName === '') $authorName = '匿名';

    $ipHash = hash('sha256', clientIp());
    enforceRateLimit($pdo, $ipHash, 'glossary_add', 10);

    $id = uuidv4();
    $now = nowIso();

    $stmt = $pdo->prepare('INSERT INTO glossary_terms (id, term, description, author_name, status, ip_hash, user_agent, created_at, updated_at) VALUES (:id, :term, :description, :author_name, "visible", :ip_hash, :user_agent, :created_at, :updated_at)');
    $stmt->execute([
        ':id' => $id,
        ':term' => $term,
        ':description' => $description,
        ':author_name' => $authorName,
        ':ip_hash' => $ipHash,
        ':user_agent' => sanitize($_SERVER['HTTP_USER_AGENT'] ?? '', 255),
        ':created_at' => $now,
        ':updated_at' => $now,
    ]);

    $row = fetchOne($pdo, 'SELECT id, term, description, author_name, created_at FROM glossary_terms WHERE id = :id LIMIT 1', [':id' => $id]);

    return [
        'ok' => true,
        'action' => 'glossary_add',
        'id' => $id,
        'term' => normalizeGlossaryTerm($row ?: []),
    ];
}


function updateGlossaryTerm(PDO $pdo, array $payload): array
{
    $id = sanitize($payload['id'] ?? ($payload['term_id'] ?? ''), 64);
    $term = sanitize($payload['term'] ?? '', 80);
    $description = sanitize($payload['description'] ?? ($payload['desc'] ?? ''), 0);
    $authorName = sanitize($payload['name'] ?? ($payload['author_name'] ?? '匿名'), 60);

    if ($id === '') throw new RuntimeException('id is required');
    if ($term === '') throw new RuntimeException('term is required');
    if ($description === '') throw new RuntimeException('description is required');
    if ($authorName === '') $authorName = '匿名';

    $stmt = $pdo->prepare('UPDATE glossary_terms SET term = :term, description = :description, author_name = :author_name, status = "visible", updated_at = :updated_at WHERE id = :id');
    $stmt->execute([
        ':id' => $id,
        ':term' => $term,
        ':description' => $description,
        ':author_name' => $authorName,
        ':updated_at' => nowIso(),
    ]);

    $row = fetchOne($pdo, 'SELECT id, term, description, author_name, created_at FROM glossary_terms WHERE id = :id LIMIT 1', [':id' => $id]);

    return [
        'ok' => true,
        'action' => 'glossary_update',
        'updated' => $stmt->rowCount() > 0,
        'term' => normalizeGlossaryTerm($row ?: []),
    ];
}

function deleteGlossaryTerm(PDO $pdo, array $payload): array
{
    $id = sanitize($payload['id'] ?? ($payload['term_id'] ?? ''), 64);
    if ($id === '') throw new RuntimeException('id is required');

    $stmt = $pdo->prepare('UPDATE glossary_terms SET status = "deleted", updated_at = :updated_at WHERE id = :id');
    $stmt->execute([
        ':id' => $id,
        ':updated_at' => nowIso(),
    ]);

    return [
        'ok' => true,
        'action' => 'glossary_delete',
        'deleted' => $stmt->rowCount() > 0,
    ];
}
function normalizeGlossaryTerm(array $row): array
{
    return [
        'id' => (string)($row['id'] ?? ''),
        'term' => (string)($row['term'] ?? ''),
        'description' => (string)($row['description'] ?? ''),
        'desc' => (string)($row['description'] ?? ''),
        'name' => (string)($row['author_name'] ?? '匿名'),
        'author_name' => (string)($row['author_name'] ?? '匿名'),
        'ts' => (string)($row['created_at'] ?? nowIso()),
        'created_at' => (string)($row['created_at'] ?? nowIso()),
    ];
}



function listGlossaryBaseOverrides(PDO $pdo): array
{
    $stmt = $pdo->prepare('SELECT base_key, term, description, author_name, status, updated_at FROM glossary_base_overrides ORDER BY updated_at DESC');
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

    return array_map(static function (array $row): array {
        return [
            'base_key' => (string)($row['base_key'] ?? ''),
            'term' => (string)($row['term'] ?? ''),
            'description' => (string)($row['description'] ?? ''),
            'author_name' => (string)($row['author_name'] ?? '匿名'),
            'status' => (string)($row['status'] ?? 'visible'),
            'updated_at' => (string)($row['updated_at'] ?? nowIso()),
        ];
    }, $rows);
}

function setGlossaryBaseOverride(PDO $pdo, array $payload): array
{
    $baseKey = sanitize($payload['base_key'] ?? '', 120);
    $term = sanitize($payload['term'] ?? '', 120);
    $description = sanitize($payload['description'] ?? ($payload['desc'] ?? ''), 0);
    $authorName = sanitize($payload['name'] ?? ($payload['author_name'] ?? '匿名'), 60);

    if ($baseKey === '') throw new RuntimeException('base_key is required');
    if ($term === '') throw new RuntimeException('term is required');
    if ($description === '') throw new RuntimeException('description is required');
    if ($authorName === '') $authorName = '匿名';

    execStmt($pdo, 'INSERT INTO glossary_base_overrides (base_key, term, description, author_name, status, updated_at) VALUES (:base_key, :term, :description, :author_name, "visible", :updated_at)
      ON CONFLICT(base_key) DO UPDATE SET term = :term, description = :description, author_name = :author_name, status = "visible", updated_at = :updated_at', [
        ':base_key' => $baseKey,
        ':term' => $term,
        ':description' => $description,
        ':author_name' => $authorName,
        ':updated_at' => nowIso(),
    ]);

    return [
        'ok' => true,
        'action' => 'glossary_base_set',
        'base_key' => $baseKey,
    ];
}

function deleteGlossaryBaseOverride(PDO $pdo, array $payload): array
{
    $baseKey = sanitize($payload['base_key'] ?? '', 120);
    if ($baseKey === '') throw new RuntimeException('base_key is required');

    execStmt($pdo, 'INSERT INTO glossary_base_overrides (base_key, term, description, author_name, status, updated_at) VALUES (:base_key, "", "", "", "deleted", :updated_at)
      ON CONFLICT(base_key) DO UPDATE SET status = "deleted", updated_at = :updated_at', [
        ':base_key' => $baseKey,
        ':updated_at' => nowIso(),
    ]);

    return [
        'ok' => true,
        'action' => 'glossary_base_delete',
        'base_key' => $baseKey,
    ];
}

function listArticleOverrides(PDO $pdo, int $limit = 300): array
{
    $limit = max(1, min(500, $limit));
    $stmt = $pdo->prepare('SELECT article_id, article_json, updated_at FROM article_overrides WHERE status = "visible" ORDER BY updated_at DESC LIMIT ' . $limit);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

    $out = [];
    foreach ($rows as $row) {
        $json = json_decode((string)($row['article_json'] ?? ''), true);
        if (!is_array($json)) continue;
        if (!isset($json['id']) || (string)$json['id'] === '') {
            $json['id'] = (string)($row['article_id'] ?? '');
        }
        $json['updatedAt'] = (string)($json['updatedAt'] ?? ($row['updated_at'] ?? nowIso()));
        $out[] = $json;
    }
    return $out;
}

function getArticleOverride(PDO $pdo, string $articleId): ?array
{
    if ($articleId === '') return null;

    $row = fetchOne($pdo, 'SELECT article_id, article_json, updated_at FROM article_overrides WHERE article_id = :article_id AND status = "visible" LIMIT 1', [
        ':article_id' => $articleId,
    ]);
    if (!$row) return null;

    $json = json_decode((string)($row['article_json'] ?? ''), true);
    if (!is_array($json)) return null;
    if (!isset($json['id']) || (string)$json['id'] === '') {
        $json['id'] = (string)($row['article_id'] ?? '');
    }
    $json['updatedAt'] = (string)($json['updatedAt'] ?? ($row['updated_at'] ?? nowIso()));
    return $json;
}

function loadStaticArticleIndex(): array
{
    $path = __DIR__ . '/../data/articles/index.json';
    if (!is_file($path)) return [];

    $raw = @file_get_contents($path);
    if (!is_string($raw) || $raw === '') return [];

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) return [];

    $out = [];
    foreach ($decoded as $row) {
        if (!is_array($row)) continue;
        $id = sanitize($row['id'] ?? '', 191);
        if ($id === '') continue;
        $out[] = normalizeArticleSummary($row);
    }
    return $out;
}

function loadStaticArticleById(string $articleId): ?array
{
    $articleId = sanitize($articleId, 191);
    if ($articleId === '') return null;
    if (!preg_match('/^[A-Za-z0-9._-]+$/', $articleId)) return null;

    $path = __DIR__ . '/../data/articles/' . $articleId . '.json';
    if (!is_file($path)) return null;

    $raw = @file_get_contents($path);
    if (!is_string($raw) || $raw === '') return null;

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) return null;
    $decoded['id'] = $articleId;
    return $decoded;
}

function listDeletedArticleIdSet(PDO $pdo): array
{
    $stmt = $pdo->prepare('SELECT article_id FROM article_overrides WHERE status = "deleted"');
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    $set = [];
    foreach ($rows as $row) {
        $id = sanitize($row['article_id'] ?? '', 191);
        if ($id !== '') $set[$id] = true;
    }
    return $set;
}

function isArticleDeletedByOverride(PDO $pdo, string $articleId): bool
{
    if ($articleId === '') return false;
    $row = fetchOne($pdo, 'SELECT article_id FROM article_overrides WHERE article_id = :article_id AND status = "deleted" LIMIT 1', [
        ':article_id' => $articleId,
    ]);
    return is_array($row) && !empty($row['article_id']);
}

function loadVisibleStaticArticleById(PDO $pdo, string $articleId): ?array
{
    $id = sanitize($articleId, 191);
    if ($id === '') return null;
    if (isArticleDeletedByOverride($pdo, $id)) return null;
    return loadStaticArticleById($id);
}

function normalizeArticleSummary(array $row): array
{
    $id = sanitize($row['id'] ?? '', 191);
    $cat = sanitize($row['cat'] ?? '', 120);
    $title = sanitize($row['title'] ?? '', 191);
    $updatedAt = sanitize($row['updatedAt'] ?? ($row['updated_at'] ?? ($row['ts'] ?? nowIso())), 64);
    $tags = [];
    if (is_array($row['tags'] ?? null)) {
        foreach ($row['tags'] as $tag) {
            $t = sanitize($tag, 64);
            if ($t !== '') $tags[] = $t;
        }
    }
    return [
        'id' => $id,
        'cat' => $cat,
        'title' => $title,
        'tags' => $tags,
        'updatedAt' => $updatedAt !== '' ? $updatedAt : nowIso(),
    ];
}

function shouldReplaceArticleSummary(array $current, array $incoming): bool
{
    $currentTs = strtotime((string)($current['updatedAt'] ?? '')) ?: 0;
    $incomingTs = strtotime((string)($incoming['updatedAt'] ?? '')) ?: 0;
    if ($incomingTs !== $currentTs) return $incomingTs > $currentTs;
    return strlen((string)($incoming['title'] ?? '')) >= strlen((string)($current['title'] ?? ''));
}

function listMergedArticleIndex(PDO $pdo, int $limit = 500): array
{
    $limit = max(1, min(5000, $limit));
    $merged = [];
    $deleted = listDeletedArticleIdSet($pdo);

    foreach (loadStaticArticleIndex() as $item) {
        $id = (string)($item['id'] ?? '');
        if ($id === '') continue;
        if (isset($deleted[$id])) continue;
        $merged[$id] = $item;
    }

    foreach (listArticleOverrides($pdo, 5000) as $item) {
        $summary = normalizeArticleSummary($item);
        $id = (string)($summary['id'] ?? '');
        if ($id === '') continue;
        if (!isset($merged[$id]) || shouldReplaceArticleSummary($merged[$id], $summary)) {
            $merged[$id] = $summary;
        }
    }

    $rows = array_values($merged);
    usort($rows, static function (array $a, array $b): int {
        $aTs = strtotime((string)($a['updatedAt'] ?? '')) ?: 0;
        $bTs = strtotime((string)($b['updatedAt'] ?? '')) ?: 0;
        if ($aTs === $bTs) {
            return strcmp((string)($a['id'] ?? ''), (string)($b['id'] ?? ''));
        }
        return $bTs <=> $aTs;
    });

    return array_slice($rows, 0, $limit);
}

function xmlEscape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_XML1, 'UTF-8');
}

function buildSitemapXml(PDO $pdo): string
{
    $urls = [
        ['loc' => APP_BASE_URL . '/', 'priority' => '1.0', 'lastmod' => null],
        ['loc' => APP_BASE_URL . '/?view=glossary', 'priority' => '0.8', 'lastmod' => null],
        ['loc' => APP_BASE_URL . '/?view=requests', 'priority' => '0.6', 'lastmod' => null],
    ];

    foreach (listMergedArticleIndex($pdo, 5000) as $item) {
        $id = sanitize($item['id'] ?? '', 191);
        if ($id === '') continue;
        $lastmod = sanitize($item['updatedAt'] ?? '', 64);
        $urls[] = [
            'loc' => APP_BASE_URL . '/?view=article&id=' . rawurlencode($id),
            'priority' => '0.7',
            'lastmod' => $lastmod !== '' ? $lastmod : null,
        ];
    }

    $xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
    foreach ($urls as $u) {
        $xml[] = '  <url>';
        $xml[] = '    <loc>' . xmlEscape((string)$u['loc']) . '</loc>';
        if (!empty($u['lastmod'])) {
            $xml[] = '    <lastmod>' . xmlEscape((string)$u['lastmod']) . '</lastmod>';
        }
        $xml[] = '    <priority>' . xmlEscape((string)$u['priority']) . '</priority>';
        $xml[] = '  </url>';
    }
    $xml[] = '</urlset>';
    return implode("\n", $xml) . "\n";
}

function upsertArticleOverride(PDO $pdo, array $payload): array
{
    $articleId = sanitize($payload['article_id'] ?? ($payload['id'] ?? ''), 191);
    $article = $payload['article'] ?? null;

    if ($articleId === '') throw new RuntimeException('article_id is required');
    if (!is_array($article)) throw new RuntimeException('article payload is required');

    $article['id'] = $articleId;
    $now = nowIso();
    $incomingUpdatedAt = sanitize($article['updatedAt'] ?? '', 64);
    $incomingTs = strtotime($incomingUpdatedAt);
    if ($incomingUpdatedAt !== '' && $incomingTs !== false) {
        // クライアント側の単調増加updatedAtを尊重し、静的データより古く見える逆転を防ぐ
        $article['updatedAt'] = $incomingUpdatedAt;
    } else {
        $article['updatedAt'] = $now;
    }

    $json = json_encode($article, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) throw new RuntimeException('article json encode failed');

    execStmt($pdo, 'INSERT INTO article_overrides (article_id, article_json, status, updated_at) VALUES (:article_id, :article_json, "visible", :updated_at)
      ON CONFLICT(article_id) DO UPDATE SET article_json = :article_json, status = "visible", updated_at = :updated_at', [
        ':article_id' => $articleId,
        ':article_json' => $json,
        ':updated_at' => $now,
    ]);

    return [
        'ok' => true,
        'action' => 'article_upsert',
        'article_id' => $articleId,
        'article' => $article,
    ];
}

function deleteArticleOverride(PDO $pdo, array $payload): array
{
    $articleId = sanitize($payload['article_id'] ?? ($payload['id'] ?? ''), 191);
    if ($articleId === '') throw new RuntimeException('article_id is required');

    execStmt($pdo, 'INSERT INTO article_overrides (article_id, article_json, status, updated_at) VALUES (:article_id, :article_json, "deleted", :updated_at)
      ON CONFLICT(article_id) DO UPDATE SET status = "deleted", updated_at = :updated_at', [
        ':article_id' => $articleId,
        ':article_json' => '{}',
        ':updated_at' => nowIso(),
    ]);

    return [
        'ok' => true,
        'action' => 'article_delete',
        'deleted' => true,
        'article_id' => $articleId,
    ];
}

function normalizeEditorProfile(array $row): array
{
    return [
        'id' => (string)($row['id'] ?? ''),
        'name' => (string)($row['name'] ?? ''),
        'role' => (string)($row['role'] ?? ''),
        'bio' => (string)($row['bio'] ?? ''),
        'x_handle' => (string)($row['x_handle'] ?? ''),
        'avatar_url' => (string)($row['avatar_url'] ?? ''),
        'created_at' => (string)($row['created_at'] ?? nowIso()),
        'updated_at' => (string)($row['updated_at'] ?? nowIso()),
        'ts' => (string)($row['updated_at'] ?? ($row['created_at'] ?? nowIso())),
    ];
}

function listEditorProfiles(PDO $pdo, int $limit): array
{
    $stmt = $pdo->prepare('SELECT id, name, role, bio, x_handle, avatar_url, created_at, updated_at FROM editor_profiles WHERE status = "visible" ORDER BY updated_at DESC LIMIT ' . $limit);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    return array_map('normalizeEditorProfile', $rows);
}

function upsertEditorProfile(PDO $pdo, array $payload): array
{
    $id = sanitize($payload['id'] ?? '', 64);
    $name = sanitize($payload['name'] ?? '', 80);
    $role = sanitize($payload['role'] ?? '', 120);
    $bio = sanitize($payload['bio'] ?? '', 1200);
    $xHandle = normalizeXHandle($payload['x_handle'] ?? ($payload['xHandle'] ?? ''));
    $avatarUrl = sanitizeUrl($payload['avatar_url'] ?? ($payload['avatarUrl'] ?? ''));

    if ($name === '') throw new RuntimeException('name is required');
    if ($id === '') $id = uuidv4();

    $now = nowIso();
    execStmt($pdo, 'INSERT INTO editor_profiles (id, name, role, bio, x_handle, avatar_url, status, created_at, updated_at)
      VALUES (:id, :name, :role, :bio, :x_handle, :avatar_url, "visible", :created_at, :updated_at)
      ON CONFLICT(id) DO UPDATE SET
        name = :name,
        role = :role,
        bio = :bio,
        x_handle = :x_handle,
        avatar_url = :avatar_url,
        status = "visible",
        updated_at = :updated_at', [
        ':id' => $id,
        ':name' => $name,
        ':role' => $role,
        ':bio' => $bio,
        ':x_handle' => $xHandle,
        ':avatar_url' => $avatarUrl,
        ':created_at' => $now,
        ':updated_at' => $now,
    ]);

    $row = fetchOne($pdo, 'SELECT id, name, role, bio, x_handle, avatar_url, created_at, updated_at FROM editor_profiles WHERE id = :id LIMIT 1', [':id' => $id]);
    return [
        'ok' => true,
        'action' => 'editor_upsert',
        'id' => $id,
        'editor' => normalizeEditorProfile($row ?: []),
    ];
}

function deleteEditorProfile(PDO $pdo, array $payload): array
{
    $id = sanitize($payload['id'] ?? '', 64);
    if ($id === '') throw new RuntimeException('id is required');

    $stmt = $pdo->prepare('UPDATE editor_profiles SET status = "deleted", updated_at = :updated_at WHERE id = :id');
    $stmt->execute([
        ':id' => $id,
        ':updated_at' => nowIso(),
    ]);

    return [
        'ok' => true,
        'action' => 'editor_delete',
        'deleted' => $stmt->rowCount() > 0,
        'id' => $id,
    ];
}

function normalizeXHandle($raw): string
{
    $v = trim((string)$raw);
    if ($v === '') return '';
    $v = preg_replace('/^https?:\/\/(www\.)?(x|twitter)\.com\//i', '', $v) ?? $v;
    $v = ltrim($v, '@');
    $v = explode('/', $v)[0] ?? $v;
    $v = explode('?', $v)[0] ?? $v;
    $v = preg_replace('/[^A-Za-z0-9_]/', '', $v) ?? '';
    return substr($v, 0, 50);
}

function configuredXBearerToken(): string
{
    $serverVal = trim((string)($_SERVER['DIC_X_BEARER_TOKEN'] ?? ''));
    if ($serverVal !== '') return $serverVal;

    $envVal = trim((string)(getenv('DIC_X_BEARER_TOKEN') ?: ''));
    if ($envVal !== '') return $envVal;

    $cfg = loadApiConfig();
    $cfgVal = trim((string)($cfg['x_bearer_token'] ?? ($cfg['DIC_X_BEARER_TOKEN'] ?? '')));
    return $cfgVal;
}

function fetchXProfile(array $payload): array
{
    $xHandle = normalizeXHandle($payload['x_handle'] ?? ($payload['xHandle'] ?? ''));
    if ($xHandle === '') throw new RuntimeException('x_handle is required');

    $token = configuredXBearerToken();
    if ($token === '') {
        return [
            'ok' => true,
            'action' => 'x_profile_fetch',
            'source' => 'fallback',
            'warning' => 'DIC_X_BEARER_TOKEN が未設定のため、簡易プロフィールで返却しました',
            'profile' => [
                'username' => $xHandle,
                'name' => '@' . $xHandle,
                'description' => '',
                'profile_image_url' => 'https://unavatar.io/x/' . rawurlencode($xHandle),
            ],
        ];
    }

    $endpoint = 'https://api.x.com/2/users/by/username/' . rawurlencode($xHandle) . '?user.fields=description,profile_image_url,name,username';
    $httpCode = 0;
    $body = '';
    if (function_exists('curl_init')) {
        $ch = curl_init($endpoint);
        if ($ch === false) {
            throw new RuntimeException('X API client init failed');
        }
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $token,
            'Accept: application/json',
        ]);
        $response = curl_exec($ch);
        $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErr = curl_error($ch);
        curl_close($ch);
        if (!is_string($response) || $response === '') {
            throw new RuntimeException('X API response is empty' . ($curlErr !== '' ? ': ' . $curlErr : ''));
        }
        $body = $response;
    } else {
        $ctx = stream_context_create([
            'http' => [
                'method' => 'GET',
                'header' => "Authorization: Bearer {$token}\r\nAccept: application/json\r\n",
                'timeout' => 10,
                'ignore_errors' => true,
            ],
        ]);
        $response = @file_get_contents($endpoint, false, $ctx);
        if (!is_string($response) || $response === '') {
            throw new RuntimeException('X API response is empty');
        }
        $body = $response;
        $meta = $http_response_header ?? [];
        foreach ($meta as $line) {
            if (preg_match('/\s(\d{3})\s/', $line, $m)) {
                $httpCode = (int)$m[1];
                break;
            }
        }
    }

    $decoded = json_decode($body, true);
    if (!is_array($decoded)) {
        throw new RuntimeException('X API response is invalid');
    }

    if ($httpCode >= 400) {
        $msg = '';
        if (isset($decoded['errors'][0]['detail'])) $msg = (string)$decoded['errors'][0]['detail'];
        if ($msg === '' && isset($decoded['title'])) $msg = (string)$decoded['title'];
        throw new RuntimeException('X API error' . ($msg !== '' ? ': ' . $msg : ''));
    }

    $data = is_array($decoded['data'] ?? null) ? $decoded['data'] : null;
    if (!$data) {
        throw new RuntimeException('X profile not found');
    }

    $profile = [
        'username' => sanitize((string)($data['username'] ?? ''), 60),
        'name' => sanitize((string)($data['name'] ?? ''), 80),
        'description' => sanitize((string)($data['description'] ?? ''), 1200),
        'profile_image_url' => sanitizeUrl((string)($data['profile_image_url'] ?? '')),
    ];

    return [
        'ok' => true,
        'action' => 'x_profile_fetch',
        'profile' => $profile,
    ];
}

function fetchArticleSourceDigest(array $payload): array
{
    $sourceUrl = sanitizeUrl($payload['source_url'] ?? ($payload['sourceUrl'] ?? ''));
    if ($sourceUrl === '') {
        throw new RuntimeException('source_url is required');
    }

    ensurePublicHttpUrl($sourceUrl);
    $fetched = fetchRemoteHtmlForDigest($sourceUrl);
    $effectiveUrl = sanitizeUrl($fetched['effective_url'] ?? $sourceUrl) ?: $sourceUrl;
    ensurePublicHttpUrl($effectiveUrl);

    $digest = digestSourceHtml((string)($fetched['html'] ?? ''), $effectiveUrl);
    return [
        'ok' => true,
        'action' => 'article_source_digest',
        'source' => $digest,
    ];
}

function ensurePublicHttpUrl(string $url): void
{
    $parts = parse_url($url);
    if (!is_array($parts)) {
        throw new RuntimeException('source_url is invalid');
    }

    $scheme = strtolower((string)($parts['scheme'] ?? ''));
    $host = strtolower((string)($parts['host'] ?? ''));
    if (!in_array($scheme, ['http', 'https'], true) || $host === '') {
        throw new RuntimeException('source_url is invalid');
    }
    if (in_array($host, ['localhost', 'localhost.localdomain'], true)) {
        throw new RuntimeException('private host is not allowed');
    }
    if (!hostResolvesToPublicIp($host)) {
        throw new RuntimeException('private/reserved network host is not allowed');
    }
}

function hostResolvesToPublicIp(string $host): bool
{
    $host = trim(strtolower($host));
    if ($host === '') return false;

    if (filter_var($host, FILTER_VALIDATE_IP)) {
        return isPublicIpAddress($host);
    }

    $ips = [];
    if (function_exists('dns_get_record')) {
        $a = @dns_get_record($host, DNS_A);
        if (is_array($a)) {
            foreach ($a as $row) {
                $ip = trim((string)($row['ip'] ?? ''));
                if ($ip !== '') $ips[] = $ip;
            }
        }
        $aaaa = @dns_get_record($host, DNS_AAAA);
        if (is_array($aaaa)) {
            foreach ($aaaa as $row) {
                $ip = trim((string)($row['ipv6'] ?? ''));
                if ($ip !== '') $ips[] = $ip;
            }
        }
    }

    if (!$ips && function_exists('gethostbynamel')) {
        $resolved = @gethostbynamel($host);
        if (is_array($resolved)) {
            foreach ($resolved as $ip) {
                $ip = trim((string)$ip);
                if ($ip !== '') $ips[] = $ip;
            }
        }
    }

    $ips = array_values(array_unique($ips));
    if (!$ips) return false;
    foreach ($ips as $ip) {
        if (!isPublicIpAddress($ip)) return false;
    }
    return true;
}

function isPublicIpAddress(string $ip): bool
{
    return filter_var(
        $ip,
        FILTER_VALIDATE_IP,
        FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
    ) !== false;
}

function fetchRemoteHtmlForDigest(string $url): array
{
    if (!function_exists('curl_init')) {
        throw new RuntimeException('server curl extension is unavailable');
    }

    $ch = curl_init($url);
    if ($ch === false) {
        throw new RuntimeException('source fetch init failed');
    }

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_MAXREDIRS, 3);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
    curl_setopt($ch, CURLOPT_TIMEOUT, 12);
    if (defined('CURLOPT_PROTOCOLS') && defined('CURLPROTO_HTTP') && defined('CURLPROTO_HTTPS')) {
        curl_setopt($ch, CURLOPT_PROTOCOLS, CURLPROTO_HTTP | CURLPROTO_HTTPS);
    }
    if (defined('CURLOPT_REDIR_PROTOCOLS') && defined('CURLPROTO_HTTP') && defined('CURLPROTO_HTTPS')) {
        curl_setopt($ch, CURLOPT_REDIR_PROTOCOLS, CURLPROTO_HTTP | CURLPROTO_HTTPS);
    }
    curl_setopt($ch, CURLOPT_USERAGENT, 'DiSA-DictionaryBot/1.0 (+https://drsp.cc/app/note/)');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: text/html,application/xhtml+xml;q=0.9,*/*;q=0.1',
        'Accept-Language: ja,en-US;q=0.8',
    ]);

    $body = curl_exec($ch);
    $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $contentType = (string)curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    $effectiveUrl = (string)curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
    $err = (string)curl_error($ch);
    curl_close($ch);

    if (!is_string($body) || $body === '') {
        throw new RuntimeException('source fetch failed' . ($err !== '' ? ': ' . $err : ''));
    }
    if ($httpCode >= 400) {
        throw new RuntimeException('source fetch failed: HTTP ' . $httpCode);
    }
    if ($contentType !== '' && !preg_match('/text\/html|application\/xhtml\+xml/i', $contentType)) {
        throw new RuntimeException('source is not an HTML page');
    }

    return [
        'html' => substr($body, 0, 500000),
        'effective_url' => $effectiveUrl !== '' ? $effectiveUrl : $url,
        'content_type' => $contentType,
    ];
}

function digestSourceHtml(string $rawHtml, string $effectiveUrl): array
{
    $html = trim($rawHtml);
    if ($html === '') {
        throw new RuntimeException('source html is empty');
    }

    $enc = mb_detect_encoding($html, ['UTF-8', 'SJIS-win', 'EUC-JP', 'ISO-2022-JP', 'ASCII'], true);
    if (is_string($enc) && strtoupper($enc) !== 'UTF-8') {
        $html = @mb_convert_encoding($html, 'UTF-8', $enc) ?: $html;
    }

    if (!class_exists('DOMDocument')) {
        $plain = normalizeDigestText(strip_tags($html));
        if ($plain === '') throw new RuntimeException('source text extraction failed');
        return [
            'url' => $effectiveUrl,
            'host' => (string)(parse_url($effectiveUrl, PHP_URL_HOST) ?? ''),
            'title' => '',
            'description' => '',
            'headings' => [],
            'paragraphs' => [mb_substr($plain, 0, 220, 'UTF-8')],
            'summary_points' => [mb_substr($plain, 0, 120, 'UTF-8')],
            'fetched_at' => nowIso(),
        ];
    }

    $prev = libxml_use_internal_errors(true);
    $dom = new DOMDocument();
    @$dom->loadHTML('<?xml encoding="utf-8" ?>' . $html, LIBXML_NOWARNING | LIBXML_NOERROR);
    libxml_clear_errors();
    libxml_use_internal_errors($prev);

    $xpath = new DOMXPath($dom);
    foreach ($xpath->query('//script|//style|//noscript|//svg|//canvas|//iframe') ?: [] as $node) {
        if ($node && $node->parentNode) {
            $node->parentNode->removeChild($node);
        }
    }

    $title = firstNonEmptyDigest([
        readMetaContent($xpath, 'property', 'og:title'),
        readMetaContent($xpath, 'name', 'twitter:title'),
        readTextByXpath($xpath, '//title'),
        readTextByXpath($xpath, '//h1'),
    ]);

    $description = firstNonEmptyDigest([
        readMetaContent($xpath, 'name', 'description'),
        readMetaContent($xpath, 'property', 'og:description'),
        readMetaContent($xpath, 'name', 'twitter:description'),
    ]);

    $headings = collectDigestTexts($xpath, '//h1|//h2|//h3', 8, 6, 120);
    $paragraphs = collectDigestTexts($xpath, '//main//p|//article//p|//p|//li', 12, 30, 220);

    $summaryPoints = [];
    if ($description !== '') $summaryPoints[] = mb_substr($description, 0, 120, 'UTF-8');
    foreach ($headings as $h) {
        if (count($summaryPoints) >= 5) break;
        $summaryPoints[] = mb_substr($h, 0, 120, 'UTF-8');
    }
    foreach ($paragraphs as $p) {
        if (count($summaryPoints) >= 5) break;
        $summaryPoints[] = mb_substr($p, 0, 120, 'UTF-8');
    }
    $summaryPoints = array_values(array_unique(array_filter(array_map('normalizeDigestText', $summaryPoints))));

    return [
        'url' => $effectiveUrl,
        'host' => (string)(parse_url($effectiveUrl, PHP_URL_HOST) ?? ''),
        'title' => $title,
        'description' => $description,
        'headings' => $headings,
        'paragraphs' => $paragraphs,
        'summary_points' => $summaryPoints,
        'fetched_at' => nowIso(),
    ];
}

function readMetaContent(DOMXPath $xpath, string $attrName, string $attrValue): string
{
    $safeAttr = preg_replace('/[^a-zA-Z:_-]/', '', $attrName) ?: 'name';
    $safeValue = preg_replace('/[^a-zA-Z0-9:_-]/', '', $attrValue) ?: '';
    if ($safeValue === '') return '';
    $nodes = $xpath->query(sprintf('//meta[@%s="%s"]', $safeAttr, $safeValue));
    if (!$nodes || $nodes->length === 0) return '';
    $node = $nodes->item(0);
    if (!$node) return '';
    return normalizeDigestText((string)$node->getAttribute('content'));
}

function readTextByXpath(DOMXPath $xpath, string $expr): string
{
    $nodes = $xpath->query($expr);
    if (!$nodes || $nodes->length === 0) return '';
    $node = $nodes->item(0);
    if (!$node) return '';
    return normalizeDigestText((string)$node->textContent);
}

function collectDigestTexts(DOMXPath $xpath, string $expr, int $max, int $minLen = 1, int $maxLen = 220): array
{
    $nodes = $xpath->query($expr);
    if (!$nodes) return [];
    $out = [];
    $seen = [];
    foreach ($nodes as $node) {
        if (count($out) >= $max) break;
        $text = normalizeDigestText((string)$node->textContent);
        if ($text === '' || mb_strlen($text, 'UTF-8') < $minLen) continue;
        if (mb_strlen($text, 'UTF-8') > $maxLen) {
            $text = mb_substr($text, 0, $maxLen, 'UTF-8') . '…';
        }
        if (isset($seen[$text])) continue;
        $seen[$text] = true;
        $out[] = $text;
    }
    return $out;
}

function firstNonEmptyDigest(array $texts): string
{
    foreach ($texts as $text) {
        $t = normalizeDigestText((string)$text);
        if ($t !== '') return $t;
    }
    return '';
}

function normalizeDigestText(string $text): string
{
    $t = trim($text);
    if ($t === '') return '';
    $t = preg_replace('/\s+/u', ' ', $t) ?? '';
    $t = preg_replace('/[\x00-\x1F\x7F]/u', '', $t) ?? '';
    return trim($t);
}

function verifyEditor(PDO $pdo, array $payload): array
{
    requireEditorPayload($payload);
    return [
        'ok' => true,
        'action' => 'verify_editor',
        'verified' => true,
    ];
}

function writeApiConfig(array $config): void
{
    $path = __DIR__ . '/config.php';
    $export = "<?php\n\nreturn " . var_export($config, true) . ";\n";
    $bytes = @file_put_contents($path, $export, LOCK_EX);
    if (!is_int($bytes) || $bytes <= 0) {
        throw new RuntimeException('config.php の保存に失敗しました');
    }
    if (function_exists('opcache_invalidate')) {
        @opcache_invalidate($path, true);
    }
}

function updateEditorKey(array $payload): array
{
    $serverVal = trim((string)($_SERVER['DIC_EDITOR_KEY'] ?? ''));
    $envVal = trim((string)(getenv('DIC_EDITOR_KEY') ?: ''));
    if ($serverVal !== '' || $envVal !== '') {
        throw new RuntimeException('環境変数 DIC_EDITOR_KEY 運用中のため、UIからは変更できません');
    }

    $required = configuredEditorKey();
    $current = sanitize($payload['current_editor_key'] ?? ($payload['editor_key'] ?? ''), 200);
    $next = sanitize($payload['new_editor_key'] ?? '', 200);
    $confirm = sanitize($payload['new_editor_key_confirm'] ?? '', 200);

    if ($current === '' || !hash_equals($required, $current)) {
        throw new RuntimeException('現在の管理者キーが正しくありません');
    }
    if ($next === '' || $confirm === '') {
        throw new RuntimeException('新しい管理者キーを入力してください');
    }
    if (!hash_equals($next, $confirm)) {
        throw new RuntimeException('新しい管理者キーと確認入力が一致しません');
    }
    if (mb_strlen($next, 'UTF-8') < 4) {
        throw new RuntimeException('新しい管理者キーは4文字以上にしてください');
    }

    $config = loadApiConfig();
    if (!is_array($config)) {
        $config = [];
    }
    $config['editor_key'] = $next;
    writeApiConfig($config);

    return [
        'ok' => true,
        'action' => 'editor_key_update',
        'updated' => true,
    ];
}

function requireEditorPayload(array $payload): void
{
    $required = configuredEditorKey();

    $given = sanitize($payload['editor_key'] ?? ($_SERVER['HTTP_X_EDITOR_KEY'] ?? ''), 200);
    if ($given === '' || !hash_equals($required, $given)) {
        throw new RuntimeException('editor_key is invalid');
    }
}

function configuredEditorKey(): string
{
    $serverVal = trim((string)($_SERVER['DIC_EDITOR_KEY'] ?? ''));
    if ($serverVal !== '') return $serverVal;

    $envVal = trim((string)(getenv('DIC_EDITOR_KEY') ?: ''));
    if ($envVal !== '') return $envVal;

    $cfg = loadApiConfig();
    $cfgVal = trim((string)($cfg['editor_key'] ?? ($cfg['DIC_EDITOR_KEY'] ?? '')));
    if ($cfgVal !== '') return $cfgVal;

    throw new RuntimeException('DIC_EDITOR_KEY が設定されていません');
}

function enforceRateLimit(PDO $pdo, string $ipHash, string $actionName, int $maxPerMinute): void
{
    execStmt($pdo, 'DELETE FROM comment_rate_limits WHERE created_at < :cutoff', [
        ':cutoff' => gmdate('c', time() - 3600),
    ]);

    $countRow = fetchOne($pdo, 'SELECT COUNT(*) AS c FROM comment_rate_limits WHERE ip_hash = :ip_hash AND action_name = :action_name AND created_at >= :from_at', [
        ':ip_hash' => $ipHash,
        ':action_name' => $actionName,
        ':from_at' => gmdate('c', time() - 60),
    ]);
    $count = toInt($countRow['c'] ?? 0, 0);

    if ($count >= $maxPerMinute) {
        throw new RuntimeException('投稿が短時間に集中しています。少し待ってから再度お試しください。');
    }

    execStmt($pdo, 'INSERT INTO comment_rate_limits (id, ip_hash, action_name, created_at) VALUES (:id, :ip_hash, :action_name, :created_at)', [
        ':id' => uuidv4(),
        ':ip_hash' => $ipHash,
        ':action_name' => $actionName,
        ':created_at' => nowIso(),
    ]);
}

function clientIp(): string
{
    $keys = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
    foreach ($keys as $key) {
        $v = $_SERVER[$key] ?? '';
        if ($v === '') continue;
        $ip = trim(explode(',', (string)$v)[0]);
        if ($ip !== '') return $ip;
    }
    return '0.0.0.0';
}

function db(): PDO
{
    if (!is_dir(DB_DIR) && !mkdir(DB_DIR, 0775, true) && !is_dir(DB_DIR)) {
        throw new RuntimeException('DBディレクトリを作成できません');
    }

    if (!is_file(DB_PATH) && is_file(LEGACY_DB_PATH)) {
        @copy(LEGACY_DB_PATH, DB_PATH);
    }

    $pdo = new PDO('sqlite:' . DB_PATH, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    $pdo->exec('PRAGMA journal_mode = WAL');
    $pdo->exec('PRAGMA synchronous = NORMAL');
    return $pdo;
}

function ensureSchema(PDO $pdo): void
{
    $pdo->exec('CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      article_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      body TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT "visible" CHECK(status IN ("visible","deleted","hidden")),
      ip_hash TEXT NOT NULL DEFAULT "",
      user_agent TEXT NOT NULL DEFAULT "",
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      deleted_at TEXT
    )');

    $pdo->exec('CREATE TABLE IF NOT EXISTS comment_rate_limits (
      id TEXT PRIMARY KEY,
      ip_hash TEXT NOT NULL,
      action_name TEXT NOT NULL,
      created_at TEXT NOT NULL
    )');

    $pdo->exec('CREATE TABLE IF NOT EXISTS feature_requests (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      body TEXT NOT NULL,
      link TEXT NOT NULL DEFAULT "",
      status TEXT NOT NULL DEFAULT "visible",
      ip_hash TEXT,
      user_agent TEXT,
      created_at TEXT NOT NULL
    )');

    $pdo->exec('CREATE TABLE IF NOT EXISTS glossary_terms (
      id TEXT PRIMARY KEY,
      term TEXT NOT NULL,
      description TEXT NOT NULL,
      author_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT "visible",
      ip_hash TEXT,
      user_agent TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )');

    $pdo->exec('CREATE TABLE IF NOT EXISTS glossary_base_overrides (
      base_key TEXT PRIMARY KEY,
      term TEXT NOT NULL,
      description TEXT NOT NULL,
      author_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT "visible",
      updated_at TEXT NOT NULL
    )');

    $pdo->exec('CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      visitor_id TEXT NOT NULL,
      session_id TEXT,
      path TEXT,
      referrer TEXT,
      tz TEXT,
      day_key TEXT NOT NULL,
      created_at TEXT NOT NULL
    )');

    $pdo->exec('CREATE TABLE IF NOT EXISTS article_overrides (
      article_id TEXT PRIMARY KEY,
      article_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT "visible",
      updated_at TEXT NOT NULL
    )');

    $pdo->exec('CREATE TABLE IF NOT EXISTS editor_profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT "",
      bio TEXT NOT NULL DEFAULT "",
      x_handle TEXT NOT NULL DEFAULT "",
      avatar_url TEXT NOT NULL DEFAULT "",
      status TEXT NOT NULL DEFAULT "visible",
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )');

    ensureColumnExists($pdo, 'comments', 'status', 'TEXT NOT NULL DEFAULT "visible"');
    ensureColumnExists($pdo, 'comments', 'ip_hash', 'TEXT');
    ensureColumnExists($pdo, 'comments', 'user_agent', 'TEXT');
    ensureColumnExists($pdo, 'comments', 'updated_at', 'TEXT NOT NULL DEFAULT ""');
    ensureColumnExists($pdo, 'comments', 'deleted_at', 'TEXT');
    ensureCommentsTableConstraints($pdo);

    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_comments_article_created ON comments(article_id, status, created_at DESC)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(status, created_at DESC)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_comment_rate_limits ON comment_rate_limits(ip_hash, action_name, created_at DESC)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_feature_requests_created ON feature_requests(status, created_at DESC)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_glossary_terms_created ON glossary_terms(status, created_at DESC)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_glossary_base_overrides_updated ON glossary_base_overrides(status, updated_at DESC)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_analytics_events_type_created ON analytics_events(event_type, created_at DESC)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor ON analytics_events(visitor_id, created_at DESC)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_article_overrides_updated ON article_overrides(status, updated_at DESC)');
    $pdo->exec('CREATE INDEX IF NOT EXISTS idx_editor_profiles_updated ON editor_profiles(status, updated_at DESC)');
}

function ensureCommentsTableConstraints(PDO $pdo): void
{
    $table = fetchOne($pdo, "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'comments' LIMIT 1");
    $createSql = strtolower((string)($table['sql'] ?? ''));

    $cols = $pdo->query('PRAGMA table_info(comments)')->fetchAll(PDO::FETCH_ASSOC) ?: [];
    if (!$cols) return;

    $colMap = [];
    foreach ($cols as $c) {
        $colMap[(string)($c['name'] ?? '')] = $c;
    }

    $statusHasCheck = strpos($createSql, 'check(status in ("visible","deleted","hidden"))') !== false
        || strpos($createSql, "check(status in ('visible','deleted','hidden'))") !== false;
    $ipNotNull = ((int)($colMap['ip_hash']['notnull'] ?? 0)) === 1;
    $uaNotNull = ((int)($colMap['user_agent']['notnull'] ?? 0)) === 1;

    if ($statusHasCheck && $ipNotNull && $uaNotNull) {
        return;
    }

    $pdo->beginTransaction();
    try {
        $pdo->exec('CREATE TABLE comments_new (
          id TEXT PRIMARY KEY,
          article_id TEXT NOT NULL,
          author_name TEXT NOT NULL,
          body TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT "visible" CHECK(status IN ("visible","deleted","hidden")),
          ip_hash TEXT NOT NULL DEFAULT "",
          user_agent TEXT NOT NULL DEFAULT "",
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          deleted_at TEXT
        )');

        $pdo->exec('INSERT INTO comments_new (id, article_id, author_name, body, status, ip_hash, user_agent, created_at, updated_at, deleted_at)
          SELECT
            id,
            article_id,
            author_name,
            body,
            CASE
              WHEN status IN ("visible","deleted","hidden") THEN status
              ELSE "visible"
            END,
            COALESCE(ip_hash, ""),
            COALESCE(user_agent, ""),
            created_at,
            CASE
              WHEN COALESCE(updated_at, "") = "" THEN created_at
              ELSE updated_at
            END,
            deleted_at
          FROM comments');

        $pdo->exec('DROP TABLE comments');
        $pdo->exec('ALTER TABLE comments_new RENAME TO comments');
        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
}

function ensureColumnExists(PDO $pdo, string $table, string $column, string $definition): void
{
    $stmt = $pdo->query('PRAGMA table_info(' . $table . ')');
    $rows = $stmt ? ($stmt->fetchAll(PDO::FETCH_ASSOC) ?: []) : [];
    foreach ($rows as $row) {
        if ((string)($row['name'] ?? '') === $column) {
            return;
        }
    }
    $pdo->exec('ALTER TABLE ' . $table . ' ADD COLUMN ' . $column . ' ' . $definition);
}

function parseJsonBody(): array
{
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') return [];
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        throw new RuntimeException('JSONボディが不正です');
    }
    return $decoded;
}

function sanitize($value, int $maxLen = 200): string
{
    $s = trim((string)$value);
    $s = preg_replace('/[\x00-\x1F\x7F]/u', '', $s) ?? '';
    if ($maxLen > 0 && mb_strlen($s, 'UTF-8') > $maxLen) {
        $s = mb_substr($s, 0, $maxLen, 'UTF-8');
    }
    return $s;
}

function sanitizeUrl($value): string
{
    $u = sanitize($value, 500);
    if ($u === '') return '';
    if (!preg_match('/^https?:\/\//i', $u)) return '';
    return $u;
}

function uuidv4(): string
{
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function nowIso(): string
{
    return gmdate('c');
}

function toInt($value, int $fallback = 0): int
{
    if (is_int($value)) return $value;
    if (is_numeric($value)) return (int)$value;
    return $fallback;
}

function execStmt(PDO $pdo, string $sql, array $params = []): void
{
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
}

function fetchOne(PDO $pdo, string $sql, array $params = []): ?array
{
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row === false ? null : $row;
}

function respond(array $payload, int $status = 200): void
{
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('Expires: 0');
    http_response_code($status);
    if ($status === 204) return;
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function respondXml(string $xml, int $status = 200): void
{
    header('Content-Type: application/xml; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('Expires: 0');
    http_response_code($status);
    if ($status === 204) return;
    echo $xml;
}

function trackMetricsEvent(PDO $pdo, array $payload): array
{
    $eventType = strtolower(sanitize($payload['type'] ?? ($payload['event_type'] ?? 'pageview'), 40));
    if ($eventType === '') {
        $eventType = 'pageview';
    }

    $visitorId = sanitize($payload['visitor_id'] ?? '', 120);
    if ($visitorId === '') {
        $visitorId = 'anon_' . substr(hash('sha256', clientIp()), 0, 16);
    }

    $sessionId = sanitize($payload['session_id'] ?? '', 120);
    $path = sanitize($payload['path'] ?? '', 500);
    $referrer = sanitize($payload['referrer'] ?? '', 500);
    $tz = sanitize($payload['tz'] ?? '', 80);
    $dayKey = gmdate('Y-m-d');

    execStmt($pdo, 'INSERT INTO analytics_events (id, event_type, visitor_id, session_id, path, referrer, tz, day_key, created_at) VALUES (:id, :event_type, :visitor_id, :session_id, :path, :referrer, :tz, :day_key, :created_at)', [
        ':id' => uuidv4(),
        ':event_type' => $eventType,
        ':visitor_id' => $visitorId,
        ':session_id' => $sessionId,
        ':path' => $path,
        ':referrer' => $referrer,
        ':tz' => $tz,
        ':day_key' => $dayKey,
        ':created_at' => nowIso(),
    ]);

    return [
        'ok' => true,
        'action' => 'metrics_track',
    ];
}

function getMetricsSummary(PDO $pdo): array
{
    $today = gmdate('Y-m-d');

    $pvTotalRow = fetchOne($pdo, 'SELECT COUNT(*) AS c FROM analytics_events WHERE event_type = :event_type', [
        ':event_type' => 'pageview',
    ]);
    $uuTotalRow = fetchOne($pdo, 'SELECT COUNT(DISTINCT visitor_id) AS c FROM analytics_events WHERE event_type = :event_type', [
        ':event_type' => 'pageview',
    ]);
    $pvTodayRow = fetchOne($pdo, 'SELECT COUNT(*) AS c FROM analytics_events WHERE event_type = :event_type AND day_key = :day_key', [
        ':event_type' => 'pageview',
        ':day_key' => $today,
    ]);
    $uuTodayRow = fetchOne($pdo, 'SELECT COUNT(DISTINCT visitor_id) AS c FROM analytics_events WHERE event_type = :event_type AND day_key = :day_key', [
        ':event_type' => 'pageview',
        ':day_key' => $today,
    ]);

    $commentTotalRow = fetchOne($pdo, 'SELECT COUNT(*) AS c FROM comments WHERE status = "visible"');
    $requestTotalRow = fetchOne($pdo, 'SELECT COUNT(*) AS c FROM feature_requests WHERE status = "visible"');

    return [
        'pv_total' => toInt($pvTotalRow['c'] ?? 0, 0),
        'uu_total' => toInt($uuTotalRow['c'] ?? 0, 0),
        'pv_today' => toInt($pvTodayRow['c'] ?? 0, 0),
        'uu_today' => toInt($uuTodayRow['c'] ?? 0, 0),
        'comment_total' => toInt($commentTotalRow['c'] ?? 0, 0),
        'request_total' => toInt($requestTotalRow['c'] ?? 0, 0),
        'day_key' => $today,
    ];
}
