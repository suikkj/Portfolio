document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.getElementById('language-select');
    const heroTitleElement = document.querySelector('h1[data-i18n="hero.title"]');
    const heroParagraphElement = document.querySelector('.hero-content p[data-i18n="hero.subtitle"]');
    const hamburgerButton = document.querySelector('.hamburger-button');
    const navigationWrapper = document.querySelector('.navigation-wrapper');
    let activeTypewriters = {};

    // Função para definir o idioma
    function setLanguage(lng) {
        i18next.changeLanguage(lng, (err, t) => {
            if (err) return console.error(err);
            updateContent();
        });
    }

    // Função para efeito de digitação
    // Função para efeito de digitação, agora retorna uma Promise
    function typeWriterEffect(element, text, speed = 75) {
        return new Promise((resolve) => {
            if (!element) {
                resolve();
                return;
            }

            // Limpa qualquer animação anterior para este elemento
            if (activeTypewriters[element.dataset.i18n]) {
                clearTimeout(activeTypewriters[element.dataset.i18n].timeoutId);
                if (activeTypewriters[element.dataset.i18n].cursor) {
                    activeTypewriters[element.dataset.i18n].cursor.style.display = 'none'; // Esconde o cursor antigo
                }
            }


            element.textContent = ''; // Limpa o texto inicial
            const cursor = element.nextElementSibling; // Pega o span do cursor
            if (cursor && cursor.classList.contains('typing-cursor')) {
                cursor.style.display = 'inline-block'; // Garante que o cursor esteja visível
                // Define a altura do cursor com base no tamanho da fonte do elemento
                const elementFontSize = window.getComputedStyle(element).fontSize;
                cursor.style.height = elementFontSize;
            }

            activeTypewriters[element.dataset.i18n] = { timeoutId: null, cursor: cursor };

            let i = 0;
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    activeTypewriters[element.dataset.i18n].timeoutId = setTimeout(type, speed);
                } else {
                    delete activeTypewriters[element.dataset.i18n];
                    resolve(); // Resolve a Promise quando a digitação terminar
                }
            }

            if (text.length === 0 && cursor && cursor.classList.contains('typing-cursor')) {
                cursor.style.display = 'none';
                resolve();
                return;
            }

            type();
        });
    }

    // Função para atualizar o conteúdo da página
    async function updateContent() { // Marcada como async para usar await
        // Atualiza todos os elementos, exceto os que serão animados
        document.querySelectorAll('[data-i18n]').forEach(element => {
            if (element !== heroTitleElement && element !== heroParagraphElement) {
                element.textContent = i18next.t(element.dataset.i18n);
            }
        });

        // Atualize também placeholders de inputs, atributos alt de imagens, etc.
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            element.placeholder = i18next.t(element.dataset.i18nPlaceholder);
        });
        document.querySelectorAll('[data-i18n-alt]').forEach(element => {
            element.alt = i18next.t(element.dataset.i18nAlt);
        });
        // Pega os textos traduzidos
        const h1Text = heroTitleElement ? i18next.t(heroTitleElement.dataset.i18n) : '';
        const pText = heroParagraphElement ? i18next.t(heroParagraphElement.dataset.i18n) : '';

        // Garante que os cursores estejam inicialmente ocultos se não forem o primeiro a animar
        const pCursor = heroParagraphElement ? heroParagraphElement.nextElementSibling : null;
        if (pCursor && pCursor.classList.contains('typing-cursor')) {
            pCursor.style.display = 'none';
        }

        if (heroTitleElement) {
            typeWriterEffect(heroTitleElement, h1Text);
        }
        if (heroParagraphElement) {
            typeWriterEffect(heroParagraphElement, pText);
        }
    }

    // Inicialização do i18next
    i18next
        .init({
            lng: 'pt', // Idioma inicial (pode ser obtido do localStorage)
            debug: true,
            resources: {
                pt: {
                    translation: {
                        "nav.inicio": "Início",
                        "nav.projetos": "Projetos",
                        "nav.sobre": "Sobre Mim",
                        "hero.title": "Olá, eu sou Lucas Oliveira!",
                        "hero.subtitle": "Desenvolvedor Fullstack apaixonado por transformar ideias em realidade digital, construindo aplicações web robustas, escaláveis e intuitivas.",
                        "hero.contact": "Entre em Contato",
                        // ... adicione mais traduções para cada texto do seu site ...
                        "footer.copyright": "&copy; 2024 Lucas Oliveira. Todos os direitos reservados.",
                    }
                },
                en: {
                    translation: {
                        "nav.inicio": "Home",
                        "nav.projetos": "Projects",
                        "nav.sobre": "About Me",
                        "hero.title": "Hello, I'm Lucas Oliveira!",
                        "hero.subtitle": "Fullstack Developer passionate about transforming ideas into digital reality, building robust, scalable, and intuitive web applications.",
                        "hero.contact": "Contact Me",
                        // ... traduções em inglês ...
                         "footer.copyright": "&copy; 2024 Lucas Oliveira. All rights reserved.",
                    }
                }
            }
        }, function(err, t) {
            if (err) return console.error(err);
            updateContent();
        });

    // Evento de mudança de idioma
    languageSelect.addEventListener('change', function() {
        setLanguage(this.value);
    });

    
    if (hamburgerButton && navigationWrapper) {
        hamburgerButton.addEventListener('click', function() {
            navigationWrapper.classList.toggle('open');
            const isExpanded = navigationWrapper.classList.contains('open');
            hamburgerButton.setAttribute('aria-expanded', isExpanded);
        });
    }


    // === Lightbox Modal Script ===
    // Seleciona todas as imagens da galeria
    const galleryImages = document.querySelectorAll('.gallery-grid img');
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-image');
    const caption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');

    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImg.src = img.src;
            caption.textContent = img.alt;
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
});
