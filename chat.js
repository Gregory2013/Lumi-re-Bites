// ========================================================
// Lumière Bites - Chat Auto-Reply Bot
// Cari produk dari data products.js, arahkan ke WhatsApp
// jika produk tidak ditemukan.
// ========================================================

const CHAT_WA_NUMBER = typeof NOMOR_WA !== "undefined" ? NOMOR_WA : "6285722719770";

// State chat
let chatOpen = false;
let chatMessages = [];

// ---- Inisialisasi Chat Widget ----
function initChat() {
    // Buat container utama
    const chatWidget = document.createElement("div");
    chatWidget.id = "chat-widget";
    chatWidget.innerHTML = `
        <!-- Tombol Buka Chat -->
        <button id="chat-toggle-btn" aria-label="Buka Chat" title="Chat dengan kami">
            <span class="chat-toggle-icon" id="chat-icon-open">
                <i class="fa-solid fa-comments"></i>
            </span>
            <span class="chat-toggle-icon chat-icon-hidden" id="chat-icon-close">
                <i class="fa-solid fa-xmark"></i>
            </span>
            <span class="chat-pulse-ring"></span>
        </button>

        <!-- Panel Chat -->
        <div id="chat-panel" class="chat-panel-hidden">
            <!-- Header -->
            <div id="chat-header">
                <div class="chat-header-avatar">
                    <img src="./photo/Biru Krem Modern Kedai Dimsum Logo (1).png" alt="Lumière Bites" onerror="this.style.display='none'">
                </div>
                <div class="chat-header-info">
                    <h4>Lumière Bites</h4>
                    <span class="chat-status"><span class="chat-status-dot"></span> Online — Siap membantu</span>
                </div>
                <button id="chat-close-btn" aria-label="Tutup Chat">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <!-- Body / Messages -->
            <div id="chat-body">
                <!-- Pesan akan dirender di sini -->
            </div>

            <!-- Quick Replies -->
            <div id="chat-quick-replies">
                <button class="chat-quick-btn" data-msg="Lihat semua snack">🍿 Snack</button>
                <button class="chat-quick-btn" data-msg="Lihat semua minuman">🧃 Minuman</button>
                <button class="chat-quick-btn" data-msg="Produk termurah">💰 Termurah</button>
                <button class="chat-quick-btn" data-msg="Halo">👋 Halo</button>
            </div>

            <!-- Input -->
            <div id="chat-input-area">
                <input type="text" id="chat-input" placeholder="Tanya produk, harga, atau ketik nama snack..." autocomplete="off">
                <button id="chat-send-btn" aria-label="Kirim Pesan">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(chatWidget);

    // Event listeners
    document.getElementById("chat-toggle-btn").addEventListener("click", toggleChat);
    document.getElementById("chat-close-btn").addEventListener("click", toggleChat);
    document.getElementById("chat-send-btn").addEventListener("click", kirimPesan);
    document.getElementById("chat-input").addEventListener("keydown", function (e) {
        if (e.key === "Enter") kirimPesan();
    });

    // Quick reply buttons
    document.querySelectorAll(".chat-quick-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const msg = this.dataset.msg;
            document.getElementById("chat-input").value = msg;
            kirimPesan();
        });
    });

    // Tampilkan pesan awal setelah delay kecil
    setTimeout(() => {
        tambahPesanBot("Halo! 👋 Selamat datang di **Lumière Bites**.\n\nKamu bisa tanya produk, cek harga, atau cari snack & minuman favorit kamu di sini.\n\nCoba ketik nama produk seperti *\"Oreo\"* atau *\"Teh Pucuk\"* 😊");
    }, 500);
}

// ---- Toggle Buka/Tutup Chat ----
function toggleChat() {
    chatOpen = !chatOpen;
    const panel = document.getElementById("chat-panel");
    const iconOpen = document.getElementById("chat-icon-open");
    const iconClose = document.getElementById("chat-icon-close");

    if (chatOpen) {
        panel.classList.remove("chat-panel-hidden");
        panel.classList.add("chat-panel-visible");
        iconOpen.classList.add("chat-icon-hidden");
        iconClose.classList.remove("chat-icon-hidden");
        document.getElementById("chat-input").focus();
    } else {
        panel.classList.remove("chat-panel-visible");
        panel.classList.add("chat-panel-hidden");
        iconOpen.classList.remove("chat-icon-hidden");
        iconClose.classList.add("chat-icon-hidden");
    }
}

// ---- Kirim Pesan ----
function kirimPesan() {
    const input = document.getElementById("chat-input");
    const teks = input.value.trim();
    if (!teks) return;

    tambahPesanUser(teks);
    input.value = "";

    // Tampilkan typing indicator
    tampilkanTyping();

    // Proses balasan dengan delay realistis
    setTimeout(() => {
        hilangkanTyping();
        const balasan = prosesAutoReply(teks);
        tambahPesanBot(balasan);
    }, 600 + Math.random() * 800);
}

// ---- Tambah Pesan ke UI ----
function tambahPesanUser(teks) {
    const body = document.getElementById("chat-body");
    const waktu = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    const div = document.createElement("div");
    div.className = "chat-msg chat-msg-user chat-msg-enter";
    div.innerHTML = `
        <div class="chat-bubble chat-bubble-user">
            <p>${escapeHtml(teks)}</p>
            <span class="chat-time">${waktu}</span>
        </div>
    `;
    body.appendChild(div);
    scrollChatBottom();
}

function tambahPesanBot(teks) {
    const body = document.getElementById("chat-body");
    const waktu = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    const div = document.createElement("div");
    div.className = "chat-msg chat-msg-bot chat-msg-enter";
    div.innerHTML = `
        <div class="chat-avatar-small">
            <i class="fa-solid fa-robot"></i>
        </div>
        <div class="chat-bubble chat-bubble-bot">
            <div>${formatBotText(teks)}</div>
            <span class="chat-time">${waktu}</span>
        </div>
    `;
    body.appendChild(div);
    scrollChatBottom();
}

function tampilkanTyping() {
    const body = document.getElementById("chat-body");
    const div = document.createElement("div");
    div.className = "chat-msg chat-msg-bot chat-msg-enter";
    div.id = "chat-typing";
    div.innerHTML = `
        <div class="chat-avatar-small">
            <i class="fa-solid fa-robot"></i>
        </div>
        <div class="chat-bubble chat-bubble-bot chat-typing-bubble">
            <div class="chat-typing-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    body.appendChild(div);
    scrollChatBottom();
}

