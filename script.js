document.addEventListener('DOMContentLoaded', () => {
    // --- DATA & STATE ---
    const experiences = [
        { id: 'saurashtra', url: 'https://totaloutfit.netlify.app/', title: 'The Playful Boy of Saurashtra', description: 'This vibrant Kediyu and Dhoti set represents the playful, energetic spirit of Saurashtra\'s youth.', fact: 'The Kediyu\'s frock-like flare, known as \'angarkhu\', was designed for complete freedom of movement during energetic folk dances like Garba.' },
        { id: 'patan', url: 'https://gagagra.netlify.app/', title: 'The Elegant Woman of Patan', description: 'Experience the royal elegance of North Gujarat, inspired by the world-renowned Patola silk weavings.', fact: 'A genuine Patola saree from Patan is a "double ikat" weave, a highly complex process where patterns are so precise they appear identical on both sides.' },
        { id: 'kutch', url: 'https://kutchturban.netlify.app/', title: 'The Artisan Man of Kutch', description: 'This style showcases the pride of Kutchi craftsmen, famous for their majestic Pagdi and rich mirror work embroidery.', fact: 'The intricate mirror work in Kutchi attire, called \'Abhla Bharat\', was traditionally believed to ward off the evil eye by reflecting it away.' }
    ];
    let currentIndex = 0;
    let isPlacingBindi = false;

    // --- ELEMENT REFERENCES ---
    const welcomeScreen = document.getElementById('welcome-screen');
    const appContainer = document.getElementById('app-container');
    const startBtn = document.getElementById('start-btn');
    const arIframe = document.getElementById('ar-iframe');
    const loaderOverlay = document.getElementById('loader-overlay');
    const loaderFactText = document.getElementById('loader-fact-text');
    const titleEl = document.getElementById('experience-title');
    const descriptionEl = document.getElementById('experience-description');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const stepCounter = document.getElementById('step-counter');
    const floatingAssetContainer = document.getElementById('floating-asset-container');
    const backgroundRangoliContainer = document.getElementById('background-rangoli-container');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    const dancerContainer = document.getElementById('dancer-container');
    const trailContainer = document.getElementById('cursor-trail-container');

    // --- ADVANCED INTERACTIVITY ---
    function makeDraggable(element) {
        let isDragging = false;
        let startX, startY, velX = 0, velY = 0, lastX, lastY;
        const startPos = { x: element.offsetLeft, y: element.offsetTop };

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            element.classList.add('dragging');
            startX = e.clientX - element.offsetLeft;
            startY = e.clientY - element.offsetTop;
            lastX = e.clientX;
            lastY = e.clientY;
            e.preventDefault();
            e.stopPropagation();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const newX = e.clientX - startX;
            const newY = e.clientY - startY;
            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
            
            velX = e.clientX - lastX;
            velY = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            element.classList.remove('dragging');

            let inertia = setInterval(() => {
                velX *= 0.92; // Damping factor
                velY *= 0.92;
                element.style.left = `${element.offsetLeft + velX}px`;
                element.style.top = `${element.offsetTop + velY}px`;
                if (Math.abs(velX) < 0.1 && Math.abs(velY) < 0.1) {
                    clearInterval(inertia);
                    element.style.transition = 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
                    element.style.left = `${startPos.x}px`;
                    element.style.top = `${startPos.y}px`;
                    setTimeout(() => element.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease', 500);
                }
            }, 16);
        });
    }

    const dandiya = document.getElementById('dandiya-interactive');
    const rangoli = document.getElementById('rangoli-interactive');
    makeDraggable(dandiya);
    makeDraggable(rangoli);

    dandiya.addEventListener('click', (e) => {
        if (dandiya.classList.contains('dragging')) return;
        dandiya.classList.add('hit');
        dandiya.addEventListener('animationend', () => {
            dandiya.classList.remove('hit');
        }, { once: true });
    });

    const rangoliColors = [
        { p1: '#e74c3c', p2: '#f1c40f', p3: '#f39c12'}, { p1: '#3498db', p2: '#9b59b6', p3: '#8e44ad'},
        { p1: '#2ecc71', p2: '#1abc9c', p3: '#16a085'}, { p1: '#e67e22', p2: '#d35400', p3: '#f39c12'}
    ];
    let rangoliColorIndex = 0;
    const rangoliSpinGroup = rangoli.querySelector('.rangoli-spin-group');
    rangoli.addEventListener('click', (e) => {
        if (rangoli.classList.contains('dragging')) return;
        rangoliColorIndex = (rangoliColorIndex + 1) % rangoliColors.length;
        const newPalette = rangoliColors[rangoliColorIndex];
        rangoli.querySelectorAll('.rangoli-part-1').forEach(el => el.style.fill = newPalette.p1);
        rangoli.querySelectorAll('.rangoli-part-2').forEach(el => el.style.fill = newPalette.p2);
        rangoli.querySelectorAll('.rangoli-part-3').forEach(el => el.style.stroke = newPalette.p3);
        
        rangoliSpinGroup.classList.add('spin');
        rangoliSpinGroup.addEventListener('animationend', () => {
            rangoliSpinGroup.classList.remove('spin');
        }, { once: true });
    });

    const bindiPalette = document.getElementById('bindi-palette');
    bindiPalette.addEventListener('click', (e) => {
        e.stopPropagation();
        isPlacingBindi = !isPlacingBindi;
        bindiPalette.classList.toggle('active');
        welcomeScreen.style.cursor = isPlacingBindi ? 'crosshair' : 'default';
    });

    welcomeScreen.addEventListener('click', (e) => {
        if (!isPlacingBindi) return;
        if (e.target.closest('.draggable-asset, #bindi-palette, #start-btn, h1, p')) return;
        const bindi = document.createElement('div');
        bindi.className = 'placed-bindi';
        bindi.style.left = `${e.clientX}px`;
        bindi.style.top = `${e.clientY}px`;
        welcomeScreen.appendChild(bindi);
        isPlacingBindi = false;
        bindiPalette.classList.remove('active');
        welcomeScreen.style.cursor = 'default';
    });
    
    function createFloatingAssets() {
        const assets = [
            `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="10" fill="#E74C3C"/><path d="M50 10 L 63 37 L 90 37 L 70 55 L 78 85 L 50 68 L 22 85 L 30 55 L 10 37 L 37 37 Z" fill="#F39C12" opacity="0.8"/></svg>`,
            `<svg viewBox="0 0 100 100"><g><path d="M10 80 Q 50 100, 90 80 Q 50 70, 10 80 Z" fill="#E74C3C"></path><path d="M45 75 Q 50 50, 55 75 Q 50 70, 45 75 Z" fill="#FFD700"></path></g></svg>`,
            `<svg viewBox="0 0 100 100"><path d="M10 90 L90 10" stroke="#c0392b" stroke-width="6" stroke-linecap="round"></path></svg>`
        ];
        for (let i = 0; i < 40; i++) {
            const el = document.createElement('div');
            el.className = 'floating-asset';
            el.innerHTML = assets[Math.floor(Math.random() * assets.length)];
            const size = Math.random() * 40 + 20;
            el.style.width = `${size}px`; el.style.height = `${size}px`;
            el.style.left = `${Math.random() * 100}%`;
            el.style.animationDelay = `${Math.random() * 20}s`;
            el.style.animationDuration = `${Math.random() * 15 + 15}s`;
            floatingAssetContainer.appendChild(el);
        }
    }
    
    function createAnimatedDancers() {
        const dancerSVG = `<svg viewBox="0 0 100 100"><path d="M50 20 C 40 20, 35 30, 35 40 L 65 40 C 65 30, 60 20, 50 20 Z" fill="#f1c40f"/><path d="M35 40 L 65 40 L 70 80 L 30 80 Z" fill="#e74c3c"/></svg>`;
        for(let i=0; i<5; i++) {
            const d = document.createElement('div');
            d.className = 'garba-dancer';
            d.innerHTML = dancerSVG;
            d.style.left = `${i * 20 + 5}%`;
            d.style.animationDelay = `${Math.random() * 2}s`;
            dancerContainer.appendChild(d);
        }
    }
    
    function createBackgroundRangoli() {
        const svg = `<svg viewBox="0 0 200 200"><defs><radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" /><stop offset="100%" style="stop-color:rgb(255,165,0);stop-opacity:1" /></radialGradient></defs><g stroke="#E74C3C" stroke-width="2" fill="none">${Array.from({length: 12}).map((_, i) => `<path d="M100 100 L 100 10" transform="rotate(${i * 30} 100 100)"/>`).join('')}<circle cx="100" cy="100" r="90" stroke-width="1"/><circle cx="100" cy="100" r="60" stroke-width="1"/><circle cx="100" cy="100" r="30" stroke-width="1" fill="url(#grad1)"/></g></svg>`;
        backgroundRangoliContainer.innerHTML = svg;
    }
    
    welcomeScreen.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 2;
        const y = (clientY / window.innerHeight - 0.5) * 2;
        parallaxLayers.forEach((layer, index) => {
            const strength = (index + 1) * 8;
            layer.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
    });
    
    document.addEventListener('mousemove', e => {
        const trail = document.createElement('div');
        trail.className = 'trail';
        trail.style.left = `${e.pageX}px`;
        trail.style.top = `${e.pageY}px`;
        const size = Math.random() * 8 + 2;
        trail.style.width = `${size}px`; trail.style.height = `${size}px`;
        trailContainer.appendChild(trail);
        setTimeout(() => trail.remove(), 500);
    });

    function updateExperience(index) {
        if (index < 0 || index >= experiences.length) return;
        currentIndex = index;
        const experience = experiences[index];
        loaderOverlay.style.opacity = '1';
        loaderOverlay.style.display = 'flex';
        loaderFactText.textContent = experience.fact;
        arIframe.style.visibility = 'hidden';
        arIframe.src = 'about:blank';
        setTimeout(() => arIframe.src = experience.url, 100);
        titleEl.textContent = experience.title;
        descriptionEl.textContent = experience.description;
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === experiences.length - 1;
        stepCounter.textContent = `Step ${index + 1} of ${experiences.length}`;
    }
    
    arIframe.addEventListener('load', () => {
        setTimeout(() => {
            loaderOverlay.style.opacity = '0';
            arIframe.style.visibility = 'visible';
            setTimeout(() => loaderOverlay.style.display = 'none', 500);
        }, 12000); 
    });

    startBtn.addEventListener('click', () => {
        const welcome = document.getElementById('welcome-screen');
        welcome.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        welcome.style.opacity = '0';
        welcome.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            welcome.style.display = 'none';
            appContainer.style.display = 'flex';
            appContainer.classList.add('fade-in');
            updateExperience(0);
        }, 500);
    });

    nextBtn.addEventListener('click', () => updateExperience(currentIndex + 1));
    prevBtn.addEventListener('click', () => updateExperience(currentIndex - 1));

    function initialize() {
        createFloatingAssets();
        createAnimatedDancers();
        createBackgroundRangoli();
        setTimeout(() => { document.body.classList.add('loaded'); }, 200);
    }
    initialize();
});