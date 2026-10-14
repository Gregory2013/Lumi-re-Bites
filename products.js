// ========================================================
// Lumière Bites - Produk Data Management System (CRUD)
// Mendukung Create, Read, Update, Delete dengan LocalStorage
// ========================================================

const STORAGE_KEY_PRODUK = "lumiere_products_data_v1";
const NOMOR_WA_DEFAULT = "6285722719770";

// Data Awal Katalog Lumière Bites
const DEFAULT_PRODUCTS = [
    // --- SNACK: SALTY ---
    {
        id: "snack-salty-1",
        nama: "small Happy tos merah",
        kategori: "salty",
        tipe: "snack",
        harga: 4000,
        gambar: "https://down-id.img.susercontent.com/file/id-11134207-7rash-m2coh9auqkwe27",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli happy tos merah",
        createdAt: 1710000001000
    },
    {
        id: "snack-salty-2",
        nama: "Kusuka Orignal 180g",
        kategori: "salty",
        tipe: "snack",
        harga: 10000,
        gambar: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//96/MTA-3971283/kusuka_kusuka_original_keripik_singkong_-180_g-_full01_sc3kbkw5.jpg",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Kusuka Orignal 180g",
        createdAt: 1710000002000
    },
    {
        id: "snack-salty-3",
        nama: "Kusuka Barbeque 180g",
        kategori: "salty",
        tipe: "snack",
        harga: 10000,
        gambar: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//105/MTA-16554975/kusuka_kusuka_barbeque_keripik_singkong_-180_g-_official_store_full01_l7pnuu6y.jpg",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Kusuka Barbeque 180g",
        createdAt: 1710000003000
    },
    {
        id: "snack-salty-4",
        nama: "Kusuka lada hitam 180g",
        kategori: "salty",
        tipe: "snack",
        harga: 10000,
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBl1h6K7vaNjRaEQP1Ke-GiRoYEIFZoqPUnFNSWT4AbA&s=10",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Kusuka lada hitam 180g",
        createdAt: 1710000004000
    },
    {
        id: "snack-salty-5",
        nama: "chitato beef barbeque 65gr",
        kategori: "salty",
        tipe: "snack",
        harga: 10000,
        gambar: "https://down-id.img.susercontent.com/file/id-11134207-7rasl-m4l35140e832ab",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli chitato beef barbeque 65gr",
        createdAt: 1710000005000
    },
    {
        id: "snack-salty-6",
        nama: "Mie Kremez Shorr Ayam Bakar",
        kategori: "salty",
        tipe: "snack",
        harga: 3500,
        gambar: "https://down-id.img.susercontent.com/file/id-11134207-82250-mkmht0wkdmo38b",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Mie Kremez Shorr Ayam Bakar",
        createdAt: 1710000006000
    },
    {
        id: "snack-salty-7",
        nama: "Mie Gemez Enaak",
        kategori: "salty",
        tipe: "snack",
        harga: 3500,
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR39G5Y8HKoJ5FNj9fpgDXFbCHry1tggknWtPSjMXMgmXI70-ieFUWBVtf&s=10",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Mie Gemez Enaak",
        createdAt: 1710000007000
    },

    // --- SNACK: SWEET ---
    {
        id: "snack-sweet-1",
        nama: "Oishi Popcorn caramel",
        kategori: "sweet",
        tipe: "snack",
        harga: 20000,
        gambar: "https://order.lottemart.co.id/_next/image?url=https%3A%2F%2Fcoreimages.lottemart.co.id%2Ford%2F06%2F1110457000&w=1920&q=75",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Oishi Popcorn caramel",
        createdAt: 1710000008000
    },
    {
        id: "snack-sweet-2",
        nama: "Oishi Popcorn Coklat",
        kategori: "sweet",
        tipe: "snack",
        harga: 20000,
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqE4piTpLl7xBAoU6lasBwxj9--kmsD577jS3h-LdaXw&s=10",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Oishi Popcorn Coklat",
        createdAt: 1710000009000
    },
    {
        id: "snack-sweet-3",
        nama: "Pocky Coklat",
        kategori: "sweet",
        tipe: "snack",
        harga: 10000,
        gambar: "https://image.astronauts.cloud/product-images/2026/8/KVpockychoco_b2786c17-e185-4389-8f37-62ad5795777a_900x900.png",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Pocky Coklat",
        createdAt: 1710000010000
    },
    {
        id: "snack-sweet-4",
        nama: "Oreo",
        kategori: "sweet",
        tipe: "snack",
        harga: 5000,
        gambar: "https://down-id.img.susercontent.com/file/id-11134207-7ra0u-mdd50i8d9ad10f",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Oreo",
        createdAt: 1710000011000
    },
    {
        id: "snack-sweet-5",
        nama: "beng beng max",
        kategori: "sweet",
        tipe: "snack",
        harga: 6500,
        gambar: "https://cdn-klik.klikindomaret.com/klik-catalog/product/20044008_meta.jpg",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli beng beng max",
        createdAt: 1710000012000
    },
    {
        id: "snack-sweet-6",
        nama: "Better",
        kategori: "sweet",
        tipe: "snack",
        harga: 3000,
        gambar: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//101/MTA-48845053/better_better_sandwich_biskuit_-27gr_-10_pcs-_pack-_full02_q3shhio3.jpg",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Better",
        createdAt: 1710000013000
    },
    {
        id: "snack-sweet-7",
        nama: "Hello Panda",
        kategori: "sweet",
        tipe: "snack",
        harga: 5000,
        gambar: "https://down-id.img.susercontent.com/file/id-11134207-7r992-lt6wpl37wh0nfe",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Hello Panda",
        createdAt: 1710000014000
    },
    {
        id: "snack-sweet-8",
        nama: "Good time cookies",
        kategori: "sweet",
        tipe: "snack",
        harga: 5000,
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU9A0bEfkwz6RN9UrkQKGWeW2kDPzCa5aIIgzM9isSCjXA1A9z4tGaEHo&s=10",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Good time cookies",
        createdAt: 1710000015000
    },
    {
        id: "snack-sweet-9",
        nama: "Kalpa",
        kategori: "sweet",
        tipe: "snack",
        harga: 3000,
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlluFkWP5oIjp16TSW_qsXWqQwqA3TOJ-CtMIrohbvkA&s=10",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Kalpa",
        createdAt: 1710000016000
    },
    {
        id: "snack-sweet-10",
        nama: "Nextar brownies",
        kategori: "sweet",
        tipe: "snack",
        harga: 3000,
        gambar: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/110/MTA-183729088/nextar_nabati-nextar-brownies-1-box-isi-12-bungkus-27g-snack-cemilan-kukis-lunak-rasa-cokelat-brownies-banyak-makin-murah-_full03.webp",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Nextar brownies",
        createdAt: 1710000017000
    },

    // --- DRINKS ---
    {
        id: "drink-item-1",
        nama: "Powerade Blue",
        kategori: "drink",
        tipe: "drink",
        harga: 8000,
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4nKk1vshndXr7Xlnt3VZQb9YUvFJ8njwNg2bd0dMdVQ&s=10",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Powerade Blue",
        createdAt: 1710000018000
    },
    {
        id: "drink-item-2",
        nama: "Powerade White",
        kategori: "drink",
        tipe: "drink",
        harga: 8000,
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQlMo9LvH9fBgIrnEa5smS0HODjiTXKQQttAd4-Bh30w&s=10",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Powerade White",
        createdAt: 1710000019000
    },
    {
        id: "drink-item-3",
        nama: "Teh Pucuk",
        kategori: "drink",
        tipe: "drink",
        harga: 5000,
        gambar: "https://coreimages.lottemart.co.id/ord/06/1051403000",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Teh Pucuk",
        createdAt: 1710000020000
    },
    {
        id: "drink-item-4",
        nama: "Jelly Drink Mangga",
        kategori: "drink",
        tipe: "drink",
        harga: 6000,
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2uLj3Yx6pbJPYpU7qLjcQb7291HxmT_2zPkS_hoY58A&s",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Jelly Drink Mangga",
        createdAt: 1710000021000
    },
    {
        id: "drink-item-5",
        nama: "Jelly Drink Strawbery",
        kategori: "drink",
        tipe: "drink",
        harga: 6000,
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfshslmEa-nklWBveNpApmi0NF8eSOmq_F4UgjoblvCA&s=10",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Jelly Drink Strawbery",
        createdAt: 1710000022000
    },
    {
        id: "drink-item-6",
        nama: "Fruit tea",
        kategori: "drink",
        tipe: "drink",
        harga: 10000,
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXd3s26SvNbIOiDk8YWeTv2Pnry26TyLUOCOeS6vMuyw&s=10",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Fruit tea",
        createdAt: 1710000023000
    },
    {
        id: "drink-item-7",
        nama: "Lemon water",
        kategori: "drink",
        tipe: "drink",
        harga: 9000,
        gambar: "https://tastysnack.id/cdn/shop/files/38_1200x1200.png?v=1707724921",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Lemon water",
        createdAt: 1710000024000
    },
    {
        id: "drink-item-8",
        nama: "Orange water",
        kategori: "drink",
        tipe: "drink",
        harga: 9000,
        gambar: "https://tastysnack.id/cdn/shop/files/39_1000x1000.png?v=1707724951",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Orange water",
        createdAt: 1710000025000
    },
    {
        id: "drink-item-9",
        nama: "Goldia",
        kategori: "drink",
        tipe: "drink",
        harga: 9000,
        gambar: "https://img.lazcdn.com/g/ff/kf/Sf311952c8d504803a4cca09aabcdc1e2A.jpg_720x720q80.jpg",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Goldia",
        createdAt: 1710000026000
    },
    {
        id: "drink-item-10",
        nama: "Floridina",
        kategori: "drink",
        tipe: "drink",
        harga: 6000,
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm6DhaPmvt6X9rt0-6NeW5ne00bnjw7cBH2xAlcW6zxQ&s=10",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Floridina",
        createdAt: 1710000027000
    },
    {
        id: "drink-item-11",
        nama: "Floridina coco",
        kategori: "drink",
        tipe: "drink",
        harga: 6000,
        gambar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZzrR74ydjQfKDYNMluVQaAZjVXM8ByeqlrdjJn87LIQ&s=10",
        deskripsi: "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: "hallo saya mau beli Floridina coco",
        createdAt: 1710000028000
    }
];

