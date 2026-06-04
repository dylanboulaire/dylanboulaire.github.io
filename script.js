document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const glowContainer = document.querySelector('.mouse-glow');
    const videoBg = document.querySelector('.video-background');

    // --- THEME TOGGLE (handles multiple buttons) ---
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') body.classList.add('light-mode');
    updateAllThemeIcons();

    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
            updateAllThemeIcons();
        });
    });

    function updateAllThemeIcons() {
        const isLight = body.classList.contains('light-mode');
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    // --- MOUSE GLOW ---
    if (glowContainer) {
        document.addEventListener('mousemove', (e) => {
            body.style.setProperty('--mouse-x', `${e.clientX}px`);
            body.style.setProperty('--mouse-y', `${e.clientY}px`);
        });
        if (videoBg) {
            window.addEventListener('scroll', () => {
                glowContainer.style.opacity = window.scrollY > window.innerHeight * 0.5 ? '1' : '0';
            });
        }
    }

    // --- BURGER MENU ---
    const burger = document.querySelector('.burger-menu');
    const navOverlay = document.querySelector('.nav-overlay');

    if (burger && navOverlay) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            navOverlay.classList.toggle('open');
            body.classList.toggle('nav-open');
        });
        document.querySelectorAll('.nav-overlay a, .nav-overlay .nav-link-btn').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navOverlay.classList.remove('open');
                body.classList.remove('nav-open');
            });
        });
        navOverlay.addEventListener('click', (e) => {
            if (e.target === navOverlay) {
                burger.classList.remove('active');
                navOverlay.classList.remove('open');
                body.classList.remove('nav-open');
            }
        });
    }

    // --- SCROLL REVEAL ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));

    // --- GEAR ITEMS STAGGER ---
    const gearObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.gear-item, .software-item').forEach((item, i) => {
                    setTimeout(() => item.classList.add('gear-visible'), i * 70);
                });
                gearObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.gear-items, .software-grid').forEach(el => gearObserver.observe(el));

    // --- HEADER SHRINK ---
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 80);
        });
    }

    // --- SECRET QUIZ: click logo 5x quickly ---
    const logoImg = document.querySelector('.logo-center img');
    let logoClicks = 0, logoTimer;

    if (logoImg) {
        logoImg.style.cursor = 'pointer';
        logoImg.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            logoClicks++;
            clearTimeout(logoTimer);
            // Visual feedback: small pulse
            logoImg.style.transform = 'scale(1.15)';
            setTimeout(() => logoImg.style.transform = '', 150);
            logoTimer = setTimeout(() => { logoClicks = 0; }, 2500);
            if (logoClicks >= 5) {
                logoClicks = 0;
                openCinemaQuiz();
            }
        });
    }

    // Also keep the link working normally when not triggering quiz
    const logoLink = document.querySelector('.logo-center a');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            // Only navigate if not on the quiz trigger path
            // (the img click handler already prevents default)
        });
    }
});

// --- MODAL KEYBOARD & TOUCH ---
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    document.addEventListener('keydown', (e) => {
        if (!modal || !modal.classList.contains('open')) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); moveSlide(-1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); moveSlide(1); }
        else if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
    });

    let touchStart = 0;
    const modalViewer = document.querySelector('.modal-viewer');
    if (modalViewer) {
        modalViewer.addEventListener('touchstart', (e) => { touchStart = e.changedTouches[0].clientX; }, false);
        modalViewer.addEventListener('touchend', (e) => {
            const diff = touchStart - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) diff > 0 ? moveSlide(1) : moveSlide(-1);
        }, false);
    }
});

