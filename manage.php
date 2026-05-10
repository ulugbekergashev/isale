<?php
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
    die('Kirish taqiqlangan');
}
?>
<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Isale.Marketing - Adminka</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
  body {
    background: #0A0A0A;
    color: #F5F5F0;
    font-family: 'Bricolage Grotesque', sans-serif;
  }
  .mono { font-family: 'JetBrains Mono', monospace; }
  .field {
    width: 100%; background: #0E0E0C; border: 1px solid #1F1F1B; color: #F5F5F0;
    padding: 12px 16px; border-radius: 12px; font-size: 15px; margin-top: 6px;
    transition: 0.2s;
  }
  .field:focus { outline: none; border-color: #D4FF3F; background: #0F1206; }
  .btn-primary {
    background: #D4FF3F; color: #0A0A0A; font-weight: 600;
    padding: 12px 24px; border-radius: 12px; transition: 0.2s;
    cursor: pointer; border: none;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(212,255,63,0.3); }
  .btn-delete {
    background: #ff4a4a; color: white; border: none; border-radius: 8px; padding: 6px 12px; cursor: pointer;
  }
  .card {
    background: #111110; border: 1px solid #1F1F1B; border-radius: 16px; padding: 24px;
  }
</style>
</head>
<body class="p-6 md:p-12 max-w-5xl mx-auto">

  <div class="flex items-center justify-between mb-10">
    <div>
      <h1 class="text-4xl font-bold text-[#D4FF3F]">Adminka</h1>
      <p class="text-[#9A9A92] mt-2 mono text-sm">Portfolioga yangi mijoz va video qo'shish</p>
    </div>
    <a href="/" class="text-[#D4FF3F] hover:underline mono text-sm">Saytga qaytish →</a>
  </div>

  <div id="status" class="hidden mb-6 p-4 rounded-xl font-bold text-center"></div>

  <div class="grid md:grid-cols-2 gap-8">
    
    <!-- Add Client Form -->
    <div class="card">
      <h2 class="text-xl font-bold mb-4 border-b border-[#1F1F1B] pb-4">Yangi natija (Statistika) qo'shish</h2>
      <form id="form-client">
        <div class="mb-4">
          <label class="text-sm text-[#9A9A92]">Instagram Handle (masalan: urolog_jahongir)</label>
          <input required class="field" id="c_handle" />
        </div>
        <div class="mb-4">
          <label class="text-sm text-[#9A9A92]">Mijoz nomi (masalan: Urolog Jahongir)</label>
          <input required class="field" id="c_label" />
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="text-sm text-[#9A9A92]">Obunachi (masalan: 120,000)</label>
            <input required class="field" id="c_n" />
          </div>
          <div>
            <label class="text-sm text-[#9A9A92]">Vaqt (masalan: 5 oy)</label>
            <input required class="field" id="c_mo" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label class="text-sm text-[#9A9A92]">Soha (masalan: Tibbiyot)</label>
            <input required class="field" id="c_cat" />
          </div>
          <div>
            <label class="text-sm text-[#9A9A92]">Mijoz rasmi (Ixtiyoriy)</label>
            <input type="file" accept="image/*" class="field bg-[#111110] p-2" id="c_avatar" />
          </div>
        </div>
        <button type="submit" class="btn-primary w-full">Ro'yxatga qo'shish</button>
      </form>
    </div>

    <!-- Add Review Form -->
    <div class="card">
      <h2 class="text-xl font-bold mb-4 border-b border-[#1F1F1B] pb-4">Yangi video izoh qo'shish</h2>
      <form id="form-review">
        <div class="mb-4">
          <label class="text-sm text-[#9A9A92]">To'liq ism (masalan: Jahongir To'raxonov)</label>
          <input required class="field" id="r_name" />
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="text-sm text-[#9A9A92]">Instagram Handle</label>
            <input required class="field" id="r_handle" />
          </div>
          <div>
            <label class="text-sm text-[#9A9A92]">Initsial (masalan: JT)</label>
            <input required class="field" id="r_initials" />
          </div>
        </div>
        <div class="mb-4">
          <label class="text-sm text-[#9A9A92]">Natija matni (masalan: 120,000 obunachi — 5 oyda)</label>
          <input required class="field" id="r_result" />
        </div>
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label class="text-sm text-[#9A9A92]">Soha</label>
            <input required class="field" id="r_cat" />
          </div>
          <div>
            <label class="text-sm text-[#9A9A92]">Mijoz rasmi (Ixtiyoriy)</label>
            <input type="file" accept="image/*" class="field bg-[#111110] p-2" id="r_avatar" />
          </div>
          <div>
            <label class="text-sm text-[#9A9A92]">Video fayl</label>
            <input required type="file" accept="video/*" class="field bg-[#111110] p-2" id="r_video" />
          </div>
        </div>
        <div class="mb-6">
          <label class="text-sm text-[#9A9A92]">Mijoz izohi matni</label>
          <textarea required class="field min-h-[80px]" id="r_text"></textarea>
        </div>
        <button type="submit" class="btn-primary w-full">Videoni qo'shish</button>
      </form>
    </div>

    <!-- Settings Form -->
    <div class="card md:col-span-2">
      <h2 class="text-xl font-bold mb-4 border-b border-[#1F1F1B] pb-4">Telegram Bot Sozlamalari (Arizalar tushishi uchun)</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="text-sm text-[#9A9A92]">Bot Token</label>
          <input class="field" id="s_botToken" placeholder="12345:ABCDEF..." />
        </div>
        <div>
          <label class="text-sm text-[#9A9A92]">Chat ID 1</label>
          <input class="field" id="s_chatId1" placeholder="12345678" />
        </div>
        <div>
          <label class="text-sm text-[#9A9A92]">Chat ID 2 (ixtiyoriy)</label>
          <input class="field" id="s_chatId2" placeholder="87654321" />
        </div>
      </div>
    </div>
  </div>

  <div class="mt-12">
    <div class="flex items-center justify-between border-b border-[#1F1F1B] pb-4 mb-6">
      <h2 class="text-2xl font-bold text-[#D4FF3F]">Joriy Ma'lumotlar</h2>
      <button id="btn-save" class="btn-primary" style="background:#fff; color:#000;">O'zgarishlarni Saytga Saqlash</button>
    </div>
    
    <div class="grid md:grid-cols-2 gap-8">
      <div>
        <h3 class="font-bold text-xl mb-4">Statistika ro'yxati (Clients)</h3>
        <div id="list-clients" class="space-y-3"></div>
      </div>
      <div>
        <h3 class="font-bold text-xl mb-4">Videolar (Reviews)</h3>
        <div id="list-reviews" class="space-y-3"></div>
      </div>
    </div>
  </div>

