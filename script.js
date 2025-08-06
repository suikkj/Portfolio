document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.getElementById('language-select');
    const heroTitleElement = document.querySelector('h1[data-i18n="hero.title"]');
    const heroParagraphElement = document.querySelector('.hero-content p[data-i18n="hero.subtitle"]');
    const hamburgerButton = document.querySelector('.hamburger-button');
    const navigationWrapper = document.querySelector('.navigation-wrapper');

    // --- LÓGICA DO IDIOMA (sem alterações) ---
    function setLanguage(lng) {
        i18next.changeLanguage(lng, (err, t) => {
            if (err) return console.error(err);
            updateContent();
        });
    }
    async function updateContent() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            if (element !== heroTitleElement && element !== heroParagraphElement) {
                element.textContent = i18next.t(element.dataset.i18n);
            }
        });
        const h1Text = heroTitleElement ? i18next.t(heroTitleElement.dataset.i18n) : '';
        const pText = heroParagraphElement ? i18next.t(heroParagraphElement.dataset.i18n) : '';
        if (heroTitleElement) await typeWriterEffect(heroTitleElement, h1Text);
        if (heroParagraphElement) await typeWriterEffect(heroParagraphElement, pText);
    }
    i18next.init({
        lng: 'pt',
        debug: false,
        resources: {
            pt: {
                translation: {
                    "nav.inicio": "Início", "nav.projetos": "Projetos", "nav.sobre": "Sobre Mim",
                    "hero.title": "Olá, eu sou Lucas Oliveira!",
                    "hero.subtitle": "Desenvolvedor Fullstack apaixonado por transformar ideias em realidade digital.",
                    "hero.contact": "Entre em Contato",
                    "footer.copyright": "© 2024 Lucas Oliveira. Todos os direitos reservados.",
                }
            },
            en: {
                translation: {
                    "nav.inicio": "Home", "nav.projetos": "Projects", "nav.sobre": "About Me",
                    "hero.title": "Hello, I'm Lucas Oliveira!",
                    "hero.subtitle": "Fullstack Developer passionate about turning ideas into digital reality.",
                    "hero.contact": "Contact Me",
                    "footer.copyright": "© 2024 Lucas Oliveira. All rights reserved.",
                }
            }
        }
    }, (err, t) => {
        if (err) return console.error(err);
        updateContent();
    });
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            setLanguage(this.value);
        });
    }

    // --- LÓGICA DO MENU HAMBURGER (sem alterações) ---
    if (hamburgerButton && navigationWrapper) {
        hamburgerButton.addEventListener('click', function() {
            navigationWrapper.classList.toggle('open');
            const isExpanded = navigationWrapper.classList.contains('open');
            hamburgerButton.setAttribute('aria-expanded', isExpanded);
        });
    }

    // --- NOVO: LÓGICA DO LIGHTBOX (GALERIA) ---
    const galleryImages = document.querySelectorAll('.gallery-grid img, .lightbox-trigger');
    const modal = document.getElementById('lightbox-modal');

    // Apenas executa se o modal existir na página
    if (modal) {
        const modalImg = document.getElementById('lightbox-image');
        const caption = document.getElementById('lightbox-caption');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');
        let currentIndex = 0;

        galleryImages.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                currentIndex = index;
                modal.style.display = 'block';
                modalImg.src = img.src;
                caption.textContent = img.alt;
            });
        });

        // Função para fechar o modal
        function closeModal() {
            modal.style.display = 'none';
        }

        // Fecha ao clicar no botão 'X'
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // Fecha ao clicar fora da imagem (no fundo escuro)
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        // Navegação entre imagens
        if (prevBtn) prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            modalImg.src = galleryImages[currentIndex].src;
            caption.textContent = galleryImages[currentIndex].alt;
        });
        if (nextBtn) nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % galleryImages.length;
            modalImg.src = galleryImages[currentIndex].src;
            caption.textContent = galleryImages[currentIndex].alt;
        });
    }
});