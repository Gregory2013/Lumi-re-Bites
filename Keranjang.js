// ========================================================
// Lumière Bites - Cart & Midtrans Payment Gateway
// ========================================================

// Nomor WhatsApp toko. Pakai kode negara, tanpa tanda + atau angka 0 di depan.
const NOMOR_WA = "6285722719770";

// Konfigurasi Midtrans Sandbox
const MIDTRANS_CLIENT_KEY = "SB-Mid-client-iQbE8Wd-umnIaxcXcE6MA75q";
const MIDTRANS_SNAP_SCRIPT = "https://app.sandbox.midtrans.com/snap/snap.js";

// Deteksi otomatis URL Backend API
function getApiBaseUrl() {
    if (window.location.protocol === 'file:') {
        return 'http://localhost:3000';
    }
    const port = window.location.port;
    if (port === '3000') {
        return '';
    }
    // Jika diakses dari Live Server (5500, 8000, dll.)
    return 'http://localhost:3000';
}

let keranjang = [];

// Memuat skrip Midtrans Snap secara dinamis
function muatSnapScript() {
    if (document.getElementById('midtrans-snap-script')) {
        return;
    }
    const script = document.createElement('script');
    script.id = 'midtrans-snap-script';
    script.type = 'text/javascript';
    script.src = MIDTRANS_SNAP_SCRIPT;
    script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
    document.head.appendChild(script);
}

function mulaiKeranjang() {
    muatSnapScript();
    muatKeranjang();
    pasangTombolDiKartu();
    pasangKotakKeranjang();
    pasangModalCheckout();
    tampilKeranjang();
}

function muatKeranjang() {
    const simpanan = localStorage.getItem("keranjang-lumiere");
    if (!simpanan) {
        return;
    }
    try {
        keranjang = JSON.parse(simpanan);
    } catch (e) {
        keranjang = [];
    }
}

function simpanKeranjang() {
    localStorage.setItem("keranjang-lumiere", JSON.stringify(keranjang));
}

function ambilHarga(teks) {
    return Number(teks.replaceAll(".", "").replace(/[^\d]/g, ""));
}

function rupiah(angka) {
    return "Rp" + Number(angka || 0).toLocaleString("id-ID");
}

function cariItem(nama) {
    for (let i = 0; i < keranjang.length; i++) {
        if (keranjang[i].nama === nama) {
            return keranjang[i];
        }
    }
    return null;
}

function pasangTombolDiKartu() {
    const kartu = document.querySelectorAll(".card");

    for (let i = 0; i < kartu.length; i++) {
        const judul = kartu[i].querySelector(".card-title");
        const tombolHarga = kartu[i].querySelector(".btn-primary");
        const isi = kartu[i].querySelector(".card-body");
        if (!judul || !tombolHarga || !isi) {
            continue;
        }

        const nama = judul.textContent.trim();
        const harga = ambilHarga(tombolHarga.textContent);

        // Jangan gandakan jika sudah ada
        if (isi.querySelector('.jumlah-kartu-wrap')) {
            continue;
        }

        isi.insertAdjacentHTML("beforeend", `
            <div class="jumlah-kartu-wrap d-flex align-items-center gap-2 mt-2">
                <button class="btn btn-sm btn-outline-primary" type="button" data-aksi="kurang" data-nama="${nama}">-</button>
                <span class="jumlah-kartu fw-bold px-1" data-jumlah="${nama}">0</span>
                <button class="btn btn-sm btn-warning" type="button" data-aksi="tambah" data-nama="${nama}" data-harga="${harga}">+</button>
            </div>
        `);
    }

    document.addEventListener("click", function (event) {
        const tombol = event.target.closest("button");
        if (!tombol || !tombol.dataset.aksi) {
            return;
        }

        const nama = tombol.dataset.nama;
        if (tombol.dataset.aksi === "tambah") {
            tambahKeKeranjang(nama, Number(tombol.dataset.harga));
        }
        if (tombol.dataset.aksi === "kurang") {
            ubahJumlah(nama, -1);
        }
    });
}

