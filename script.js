document.addEventListener('DOMContentLoaded', () => {
    
    const body = document.body;
    const glowContainer = document.querySelector('.mouse-glow');
    const videoBg = document.querySelector('.video-background');

    // 1. Suivi de la souris
    if (glowContainer) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            body.style.setProperty('--mouse-x', `${x}px`);
            body.style.setProperty('--mouse-y', `${y}px`);
        });

        // 2. Logique Spéciale Accueil : Cacher lueur sur la vidéo
        if (videoBg) {
            // On est sur l'accueil
            glowContainer.style.opacity = '0'; // Caché par défaut en haut

            window.addEventListener('scroll', () => {
                // Si on a scrollé de plus de la moitié de l'écran (vers la galerie noire)
                if (window.scrollY > window.innerHeight * 0.5) {
                    glowContainer.style.opacity = '1'; // Affiche la lueur
                } else {
                    glowContainer.style.opacity = '0'; // Cache la lueur sur la vidéo
                }
            });
        } else {
            // Sur les autres pages (Contact, Bio...), toujours visible
            glowContainer.style.opacity = '1';
        }
    }
});
