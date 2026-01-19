document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const glowContainer = document.querySelector('.mouse-glow');
    const videoBg = document.querySelector('.video-background');

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
