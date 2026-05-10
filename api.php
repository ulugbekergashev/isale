<?php
header('Content-Type: application/json; charset=utf-8');

$action = isset($_GET['action']) ? $_GET['action'] : '';
$DATA_FILE = __DIR__ . '/data.json';

// Basic Auth
function checkAuth() {
    $user = isset($_SERVER['PHP_AUTH_USER']) ? $_SERVER['PHP_AUTH_USER'] : '';
    $pass = isset($_SERVER['PHP_AUTH_PW']) ? $_SERVER['PHP_AUTH_PW'] : '';
    
    if (!$user && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        if (preg_match('/Basic\s+(.*)$/i', $_SERVER['HTTP_AUTHORIZATION'], $matches)) {
            $decoded = base64_decode($matches[1]);
            if (strpos($decoded, ':') !== false) {
                list($user, $pass) = explode(':', $decoded, 2);
            }
        }
    }

    if ($user !== 'admin' || $pass !== 'isale2026') {
        header('WWW-Authenticate: Basic realm="Isale Adminka"');
        header('HTTP/1.0 401 Unauthorized');
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}

switch ($action) {
    case 'data':
        if (file_exists($DATA_FILE)) {
            $data = json_decode(file_get_contents($DATA_FILE), true);
            unset($data['settings']);
            echo json_encode($data);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Data not found']);
        }
        break;

    case 'notify':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $data = json_decode(file_get_contents($DATA_FILE), true);
            $settings = $data['settings'];
            
            if (empty($settings['botToken'])) {
                echo json_encode(['ok' => true, 'note' => 'No bot token']);
                exit;
            }
            
            $text = "🔥 Yangi ariza (Isale.Marketing):\n\n" .
                    "👤 Ism: " . ($input['name'] ?? '') . "\n" .
                    "📞 Tel: " . ($input['phone'] ?? '') . "\n" .
                    "🌐 Insta: " . ($input['insta'] ?? '-') . "\n" .
                    "🎯 Soha: " . ($input['niche'] ?? '') . "\n" .
                    "💰 Byudjet: " . ($input['budget'] ?? '') . "\n" .
                    "🚀 Maqsad: " . ($input['goal'] ?? '');
                    
            $url = "https://api.telegram.org/bot" . $settings['botToken'] . "/sendMessage";
            
            $sendTo = function($chatId) use ($url, $text) {
                if (!$chatId) return;
                $ch = curl_init($url);
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['chat_id' => $chatId, 'text' => $text]));
                curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_exec($ch);
                curl_close($ch);
            };
            
            $sendTo($settings['chatId1']);
            $sendTo($settings['chatId2']);
            
            echo json_encode(['ok' => true]);
        }
        break;

    case 'save':
        checkAuth();
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $json = file_get_contents('php://input');
            file_put_contents($DATA_FILE, $json);
            echo json_encode(['success' => true]);
        }
        break;

    case 'upload':
        checkAuth();
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $filename = isset($_GET['filename']) ? $_GET['filename'] : 'file_' . time();
            $filename = preg_replace('/[^a-zA-Z0-9_.-]/', '', $filename);
            
            $target = __DIR__ . '/' . $filename;
            $input = fopen('php://input', 'rb');
            $output = fopen($target, 'wb');
            stream_copy_to_stream($input, $output);
            fclose($input);
            fclose($output);
            
            if (filesize($target) === 0) {
                http_response_code(413);
                echo json_encode(['error' => 'Upload failed. File is 0 bytes (Check PHP post_max_size in cPanel)']);
                exit;
            }
            
            echo json_encode(['success' => true, 'filename' => $filename]);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
}