// =============================================
// CINEMA QUIZ
// =============================================
const cinemaQuizData = [
    {
        question: "Quel film a popularisé le 'jump cut' grâce à sa révolution du montage ?",
        answers: ["À bout de souffle", "Citizen Kane", "8½", "Metropolis"],
        correct: 0,
        fact: "Jean-Luc Godard a révolutionné le montage dans 'À bout de souffle' (1960) en utilisant le jump cut de manière délibérée et poétique."
    },
    {
        question: "La règle des 180° au cinéma sert à...",
        answers: ["Conserver la cohérence spatiale", "Limiter les mouvements de caméra", "Définir la focale idéale", "Cadrer le sujet au centre"],
        correct: 0,
        fact: "La règle des 180° garantit que les personnages restent du même côté de l'écran, évitant la désorientation spatiale du spectateur."
    },
    {
        question: "Quel format d'aspect est typique du cinéma 'scope' anamorphique ?",
        answers: ["2.39:1", "16:9", "4:3", "1.85:1"],
        correct: 0,
        fact: "Le format 2.39:1 (CinemaScope) donne cet aspect ultra-panoramique reconnaissable dans les grands films hollywoodiens."
    },
    {
        question: "Quelle ouverture (f-stop) donne la plus faible profondeur de champ ?",
        answers: ["f/1.4", "f/8", "f/11", "f/22"],
        correct: 0,
        fact: "Plus le f-stop est bas, plus la profondeur de champ est réduite — idéal pour le bokeh et isoler un sujet du fond."
    },
    {
        question: "Le 'LUT' en post-production signifie...",
        answers: ["Look-Up Table", "Light Unification Tool", "Layered Under Tone", "Luminance Unit Track"],
        correct: 0,
        fact: "Un LUT (Look-Up Table) transforme mathématiquement les couleurs d'une image — indispensable pour l'étalonnage cinématique."
    },
    {
        question: "Dans Premiere Pro, quel raccourci coupe un clip à la position de la tête de lecture ?",
        answers: ["Ctrl+K / Cmd+K", "C puis Entrée", "X", "Alt+Suppr"],
        correct: 0,
        fact: "Ctrl+K (PC) ou Cmd+K (Mac) est le raccourci 'Add Edit' de Premiere Pro, essentiel pour un montage rapide."
    },
    {
        question: "Le codec H.264 est privilégié pour la diffusion car...",
        answers: ["Il offre le meilleur ratio qualité/poids", "Il est le seul lisible sur YouTube", "Il n'applique aucune compression", "Il produit des fichiers RAW"],
        correct: 0,
        fact: "H.264 reste le standard universel grâce à son excellent compromis qualité/compression et sa compatibilité maximale."
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
                <p>Tu as découvert l'easter egg ! 8 questions sur le cinéma & l'audiovisuel.</p>
            </div>
            <div id="quiz-body"></div>
        </div>`;
    document.body.appendChild(quizOverlay);
    setTimeout(() => quizOverlay.classList.add('visible'), 10);
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const body = document.getElementById('quiz-body');
    const q = cinemaQuizData[quizState.current];
    const total = cinemaQuizData.length;
    body.innerHTML = `
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${(quizState.current/total)*100}%"></div></div>
        <div class="quiz-counter">${quizState.current + 1} / ${total}</div>
        <div class="quiz-question">${q.question}</div>
        <div class="quiz-answers">
            ${q.answers.map((a, i) => `
                <button class="quiz-answer-btn" onclick="answerQuiz(${i})">
                    <span class="quiz-letter">${['A','B','C','D'][i]}</span>${a}
                </button>`).join('')}
        </div>
        <div class="quiz-fact" id="quiz-fact"></div>
        <button class="quiz-next-btn" id="quiz-next" style="display:none" onclick="nextQuizQuestion()">
            ${quizState.current + 1 < total ? 'QUESTION SUIVANTE →' : 'VOIR MON SCORE →'}
        </button>`;
    quizState.answered = false;
}

function answerQuiz(index) {
    if (quizState.answered) return;
    quizState.answered = true;
    const q = cinemaQuizData[quizState.current];
    document.querySelectorAll('.quiz-answer-btn').forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.correct) btn.classList.add('correct');
        else if (i === index) btn.classList.add('wrong');
    });
    if (index === q.correct) quizState.score++;
    const fact = document.getElementById('quiz-fact');
    fact.textContent = '💡 ' + q.fact;
    fact.classList.add('visible');
    document.getElementById('quiz-next').style.display = 'block';
}

function nextQuizQuestion() {
    quizState.current++;
    quizState.current >= cinemaQuizData.length ? renderQuizResults() : renderQuizQuestion();
}

function renderQuizResults() {
    const score = quizState.score, total = cinemaQuizData.length;
    const pct = Math.round((score / total) * 100);
    const grades = [
        { min: 87, grade: "Expert Cinéphile", emoji: "🏆", msg: "Impressionnant ! Tu maîtrises l'audiovisuel comme un pro." },
        { min: 62, grade: "Passionné du 7ème Art", emoji: "🎥", msg: "Belle connaissance ! Tu as l'œil du réalisateur." },
        { min: 37, grade: "Apprenti Cinéaste", emoji: "🎞️", msg: "Pas mal ! Continue à explorer l'univers de l'image." },
        { min: 0,  grade: "Spectateur Curieux", emoji: "🍿", msg: "Les bases se construisent plan par plan !" }
    ];
    const { grade, emoji, msg } = grades.find(g => pct >= g.min);
    document.getElementById('quiz-body').innerHTML = `
        <div class="quiz-results">
            <div class="quiz-result-emoji">${emoji}</div>
            <div class="quiz-result-score">${score}<span>/${total}</span></div>
            <div class="quiz-result-grade">${grade}</div>
            <p class="quiz-result-msg">${msg}</p>
            <div class="quiz-result-pct">${pct}% de réussite</div>
            ${pct >= 62 ? `
            <div class="quiz-reward">
                <div class="quiz-reward-title">🎁 RÉCOMPENSE DÉBLOQUÉE</div>
                <p>Félicitations ! Voici mon CV :</p>
                <a href="assets/CV_BOULAIRE_DYLAN_ALTERNANCE (2).pdf" target="_blank" class="quiz-cv-btn">
                    <i class="fas fa-file-pdf"></i> VOIR MON CV
                </a>
            </div>` : `<p class="quiz-retry-hint">Score 5/8 ou plus pour débloquer la récompense…</p>`}
            <button class="quiz-restart-btn" onclick="restartQuiz()">REJOUER</button>
        </div>`;
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
