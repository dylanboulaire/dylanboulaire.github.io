document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const glowContainer = document.querySelector('.mouse-glow');
    const videoBg = document.querySelector('.video-background');
    const themeToggle = document.querySelector('.theme-toggle');

    // --- THEME TOGGLE ---
    // Récupérer le mode sauvegardé ou utiliser 'dark' par défaut
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        updateThemeIcon();
    }

    // Gestion du clic sur le bouton de basculement
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            
            // Sauvegarder le préférence
            const isLightMode = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
            
            // Mettre à jour l'icône
            updateThemeIcon();
        });
    }

    function updateThemeIcon() {
        const isLightMode = body.classList.contains('light-mode');
        themeToggle.innerHTML = isLightMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    // --- MOUSE GLOW EFFECT ---
    if (glowContainer) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            body.style.setProperty('--mouse-x', `${x}px`);
            body.style.setProperty('--mouse-y', `${y}px`);
        });

        // Cache la lueur sur la vidéo d'accueil quand on est tout en haut
        if (videoBg) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > window.innerHeight * 0.5) {
                    glowContainer.style.opacity = '1';
                } else {
                    glowContainer.style.opacity = '0';
                }
            });
        }
    }
});
