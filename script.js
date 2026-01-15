// script.js - Gestion globale

document.addEventListener('DOMContentLoaded', () => {
    
    /* --- EFFET LUEUR SOURIS (Mouse Glow) --- */
    const body = document.body;
    // On vérifie si le div existe sur la page avant de lancer le script
    const glowContainer = document.querySelector('.mouse-glow');

    if (glowContainer) {
        document.addEventListener('mousemove', (e) => {
            // Récupère les coordonnées X et Y de la souris
            const x = e.clientX;
            const y = e.clientY;

            // Met à jour les variables CSS pour déplacer le dégradé
            body.style.setProperty('--mouse-x', `${x}px`);
            body.style.setProperty('--mouse-y', `${y}px`);
        });
    }
});
