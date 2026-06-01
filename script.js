document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const glowContainer = document.querySelector('.mouse-glow');
    const videoBg = document.querySelector('.video-background');
    const themeToggle = document.querySelector('.theme-toggle');

    // --- THEME TOGGLE ---
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
    }
    updateThemeIcon();

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLightMode = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
            updateThemeIcon();
        });
    }

    function updateThemeIcon() {
        if (!themeToggle) return;
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

// --- MODAL KEYBOARD & TOUCH NAVIGATION ---
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    
    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!modal || !modal.classList.contains('open')) return;
        
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            moveSlide(-1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            moveSlide(1);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            closeModal();
        }
    });

    // Touch Swipe Navigation
    let touchStart = 0;
    let touchEnd = 0;

    const modalViewer = document.querySelector('.modal-viewer');
    if (modalViewer) {
        modalViewer.addEventListener('touchstart', (e) => {
            touchStart = e.changedTouches[0].clientX;
        }, false);

        modalViewer.addEventListener('touchend', (e) => {
            touchEnd = e.changedTouches[0].clientX;
            handleSwipe();
        }, false);

        function handleSwipe() {
            const diff = touchStart - touchEnd;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    moveSlide(1); // Swipe left → next
                } else {
                    moveSlide(-1); // Swipe right → prev
                }
            }
        }
    }
});