/* This is where i will store all the functions that will happen on every page! */
// Global theme you can toggle on and off
let darkmode = localStorage.getItem('darkmode');
const themeSwitch = document.getElementById('theme-switch');

// Enable Dark Mode
const enableDarkmode = () => {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkmode', 'active');
    darkmode = 'active';
};

// Disable Dark Mode
const disableDarkmode = () => {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkmode', null);
    darkmode = null;
};

if (darkmode === 'active') {
    enableDarkmode();
}

if (themeSwitch) {
    themeSwitch.addEventListener("click", () => {
        darkmode !== "active" ? enableDarkmode() : disableDarkmode();
    });
}

// Light box javascript...this file might get too big im tired of the css glabal...
document.addEventListener('DOMContentLoaded', () => {
    const ligthboxModal = document.getElementById('lightbox-modal');
    const ligthboxImg = document.getElementById('lightbox-img');
    const ligthboxCaption = document.getElementById('lightbox-caption');
    const closeLightboxBtn = document.getElementById('close-lightbox');

    // select all product images automatically

    const cardImages = document.querySelectorAll(
        '.product-grid article img, .collectibles-product-grid article img, .collectibles-products-grid article img'
    );
    cardImages.forEach(img => {
        img.style.curosr = 'zoom-in';
        img.addEventListener('click', () => {
            if (ligthboxModal && ligthboxImg) {
                ligthboxImg.src = img.src;
                ligthboxImg.alt = img.alt;

                // pull card title from article or refer to alt text
                const cardTitle = img.closest('article')?.querySelector('h3')?.textContent || img.alt;
                if (ligthboxCaption) {
                    ligthboxCaption.textContent = cardTitle;
                }

                ligthboxModal.classList.remove('hidden');
            }
        });
    });

    const closeLightbox = () => {
        if (ligthboxModal) ligthboxModal.classList.add('hidden');
    };

    if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);

    // closes when clicking off the image
    if (ligthboxModal) {
        ligthboxModal.addEventListener('click', (e) => {
            if (e.target === ligthboxModal) closeLightbox();
        });
    }
});