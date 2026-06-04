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

    // --- BURGER MENU ---
    const burger = document.querySelector('.burger-menu');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLeft = document.querySelector('.nav-left');

    if (burger) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            navOverlay.classList.toggle('open');
            body.classList.toggle('nav-open');
        });

        // Close on nav link click
        document.querySelectorAll('.nav-overlay a, .nav-overlay [onclick]').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navOverlay.classList.remove('open');
                body.classList.remove('nav-open');
            });
        });
    }

    // Close nav overlay on outside click
    if (navOverlay) {
        navOverlay.addEventListener('click', (e) => {
            if (e.target === navOverlay) {
                burger.classList.remove('active');
                navOverlay.classList.remove('open');
                body.classList.remove('nav-open');
            }
        });
    }

    // --- SCROLL REVEAL ANIMATIONS ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        revealObserver.observe(el);
    });

    // Stagger project cards reveal
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('card-revealed');
                }, entry.target.dataset.delay || 0);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    function observeCards() {
        document.querySelectorAll('.project-card').forEach((card, i) => {
            card.dataset.delay = i * 80;
            cardObserver.observe(card);
        });
    }
    // Re-run when grid is populated
    setTimeout(observeCards, 200);

    // --- HEADER SCROLL SHRINK ---
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- KONAMI/SECRET: click logo 5 times to open cinema quiz ---
    const logoLink = document.querySelector('.logo-center a');
    let logoClicks = 0;
    let logoTimer;
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            if (window.location.pathname.includes('index') || window.location.pathname === '/' || window.location.pathname === '') {
                e.preventDefault();
                logoClicks++;
                clearTimeout(logoTimer);
                logoTimer = setTimeout(() => { logoClicks = 0; }, 2000);
                if (logoClicks >= 5) {
                    logoClicks = 0;
                    openCinemaQuiz();
                }
            }
        });
    }
});

// --- MODAL KEYBOARD & TOUCH NAVIGATION ---
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    
    document.addEventListener('keydown', (e) => {
        if (!modal || !modal.classList.contains('open')) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); moveSlide(-1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); moveSlide(1); }
        else if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
    });

    let touchStart = 0;
    let touchEnd = 0;
    const modalViewer = document.querySelector('.modal-viewer');
    if (modalViewer) {
        modalViewer.addEventListener('touchstart', (e) => { touchStart = e.changedTouches[0].clientX; }, false);
        modalViewer.addEventListener('touchend', (e) => { touchEnd = e.changedTouches[0].clientX; handleSwipe(); }, false);
        function handleSwipe() {
            const diff = touchStart - touchEnd;
            if (Math.abs(diff) > 50) { diff > 0 ? moveSlide(1) : moveSlide(-1); }
        }
    }
});

// ======================================================
// CINEMA QUIZ GAME
// ======================================================
const cinemaQuizData = [
    {
        question: "Quel film a popularisé le terme 'jump cut' grâce à sa révolution du montage ?",
        answers: ["À bout de souffle", "Citizen Kane", "8½", "Metropolis"],
        correct: 0,
        fact: "Jean-Luc Godard a révolutionné le montage dans 'À bout de souffle' (1960) en utilisant le jump cut de manière délibérée."
    },
    {
        question: "La règle des 180° au cinéma sert à...",
        answers: ["Conserver la cohérence spatiale entre les personnages", "Limiter les mouvements de caméra", "Définir la focale idéale", "Cadrer le sujet au centre"],
        correct: 0,
        fact: "La règle des 180° garantit que les personnages restent du même côté de l'écran, évitant la désorientation spatiale du spectateur."
    },
    {
        question: "Quel format d'aspect est typique du cinéma 'scope' (anamorphique) ?",
        answers: ["2.39:1", "16:9", "4:3", "1.85:1"],
        correct: 0,
        fact: "Le format 2.39:1 (CinemaScope) donne cet aspect ultra-panoramique si reconnaissable dans les grands films hollywoodiens."
    },
    {
        question: "Le codec H.264 est recommandé pour les vidéos car...",
        answers: ["Il offre le meilleur ratio qualité/poids", "Il est le seul lisible sur YouTube", "Il n'existe pas de compression", "Il produit des fichiers RAW"],
        correct: 0,
        fact: "H.264 (AVC) reste le standard universel de diffusion grâce à son excellent compromis qualité/compression et sa compatibilité maximale."
    },
    {
        question: "Dans Adobe Premiere, quelle touche permet de couper un clip sans outil supplémentaire ?",
        answers: ["Ctrl+K (ou Cmd+K)", "C puis Entrée", "X", "Alt+Suppr"],
        correct: 0,
        fact: "Ctrl+K / Cmd+K est le raccourci 'Add Edit' de Premiere Pro : il coupe le clip à la position de la tête de lecture."
    },
    {
        question: "Quelle ouverture (f-stop) donne la plus faible profondeur de champ ?",
        answers: ["f/1.4", "f/8", "f/11", "f/22"],
        correct: 0,
        fact: "Plus le f-stop est bas (grande ouverture), plus la profondeur de champ est réduite — idéal pour le bokeh et isoler un sujet."
    },
    {
        question: "Le 'LUT' en post-production signifie...",
        answers: ["Look-Up Table", "Light Unification Tool", "Layered Under Tone", "Luminance Unit Track"],
        correct: 0,
        fact: "Un LUT (Look-Up Table) est une table de correspondance qui transforme mathématiquement les couleurs d'une image pour l'étalonnage."
    },
    {
        question: "Qui a réalisé '2001 : L'Odyssée de l'espace' ?",
        answers: ["Stanley Kubrick", "Steven Spielberg", "Ridley Scott", "Christopher Nolan"],
        correct: 0,
        fact: "Stanley Kubrick a réalisé ce chef-d'œuvre en 1968, révolutionnant les effets spéciaux et la narration abstraite au cinéma."
    }
];

