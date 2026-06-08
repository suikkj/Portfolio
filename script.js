document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.getElementById('language-select');
    const heroTitleElement = document.querySelector('h1[data-i18n="hero.title"]');
    const heroParagraphElement = document.querySelector('.hero-content p[data-i18n="hero.subtitle"]');
    const hamburgerButton = document.querySelector('.hamburger-button');
    const navigationWrapper = document.querySelector('.navigation-wrapper');
    const currentYearElement = document.getElementById('current-year');

    // --- DYNAMIC YEAR ---
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // ===========================================
    //  PARTICLE CANVAS BACKGROUND
    // ===========================================
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseX = -1000;
        let mouseY = -1000;
        const particleCount = Math.min(80, Math.floor(window.innerWidth / 18));
        const connectionDistance = 150;
        const mouseRadius = 200;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 1.8 + 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Mouse repulsion
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouseRadius && dist > 0) {
                    const force = (mouseRadius - dist) / mouseRadius * 0.02;
                    this.vx += (dx / dist) * force;
                    this.vy += (dy / dist) * force;
                }

                // Damping
                this.vx *= 0.999;
                this.vy *= 0.999;

                // Wrap around edges
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(97, 218, 251, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < connectionDistance) {
                        const opacity = (1 - distance / connectionDistance) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(97, 218, 251, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawConnections();
            requestAnimationFrame(animate);
        }
        animate();

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        document.addEventListener('mouseleave', () => {
            mouseX = -1000;
            mouseY = -1000;
        });
    }

    // ===========================================
    //  CURSOR GLOW EFFECT
    // ===========================================
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    // ===========================================
    //  SCROLL PROGRESS BAR
    // ===========================================
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            scrollProgress.style.width = progress + '%';
        });
    }

    // ===========================================
    //  HEADER SCROLL EFFECT
    // ===========================================
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ===========================================
    //  TYPEWRITER EFFECT
    // ===========================================
    async function typeWriterEffect(element, text, speed = 100) {
        if (!element) return;
        element.innerHTML = '';
        
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        element.parentNode.appendChild(cursor);
        cursor.style.display = 'inline-block';

        let i = 0;
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // ===========================================
    //  SCROLL REVEAL (Intersection Observer)
    // ===========================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- STAGGERED ANIMATION ---
    const staggeredContainers = document.querySelectorAll('.stagger-children');
    staggeredContainers.forEach(container => {
        const children = container.querySelectorAll('.reveal');
        children.forEach((child, index) => {
            child.style.setProperty('--stagger-index', index);
        });
    });

    // ===========================================
    //  COUNTER ANIMATION
    // ===========================================
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    animateCounter(el, target);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(element, target) {
        let current = 0;
        const duration = 1800;
        const increment = target / (duration / 16);
        const suffix = '+';

        function step() {
            current += increment;
            if (current >= target) {
                element.textContent = target + suffix;
                return;
            }
            element.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    // ===========================================
    //  PROJECT FILTER
    // ===========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card[data-category]');

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active filter
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const category = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category').includes(category)) {
                        card.style.display = '';
                        card.style.animation = 'fadeInUp 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Fade-in animation for filter
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);


    // ===========================================
    //  ACTIVE NAV LINK HIGHLIGHTING
    // ===========================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });


    // ===========================================
    //  I18N LOGIC
    // ===========================================
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

        // Hero Typewriter
        const h1Text = heroTitleElement ? i18next.t('hero.title') : '';
        const pText = heroParagraphElement ? i18next.t('hero.subtitle') : '';
        
        document.querySelectorAll('.typing-cursor').forEach(c => c.remove());

        if (heroTitleElement) await typeWriterEffect(heroTitleElement, h1Text, 50);
        if (heroParagraphElement) {
             heroParagraphElement.textContent = '';
             setTimeout(() => typeWriterEffect(heroParagraphElement, pText, 30), h1Text.length * 50 + 500);
        }
    }

    i18next.init({
        lng: 'pt',
        debug: false,
        resources: {
            pt: {
                translation: {
                    "nav.inicio": "Início", "nav.projetos": "Projetos", "nav.sobre": "Sobre Mim",
                    "hero.badge": "Disponível para oportunidades",
                    "hero.title": "Olá, eu sou Lucas Oliveira!",
                    "hero.subtitle": "Desenvolvedor Fullstack e Analista de Dados focado em transformar dados complexos em soluções digitais intuitivas.",
                    "hero.contact": "Entre em Contato",
                    "hero.projects": "Ver Projetos",
                    "stats.years": "Anos de Experiência",
                    "stats.projects": "Projetos Entregues",
                    "stats.techs": "Tecnologias Dominadas",
                    "skills.title": "Minhas Ferramentas e Tecnologias",
                    "skills.frontend": "Frontend & Mobile",
                    "skills.backend": "Backend & Database",
                    "skills.data": "Dados & Ferramentas",
                    "experience.title": "Experiência Profissional",
                    "exp.doceveneno.date": "Atual",
                    "exp.doceveneno.role": "Desenvolvedor Fullstack, Administrador e Analista de Dados",
                    "exp.doceveneno.desc": "Sistema Fullstack web para gerenciamento de loja de roupas, focado na otimização do controle de estoque e acompanhamento financeiro. API construída com Node.js e Express.js e arquitetura de banco de dados PostgreSQL (Supabase).",
                    "exp.rpg.date": "Projeto Pessoal",
                    "exp.rpg.title": "Plataforma de Fichas e Campanhas de RPG",
                    "exp.rpg.role": "Administrador e Analista de Dados",
                    "exp.rpg.desc": "Plataforma Fullstack web robusta para gerenciamento de campanhas de RPG e criação de fichas, focada na experiência do usuário. API construída com React.js, Express.js e arquitetura de banco de dados PostgreSQL (Supabase).",
                    "education.title": "Formação Acadêmica",
                    "education.course": "Análise e Desenvolvimento de Sistemas",
                    "education.date": "Jan 2023 - Fev 2026",
                    "education.desc": "Foco em engenharia de software, banco de dados e gestão de projetos tecnológicos.",
                    "languages.title": "Idiomas",
                    "lang.pt": "Português",
                    "lang.native": "Nativo",
                    "lang.en": "Inglês",
                    "lang.en.desc": "Imersão diária (documentação, mídia, comunicação)",
                    "projects.title": "Projetos em Destaque",
                    "project.rpg.title": "Plataforma de RPG (Hystoria)",
                    "project.rpg.desc": "Sistema web completo para criação de fichas e gestão de campanhas de RPG Tormenta20.",
                    "project.stock.title": "Gerenciador de Estoque",
                    "project.stock.desc": "Sistema para otimização de controle de estoque e financeiro para loja de moda.",
                    "project.arg.title": "ARG - Enigmas",
                    "project.arg.desc": "Experiência interativa de mistério e puzzles com narrativa imersiva.",
                    "contact.title": "Vamos Conversar?",
                    "contact.text": "Estou sempre aberto a novas oportunidades e colaborações. Entre em contato!",
                    "footer.copyright": "© 2026 Lucas Oliveira. Todos os direitos reservados.",
                    "btn.details": "Ver Detalhes",
                    "btn.viewAll": "Ver Todos os Projetos",
                    "about.title": "Sobre Mim",
                    "about.p1": "Profissional focado em Análise de Dados com uma sólida base técnica em desenvolvimento de software. Proficiente em SQL para modelagem, gerenciamento e consulta de bancos de dados PostgreSQL, e habilitado na criação de dashboards e relatórios em Power BI.",
                    "about.p2": "Minha experiência prévia com Node.js e React.js me proporciona uma forte capacidade de resolução de problemas e agilidade no aprendizado de novas ferramentas, como Python e suas bibliotecas de análise. Busco uma posição desafiadora onde possa aplicar minha capacidade analítica para transformar dados em insights acionáveis e suportar a tomada de decisão estratégica.",
                    "about.values": "Diferenciais",
                    "about.val1.title": "Pensamento Analítico",
                    "about.val1.desc": "Transformo dados complexos em insights claros e acionáveis.",
                    "about.val2.title": "Resolução de Problemas",
                    "about.val2.desc": "Capacidade de diagnosticar e resolver desafios técnicos de forma eficiente.",
                    "about.val3.title": "Código Limpo",
                    "about.val3.desc": "Foco em código maintível, documentado e bem estruturado.",
                    "about.val4.title": "Aprendizado Contínuo",
                    "about.val4.desc": "Sempre buscando novas tecnologias e melhores práticas.",
                    "filter.all": "Todos",
                    "filter.fullstack": "Fullstack",
                    "filter.frontend": "Frontend",
                    "filter.data": "Data",
                    "filter.gaming": "Gaming",
                    "projects.page.title": "Meus Projetos"
                }
            },
            en: {
                translation: {
                    "nav.inicio": "Home", "nav.projetos": "Projects", "nav.sobre": "About Me",
                    "hero.badge": "Open to opportunities",
                    "hero.title": "Hello, I'm Lucas Oliveira!",
                    "hero.subtitle": "Fullstack Developer and Data Analyst focused on transforming complex data into intuitive digital solutions.",
                    "hero.contact": "Contact Me",
                    "hero.projects": "View Projects",
                    "stats.years": "Years of Experience",
                    "stats.projects": "Projects Delivered",
                    "stats.techs": "Technologies Mastered",
                    "skills.title": "My Tools and Technologies",
                    "skills.frontend": "Frontend & Mobile",
                    "skills.backend": "Backend & Database",
                    "skills.data": "Data & Tools",
                    "experience.title": "Professional Experience",
                    "exp.doceveneno.date": "Current",
                    "exp.doceveneno.role": "Fullstack Developer, Administrator & Data Analyst",
                    "exp.doceveneno.desc": "Fullstack web system for clothing store management, focused on inventory control optimization and financial tracking. API built with Node.js and Express.js and PostgreSQL (Supabase) database architecture.",
                    "exp.rpg.date": "Personal Project",
                    "exp.rpg.title": "RPG Character Sheet & Campaign Platform",
                    "exp.rpg.role": "Administrator & Data Analyst",
                    "exp.rpg.desc": "Robust Fullstack web platform for RPG campaign management and character sheet creation, user-experience focused. API built with React.js, Express.js and PostgreSQL (Supabase) database architecture.",
                    "education.title": "Education",
                    "education.course": "Analysis and Systems Development",
                    "education.date": "Jan 2023 - Feb 2026",
                    "education.desc": "Focus on software engineering, databases, and technological project management.",
                    "languages.title": "Languages",
                    "lang.pt": "Portuguese",
                    "lang.native": "Native",
                    "lang.en": "English",
                    "lang.en.desc": "Daily immersion (documentation, media, communication)",
                    "projects.title": "Featured Projects",
                    "project.rpg.title": "RPG Platform (Hystoria)",
                    "project.rpg.desc": "Complete web system for Tormenta20 character creation and campaign management.",
                    "project.stock.title": "Inventory Manager",
                    "project.stock.desc": "System for inventory control optimization and financial tracking for a fashion store.",
                    "project.arg.title": "ARG - Enigmas",
                    "project.arg.desc": "Interactive mystery experience with immersive narrative and puzzles.",
                    "contact.title": "Let's Talk?",
                    "contact.text": "I'm always open to new opportunities and collaborations. Get in touch!",
                    "footer.copyright": "© 2026 Lucas Oliveira. All rights reserved.",
                    "btn.details": "View Details",
                    "btn.viewAll": "View All Projects",
                    "about.title": "About Me",
                    "about.p1": "Professional focused on Data Analysis with a solid technical foundation in software development. Proficient in SQL for modeling, managing, and querying PostgreSQL databases, and skilled in creating dashboards and reports in Power BI.",
                    "about.p2": "My previous experience with Node.js and React.js provides me with strong problem-solving skills and agility in learning new tools, such as Python and its analysis libraries. Seeking a challenging position where I can apply my analytical skills to transform data into actionable insights and support strategic decision-making.",
                    "about.values": "Differentials",
                    "about.val1.title": "Analytical Thinking",
                    "about.val1.desc": "Transform complex data into clear, actionable insights.",
                    "about.val2.title": "Problem Solving",
                    "about.val2.desc": "Ability to diagnose and solve technical challenges efficiently.",
                    "about.val3.title": "Clean Code",
                    "about.val3.desc": "Focus on maintainable, documented, and well-structured code.",
                    "about.val4.title": "Continuous Learning",
                    "about.val4.desc": "Always seeking new technologies and best practices.",
                    "filter.all": "All",
                    "filter.fullstack": "Fullstack",
                    "filter.frontend": "Frontend",
                    "filter.data": "Data",
                    "filter.gaming": "Gaming",
                    "projects.page.title": "My Projects"
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

    // ===========================================
    //  HAMBURGER MENU
    // ===========================================
    if (hamburgerButton && navigationWrapper) {
        hamburgerButton.addEventListener('click', function() {
            navigationWrapper.classList.toggle('open');
            const isExpanded = navigationWrapper.classList.contains('open');
            hamburgerButton.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking a nav link (mobile)
        const mobileNavLinks = navigationWrapper.querySelectorAll('.main-nav a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navigationWrapper.classList.remove('open');
                    hamburgerButton.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // ===========================================
    //  LIGHTBOX LOGIC
    // ===========================================
    const galleryImages = document.querySelectorAll('.gallery-grid img, .lightbox-trigger');
    const modal = document.getElementById('lightbox-modal');

    if (modal) {
        const modalImg = document.getElementById('lightbox-image');
        const caption = document.getElementById('lightbox-caption');
        const closeBtn = document.querySelector('.lightbox-close');
        
        galleryImages.forEach((img) => {
            img.addEventListener('click', () => {
                modal.style.display = 'block';
                modalImg.src = img.src;
                caption.textContent = img.alt;
            });
        });

        const closeModal = () => { modal.style.display = 'none'; }
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });
    }
});