function tambahKeKeranjang(nama, harga) {
    const sudahAda = cariItem(nama);

    if (sudahAda) {
        sudahAda.jumlah += 1;
    } else {
        keranjang.push({
            nama: nama,
            harga: harga,
            jumlah: 1
        });
    }

    simpanKeranjang();
    tampilKeranjang();
}

function ubahJumlah(nama, perubahan) {
    const item = cariItem(nama);
    if (!item) {
        return;
    }

    item.jumlah += perubahan;

    if (item.jumlah <= 0) {
        const baru = [];
        for (let i = 0; i < keranjang.length; i++) {
            if (keranjang[i].nama !== nama) {
                baru.push(keranjang[i]);
            }
        }
        keranjang = baru;
    }

    simpanKeranjang();
    tampilKeranjang();
}

function hitungTotal() {
    let total = 0;
    for (let i = 0; i < keranjang.length; i++) {
        total += keranjang[i].harga * keranjang[i].jumlah;
    }
    return total;
}

function tampilKeranjang() {
    const isi = document.getElementById("isi-keranjang");
    const totalTeks = document.getElementById("total-keranjang");
    const tombolPesanWa = document.getElementById("pesan-keranjang");
    const tombolBayarMidtrans = document.getElementById("bayar-midtrans");
    if (!isi) {
        return;
    }

    const jumlahDiKartu = document.querySelectorAll(".jumlah-kartu");
    for (let i = 0; i < jumlahDiKartu.length; i++) {
        const itemKartu = cariItem(jumlahDiKartu[i].dataset.jumlah);
        jumlahDiKartu[i].textContent = itemKartu ? itemKartu.jumlah : "0";
    }

    if (keranjang.length === 0) {
        isi.innerHTML = `<li class="list-group-item px-0 py-3 text-secondary text-center">
            <i class="fa-solid fa-cart-shopping me-2 fs-5 opacity-50"></i> Keranjang belanja masih kosong.
        </li>`;
        totalTeks.textContent = "Total: Rp0";
        if (tombolPesanWa) tombolPesanWa.href = "#";
        if (tombolBayarMidtrans) {
            tombolBayarMidtrans.classList.add("disabled");
            tombolBayarMidtrans.setAttribute("disabled", "disabled");
        }
        return;
    }

    if (tombolBayarMidtrans) {
        tombolBayarMidtrans.classList.remove("disabled");
        tombolBayarMidtrans.removeAttribute("disabled");
    }

    isi.innerHTML = "";
    let total = 0;

    for (let i = 0; i < keranjang.length; i++) {
        const item = keranjang[i];
        const subtotal = item.harga * item.jumlah;
        total += subtotal;
        isi.innerHTML += `
            <li class="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                <div>
                    <span class="fw-semibold text-dark">${item.nama}</span>
                    <span class="text-secondary small ms-1">(${rupiah(item.harga)} x ${item.jumlah})</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="fw-bold text-primary">${rupiah(subtotal)}</span>
                    <button type="button" class="btn btn-sm btn-outline-danger border-0 p-1" onclick="hapusDariKeranjang('${item.nama}')" title="Hapus item">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </li>
        `;
    }

    totalTeks.textContent = "Total: " + rupiah(total);
    if (tombolPesanWa) {
        tombolPesanWa.href = "https://wa.me/" + NOMOR_WA + "?text=" + encodeURIComponent(buatTeksPesanan(total));
    }
}

function hapusDariKeranjang(nama) {
    keranjang = keranjang.filter(item => item.nama !== nama);
    simpanKeranjang();
    tampilKeranjang();
}

function buatTeksPesanan(total) {
    let teks = "Halo Lumière Bites, saya mau pesan:\n\n";

    for (let i = 0; i < keranjang.length; i++) {
        const item = keranjang[i];
        teks += "• " + item.nama + " x" + item.jumlah + " = " + rupiah(item.harga * item.jumlah) + "\n";
    }

    teks += "\nTotal: " + rupiah(total);
    return teks;
}