let quizOverlay = null;
let quizState = { current: 0, score: 0, answered: false };

function openCinemaQuiz() {
    if (quizOverlay) return;
    quizState = { current: 0, score: 0, answered: false };

    quizOverlay = document.createElement('div');
    quizOverlay.id = 'cinema-quiz-overlay';
    quizOverlay.innerHTML = `
        <div class="quiz-container">
            <button class="quiz-close" onclick="closeCinemaQuiz()"><i class="fas fa-times"></i></button>
            <div class="quiz-header">
                <div class="quiz-icon">🎬</div>
                <h2>QUIZ CINÉMA <span class="quiz-secret-tag">SECRET</span></h2>
                <p>Tu as découvert le mini-jeu caché ! 8 questions sur le cinéma & l'audiovisuel.</p>
            </div>
            <div id="quiz-body"></div>
        </div>
    `;
    document.body.appendChild(quizOverlay);
    setTimeout(() => quizOverlay.classList.add('visible'), 10);
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const body = document.getElementById('quiz-body');
    const q = cinemaQuizData[quizState.current];
    const total = cinemaQuizData.length;
    const progress = ((quizState.current) / total) * 100;

    body.innerHTML = `
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${progress}%"></div></div>
        <div class="quiz-counter">${quizState.current + 1} / ${total}</div>
        <div class="quiz-question">${q.question}</div>
        <div class="quiz-answers">
            ${q.answers.map((a, i) => `
                <button class="quiz-answer-btn" onclick="answerQuiz(${i})" data-index="${i}">
                    <span class="quiz-letter">${['A','B','C','D'][i]}</span>
                    ${a}
                </button>
            `).join('')}
        </div>
        <div class="quiz-fact" id="quiz-fact"></div>
        <button class="quiz-next-btn" id="quiz-next" style="display:none" onclick="nextQuizQuestion()">
            ${quizState.current + 1 < total ? 'QUESTION SUIVANTE →' : 'VOIR MON SCORE →'}
        </button>
    `;
    quizState.answered = false;
}

function answerQuiz(index) {
    if (quizState.answered) return;
    quizState.answered = true;

    const q = cinemaQuizData[quizState.current];
    const btns = document.querySelectorAll('.quiz-answer-btn');
    
    btns.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.correct) btn.classList.add('correct');
        else if (i === index && index !== q.correct) btn.classList.add('wrong');
    });

    if (index === q.correct) quizState.score++;

    const fact = document.getElementById('quiz-fact');
    fact.textContent = '💡 ' + q.fact;
    fact.classList.add('visible');

    document.getElementById('quiz-next').style.display = 'block';
}

function nextQuizQuestion() {
    quizState.current++;
    if (quizState.current >= cinemaQuizData.length) {
        renderQuizResults();
    } else {
        renderQuizQuestion();
    }
}

function renderQuizResults() {
    const body = document.getElementById('quiz-body');
    const score = quizState.score;
    const total = cinemaQuizData.length;
    const pct = Math.round((score / total) * 100);
    
    let grade, emoji, msg;
    if (pct >= 87) { grade = "Expert Cinéphile"; emoji = "🏆"; msg = "Impressionnant ! Tu maîtrises l'audiovisuel comme un pro."; }
    else if (pct >= 62) { grade = "Passionné du 7ème Art"; emoji = "🎥"; msg = "Belle connaissance ! Tu as l'œil du réalisateur."; }
    else if (pct >= 37) { grade = "Apprenti Cinéaste"; emoji = "🎞️"; msg = "Pas mal ! Continue à explorer l'univers de l'image."; }
    else { grade = "Spectateur Curieux"; emoji = "🍿"; msg = "Les bases se construisent plan par plan !"; }

    body.innerHTML = `
        <div class="quiz-results">
            <div class="quiz-result-emoji">${emoji}</div>
            <div class="quiz-result-score">${score}<span>/${total}</span></div>
            <div class="quiz-result-grade">${grade}</div>
            <p class="quiz-result-msg">${msg}</p>
            <div class="quiz-result-pct">${pct}% de réussite</div>
            ${pct >= 62 ? `
            <div class="quiz-reward">
                <div class="quiz-reward-title">🎁 RÉCOMPENSE DÉBLOQUÉE</div>
                <p>Tu peux consulter mon CV :</p>
                <a href="assets/CV_BOULAIRE_DYLAN_ALTERNANCE (2).pdf" target="_blank" class="quiz-cv-btn">
                    <i class="fas fa-file-pdf"></i> VOIR MON CV
                </a>
            </div>` : `<div class="quiz-retry-hint">Score 5/8 ou plus pour débloquer une récompense...</div>`}
            <button class="quiz-restart-btn" onclick="restartQuiz()">REJOUER</button>
        </div>
    `;
}

function restartQuiz() {
    quizState = { current: 0, score: 0, answered: false };
    renderQuizQuestion();
}

function closeCinemaQuiz() {
    if (quizOverlay) {
        quizOverlay.classList.remove('visible');
        setTimeout(() => { quizOverlay.remove(); quizOverlay = null; }, 400);
    }
}