// Helper Mengambil Semua Produk dari LocalStorage
function ambilSemuaProduk() {
    try {
        const simpanan = localStorage.getItem(STORAGE_KEY_PRODUK);
        if (!simpanan) {
            localStorage.setItem(STORAGE_KEY_PRODUK, JSON.stringify(DEFAULT_PRODUCTS));
            return [...DEFAULT_PRODUCTS];
        }
        const parsed = JSON.parse(simpanan);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
        }
        localStorage.setItem(STORAGE_KEY_PRODUK, JSON.stringify(DEFAULT_PRODUCTS));
        return [...DEFAULT_PRODUCTS];
    } catch (e) {
        console.error("Gagal memuat produk dari LocalStorage:", e);
        return [...DEFAULT_PRODUCTS];
    }
}

// Simpan array produk ke LocalStorage
function simpanSemuaProduk(daftarProduk) {
    try {
        localStorage.setItem(STORAGE_KEY_PRODUK, JSON.stringify(daftarProduk));
        return true;
    } catch (e) {
        console.error("Gagal menyimpan produk ke LocalStorage:", e);
        return false;
    }
}

// Cari Produk Berdasarkan ID
function cariProdukById(id) {
    const list = ambilSemuaProduk();
    return list.find(item => item.id === id) || null;
}