function pasangKotakKeranjang() {
    if (document.getElementById("kotak-keranjang-lumiere")) {
        return;
    }

    const footer = document.getElementById("footer");
    const kotak = document.createElement("div");
    kotak.id = "kotak-keranjang-lumiere";
    kotak.className = "container my-5";
    kotak.innerHTML = `
        <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div class="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-2">
                    <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(13, 110, 253, 0.1); display: flex; align-items: center; justify-content: center;">
                        <i class="fa-solid fa-cart-shopping text-primary"></i>
                    </div>
                    <h3 class="h4 mb-0 fw-bold">Keranjang Belanja</h3>
                </div>
                <button class="btn btn-sm btn-outline-danger" id="reset-keranjang" type="button">
                    <i class="fa-solid fa-rotate-left me-1"></i> Kosongkan
                </button>
            </div>

            <div class="card-body p-4">
                <ul class="list-group list-group-flush mb-3" id="isi-keranjang"></ul>

                <!-- Metode Pembayaran Banner -->
                <div class="payment-badges-container my-3">
                    <span class="small text-secondary fw-semibold w-100 mb-1">
                        <i class="fa-solid fa-shield-halved text-success me-1"></i> Metode Pembayaran Resmi via Midtrans:
                    </span>
                    <span class="payment-badge-pill payment-badge-qris"><i class="fa-solid fa-qrcode"></i> QRIS</span>
                    <span class="payment-badge-pill payment-badge-gopay"><i class="fa-solid fa-wallet"></i> GoPay</span>
                    <span class="payment-badge-pill payment-badge-shopee"><i class="fa-solid fa-bag-shopping"></i> ShopeePay</span>
                    <span class="payment-badge-pill payment-badge-bank"><i class="fa-solid fa-building-columns"></i> Transfer Bank (BCA, Mandiri, BRI, BNI, Permata)</span>
                    <span class="payment-badge-pill payment-badge-card"><i class="fa-solid fa-credit-card"></i> Kartu Debit / Kredit</span>
                </div>

                <div class="d-flex flex-wrap justify-content-between align-items-center pt-3 border-top mt-3 gap-3">
                    <div>
                        <span class="text-secondary small d-block">Total Pembayaran</span>
                        <p class="fs-3 fw-bold text-dark mb-0" id="total-keranjang">Total: Rp0</p>
                    </div>

                    <div class="d-flex flex-wrap gap-2">
                        <a class="btn btn-outline-success px-3 py-2 fw-semibold d-inline-flex align-items-center" id="pesan-keranjang" target="_blank">
                            <i class="fa-brands fa-whatsapp fs-5 me-2"></i> Pesan via WhatsApp
                        </a>
                        <button type="button" class="btn btn-midtrans px-4 py-2" id="bayar-midtrans">
                            <i class="fa-solid fa-credit-card me-2"></i> Bayar Online (Midtrans)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    if (footer) {
        footer.before(kotak);
    } else {
        document.body.appendChild(kotak);
    }

    document.getElementById("pesan-keranjang").addEventListener("click", function (event) {
        if (keranjang.length === 0) {
            event.preventDefault();
            alert("Keranjang masih kosong");
        }
    });

    document.getElementById("reset-keranjang").addEventListener("click", resetKeranjang);
    document.getElementById("bayar-midtrans").addEventListener("click", bukaModalCheckout);
}

function resetKeranjang() {
    if (keranjang.length === 0) {
        alert("Keranjang sudah kosong");
        return;
    }

    if (!confirm("Yakin ingin mengosongkan keranjang belanja?")) {
        return;
    }

    keranjang = [];
    simpanKeranjang();
    tampilKeranjang();
}

// ========================================================
// Modal Checkout & Pembayaran Midtrans
// ========================================================

function pasangModalCheckout() {
    if (document.getElementById("modal-checkout-midtrans")) {
        return;
    }

    const modalDiv = document.createElement("div");
    modalDiv.innerHTML = `
        <!-- Checkout Form Modal -->
        <div class="modal fade" id="modal-checkout-midtrans" tabindex="-1" aria-labelledby="modalCheckoutLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content lb-modal-content">
                    <div class="modal-header lb-modal-header">
                        <div class="d-flex align-items-center gap-2">
                            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(59, 130, 246, 0.2); display: flex; align-items: center; justify-content: center;">
                                <i class="fa-solid fa-lock text-info"></i>
                            </div>
                            <h5 class="modal-title fw-bold text-white mb-0" id="modalCheckoutLabel">Checkout Pembayaran Midtrans</h5>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body lb-modal-body">
                        <div class="row g-4">
                            <!-- Kolom Data Pembeli -->
                            <div class="col-md-7">
                                <h6 class="fw-bold mb-3 text-dark">
                                    <i class="fa-solid fa-user-circle me-1 text-primary"></i> Data Pemesan
                                </h6>
                                <form id="form-checkout-midtrans">
                                    <div class="mb-3">
                                        <label for="cust-nama" class="form-label small fw-semibold text-secondary">Nama Lengkap *</label>
                                        <input type="text" class="form-control lb-form-control" id="cust-nama" placeholder="Contoh: Budi Santoso" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="cust-phone" class="form-label small fw-semibold text-secondary">Nomor WhatsApp / HP *</label>
                                        <input type="tel" class="form-control lb-form-control" id="cust-phone" placeholder="Contoh: 08123456789" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="cust-email" class="form-label small fw-semibold text-secondary">Alamat Email (untuk bukti bayar) *</label>
                                        <input type="email" class="form-control lb-form-control" id="cust-email" placeholder="Contoh: budi@gmail.com" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="cust-notes" class="form-label small fw-semibold text-secondary">Catatan Pesanan / Alamat Pengiriman (Opsional)</label>
                                        <textarea class="form-control lb-form-control" id="cust-notes" rows="2" placeholder="Catatan rasa pedas, alamat pengantaran, dll..."></textarea>
                                    </div>
                                </form>
                            </div>

                            <!-- Kolom Ringkasan Order -->
                            <div class="col-md-5">
                                <div class="p-3 bg-white rounded-3 border">
                                    <h6 class="fw-bold mb-3 text-dark">
                                        <i class="fa-solid fa-receipt me-1 text-primary"></i> Ringkasan Belanja
                                    </h6>
                                    <div id="checkout-summary-items" style="max-height: 200px; overflow-y: auto;"></div>
                                    <hr class="my-2">
                                    <div class="d-flex justify-content-between align-items-center py-2">
                                        <span class="fw-bold text-dark">Total Tagihan</span>
                                        <span class="fs-5 fw-bold text-primary" id="checkout-total-tagihan">Rp0</span>
                                    </div>
                                    <div class="bg-light p-2 rounded small text-secondary mt-2">
                                        <i class="fa-solid fa-shield-halved text-success me-1"></i>
                                        Pembayaran diproses secara instan & aman oleh <strong>Midtrans Sandbox Gateway</strong>.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer bg-white border-top">
                        <button type="button" class="btn btn-outline-secondary px-3" data-bs-dismiss="modal">Batal</button>
                        <button type="button" class="btn btn-midtrans px-4" id="btn-konfirmasi-bayar">
                            <span id="btn-bayar-text"><i class="fa-solid fa-shield-halved me-2"></i> Bayar Sekarang</span>
                            <span id="btn-bayar-spinner" class="d-none">
                                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Memproses Pembayaran...
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Payment Success / Receipt Modal -->
        <div class="modal fade" id="modal-sukses-midtrans" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content lb-modal-content text-center p-4">
                    <div style="width: 70px; height: 70px; border-radius: 50%; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 32px;">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <h4 class="fw-bold text-dark mb-1">Pembayaran Berhasil!</h4>
                    <p class="text-secondary small mb-4">Terima kasih atas pesanan Anda di Lumière Bites.</p>
                    
                    <div class="receipt-card text-start mb-4">
                        <div class="receipt-item-row">
                            <span class="text-secondary">Order ID</span>
                            <span class="fw-bold text-dark font-monospace" id="receipt-order-id">-</span>
                        </div>
                        <div class="receipt-item-row">
                            <span class="text-secondary">Total Bayar</span>
                            <span class="fw-bold text-success" id="receipt-total">-</span>
                        </div>
                        <div class="receipt-item-row">
                            <span class="text-secondary">Metode Bayar</span>
                            <span class="fw-semibold text-dark" id="receipt-method">Midtrans</span>
                        </div>
                        <div class="receipt-item-row">
                            <span class="text-secondary">Status</span>
                            <span class="badge bg-success-subtle text-success border border-success-subtle">LUNAS / SETTLED</span>
                        </div>
                    </div>

                    <div class="d-flex flex-column gap-2">
                        <a href="#" id="receipt-wa-btn" target="_blank" class="btn btn-success fw-bold py-2">
                            <i class="fa-brands fa-whatsapp me-2"></i> Konfirmasi Pesanan ke WhatsApp Toko
                        </a>
                        <button type="button" class="btn btn-outline-primary py-2" data-bs-dismiss="modal">
                            Selesai & Belanja Lagi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalDiv);

    // Ambil data pelanggan yang tersimpan sebelumnya jika ada
    const savedName = localStorage.getItem("lb_cust_name");
    const savedPhone = localStorage.getItem("lb_cust_phone");
    const savedEmail = localStorage.getItem("lb_cust_email");
    if (savedName) document.getElementById("cust-nama").value = savedName;
    if (savedPhone) document.getElementById("cust-phone").value = savedPhone;
    if (savedEmail) document.getElementById("cust-email").value = savedEmail;

    document.getElementById("btn-konfirmasi-bayar").addEventListener("click", eksekusiPembayaranMidtrans);
}

