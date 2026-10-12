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

        isi.insertAdjacentHTML("beforeend", `
            <div class="d-flex align-items-center gap-2 mt-2">
                <button class="btn btn-outline-primary" type="button" data-aksi="kurang" data-nama="${nama}">-</button>
                <span class="jumlah-kartu" data-jumlah="${nama}">0</span>
                <button class="btn btn-warning" type="button" data-aksi="tambah" data-nama="${nama}" data-harga="${harga}">+</button>
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
                <a class="btn btn-success" id="pesan-keranjang" target="_blank">Pesan lewat WhatsApp</a>
            </div>
        </div>
    `;
    footer.before(kotak);

    document.getElementById("pesan-keranjang").addEventListener("click", function (event) {
        if (keranjang.length === 0) {
            event.preventDefault();
            alert("Keranjang masih kosong");
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