// CREATE: Tambah Produk Baru
function tambahProduk(dataBaru) {
    const list = ambilSemuaProduk();
    const idBaru = "prod_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    
    // Tentukan tipe otomatis jika belum diisi
    const tipe = dataBaru.tipe || (dataBaru.kategori === 'drink' ? 'drink' : 'snack');
    
    const produk = {
        id: idBaru,
        nama: (dataBaru.nama || "Produk Baru").trim(),
        kategori: dataBaru.kategori || "salty",
        tipe: tipe,
        harga: Number(dataBaru.harga) || 0,
        gambar: dataBaru.gambar || "./photo/Biru Krem Modern Kedai Dimsum Logo (1).png",
        deskripsi: dataBaru.deskripsi || "Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.",
        pesanWa: dataBaru.pesanWa || ("hallo saya mau beli " + (dataBaru.nama || "produk")),
        createdAt: Date.now()
    };

    list.unshift(produk); // taruh di paling depan
    simpanSemuaProduk(list);
    return produk;
}

// UPDATE: Perbarui Produk yang Ada
function updateProduk(id, dataUpdated) {
    const list = ambilSemuaProduk();
    const index = list.findIndex(item => item.id === id);
    if (index === -1) {
        return null;
    }

    const tipe = dataUpdated.tipe || (dataUpdated.kategori === 'drink' ? 'drink' : 'snack');

    list[index] = {
        ...list[index],
        nama: (dataUpdated.nama || list[index].nama).trim(),
        kategori: dataUpdated.kategori || list[index].kategori,
        tipe: tipe,
        harga: Number(dataUpdated.harga !== undefined ? dataUpdated.harga : list[index].harga),
        gambar: dataUpdated.gambar || list[index].gambar,
        deskripsi: dataUpdated.deskripsi !== undefined ? dataUpdated.deskripsi : list[index].deskripsi,
        pesanWa: dataUpdated.pesanWa || ("hallo saya mau beli " + (dataUpdated.nama || list[index].nama)),
        updatedAt: Date.now()
    };

    simpanSemuaProduk(list);
    return list[index];
}