function bukaModalCheckout() {
    if (keranjang.length === 0) {
        alert("Keranjang masih kosong. Tambahkan snack atau minuman terlebih dahulu!");
        return;
    }

    const summaryContainer = document.getElementById("checkout-summary-items");
    const totalTagihan = document.getElementById("checkout-total-tagihan");
    let total = 0;

    summaryContainer.innerHTML = "";
    for (let i = 0; i < keranjang.length; i++) {
        const item = keranjang[i];
        const subtotal = item.harga * item.jumlah;
        total += subtotal;
        summaryContainer.innerHTML += `
            <div class="d-flex justify-content-between align-items-center py-1 small border-bottom border-light">
                <span>${item.nama} x ${item.jumlah}</span>
                <span class="fw-semibold">${rupiah(subtotal)}</span>
            </div>
        `;
    }

    totalTagihan.textContent = rupiah(total);

    const modalEl = document.getElementById("modal-checkout-midtrans");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}

async function eksekusiPembayaranMidtrans() {
    const nama = document.getElementById("cust-nama").value.trim();
    const phone = document.getElementById("cust-phone").value.trim();
    const email = document.getElementById("cust-email").value.trim();
    const notes = document.getElementById("cust-notes").value.trim();

    if (!nama) {
        alert("Silakan masukkan Nama Lengkap Anda.");
        document.getElementById("cust-nama").focus();
        return;
    }
    if (!phone) {
        alert("Silakan masukkan Nomor WhatsApp / HP.");
        document.getElementById("cust-phone").focus();
        return;
    }
    if (!email || !email.includes("@")) {
        alert("Silakan masukkan alamat Email yang valid.");
        document.getElementById("cust-email").focus();
        return;
    }

    // Simpan ke localStorage untuk memudahkan pembelian berikutnya
    localStorage.setItem("lb_cust_name", nama);
    localStorage.setItem("lb_cust_phone", phone);
    localStorage.setItem("lb_cust_email", email);

    const total = hitungTotal();
    const orderId = "LMB-" + Date.now();

    const payload = {
        order_id: orderId,
        gross_amount: total,
        customer_name: nama,
        customer_email: email,
        customer_phone: phone,
        notes: notes,
        item_details: keranjang.map((item, idx) => ({
            id: "ITEM-" + (idx + 1),
            price: item.harga,
            quantity: item.jumlah,
            name: item.nama
        }))
    };

    // Tampilkan state loading
    const btnText = document.getElementById("btn-bayar-text");
    const btnSpinner = document.getElementById("btn-bayar-spinner");
    const btnBayar = document.getElementById("btn-konfirmasi-bayar");

    btnText.classList.add("d-none");
    btnSpinner.classList.remove("d-none");
    btnBayar.setAttribute("disabled", "disabled");

    const apiUrl = getApiBaseUrl() + "/api/midtrans/charge";

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        btnText.classList.remove("d-none");
        btnSpinner.classList.add("d-none");
        btnBayar.removeAttribute("disabled");

        if (!response.ok || !data.token) {
            throw new Error(data.error?.message || data.error || "Gagal mendapatkan token pembayaran dari Midtrans.");
        }

        // Tutup modal checkout
        const modalCheckout = bootstrap.Modal.getInstance(document.getElementById("modal-checkout-midtrans"));
        if (modalCheckout) {
            modalCheckout.hide();
        }

        // Buka Snap Payment Popup
        if (window.snap && typeof window.snap.pay === "function") {
            window.snap.pay(data.token, {
                onSuccess: function (result) {
                    tanganiPembayaranSukses(result, payload);
                },
                onPending: function (result) {
                    tanganiPembayaranPending(result, payload);
                },
                onError: function (result) {
                    alert("Pembayaran gagal atau dibatalkan. Silakan coba lagi.");
                    console.error("Midtrans Error:", result);
                },
                onClose: function () {
                    alert("Jendela pembayaran ditutup. Anda dapat melanjutkan pembayaran nanti.");
                }
            });
        } else {
            // Fallback jika snap popup belum ter-load atau diblokir
            if (data.redirect_url) {
                window.open(data.redirect_url, "_blank");
            } else {
                alert("Snap Midtrans belum siap. Token: " + data.token);
            }
        }
    } catch (err) {
        btnText.classList.remove("d-none");
        btnSpinner.classList.add("d-none");
        btnBayar.removeAttribute("disabled");

        console.error("Error pembayaran:", err);
        alert(
            "⚠️ Tidak dapat menghubungi server pembayaran Midtrans:\n\n" +
            (err.message || err) +
            "\n\nPastikan server sudah dijalankan dengan perintah:\n`npm start` atau `node server.js`"
        );
    }
}