<script>
  let serverData = { clients: [], reviews: [], settings: {botToken:"", chatId1:"", chatId2:""} };

  async function loadData() {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        serverData = await res.json();
        if (!serverData.settings) serverData.settings = {botToken:"", chatId1:"", chatId2:""};
        document.getElementById('s_botToken').value = serverData.settings.botToken || "";
        document.getElementById('s_chatId1').value = serverData.settings.chatId1 || "";
        document.getElementById('s_chatId2').value = serverData.settings.chatId2 || "";
        renderLists();
      }
    } catch (err) {
      console.error(err);
      showStatus("Ma'lumotlarni yuklab bo'lmadi! Server ishlayaptimi?", "error");
    }
  }

  function renderLists() {
    const clDiv = document.getElementById('list-clients');
    clDiv.innerHTML = '';
    serverData.clients.forEach((c, index) => {
      clDiv.innerHTML += `
        <div class="flex items-center justify-between bg-[#111110] border border-[#1F1F1B] p-3 rounded-lg">
          <div>
            <div class="font-bold text-sm">${c.label} (${c.n})</div>
            <div class="text-[#9A9A92] text-xs">@${c.handle}</div>
          </div>
          <button onclick="deleteItem('clients', ${index})" class="btn-delete text-xs">O'chirish</button>
        </div>
      `;
    });

    const revDiv = document.getElementById('list-reviews');
    revDiv.innerHTML = '';
    serverData.reviews.forEach((r, index) => {
      revDiv.innerHTML += `
        <div class="flex items-center justify-between bg-[#111110] border border-[#1F1F1B] p-3 rounded-lg">
          <div>
            <div class="font-bold text-sm">${r.name}</div>
            <div class="text-[#D4FF3F] text-xs">${r.video}</div>
          </div>
          <button onclick="deleteItem('reviews', ${index})" class="btn-delete text-xs">O'chirish</button>
        </div>
      `;
    });
  }

  window.deleteItem = function(type, index) {
    if(confirm("Rostdan ham o'chirmoqchimisiz?")) {
      serverData[type].splice(index, 1);
      renderLists();
    }
  };

  document.getElementById('form-client').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const prevText = btn.innerText;
    
    let avatarName = "";
    const file = document.getElementById('c_avatar').files[0];
    if (file) {
      btn.innerText = "Rasm yuklanmoqda..."; btn.disabled = true;
      try {
        const r = await fetch('/api/upload?filename=' + encodeURIComponent(file.name), { method: 'POST', body: file });
        const d = await r.json();
        avatarName = d.filename;
      } catch (err) {}
      btn.innerText = prevText; btn.disabled = false;
    }

    const newItem = {
      handle: document.getElementById('c_handle').value,
      label: document.getElementById('c_label').value,
      n: document.getElementById('c_n').value,
      mo: document.getElementById('c_mo').value,
      cat: document.getElementById('c_cat').value,
      avatar: avatarName
    };
    // yangi elementni boshiga qo'shamiz
    serverData.clients.unshift(newItem);
    renderLists();
    e.target.reset();
  });

  document.getElementById('form-review').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const prevText = btn.innerText;
    
    const fileInput = document.getElementById('r_video');
    const file = fileInput.files[0];
    let videoFilename = "";

    const avatarInput = document.getElementById('r_avatar');
    const avatarFile = avatarInput.files[0];
    let avatarName = "";
    
    if (file || avatarFile) {
      btn.innerText = "Fayllar yuklanmoqda... (Kuting)";
      btn.disabled = true;
      try {
        if (file) {
          const uploadRes = await fetch('/api/upload?filename=' + encodeURIComponent(file.name), { method: 'POST', body: file });
          const uploadData = await uploadRes.json();
          videoFilename = uploadData.filename;
        }
        if (avatarFile) {
          const r = await fetch('/api/upload?filename=' + encodeURIComponent(avatarFile.name), { method: 'POST', body: avatarFile });
          const d = await r.json();
          avatarName = d.filename;
        }
      } catch (err) {
        showStatus("Fayllarni yuklash amalga oshmadi", "error");
        btn.innerText = prevText;
        btn.disabled = false;
        return;
      }
    }

    const newItem = {
      name: document.getElementById('r_name').value,
      handle: document.getElementById('r_handle').value,
      result: document.getElementById('r_result').value,
      cat: document.getElementById('r_cat').value,
      initials: document.getElementById('r_initials').value,
      video: videoFilename,
      avatar: avatarName,
      text: document.getElementById('r_text').value
    };
    serverData.reviews.unshift(newItem);
    renderLists();
    e.target.reset();
    btn.innerText = prevText;
    btn.disabled = false;
    showStatus("Ro'yxatga qo'shildi! Tepadan 'O'zgarishlarni Saytga Saqlash'ni bosing.", "success");
  });

  document.getElementById('btn-save').addEventListener('click', async () => {
    serverData.settings = {
      botToken: document.getElementById('s_botToken').value,
      chatId1: document.getElementById('s_chatId1').value,
      chatId2: document.getElementById('s_chatId2').value
    };
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serverData)
      });
      if(res.ok) {
        showStatus("Ma'lumotlar muvaffaqiyatli saqlandi! Saytga qaytib yangilang.", "success");
      } else {
        showStatus("Saqlashda xatolik yuz berdi.", "error");
      }
    } catch (e) {
      showStatus("Server bilan aloqa yo'q.", "error");
    }
  });

  function showStatus(msg, type) {
    const el = document.getElementById('status');
    el.innerText = msg;
    el.className = `mb-6 p-4 rounded-xl font-bold text-center block ${type === 'success' ? 'bg-[#D4FF3F] text-black' : 'bg-[#ff4a4a] text-white'}`;
    setTimeout(() => { el.style.display = 'none'; }, 4000);
  }

  // init
  loadData();
</script>
</body>
</html>