// DELETE: Hapus Produk Berdasarkan ID
function hapusProduk(id) {
    const list = ambilSemuaProduk();
    const produkDihapus = list.find(item => item.id === id);
    const listBaru = list.filter(item => item.id !== id);
    
    simpanSemuaProduk(listBaru);

    // Bersihkan juga dari keranjang belanja jika produk ini ada di keranjang
    if (produkDihapus) {
        try {
            const rawKeranjang = localStorage.getItem("keranjang-lumiere");
            if (rawKeranjang) {
                let keranjang = JSON.parse(rawKeranjang);
                keranjang = keranjang.filter(k => k.nama !== produkDihapus.nama);
                localStorage.setItem("keranjang-lumiere", JSON.stringify(keranjang));
            }
        } catch (e) {
            console.error("Gagal menyinkronkan keranjang setelah hapus produk:", e);
        }
    }

    return true;
}

// RESET: Mengembalikan ke Data Awal
function resetProdukKeDefault() {
    localStorage.setItem(STORAGE_KEY_PRODUK, JSON.stringify(DEFAULT_PRODUCTS));
    return [...DEFAULT_PRODUCTS];
}

// Format Rupiah untuk tampilan rapi (misal: "Rp10.000")
function formatRupiahAdmin(angka) {
    return "Rp" + Number(angka || 0).toLocaleString("id-ID");
}

// Format harga untuk tombol kartu agar kompatibel dengan Keranjang.js (misal: "10.000 rp")
function formatHargaTombol(angka) {
    return Number(angka || 0).toLocaleString("id-ID") + " rp";
}