function tanganiPembayaranSukses(result, payload) {
    const orderId = result.order_id || payload.order_id;
    const grossAmount = result.gross_amount || payload.gross_amount;
    const paymentType = result.payment_type || "Midtrans Online";

    // Simpan ke riwayat transaksi lokal
    const riwayat = JSON.parse(localStorage.getItem("riwayat-pesanan-lumiere") || "[]");
    riwayat.unshift({
        order_id: orderId,
        gross_amount: grossAmount,
        customer: {
            name: payload.customer_name,
            phone: payload.customer_phone,
            email: payload.customer_email
        },
        items: payload.item_details,
        status: "settlement",
        payment_type: paymentType,
        waktu: new Date().toLocaleString("id-ID")
    });
    localStorage.setItem("riwayat-pesanan-lumiere", JSON.stringify(riwayat));

    // Siapkan pesan konfirmasi WhatsApp
    let waText = `Halo Lumière Bites, saya sudah berhasil bayar pesanan via Midtrans!\n\n`;
    waText += `*Order ID:* ${orderId}\n`;
    waText += `*Nama:* ${payload.customer_name}\n`;
    waText += `*Total:* ${rupiah(grossAmount)}\n`;
    waText += `*Metode Bayar:* ${paymentType.toUpperCase()}\n\n`;
    waText += `*Item Pesanan:*\n`;
    payload.item_details.forEach(item => {
        waText += `• ${item.name} x${item.quantity} = ${rupiah(item.price * item.quantity)}\n`;
    });
    if (payload.notes) {
        waText += `\n*Catatan/Alamat:* ${payload.notes}\n`;
    }
    waText += `\nMohon segera diproses ya, terima kasih!`;

    document.getElementById("receipt-order-id").textContent = orderId;
    document.getElementById("receipt-total").textContent = rupiah(grossAmount);
    document.getElementById("receipt-method").textContent = paymentType.toUpperCase();
    document.getElementById("receipt-wa-btn").href = "https://wa.me/" + NOMOR_WA + "?text=" + encodeURIComponent(waText);

    // Kosongkan keranjang
    keranjang = [];
    simpanKeranjang();
    tampilKeranjang();

    // Tampilkan modal struk sukses
    const modalSukses = new bootstrap.Modal(document.getElementById("modal-sukses-midtrans"));
    modalSukses.show();
}

function tanganiPembayaranPending(result, payload) {
    alert(
        "Status: Menunggu Pembayaran!\n\nOrder ID: " + (result.order_id || payload.order_id) +
        "\nSilakan selesaikan pembayaran sesuai petunjuk (kode Virtual Account / QRIS). Pesanan akan diproses otomatis setelah pembayaran diverifikasi."
    );
}
