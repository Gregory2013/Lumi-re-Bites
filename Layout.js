function tampil_footer() {
    const footer = document.querySelector('#footer')
    footer.innerHTML = `
        <div class="container text-center py-4">
            <h1 class="display-2 fw-bold text-light mb-3">
                We love <span id="changing-word" class="fw-bold">Lumière Bites</span>
            </h1>
            <p class="text-secondary fs-5 mb-4">
                Follow akun Instagram kami untuk update promo dan produk terbaru!
            </p>
            <div class="mt-4 pt-2">
                <a href="https://www.instagram.com/lumierebitesofficial?exln=djhnazUweWdrcW9y&utm_source=qr" 
                   target="_blank" 
                   class="btn instagram-btn">
                    <i class="fa-brands fa-instagram me-2 fs-5"></i> Follow on Instagram
                </a>
            </div>
            <div class="border-top border-secondary border-opacity-25 mt-5 pt-4 text-secondary small">
                © 2026 Lumière Bites. All rights reserved.
            </div>
        </div>
    `
}

function tampil_header(Halaman_aktif) {
    function class_aktif(nama_halaman) {
        if (Halaman_aktif === nama_halaman) { return 'active' }
        return ''
    }

    const navbar = document.querySelector('#header')
    navbar.innerHTML = `
    <div class="container-fluid py-2 px-3">
            <a class="navbar-brand" href="./index.html">Lumière Bites</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto gap-2 align-items-lg-center">
                    <li class="nav-item">
                        <a class="nav-link ${class_aktif('home')}" aria-current="page" href="./index.html">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${class_aktif('snack')}" href="./Snack.html">Snack</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link ${class_aktif('drink')}" href="./Drink.html">Drink</a>
                    </li>
                </ul>
            </div>
        </div>
    `
}