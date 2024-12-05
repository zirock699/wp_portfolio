const CACHE_NAME = "portfolio-cache-v2"; // Update version as needed
const ASSETS_TO_CACHE = [
    "/index.html",
    "/contact.html",
    "/about.html",
    "/currency_converter.html",
    "/fuel_forecaster.html",
    "/interests.html",
    "/manifest.json",
    "/skills.html",
    "/testimonials.html",

    // CSS files
    "/css/about.css",
    "/css/contact.css",
    "/css/footer.css",
    "/css/header.css",
    "/css/home.css",
    "/css/main.css",
    "/css/responsive.css",
    "/css/skills.css",
    "/css/tasks.css",

    // JavaScript files
    "/js/contactForm.js",
    "/js/currency_converter.js",
    "/js/forecaster.js",
    "/js/form_validation.js",
    "/js/main.js",

    // Components
    "/components/contact-form.html",
    "/components/footer.html",
    "/components/header.html",

    // Assets (images and icons)
    "/assets/Hichem.ico",
    "/assets/Hichem.png",
    "/assets/banner/image1.png",
    "/assets/banner/image2.png",
    "/assets/banner/image3.png",
    "/assets/images/christopher-burns-Kj2SaNHG-hg-unsplash.jpg",
    "/assets/tech/97_Docker_logo_logos-512.webp",
    "/assets/tech/Amazon_Web_Services_Logo.svg.png",
    "/assets/tech/CiCd.png",
    "/assets/tech/CSS3_logo.svg.png",
    "/assets/tech/Git_icon.svg.png",
    "/assets/tech/HTML5_logo_and_wordmark.svg.png",
    "/assets/tech/javascript-logo-javascript-icon-transparent-free-png.webp",
    "/assets/tech/Jenkins_logo.svg (1).png",
    "/assets/tech/node-js-icon-454x512-nztofx17.png",
    "/assets/tech/owasp_logo_flat2_icon.png",
    "/assets/tech/owasp_logo_icon_248268.webp",
    "/assets/tech/react-original-wordmark-icon-840x1024-vhmauxp6.png",
];

// Install event: Cache files
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Opened cache");
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Fetch event: Serve cached files or fallback
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return (
                response ||
                fetch(event.request).catch(() => caches.match("/index.html"))
            );
        })
    );
});

// Activate event: Remove old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Deleting old cache:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