// Helper badge kategori HTML
function getBadgeKategoriHTML(kategori) {
    if (kategori === "salty") {
        return `<span class="badge badge-salty"><i class="fa-solid fa-cookie-bite me-1"></i> Asin / Gurih</span>`;
    } else if (kategori === "sweet") {
        return `<span class="badge badge-sweet"><i class="fa-solid fa-candy-cane me-1"></i> Manis</span>`;
    } else if (kategori === "drink") {
        return `<span class="badge badge-drink"><i class="fa-solid fa-bottle-water me-1"></i> Minuman</span>`;
    }
    return `<span class="badge bg-secondary">${kategori}</span>`;
}

// Render dynamic card HTML untuk Snack / Drink di customer pages
function generateCardCustomerHTML(item) {
    const encodedWa = encodeURIComponent(item.pesanWa || `hallo saya mau beli ${item.nama}`);
    const noWa = typeof NOMOR_WA !== "undefined" ? NOMOR_WA : NOMOR_WA_DEFAULT;
    const fallbackImg = "./photo/Biru Krem Modern Kedai Dimsum Logo (1).png";
    
    return `
        <div class="card m-3" style="width: 18rem;" data-id="${item.id}">
            <img src="${item.gambar || fallbackImg}" 
                 class="card-img-top" 
                 alt="${item.nama}"
                 onerror="this.onerror=null; this.src='${fallbackImg}';">
            <div class="card-body">
                <h5 class="card-title">${item.nama}</h5>
                <p class="card-text">"${item.deskripsi || 'Kalau mau beli produk ini, beli di toko Shopee Lumière Bites.'}"</p>
                <a class="btn btn-primary">${formatHargaTombol(item.harga)}</a>
                <a class="btn btn-success" href="https://wa.me/${noWa}?text=${encodedWa}" target="_blank">Whatsapp</a>
            </div>
        </div>
    `;
}

// Fungsi render otomatis untuk Snack.html
function renderHalamanSnack(containerSaltyId = "container-salty", containerSweetId = "container-sweet") {
    const saltyBox = document.getElementById(containerSaltyId);
    const sweetBox = document.getElementById(containerSweetId);
    if (!saltyBox && !sweetBox) return;

    const semua = ambilSemuaProduk();
    const saltyItems = semua.filter(p => p.kategori === "salty");
    const sweetItems = semua.filter(p => p.kategori === "sweet");

    if (saltyBox) {
        if (saltyItems.length === 0) {
            saltyBox.innerHTML = `
                <div class="col-12 text-center py-4 text-muted">
                    <p class="fs-5">Belum ada camilan asin/gurih yang tersedia saat ini.</p>
                </div>
            `;
        } else {
            saltyBox.innerHTML = saltyItems.map(generateCardCustomerHTML).join("");
        }
    }

    if (sweetBox) {
        if (sweetItems.length === 0) {
            sweetBox.innerHTML = `
                <div class="col-12 text-center py-4 text-muted">
                    <p class="fs-5">Belum ada camilan manis yang tersedia saat ini.</p>
                </div>
            `;
        } else {
            sweetBox.innerHTML = sweetItems.map(generateCardCustomerHTML).join("");
        }
    }
}

// Fungsi render otomatis untuk Drink.html
function renderHalamanDrink(containerDrinkId = "container-drink") {
    const drinkBox = document.getElementById(containerDrinkId);
    if (!drinkBox) return;

    const semua = ambilSemuaProduk();
    const drinkItems = semua.filter(p => p.kategori === "drink" || p.tipe === "drink");

    if (drinkItems.length === 0) {
        drinkBox.innerHTML = `
            <div class="col-12 text-center py-4 text-muted">
                <p class="fs-5">Belum ada minuman segar yang tersedia saat ini.</p>
            </div>
        `;
    } else {
        drinkBox.innerHTML = drinkItems.map(generateCardCustomerHTML).join("");
    }
}
