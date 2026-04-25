<?php

declare(strict_types=1);

ini_set('display_errors', '0');
ini_set('html_errors', '0');
error_reporting(E_ALL);
mb_internal_encoding('UTF-8');
date_default_timezone_set('Asia/Tokyo');

const NOTE_RSS_URL = 'https://note.com/disa_pr/rss';
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 20;

try {
    $limit = toInt($_GET['limit'] ?? DEFAULT_LIMIT, DEFAULT_LIMIT);
    $limit = max(1, min(MAX_LIMIT, $limit));

    $xml = fetchText(NOTE_RSS_URL);
    if ($xml === '') {
        throw new RuntimeException('RSS取得に失敗しました');
    }

    $items = parseRssItems($xml, $limit);

    respond([
        'ok' => true,
        'source' => NOTE_RSS_URL,
        'count' => count($items),
        'items' => $items,
        'time' => gmdate('c'),
    ]);
} catch (Throwable $e) {
    respond(['ok' => false, 'error' => $e->getMessage()], 500);
}

function fetchText(string $url): string
{
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_CONNECTTIMEOUT => 8,
            CURLOPT_TIMEOUT => 15,
            CURLOPT_USERAGENT => 'DiSA-Dictionary/1.0 (+https://drsp.cc/app/note)',
            CURLOPT_HTTPHEADER => [
                'Accept: application/rss+xml, application/xml, text/xml, */*',
            ],
        ]);
        $body = curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $err = curl_error($ch);

        if ($body !== false && $code >= 200 && $code < 300) {
            return (string)$body;
        }

        if ($err !== '') {
            error_log('note-rss curl error: ' . $err);
        }
    }

    if (ini_get('allow_url_fopen')) {
        $ctx = stream_context_create([
            'http' => [
                'method' => 'GET',
                'timeout' => 15,
                'header' => "Accept: application/rss+xml, application/xml, text/xml, */*\r\n" .
                    "User-Agent: DiSA-Dictionary/1.0 (+https://drsp.cc/app/note)\r\n",
            ],
        ]);
        $body = @file_get_contents($url, false, $ctx);
        if ($body !== false) {
            return (string)$body;
        }
    }

    return '';
}

function parseRssItems(string $xmlText, int $limit): array
{
    libxml_use_internal_errors(true);
    $xml = simplexml_load_string($xmlText, 'SimpleXMLElement', LIBXML_NOCDATA);
    if ($xml === false || !isset($xml->channel->item)) {
        return [];
    }

    $items = [];
    foreach ($xml->channel->item as $item) {
        $title = trim((string)($item->title ?? ''));
        $link = trim((string)($item->link ?? ''));
        $pubDate = trim((string)($item->pubDate ?? ''));
        $description = trim((string)($item->description ?? ''));

        if ($title === '' || $link === '') continue;

        $items[] = [
            'title' => $title,
            'link' => $link,
            'date' => formatDate($pubDate),
            'description' => $description,
            'content' => $description,
        ];

        if (count($items) >= $limit) break;
    }

    return $items;
}

function formatDate(string $raw): string
{
    if ($raw === '') return '';
    $ts = strtotime($raw);
    if ($ts === false) return '';
    return date('Y/m/d', $ts);
}

function toInt($value, int $fallback = 0): int
{
    if (is_int($value)) return $value;
    if (is_numeric($value)) return (int)$value;
    return $fallback;
}

function respond(array $payload, int $status = 200): void
{
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
