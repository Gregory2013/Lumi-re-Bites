// Nomor WhatsApp toko. Pakai kode negara, tanpa tanda + atau angka 0 di depan.
const NOMOR_WA = "6285722719770";

let keranjang = [];

function mulaiKeranjang() {
    muatKeranjang();
    pasangTombolDiKartu();
    pasangKotakKeranjang();
    tampilKeranjang();
}

function muatKeranjang() {
    const simpanan = localStorage.getItem("keranjang-lumiere");
    if (!simpanan) {
        return;
    }
    keranjang = JSON.parse(simpanan);
}

function simpanKeranjang() {
    localStorage.setItem("keranjang-lumiere", JSON.stringify(keranjang));
}

function ambilHarga(teks) {
    return Number(teks.replaceAll(".", "").replace(/[^\d]/g, ""));
}

function rupiah(angka) {
    return "Rp" + angka.toLocaleString("id-ID");
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

        // Memungkinkan tombol harga juga bisa diklik untuk menambah ke keranjang
        tombolHarga.style.cursor = "pointer";
        tombolHarga.setAttribute("data-aksi", "tambah");
        tombolHarga.setAttribute("data-nama", nama);
        tombolHarga.setAttribute("data-harga", harga);
        tombolHarga.setAttribute("title", "Klik untuk menambah ke keranjang");

        isi.insertAdjacentHTML("beforeend", `
            <div class="d-flex align-items-center gap-2 mt-2">
                <button class="btn btn-outline-primary" type="button" data-aksi="kurang" data-nama="${nama}">-</button>
                <span class="jumlah-kartu" data-jumlah="${nama}">0</span>
                <button class="btn btn-warning" type="button" data-aksi="tambah" data-nama="${nama}" data-harga="${harga}">+</button>
            </div>
        `);
    }

    document.addEventListener("click", function (event) {
        const tombol = event.target.closest("[data-aksi]");
        if (tombol && tombol.dataset.aksi) {
            const nama = tombol.dataset.nama;
            if (tombol.dataset.aksi === "tambah") {
                tambahKeKeranjang(nama, Number(tombol.dataset.harga));
            }
            if (tombol.dataset.aksi === "kurang") {
                ubahJumlah(nama, -1);
            }
            return;
        }

        // Tracking jika ada yang klik tombol WhatsApp langsung pada kartu produk
        const tombolWa = event.target.closest("a.btn-success");
        if (tombolWa && tombolWa.href && tombolWa.href.includes("wa.me")) {
            const kartu = tombolWa.closest(".card");
            const namaProduk = kartu && kartu.querySelector(".card-title") ? kartu.querySelector(".card-title").textContent.trim() : "";
            try {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: "klik_whatsapp_produk",
                    nama_produk: namaProduk
                });
            } catch (e) {}
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

    // ========================================================
    // Tracking Google Tag Manager / Google Analytics (add_to_cart)
    // ========================================================
    try {
        window.dataLayer = window.dataLayer || [];

        // 1. Event standar eCommerce GA4 (add_to_cart)
        window.dataLayer.push({
            event: "add_to_cart",
            ecommerce: {
                currency: "IDR",
                value: harga,
                items: [{
                    item_name: nama,
                    price: harga,
                    quantity: 1
                }]
            }
        });

        // 2. Custom Event GTM khusus (klik_tambah_keranjang) agar mudah diset di GTM
        window.dataLayer.push({
            event: "klik_tambah_keranjang",
            nama_produk: nama,
            harga_produk: harga
        });

        // 3. Panggil langsung window.gtag jika tersedia
        if (typeof window.gtag === "function") {
            window.gtag("event", "add_to_cart", {
                currency: "IDR",
                value: harga,
                items: [{
                    item_name: nama,
                    price: harga,
                    quantity: 1
                }]
            });
        }
    } catch (err) {
        console.warn("GTM Track Error:", err);
    }
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

function tampilKeranjang() {
    const isi = document.getElementById("isi-keranjang");
    const totalTeks = document.getElementById("total-keranjang");
    const tombolPesan = document.getElementById("pesan-keranjang");
    if (!isi) {
        return;
    }

    const jumlahDiKartu = document.querySelectorAll(".jumlah-kartu");
    for (let i = 0; i < jumlahDiKartu.length; i++) {
        const itemKartu = cariItem(jumlahDiKartu[i].dataset.jumlah);
        jumlahDiKartu[i].textContent = itemKartu ? itemKartu.jumlah : "0";
    }

    if (keranjang.length === 0) {
        isi.innerHTML = `<li class="list-group-item px-0 text-secondary">Keranjang masih kosong.</li>`;
        totalTeks.textContent = "Total: Rp0";
        tombolPesan.href = "#";
        return;
    }

    isi.innerHTML = "";
    let total = 0;

    for (let i = 0; i < keranjang.length; i++) {
        const item = keranjang[i];
        const subtotal = item.harga * item.jumlah;
        total += subtotal;
        isi.innerHTML += `
            <li class="list-group-item px-0 d-flex justify-content-between align-items-center">
                <span>${item.nama} x${item.jumlah}</span>
                <span>${rupiah(subtotal)}</span>
            </li>
        `;
    }

    totalTeks.textContent = "Total: " + rupiah(total);
    tombolPesan.href = "https://wa.me/" + NOMOR_WA + "?text=" + encodeURIComponent(buatTeksPesanan(total));
}

function buatTeksPesanan(total) {
    let teks = "Halo Lumière Bites, saya mau beli:\n";

    for (let i = 0; i < keranjang.length; i++) {
        const item = keranjang[i];
        teks += "- " + item.nama + " x" + item.jumlah + " = " + rupiah(item.harga * item.jumlah) + "\n";
    }

    teks += "Total: " + rupiah(total);
    return teks;
}

function pasangKotakKeranjang() {
    const footer = document.getElementById("footer");
    const kotak = document.createElement("div");
    kotak.className = "container my-5";
    kotak.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h2>Keranjang</h2>
                <ul class="list-group list-group-flush" id="isi-keranjang"></ul>
                <p class="fs-4 fw-bold mt-3" id="total-keranjang">Total: Rp0</p>
                <button class="btn btn-danger me-2" id="reset-keranjang" type="button">
                    Reset Keranjang
                </button>
                <a class="btn btn-success" id="pesan-keranjang" target="_blank">Pesan lewat WhatsApp</a>
            </div>
        </div>
    `;
    footer.before(kotak);

    document.getElementById("pesan-keranjang").addEventListener("click", function (event) {
        if (keranjang.length === 0) {
            event.preventDefault();
            alert("Keranjang masih kosong");
            return;
        }

        // Tracking Google Tag Manager: Checkout / Pesan WhatsApp
        try {
            window.dataLayer = window.dataLayer || [];
            const totalNilai = keranjang.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
            window.dataLayer.push({
                event: "begin_checkout",
                ecommerce: {
                    currency: "IDR",
                    value: totalNilai,
                    items: keranjang.map(item => ({
                        item_name: item.nama,
                        price: item.harga,
                        quantity: item.jumlah
                    }))
                }
            });
            window.dataLayer.push({
                event: "klik_pesan_whatsapp",
                total_nilai: totalNilai,
                jumlah_item: keranjang.length
            });
            if (typeof window.gtag === "function") {
                window.gtag("event", "begin_checkout", {
                    currency: "IDR",
                    value: totalNilai,
                    items: keranjang.map(item => ({
                        item_name: item.nama,
                        price: item.harga,
                        quantity: item.jumlah
                    }))
                });
            }
        } catch (e) {
            console.warn("GTM Track Checkout Error:", e);
        }
    });

    document.getElementById("reset-keranjang").addEventListener("click", resetKeranjang);
}

function resetKeranjang() {
    if (keranjang.length === 0) {
        alert("Keranjang sudah kosong");
        return;
    }

    if (!confirm("Yakin ingin mengosongkan keranjang?")) {
        return;
    }

    keranjang = [];
    simpanKeranjang();
    tampilKeranjang();
}