function hilangkanTyping() {
    const typing = document.getElementById("chat-typing");
    if (typing) typing.remove();
}

function scrollChatBottom() {
    const body = document.getElementById("chat-body");
    body.scrollTop = body.scrollHeight;
}

// ---- Format teks bot (bold, italic, newline) ----
function formatBotText(teks) {
    return teks
        // Convert markdown links [text](url) → <a> tags (harus duluan sebelum bold/italic)
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br>");
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// ========================================================
// LOGIKA AUTO-REPLY
// ========================================================

function prosesAutoReply(pesanUser) {
    const q = pesanUser.toLowerCase().trim();

    // --- Sapaan ---
    if (cocok(q, ["halo", "hai", "hi", "hey", "hello", "p", "hallo", "selamat"])) {
        return "Halo juga! 😊 Ada yang bisa saya bantu?\n\nKamu bisa tanya tentang:\n• **Produk** — ketik nama snack/minuman\n• **Harga** — \"harga oreo\", \"berapa harga chitato\"\n• **Kategori** — \"snack manis\", \"snack asin\", \"minuman\"\n• **Semua produk** — \"daftar produk\"";
    }

    // --- Terima kasih ---
    if (cocok(q, ["terima kasih", "makasih", "thanks", "thank you", "thx", "tq"])) {
        return "Sama-sama! 😊 Senang bisa membantu. Jangan ragu tanya lagi ya!";
    }

    // --- Lihat semua produk / daftar ---
    if (cocok(q, ["semua produk", "daftar produk", "list produk", "katalog", "menu", "produk apa saja", "produk apa aja"])) {
        return tampilkanDaftarProduk();
    }

    // --- Kategori: Snack Asin ---
    if (cocok(q, ["snack asin", "camilan asin", "snack gurih", "salty", "snack salty", "lihat semua snack"])) {
        return tampilkanProdukByKategori("salty", "Snack Asin/Gurih 🧂");
    }

    // --- Kategori: Snack Manis ---
    if (cocok(q, ["snack manis", "camilan manis", "sweet", "snack sweet"])) {
        return tampilkanProdukByKategori("sweet", "Snack Manis 🍬");
    }

    // --- Kategori: Minuman ---
    if (cocok(q, ["minuman", "drink", "minum", "lihat semua minuman", "daftar minuman"])) {
        return tampilkanProdukByKategori("drink", "Minuman 🧃");
    }

    // --- Produk termurah ---
    if (cocok(q, ["termurah", "paling murah", "murah", "cheapest"])) {
        return tampilkanTermurah();
    }

    // --- Tanya harga ---
    const tanyaHarga = q.match(/(?:harga|berapa|price|biaya|cost)\s+(.+)/i);
    if (tanyaHarga) {
        const keyword = tanyaHarga[1].trim();
        return cariDanBalas(keyword);
    }

    // --- Cara pesan / cara beli ---
    if (cocok(q, ["cara pesan", "cara beli", "gimana cara", "bagaimana cara", "cara order", "order"])) {
        const waLink = `https://wa.me/${CHAT_WA_NUMBER}?text=${encodeURIComponent("Halo Lumière Bites, saya mau bertanya tentang cara pemesanan")}`;
        return `Cara pesan di **Lumière Bites** sangat mudah! 🛒\n\n1️⃣ Pilih produk yang kamu mau\n2️⃣ Tambah ke keranjang dengan tombol **+**\n3️⃣ Klik **\"Pesan lewat WhatsApp\"** di keranjang\n4️⃣ Atau langsung hubungi kami di WhatsApp!\n\n📲 [**Chat WhatsApp Sekarang**](${waLink})`;
    }

    // --- Cari produk berdasarkan nama ---
    return cariDanBalas(q);
}

// ---- Pencarian Produk ----
function cariDanBalas(keyword) {
    const produkList = ambilSemuaProduk();
    const hasil = cariProdukFlexible(produkList, keyword);

    if (hasil.length === 0) {
        // Produk tidak ditemukan → Arahkan ke WhatsApp
        const waLink = `https://wa.me/${CHAT_WA_NUMBER}?text=${encodeURIComponent("Halo Lumière Bites, saya mencari produk: " + keyword)}`;
        return `Maaf, saya tidak menemukan produk **\"${escapeHtml(keyword)}\"** di katalog kami saat ini. 😔\n\nMungkin produk tersebut belum tersedia atau penulisan namanya berbeda.\n\n💡 **Hubungi kami langsung via WhatsApp** untuk informasi lebih lanjut:\n\n📲 [**Chat WhatsApp**](${waLink})\n\nAtau coba kata kunci lain, misalnya: *\"oreo\"*, *\"chitato\"*, *\"teh pucuk\"*`;
    }

    if (hasil.length === 1) {
        const p = hasil[0];
        const hargaFormatted = formatHargaChat(p.harga);
        const waLink = `https://wa.me/${CHAT_WA_NUMBER}?text=${encodeURIComponent(p.pesanWa || "Hallo saya mau beli " + p.nama)}`;
        const tipeBadge = p.kategori === "salty" ? "🧂 Asin" : p.kategori === "sweet" ? "🍬 Manis" : "🧃 Minuman";

        return `✅ Ketemu! Ini produknya:\n\n🏷️ **${p.nama}**\n💰 Harga: **${hargaFormatted}**\n📦 Kategori: ${tipeBadge}\n\n${p.deskripsi}\n\n📲 [**Beli via WhatsApp**](${waLink})`;
    }

    // Multiple results
    let response = `Saya menemukan **${hasil.length} produk** yang cocok:\n\n`;
    hasil.forEach((p, i) => {
        const hargaFormatted = formatHargaChat(p.harga);
        response += `${i + 1}. **${p.nama}** — ${hargaFormatted}\n`;
    });
    response += `\nKetik nama produk yang lebih spesifik untuk info lengkapnya! 😊`;
    return response;
}

// ---- Fuzzy / Flexible Search ----
function cariProdukFlexible(list, keyword) {
    const kw = keyword.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
    if (!kw) return [];

    const keywords = kw.split(/\s+/);

    // Exact match first
    const exact = list.filter(p =>
        p.nama.toLowerCase() === kw
    );
    if (exact.length > 0) return exact;

    // Contains full keyword
    const contains = list.filter(p =>
        p.nama.toLowerCase().includes(kw)
    );
    if (contains.length > 0) return contains;

    // All keywords must be found somewhere in the name
    const multi = list.filter(p => {
        const nameLower = p.nama.toLowerCase();
        return keywords.every(k => nameLower.includes(k));
    });
    if (multi.length > 0) return multi;

    // Any keyword match (partial)
    const partial = list.filter(p => {
        const nameLower = p.nama.toLowerCase();
        return keywords.some(k => nameLower.includes(k) && k.length >= 3);
    });
    return partial;
}

// ---- Tampilkan produk per kategori ----
function tampilkanProdukByKategori(kategori, label) {
    const produkList = ambilSemuaProduk();
    const filtered = produkList.filter(p => p.kategori === kategori);

    if (filtered.length === 0) {
        return `Belum ada produk di kategori **${label}** saat ini.`;
    }

    let response = `📋 **Daftar ${label}:**\n\n`;
    filtered.forEach((p, i) => {
        response += `${i + 1}. **${p.nama}** — ${formatHargaChat(p.harga)}\n`;
    });
    response += `\nKetik nama produk untuk info lengkapnya! 😊`;
    return response;
}

// ---- Daftar semua produk ----
function tampilkanDaftarProduk() {
    const produkList = ambilSemuaProduk();

    const salty = produkList.filter(p => p.kategori === "salty");
    const sweet = produkList.filter(p => p.kategori === "sweet");
    const drink = produkList.filter(p => p.kategori === "drink");

    let response = `📋 **Katalog Lumière Bites** (${produkList.length} produk)\n\n`;

    if (salty.length > 0) {
        response += `🧂 **Snack Asin/Gurih:**\n`;
        salty.forEach(p => { response += `• ${p.nama} — ${formatHargaChat(p.harga)}\n`; });
        response += `\n`;
    }

    if (sweet.length > 0) {
        response += `🍬 **Snack Manis:**\n`;
        sweet.forEach(p => { response += `• ${p.nama} — ${formatHargaChat(p.harga)}\n`; });
        response += `\n`;
    }

    if (drink.length > 0) {
        response += `🧃 **Minuman:**\n`;
        drink.forEach(p => { response += `• ${p.nama} — ${formatHargaChat(p.harga)}\n`; });
    }

    response += `\nKetik nama produk untuk detail & link beli! 😊`;
    return response;
}

// ---- Produk termurah ----
function tampilkanTermurah() {
    const produkList = ambilSemuaProduk();
    if (produkList.length === 0) return "Belum ada produk di katalog.";

    const sorted = [...produkList].sort((a, b) => a.harga - b.harga);
    const top5 = sorted.slice(0, 5);

    let response = `💰 **5 Produk Termurah di Lumière Bites:**\n\n`;
    top5.forEach((p, i) => {
        response += `${i + 1}. **${p.nama}** — ${formatHargaChat(p.harga)}\n`;
    });
    response += `\nKetik nama produk untuk info lengkapnya! 😊`;
    return response;
}

// ---- Helper: cocok keyword ----
function cocok(input, daftarKata) {
    return daftarKata.some(kata => input.includes(kata));
}

// ---- Format harga ----
function formatHargaChat(angka) {
    return "Rp" + Number(angka || 0).toLocaleString("id-ID");
}

// ---- Inisialisasi saat DOM siap ----
document.addEventListener("DOMContentLoaded", function () {
    // Delay sedikit agar produk sudah dimuat
    setTimeout(initChat, 300);
});
