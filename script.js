document.addEventListener('DOMContentLoaded', function () {
    // Enable the JS-gated reveal hidden state (content visible by default otherwise)
    document.body.classList.add('js-reveal');

    const languageSelect = document.getElementById('language-select');
    const hamburgerButton = document.querySelector('.hamburger-button');
    const navigationWrapper = document.querySelector('.navigation-wrapper');
    const currentYearElement = document.getElementById('current-year');

    // --- DYNAMIC YEAR ---
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // --- SCROLL PROGRESS BAR ---
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            scrollProgress.style.width = progress + '%';
        });
    }

    // --- HEADER SCROLL EFFECT ---
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- SCROLL REVEAL (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    let revealHappened = false;
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                revealHappened = true;
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealElements.forEach(el => revealObserver.observe(el));

    // Fail-safe: if the observer never fires (e.g. unusual embed contexts), reveal all.
    setTimeout(function () {
        if (!revealHappened && revealElements.length) {
            revealElements.forEach(el => el.classList.add('active'));
        }
    }, 1400);

    // Fallback for elements already in viewport at load
    if ('IntersectionObserver' in window) {
        setTimeout(function () {
            revealElements.forEach(el => {
                const r = el.getBoundingClientRect();
                if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('active');
            });
        }, 200);
    } else {
        revealElements.forEach(el => el.classList.add('active'));
    }

    // --- STAGGERED ANIMATION ---
    document.querySelectorAll('.stagger-children').forEach(container => {
        container.querySelectorAll(':scope > .reveal').forEach((child, index) => {
            child.style.setProperty('--stagger-index', index);
        });
    });

    // --- COUNTER ANIMATION ---
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target, parseInt(entry.target.getAttribute('data-count'), 10));
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(el => counterObserver.observe(el));
    }
    function animateCounter(element, target) {
        let current = 0;
        const duration = 1600;
        const start = performance.now();
        function step(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            current = Math.floor(eased * target);
            element.textContent = current + '+';
            if (p < 1) requestAnimationFrame(step);
            else element.textContent = target + '+';
        }
        requestAnimationFrame(step);
    }

    // --- PROJECT FILTER ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card[data-category]');
    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.getAttribute('data-filter');
                projectCards.forEach(card => {
                    if (category === 'all' || (card.getAttribute('data-category') || '').split(' ').includes(category)) {
                        card.style.display = '';
                        card.style.animation = 'fadeInUp 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
        const style = document.createElement('style');
        style.textContent = '@keyframes fadeInUp { from { opacity:0; transform:translateY(20px);} to { opacity:1; transform:none;} }';
        document.head.appendChild(style);
    }

    // --- HAMBURGER MENU ---
    if (hamburgerButton && navigationWrapper) {
        hamburgerButton.addEventListener('click', function () {
            navigationWrapper.classList.toggle('open');
            hamburgerButton.setAttribute('aria-expanded', navigationWrapper.classList.contains('open'));
        });
        navigationWrapper.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) navigationWrapper.classList.remove('open');
            });
        });
    }

    // ===========================================
    //  I18N
    // ===========================================
    function setLanguage(lng) {
        i18next.changeLanguage(lng, (err) => {
            if (err) return console.error(err);
            updateContent();
            try { localStorage.setItem('portfolio-lang', lng); } catch (e) {}
        });
    }
    function updateContent() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            const val = i18next.t(key);
            if (val && val !== key) element.textContent = val;
        });
    }

    const resources = {
        pt: {
            translation: {
                "nav.inicio": "Início", "nav.projetos": "Projetos", "nav.sobre": "Sobre Mim",
                "hero.badge": "Disponível para oportunidades",
                "hero.title": "Olá, eu sou Lucas Oliveira!",
                "hero.role": "Fullstack Developer · Data Analyst · Game Dev",
                "hero.subtitle": "Transformo dados e ideias em produtos digitais — de dashboards e APIs a apps mobile e mods de jogos.",
                "hero.contact": "Entre em Contato", "hero.projects": "Ver Projetos",
                "stats.years": "Anos de Experiência", "stats.projects": "Projetos Entregues", "stats.techs": "Tecnologias Dominadas",
                "skills.kicker": "Stack", "skills.title": "Ferramentas e Tecnologias",
                "skills.frontend": "Frontend & Mobile", "skills.backend": "Backend & Database", "skills.data": "Dados, DevOps & Games",
                "projects.kicker": "Portfólio", "projects.feat": "Projetos em Destaque",
                "projects.page.title": "Meus Projetos", "projects.page.lead": "Web, mobile, análise de dados, APIs e modding de jogos.",
                "project.escolarbh.desc": "Plataforma de transporte escolar com web, API, app mobile e serviço de geolocalização.",
                "project.sorteio.title": "Sorteio Doce Veneno", "project.sorteio.desc": "App de sorteios integrado ao Instagram, com sorteio ao vivo e painel de estatísticas.",
                "project.stock.title": "Sistema Doce Veneno", "project.stock.desc": "Gestão de estoque e financeiro da loja, com dashboards.",
                "project.rpg.title": "Hystoria RPG", "project.rpg.desc": "Plataforma de fichas e campanhas de RPG Tormenta20.",
                "project.mm.desc": "Mod Java/NeoForge com novas criaturas, máquinas e mecânicas para Minecraft.",
                "project.profanidade.title": "M&M Profanidade", "project.profanidade.desc": "Mod de terror inspirado em The Broken Script: arquivos TXT e popups no desktop do jogador e um comunicador estilo TemPad com notificações.",
                "project.kubejs.title": "Modpack & Server Engineer", "project.kubejs.desc": "Modpack \"Entre Monstros e Máquinas\" (NeoForge 1.21.1): dezenas de scripts de gameplay, gating de crafting por FTB Quests e manutenção de servidor ativo.",
                "project.camerafix.title": "Camera Compat Fix", "project.camerafix.desc": "Mod NeoForge com Mixins para corrigir compatibilidade de câmera entre mods.",
                "project.arg.title": "ARG - Enigmas", "project.arg.desc": "Experiência interativa de mistério e puzzles com narrativa imersiva.",
                "project.ecomente.desc": "Plataforma educacional focada em sustentabilidade.",
                "project.xodarap.desc": "Site institucional para empresa de tecnologia.",
                "cat.fullstack": "Fullstack", "cat.data": "Data", "cat.frontend": "Frontend", "cat.gaming": "Gaming", "cat.mobile": "Mobile",
                "btn.details": "Ver Detalhes", "btn.viewAll": "Ver Todos os Projetos", "btn.back": "Voltar aos Projetos", "btn.visit": "Visitar",
                "experience.kicker": "Trajetória", "experience.title": "Experiência",
                "exp.doceveneno.date": "Atual", "exp.doceveneno.role": "Fullstack Developer, Administrator & Data Analyst",
                "exp.doceveneno.desc": "Sistema Fullstack para uma loja real: controle de estoque, financeiro e sorteios. Node.js, Express, PostgreSQL (Supabase), React e análise de dados em Power BI.",
                "exp.escolarbh.date": "2026", "exp.escolarbh.role": "Fullstack Developer (Web, API, Mobile & Geo)",
                "exp.escolarbh.desc": "Plataforma completa de transporte escolar: web em React/TS, API em Spring Boot (Kotlin), app mobile em React Native/Expo e microsserviço de geolocalização em Rust.",
                "exp.rpg.date": "Pessoal", "exp.rpg.title": "Hystoria RPG", "exp.rpg.role": "Fullstack Developer & UI/UX",
                "exp.rpg.desc": "Plataforma fullstack de campanhas de RPG e criação de fichas em React, Node e MongoDB Atlas.",
                "exp.games.date": "Game Dev", "exp.games.title": "Mods & Servidores de Minecraft", "exp.games.role": "Mod Developer & Server Engineer",
                "exp.games.desc": "Mods Java/NeoForge (Monstros e Máquinas, Camera Compat Fix) e expansões de gameplay com KubeJS, FTB Quests e gating de crafting em servidores ativos.",
                "education.k": "Ensino", "education.title": "Formação", "education.course": "Análise e Desenvolvimento de Sistemas", "education.date": "Janeiro 2023 - Fevereiro 2026", "education.desc": "Foco em engenharia de software, banco de dados e gestão de projetos tecnológicos.",
                "languages.k": "Idiomas", "languages.title": "Idiomas", "lang.pt": "Português", "lang.native": "Nativo", "lang.en": "Inglês", "lang.en.desc": "Imersão diária (documentação, mídia, comunicação)",
                "contact.kicker": "Contato", "contact.title": "Vamos Conversar?", "contact.text": "Estou aberto a novas oportunidades e colaborações. Entre em contato!",
                "footer.copyright": "© 2026 Lucas Oliveira. Todos os direitos reservados.",
                "filter.all": "Todos", "filter.fullstack": "Fullstack", "filter.mobile": "Mobile", "filter.frontend": "Frontend", "filter.data": "Data", "filter.gaming": "Gaming",
                "about.kicker": "Sobre", "about.title": "Sobre Mim",
                "about.p1": "Desenvolvedor Fullstack com base sólida em dados. Proficiente em SQL/PostgreSQL, Power BI e Python para análise, e experiente em construir produtos completos: front-end com React e TypeScript, back-end com Node.js/Express e Spring Boot (Kotlin), apps mobile com React Native (Expo) e até microsserviços em Rust.",
                "about.p2": "Além de desenvolvimento web/mobile, tenho forte atuação no universo de jogos: crio mods Java/NeoForge para Minecraft (Monstros e Máquinas, Camera Compat Fix), escrevo dezenas de scripts de gameplay com KubeJS em servidores ativos e cuido de skin mods para Deadlock (Source 2). Gosto de resolver problemas reais e entregar valor de ponta a ponta.",
                "about.values.k": "Valores", "about.values": "Diferenciais",
                "about.val1.title": "Pensamento Analítico", "about.val1.desc": "Transformo dados complexos em insights claros e acionáveis.",
                "about.val2.title": "Resolução de Problemas", "about.val2.desc": "Diagnostico e resolvo desafios técnicos de forma eficiente.",
                "about.val3.title": "Código Limpo", "about.val3.desc": "Foco em código mantível, documentado e bem estruturado.",
                "about.val4.title": "Aprendizado Contínuo", "about.val4.desc": "Sempre buscando novas tecnologias e melhores práticas.",
                "nav.criativo": "Criativo",
                "creative.kicker": "Além do Código", "creative.title": "Lado Criativo",
                "creative.lead": "Programação é só uma parte do que eu gosto de criar. Edição de vídeo, música, arte, mundo fictício e escrita — aqui está o que eu \"coiso\" por aí.",
                "creative.av.k": "Audiovisual", "creative.av.title": "Edição de Vídeo",
                "creative.av.lead": "Edições e experimentos visuais montados no Adobe Premiere Pro — de edições musicais a cineclipes dentro do Minecraft.",
                "cat.video": "Vídeo",
                "creative.v.violetta": "Cineclipe de ficção gravado dentro do Minecraft, contando a história de Violetta.",
                "creative.v.canfix": "Edição de ritmo e emoção com estética de mangá e legendas dramatizadas.",
                "creative.v.loverman": "Edição musical sincronizada ao ritmo, com cortes e transições marcados na batida.",
                "creative.v.lies": "Edição de clima e narrativa, brincando com cor e corte.",
                "creative.v.carlito": "Homenagem editada com carinho e sentido de humor.",
                "creative.music.k": "Áudio", "creative.music.title": "Música & Sound Design",
                "creative.music.lead": "Gravações, covers e efeitos sonoros — explorando som como mais uma forma de contar história.",
                "cat.audio": "Áudio",
                "creative.music.covers": "Gravações & Covers", "creative.music.covers.desc": "Gravações vocais e de instrumentos em estúdio, com edição e mixagem.",
                "creative.music.sfx": "Sound Design", "creative.music.sfx.desc": "Design de efeitos sonoros (como dados rolando) para uso em jogos e projetos.",
                "creative.art.k": "Arte", "creative.art.title": "Arte, Textura & 3D",
                "creative.art.lead": "Ilustração, pintura digital, logos, texturas e modelagem 3D — incluindo as artes do universo \"Monstros e Máquinas\".",
                "cat.art": "Arte",
                "creative.art.logos": "Logos & Identidade", "creative.art.logos.desc": "Criação de logos e identidade visual para os meus projetos e comunidades.",
                "creative.art.models": "Modelagem 3D (Blockbench)", "creative.art.models.desc": "Modelos 3D animáveis — criaturas e itens do mod Monstros e Máquinas.",
                "creative.art.painting": "Pintura Digital", "creative.art.painting.desc": "Artes e ilustrações digitais autorais (ex. \"Ruindade Pura\"), feitas no Photoshop.",
                "creative.mc.k": "Mundo", "creative.mc.title": "Minecraft & Experiências",
                "creative.mc.lead": "Modpacks temáticos e packs de textura que transformam o jogo em uma experiência própria.",
                "cat.game": "Game",
                "creative.mc.liminal": "Liminal Heinrich", "creative.mc.liminal.desc": "Modpack de experiência \"liminal\" — ambientes vazios e inquietantes com atmosfera própria.",
                "creative.mc.textures": "Packs de Textura", "creative.mc.textures.desc": "Texturas e tilesets que fazem parte da direção de arte dos meus mundos.",
                "creative.write.k": "Escrita", "creative.write.title": "Escrita Ficcional",
                "creative.write.lead": "Textos que compõem a história do meu universo — o pós-apocalíptico de \"Monstros e Máquinas\", o vírus \"Vazio\", a organização T.U.R. e os seus personagens. Cada peça tem sinopse em português e inglês.",
                "write.tomas.title": "A Escolha de Thomas", "write.tomas.meta": "Conto · Refúgios · ~760 palavras",
                "write.tomas.desc": "No 12º dia fora do Refúgio, alguém precisa ser enviado à morte — e uma voz se oferece no lugar de Thomas, quebrando a hierarquia de quem ele achava que seria escolhido.",
                "write.tur.title": "(Confidencial) Arquivos da T.U.R.", "write.tur.meta": "Dossiê · Worldbuilding · Kali e Rosellyne",
                "write.tur.desc": "Arquivos classificados da Tactical Unit for Restoration — a organização que mantém os Refúgios vivos, mas esconde mais do que o governo consegue controlar.",
                "write.valid.title": "Anotações sobre o VALID-71 (Dra. Carmine)", "write.valid.meta": "Registro · Diário científico · Dra. Carmine",
                "write.valid.desc": "A Dra. Carmine revela a verdade: o \"Vazio\" não é vírus nem magia — ele apaga a sua mente aos poucos e, ao terminar de consumir uma pessoa, assume a consciência dela.",
                "write.garden.title": "O Jardim da Criação", "write.garden.meta": "Conto · Laboratório Jardim da Criação",
                "write.garden.desc": "Dias no Jardim da Criação: a relação entre a mestra Violetta e Rosellyne enquanto correm contra as exigências abusivas da T.U.R. para deter o Vazio.",
                "write.ignota.title": "Memória Ignota", "write.ignota.meta": "Experiencial · Segunda pessoa · Limbo",
                "write.ignota.desc": "Você acorda num limbo, em uma floresta que nunca viu, guiado por uma respiração e gemidos de dor distantes — uma história em segunda pessoa sobre memória e medo.",
                "write.limiar.title": "O Limiar do Impossível", "write.limiar.meta": "Conto · Expedição · Flynt, Thomas e Rin",
                "write.limiar.desc": "Flynt Guinevere lidera a equipe em uma expedição ao que foi ensinado como sentença de morte — numa subida onde cada segundo ecoa o temor do \"Vazio\", que é atraído pelo som.",
                "write.ultima.title": "Uma Última Vez.", "write.ultima.meta": "Conto · Assimilação · Violetta",
                "write.ultima.desc": "Sobre o destino cruel da assimilação: Violetta sente a mente sendo dominada por algo que não compreende e começa a apagar a própria memória para resistir.",
                "write.petala.title": "Violetta e sua última pétala.", "write.petala.meta": "Conto-longo · Confronto · ~4100 palavras",
                "write.petala.desc": "O confronto final: \"Ele\" deixa a sombra e ganha voz, vinhas surgem do chão para prender Violetta — e a ironia cósmica cobra o seu preço.",
                "project.mm.title": "Monstros e Máquinas",
                "vtitle.violetta": "Violetta",
                "vtitle.demo": "Demonstração - Monstros e Máquinas",
                "vtitle.canfix": "Eu posso consertar você, Roselynne",
                "vtitle.loverman": "Dreamgarden - Edit",
                "vtitle.lies": "Que piada cósmica você é, Arquivista",
                "vtitle.carlito": "Obrigado pelo esforço, Carlito",
                "watch": "Assistir no YouTube",
                "v.demo.desc": "Trailer e demonstração do mod Monstros e Máquinas para Minecraft.",
                "ler": "Ler", "readBack": "Voltar à Biblioteca",
                "write.corredor.title": "O Corredor", "write.corredor.meta": "Experiencial · 2ª pessoa · Liminal",
                "write.corredor.desc": "Em segunda pessoa: você está de novo no mesmo corredor, e os passos atrás de você nunca deixam de se aproximar.",
                "write.collab.title": "Collab com a T.U.R.", "write.collab.meta": "Collab · Expedição · Hitsuna Akane",
                "write.collab.desc": "Hitsuna Akane documenta 45 dias fora do Refúgio numa collab da T.U.R. — até o Dia 27 deixar de ser apenas um vlog.",
                "write.diario.title": "Diário 1 - Grupo de Expedição", "write.diario.meta": "Diário · Expedição · Refúgio Cigarra",
                "write.diario.desc": "O diário do grupo que saiu do Refúgio Cigarra após 2.740 anos — os Dias 1, 2 e 4 de exploração de um mundo em ruínas."
            }
        },
        en: {
            translation: {
                "nav.inicio": "Home", "nav.projetos": "Projects", "nav.sobre": "About Me",
                "hero.badge": "Open to opportunities",
                "hero.title": "Hello, I'm Lucas Oliveira!",
                "hero.role": "Fullstack Developer · Data Analyst · Game Dev",
                "hero.subtitle": "Turning data and ideas into digital products — from dashboards and APIs to mobile apps and game mods.",
                "hero.contact": "Contact Me", "hero.projects": "View Projects",
                "stats.years": "Years of Experience", "stats.projects": "Projects Delivered", "stats.techs": "Technologies Mastered",
                "skills.kicker": "Stack", "skills.title": "Tools and Technologies",
                "skills.frontend": "Frontend & Mobile", "skills.backend": "Backend & Database", "skills.data": "Data, DevOps & Games",
                "projects.kicker": "Portfolio", "projects.feat": "Featured Projects",
                "projects.page.title": "My Projects", "projects.page.lead": "Web, mobile, data analysis, APIs and game modding.",
                "project.escolarbh.desc": "School transport platform with web, API, mobile app and geolocation service.",
                "project.sorteio.title": "Doce Veneno Giveaway", "project.sorteio.desc": "Giveaway app integrated with Instagram, with live draw and stats dashboard.",
                "project.stock.title": "Doce Veneno System", "project.stock.desc": "Store inventory and financial management with dashboards.",
                "project.rpg.title": "Hystoria RPG", "project.rpg.desc": "Tormenta20 character sheet and campaign platform.",
                "project.mm.desc": "Java/NeoForge mod with new creatures, machines and mechanics for Minecraft.",
                "project.profanidade.title": "M&M Profanidade", "project.profanidade.desc": "Horror mod inspired by The Broken Script: TXT files and popups on the player's desktop and a TemPad-style communicator with notifications.",
                "project.kubejs.title": "Modpack & Server Engineer", "project.kubejs.desc": "\"Entre Monstros e Máquinas\" modpack (NeoForge 1.21.1): dozens of gameplay scripts, FTB Quests crafting gating and live server maintenance.",
                "project.camerafix.title": "Camera Compat Fix", "project.camerafix.desc": "NeoForge mod with Mixins to fix camera compatibility between mods.",
                "project.arg.title": "ARG - Puzzle", "project.arg.desc": "Interactive mystery experience with immersive narrative and puzzles.",
                "project.ecomente.desc": "Educational platform focused on sustainability.",
                "project.xodarap.desc": "Corporate website for a technology company.",
                "cat.fullstack": "Fullstack", "cat.data": "Data", "cat.frontend": "Frontend", "cat.gaming": "Gaming", "cat.mobile": "Mobile",
                "btn.details": "View Details", "btn.viewAll": "View All Projects", "btn.back": "Back to Projects", "btn.visit": "Visit",
                "experience.kicker": "Journey", "experience.title": "Experience",
                "exp.doceveneno.date": "Current", "exp.doceveneno.role": "Fullstack Developer, Administrator & Data Analyst",
                "exp.doceveneno.desc": "Fullstack system for a real store: inventory control, finance and giveaways. Node.js, Express, PostgreSQL (Supabase), React and Power BI data analysis.",
                "exp.escolarbh.date": "2026", "exp.escolarbh.role": "Fullstack Developer (Web, API, Mobile & Geo)",
                "exp.escolarbh.desc": "Complete school transport platform: React/TS web, Spring Boot (Kotlin) API, React Native/Expo mobile app and a Rust geolocation microservice.",
                "exp.rpg.date": "Personal", "exp.rpg.title": "Hystoria RPG", "exp.rpg.role": "Fullstack Developer & UI/UX",
                "exp.rpg.desc": "Fullstack platform for RPG campaigns and character sheets built with React, Node and MongoDB Atlas.",
                "exp.games.date": "Game Dev", "exp.games.title": "Minecraft Mods & Servers", "exp.games.role": "Mod Developer & Server Engineer",
                "exp.games.desc": "Java/NeoForge mods (Monsters and Machines, Camera Compat Fix) and gameplay expansions with KubeJS, FTB Quests and crafting gating on live servers.",
                "education.k": "Education", "education.title": "Education", "education.course": "Analysis and Systems Development", "education.date": "January 2023 - February 2026", "education.desc": "Focus on software engineering, databases and technological project management.",
                "languages.k": "Languages", "languages.title": "Languages", "lang.pt": "Portuguese", "lang.native": "Native", "lang.en": "English", "lang.en.desc": "Daily immersion (documentation, media, communication)",
                "contact.kicker": "Contact", "contact.title": "Let's Talk?", "contact.text": "I'm always open to new opportunities and collaborations. Get in touch!",
                "footer.copyright": "© 2026 Lucas Oliveira. All rights reserved.",
                "filter.all": "All", "filter.fullstack": "Fullstack", "filter.mobile": "Mobile", "filter.frontend": "Frontend", "filter.data": "Data", "filter.gaming": "Gaming",
                "about.kicker": "About", "about.title": "About Me",
                "about.p1": "Fullstack Developer with a solid data foundation. Proficient in SQL/PostgreSQL, Power BI and Python for analysis, and experienced building complete products: React + TypeScript front-ends, Node.js/Express and Spring Boot (Kotlin) back-ends, React Native (Expo) mobile apps and even Rust microservices.",
                "about.p2": "Beyond web/mobile development, I'm deeply engaged in the gaming world: I build Java/NeoForge mods for Minecraft (Monsters and Machines, Camera Compat Fix), write dozens of KubeJS gameplay scripts on live servers, and maintain skin mods for Deadlock (Source 2). I enjoy solving real problems and delivering end-to-end value.",
                "about.values.k": "Values", "about.values": "Differentials",
                "about.val1.title": "Analytical Thinking", "about.val1.desc": "Transform complex data into clear, actionable insights.",
                "about.val2.title": "Problem Solving", "about.val2.desc": "Diagnose and solve technical challenges efficiently.",
                "about.val3.title": "Clean Code", "about.val3.desc": "Focus on maintainable, documented, and well-structured code.",
                "about.val4.title": "Continuous Learning", "about.val4.desc": "Always seeking new technologies and best practices.",
                "nav.criativo": "Creative",
                "creative.kicker": "Beyond Code", "creative.title": "Creative Side",
                "creative.lead": "Programming is just one part of what I love to create. Video editing, music, art, a fictional world and writing — here's the stuff I make on the side.",
                "creative.av.k": "Video", "creative.av.title": "Video Editing",
                "creative.av.lead": "Visual edits and experiments put together in Adobe Premiere Pro — from music edits to short films shot inside Minecraft.",
                "cat.video": "Video",
                "creative.v.violetta": "A fiction short shot inside Minecraft, telling Violetta's story.",
                "creative.v.canfix": "A rhythm-and-emotion edit with manga aesthetics and dramatic subtitles.",
                "creative.v.loverman": "A music edit synced to the beat, with cuts and transitions on tempo.",
                "creative.v.lies": "A mood-driven edit playing with color and pacing.",
                "creative.v.carlito": "A tribute cut with care and a sense of humor.",
                "creative.music.k": "Audio", "creative.music.title": "Music & Sound Design",
                "creative.music.lead": "Recordings, covers and sound effects — exploring sound as another way to tell a story.",
                "cat.audio": "Audio",
                "creative.music.covers": "Recordings & Covers", "creative.music.covers.desc": "Studio vocal and instrument recordings, with editing and mixing.",
                "creative.music.sfx": "Sound Design", "creative.music.sfx.desc": "Sound effects design (like rolling dice) for use in games and projects.",
                "creative.art.k": "Art", "creative.art.title": "Art, Texture & 3D",
                "creative.art.lead": "Illustration, digital painting, logos, textures and 3D modeling — including artwork from the 'Monsters and Machines' universe.",
                "cat.art": "Art",
                "creative.art.logos": "Logos & Identity", "creative.art.logos.desc": "Logo and visual identity work for my projects and communities.",
                "creative.art.models": "3D Modeling (Blockbench)", "creative.art.models.desc": "Animatable 3D models — creatures and items from the Monsters and Machines mod.",
                "creative.art.painting": "Digital Painting", "creative.art.painting.desc": "Original digital art and illustrations (e.g. 'Pure Mischief'), made in Photoshop.",
                "creative.mc.k": "World", "creative.mc.title": "Minecraft & Experiences",
                "creative.mc.lead": "Themed modpacks and texture packs that turn the game into a unique experience.",
                "cat.game": "Game",
                "creative.mc.liminal": "Liminal Heinrich", "creative.mc.liminal.desc": "A 'liminal' experience modpack — empty, unsettling environments with their own atmosphere.",
                "creative.mc.textures": "Texture Packs", "creative.mc.textures.desc": "Textures and tilesets that shape the art direction of my worlds.",
                "creative.write.k": "Writing", "creative.write.title": "Fiction Writing",
                "creative.write.lead": "Stories that make up my universe — the post-apocalypse of 'Monsters and Machines', the 'Void' virus, the T.U.R. organization and its characters. Each piece has a synopsis in English (and Portuguese).",
                "write.tomas.title": "Thomas's Choice", "write.tomas.meta": "Short story · Shelters · ~760 words",
                "write.tomas.desc": "On the 12th day outside the Shelter, someone must be sent to their death — and a voice volunteers in Thomas's place, breaking the hierarchy of the one he thought would be chosen.",
                "write.tur.title": "(Confidential) T.U.R. Files", "write.tur.meta": "Dossier · Worldbuilding · Kali and Rosellyne",
                "write.tur.desc": "Classified files from the Tactical Unit for Restoration — the organization that keeps the Shelters alive but hides more than the government can control.",
                "write.valid.title": "Notes on VALID-71 (Dr. Carmine)", "write.valid.meta": "Log · Scientific journal · Dr. Carmine",
                "write.valid.desc": "Dr. Carmine reveals the truth: the 'Void' is neither a virus nor magic — it slowly erases your mind and, once it finishes consuming a person, takes over their consciousness.",
                "write.garden.title": "The Garden of Creation", "write.garden.meta": "Short story · Garden of Creation Lab",
                "write.garden.desc": "Days in the Garden of Creation: the bond between master Violetta and Rosellyne as they race against the T.U.R.'s crushing demands to stop the Void.",
                "write.ignota.title": "Unknown Memory", "write.ignota.meta": "Experiential · Second person · Limbo",
                "write.ignota.desc": "You wake in a limbo, in a forest you've never seen, guided by a distant breath and groans of pain — a second-person story about memory and fear.",
                "write.limiar.title": "The Threshold of the Impossible", "write.limiar.meta": "Short story · Expedition · Flynt, Thomas and Rin",
                "write.limiar.desc": "Flynt Guinevere leads the team into what was taught as a death sentence — an ascent where every second echoes the dread of the 'Void', which is drawn to sound.",
                "write.ultima.title": "One Last Time.", "write.ultima.meta": "Short story · Assimilation · Violetta",
                "write.ultima.desc": "On the cruel fate of assimilation: Violetta feels her mind being taken over by something she can't understand and begins erasing her own memory to resist.",
                "write.petala.title": "Violetta and her last petal.", "write.petala.meta": "Long story · Confrontation · ~4100 words",
                "write.petala.desc": "The final confrontation: 'He' steps out of the shadows and gains a voice, vines rise from the ground to seize Violetta — and cosmic irony takes its toll.",
                "project.mm.title": "Monster&Machines",
                "vtitle.violetta": "Violetta",
                "vtitle.demo": "Monsters & Machines - Demo",
                "vtitle.canfix": "I can fix you, Roselynne",
                "vtitle.loverman": "Dreamgarden - Edit",
                "vtitle.lies": "What a cosmic joke you are, Archivist",
                "vtitle.carlito": "Thanks for the effort, Carlito",
                "watch": "Watch on YouTube",
                "v.demo.desc": "Trailer and demo of the Monsters & Machines mod for Minecraft.",
                "ler": "Read", "readBack": "Back to Library",
                "write.corredor.title": "The Corridor", "write.corredor.meta": "Experiential · Second person · Liminal",
                "write.corredor.desc": "In second person: you find yourself again in the same corridor, and the footsteps behind you never stop closing in.",
                "write.collab.title": "Collab with the T.U.R.", "write.collab.meta": "Collab · Expedition · Hitsuna Akane",
                "write.collab.desc": "Hitsuna Akane documents 45 days outside the Shelter on a T.U.R. collab — until Day 27 stops being just a vlog.",
                "write.diario.title": "Diary 1 - Expedition Group", "write.diario.meta": "Diary · Expedition · Cigarra Shelter",
                "write.diario.desc": "The diary of the group that left the Cigarra Shelter after 2,740 years — Days 1, 2 and 4 of exploring a world in ruins."
            }
        }
    };

    i18next.init({
        lng: 'pt',
        fallbackLng: 'pt',
        debug: false,
        resources: resources
    }, (err) => {
        if (err) return console.error(err);
        let saved = 'pt';
        try { saved = localStorage.getItem('portfolio-lang') || 'pt'; } catch (e) {}
        if (languageSelect) languageSelect.value = saved;
        setLanguage(saved);
    });

    if (languageSelect) {
        languageSelect.addEventListener('change', function () {
            setLanguage(this.value);
        });
    }
});
