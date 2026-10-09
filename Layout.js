function tampil_footer() {
    const footer = document.querySelector('#footer')
    footer.innerHTML = `
 <div class="container text-center">
            <div class="container text-center mt-5">
                <h1 class="display-1 fw-bold text-light">We love <span id="changing-word"
                        class="text-primary fw-bold">Lumière
                        Bites</span> </h1>
                <a href="https://www.instagram.com/lumierebitesofficial?exln=djhnazUweWdrcW9y&utm_source=qr" target="_blank" class="btn text-white"
                    style="background: radial-gradient(circle at 30% 107%, #fdf497 0%, #df4996 45%, #a23ab7 60%, #3f51b5 90%);">
                    <i class="fa-brands fa-instagram me-2"></i> Follow on Instagram
                </a>
            </div>
        </div>
    `
}

function tampil_header(Halaman_aktif) {
    function class_aktif(nama_halaman) {
        if (Halaman_aktif === nama_halaman) { return 'active' }
    }

    const navbar = document.querySelector('#header')
    navbar.innerHTML = `
    <div class="container-fluid mt-3 mb-3 ">
            <a class="navbar-brand fs-1" href="#">Lumière Bites</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item fs-1">
                        <a class="nav-link ${class_aktif('home')}" aria-current="page" href="./Index.html">Home</a>
                    </li>
                    <li class="nav-item fs-1">
                        <a class="nav-link ${class_aktif('snack')} "     href="./Snack.html">Snack</a>
                    </li>
                    <li class="nav-item fs-1">
                        <a class="nav-link ${class_aktif('drink')} "    href="./Drink.html">Drink</a>
                    </li>
                </ul>
            </div>
        </div>
    `
}