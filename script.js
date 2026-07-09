document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const glowContainer = document.querySelector('.mouse-glow');
    const videoBg = document.querySelector('.video-background');

    // ── THEME TOGGLE ─────────────────────────────────────────────────
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

    // ── CUSTOM CURSOR ────────────────────────────────────────────────
    // On ne crée le curseur que sur desktop (pas tactile)
    const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

    if (!isTouchDevice()) {
        const cursor    = document.createElement('div');
        const cursorDot = document.createElement('div');
        cursor.className    = 'custom-cursor';
        cursorDot.className = 'custom-cursor-dot';
        document.body.appendChild(cursor);
        document.body.appendChild(cursorDot);

        // Position réelle de la souris
        let mouseX = -200, mouseY = -200;
        // Position interpolée de l'anneau
        let ringX  = -200, ringY  = -200;
        let rafId  = null;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // Le point suit immédiatement, via CSS transform direct
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        // Anneau avec lag (lerp)
        function animateCursor() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            cursor.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
            rafId = requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Cible hover
        const hoverSel = 'a, button, .project-card, .filter-btn, .gear-item, .software-item, .quiz-answer-btn, .file-item, .folder-header, .submit-btn, .carousel-btn, .modal-close, .gallery-item, input, textarea, [onclick]';

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverSel)) {
                cursor.classList.add('cursor-hover');
                cursorDot.classList.add('cursor-hover');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverSel)) {
                cursor.classList.remove('cursor-hover');
                cursorDot.classList.remove('cursor-hover');
            }
        });
        document.addEventListener('mousedown', () => {
            cursor.classList.add('cursor-click');
            cursorDot.classList.add('cursor-click');
        });
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('cursor-click');
            cursorDot.classList.remove('cursor-click');
        });

        // Masquer quand hors fenêtre
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity    = '0';
            cursorDot.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity    = '1';
            cursorDot.style.opacity = '1';
        });
    }

    // ── MOUSE GLOW ───────────────────────────────────────────────────
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

    // ── BURGER MENU ──────────────────────────────────────────────────
    const burger     = document.querySelector('.burger-menu');
    const navOverlay = document.querySelector('.nav-overlay');

    if (burger && navOverlay) {
        burger.addEventListener('click', () => {
            const isOpen = navOverlay.classList.toggle('open');
            burger.classList.toggle('active', isOpen);
        });
        navOverlay.querySelectorAll('a, .nav-link-btn').forEach(link => {
            link.addEventListener('click', closeNav);
        });
        navOverlay.addEventListener('click', (e) => {
            if (e.target === navOverlay) closeNav();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navOverlay.classList.contains('open')) closeNav();
        });
    }

    function closeNav() {
        const b = document.querySelector('.burger-menu');
        const o = document.querySelector('.nav-overlay');
        if (b) b.classList.remove('active');
        if (o) o.classList.remove('open');
    }

    // ── SCROLL REVEAL ────────────────────────────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));

    // ── GEAR STAGGER ─────────────────────────────────────────────────
    const gearObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.gear-item, .software-item').forEach((item, i) => {
                    setTimeout(() => item.classList.add('gear-visible'), i * 70);
                });
                gearObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });
    document.querySelectorAll('.gear-items, .software-grid').forEach(el => gearObserver.observe(el));

    // ── HEADER SHRINK ────────────────────────────────────────────────
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 80);
        });
    }

    // ── JUICY CLICK BURST ────────────────────────────────────────────
    document.addEventListener('click', spawnClickBurst);

    function spawnClickBurst(e) {
        // Pas de burst sur les zones de quiz ou modal pour eviter le bruit visuel
        if (e.target.closest('.modal-overlay, #cinema-quiz-overlay')) return;

        const burst = document.createElement('div');
        burst.className = 'click-burst';
        // Position absolue par rapport au viewport, sans offset
        burst.style.left = e.clientX + 'px';
        burst.style.top  = e.clientY + 'px';
        document.body.appendChild(burst);

        for (let i = 0; i < 6; i++) {
            const dot   = document.createElement('div');
            dot.className = 'burst-dot';
            const angle = (i / 6) * 360;
            const dist  = 26 + Math.random() * 16;
            const rad   = (angle * Math.PI) / 180;
            dot.style.setProperty('--tx', Math.cos(rad) * dist + 'px');
            dot.style.setProperty('--ty', Math.sin(rad) * dist + 'px');
            dot.style.animationDelay = (i * 16) + 'ms';
            burst.appendChild(dot);
        }
        setTimeout(() => burst.remove(), 700);
    }
});

// ── MODAL KEYBOARD & TOUCH ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');

    document.addEventListener('keydown', (e) => {
        if (!modal || !modal.classList.contains('open')) return;
        if (e.key === 'ArrowLeft')       { e.preventDefault(); moveSlide(-1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); moveSlide(1); }
        else if (e.key === 'Escape')     { e.preventDefault(); closeModal(); }
    });

    // Fermeture en cliquant sur le fond
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

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

// =====================================================================
// QUIZ PERSO — CV gate
// =====================================================================
const cinemaQuizDataRaw = [
    {
        question: "🎾 Quel joueur détient le record de titres du Grand Chelem en tennis ?",
        answers: ["Novak Djokovic", "Rafael Nadal", "Roger Federer", "Pete Sampras"],
        correct: 0,
        fact: "Novak Djokovic détient le record avec 24 titres du Grand Chelem. Nadal est 2ème avec 22, Federer 3ème avec 20."
    },
    {
        question: "🎾 Sur quelle surface se joue Roland-Garros ?",
        answers: ["Terre battue", "Gazon", "Dur", "Moquette"],
        correct: 0,
        fact: "Roland-Garros se joue sur terre battue — la surface de prédilection de Nadal, surnommé 'le Roi de la terre battue' avec 14 titres !"
    },
    {
        question: "🎬 Dans quel film Nolan raconte-t-il une histoire à rebours ?",
        answers: ["Memento", "Inception", "Interstellar", "The Prestige"],
        correct: 0,
        fact: "Memento (2000) suit un homme sans mémoire à court terme — la narration remonte le temps scène après scène. Un chef-d'œuvre de montage !"
    },
    {
        question: "🎬 Quel réalisateur a signé Jurassic Park, Les Dents de la Mer et E.T. ?",
        answers: ["Steven Spielberg", "James Cameron", "Ridley Scott", "George Lucas"],
        correct: 0,
        fact: "Steven Spielberg, l'un des plus grands réalisateurs de tous les temps, auteur de films qui ont marqué des générations entières."
    },
    {
        question: "🎓 Dans quelle ville Dylan a-t-il fait son BUT MMI ?",
        answers: ["Lannion", "Rennes", "Brest", "Saint-Brieuc"],
        correct: 0,
        fact: "C'est à Lannion, en Bretagne, à l'IUT — une ville connue pour ses télécommunications et son dynamisme numérique !"
    },
    {
        question: "🎓 Que signifie MMI ?",
        answers: ["Métiers du Multimédia et de l'Internet", "Master en Marketing International", "Management des Médias et de l'Image", "Montage et Mise en Image"],
        correct: 0,
        fact: "MMI = Métiers du Multimédia et de l'Internet. Un BUT polyvalent qui mêle vidéo, webdesign, communication et développement !"
    },
    {
        question: "💇 Quelle est la couleur des cheveux de Dylan ?",
        answers: ["Bruns", "Blonds", "Roux", "Noirs"],
        correct: 0,
        fact: "Dylan a les cheveux bruns. Maintenant tu peux le reconnaître si tu le croises dans un couloir 😄"
    },
    {
        question: "📄 Soyons directs… tu veux vraiment son CV ?",
        answers: ["OUI, évidemment ! 🚀", "Non, je suis juste curieux 👀"],
        correct: 0,
        fact: "Excellente décision ! Un profil créatif, polyvalent et motivé — tu ne vas pas le regretter 🎯"
    }
];

function buildShuffledQuiz(rawData) {
    const fixedLast = rawData[rawData.length - 1];
    const toShuffle = rawData.slice(0, rawData.length - 1).map(q => {
        const correctAnswer = q.answers[q.correct];
        const shuffled = [...q.answers];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return { question: q.question, answers: shuffled, correct: shuffled.indexOf(correctAnswer), fact: q.fact };
    });
    return [...toShuffle, fixedLast];
}

let cinemaQuizData = [];
let quizOverlay    = null;
let quizState      = { current: 0, score: 0, answered: false, cvMode: false, forcedNoCV: false };

function openCinemaQuizForCV() { _openQuiz(true); }
function openCinemaQuiz()      { _openQuiz(false); }

function _openQuiz(cvMode) {
    if (quizOverlay) return;
    cinemaQuizData = buildShuffledQuiz(cinemaQuizDataRaw);
    quizState      = { current: 0, score: 0, answered: false, cvMode, forcedNoCV: false };

    quizOverlay = document.createElement('div');
    quizOverlay.id = 'cinema-quiz-overlay';

    const intro    = cvMode
        ? `<p>Mon CV ? Il se mérite ! 😏<br>8 questions pour voir si on est sur la même longueur d'onde.</p>`
        : `<p>Tu as trouvé l'easter egg ! 8 questions pour mieux me connaître.</p>`;
    const titleTag = cvMode ? `MON CV ? IL FAUT LE MÉRITER !` : `QUIZ SECRET 🎬`;

    quizOverlay.innerHTML = `
        <div class="quiz-container">
            <button class="quiz-close" onclick="closeCinemaQuiz()"><i class="fas fa-times"></i></button>
            <div class="quiz-header">
                <div class="quiz-icon">${cvMode ? '🎯' : '🎬'}</div>
                <h2>${titleTag}</h2>
                ${intro}
            </div>
            <div id="quiz-body"></div>
        </div>`;

    document.body.appendChild(quizOverlay);
    setTimeout(() => quizOverlay.classList.add('visible'), 10);
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const body    = document.getElementById('quiz-body');
    const q       = cinemaQuizData[quizState.current];
    const total   = cinemaQuizData.length;
    const isLastQ = quizState.current === total - 1;

    body.innerHTML = `
        <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width:${(quizState.current / total) * 100}%"></div>
        </div>
        <div class="quiz-counter">${quizState.current + 1} / ${total}</div>
        <div class="quiz-question">${q.question}</div>
        <div class="quiz-answers${isLastQ ? ' quiz-answers--yesno' : ''}">
            ${q.answers.map((a, i) => `
                <button class="quiz-answer-btn${isLastQ ? (i === 0 ? ' quiz-btn--yes' : ' quiz-btn--no') : ''}" onclick="answerQuiz(${i})">
                    ${!isLastQ ? `<span class="quiz-letter">${['A','B','C','D'][i]}</span>` : ''}${a}
                </button>`).join('')}
        </div>
        <div class="quiz-fact" id="quiz-fact"></div>
        <button class="quiz-next-btn" id="quiz-next" style="display:none" onclick="nextQuizQuestion()">
            ${quizState.current + 1 < total ? 'QUESTION SUIVANTE →' : 'VOIR LE RÉSULTAT →'}
        </button>`;
    quizState.answered = false;
}

function answerQuiz(index) {
    if (quizState.answered) return;
    quizState.answered = true;

    const q        = cinemaQuizData[quizState.current];
    const total    = cinemaQuizData.length;
    const isLastQ  = quizState.current === total - 1;
    const isCorrect = index === q.correct;

    if (isCorrect) quizState.score++;
    if (isLastQ && !isCorrect) quizState.forcedNoCV = true;

    document.querySelectorAll('.quiz-answer-btn').forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.correct)             btn.classList.add('correct', 'quiz-pop');
        else if (i === index && !isCorrect) btn.classList.add('wrong', 'quiz-shake');
    });

    const fact = document.getElementById('quiz-fact');
    fact.textContent = (isLastQ && !isCorrect)
        ? '😅 Dommage ! Reviens quand tu seras convaincu.'
        : '💡 ' + q.fact;
    fact.classList.add('visible');
    document.getElementById('quiz-next').style.display = 'block';
}

function nextQuizQuestion() {
    quizState.current++;
    quizState.current >= cinemaQuizData.length ? renderQuizResults() : renderQuizQuestion();
}

function renderQuizResults() {
    const score   = quizState.score;
    const total   = cinemaQuizData.length;
    const pct     = Math.round((score / total) * 100);
    const saidNo  = quizState.forcedNoCV;
    const cvMode  = quizState.cvMode;

    const grades = [
        { min: 87, grade: "Tu me connais presque mieux que moi 👀", emoji: "🏆" },
        { min: 62, grade: "Bon feeling — on va bien s'entendre !",   emoji: "🎯" },
        { min: 37, grade: "Pas mal, mais il reste des mystères…",    emoji: "🎞️" },
        { min: 0,  grade: "On part de loin, mais c'est pas grave !", emoji: "🍿" }
    ];
    const { grade, emoji } = grades.find(g => pct >= g.min);
    const cvUnlocked = !saidNo && score >= 5;

    const rewardBlock = saidNo
        ? `<div class="quiz-reward quiz-reward--locked">
               <div class="quiz-reward-title">🚫 TU AS DIT NON…</div>
               <p>Respect. Si tu changes d'avis, le bouton sera toujours là 😏</p>
           </div>`
        : cvUnlocked
            ? `<div class="quiz-reward">
                   <div class="quiz-reward-title">🎁 CV DÉBLOQUÉ !</div>
                   <p>${cvMode ? 'Tu l\'as mérité — voilà ce que tu cherchais :' : 'Récompense débloquée !'}</p>
                   <a href="assets/CV_BOULAIRE_DYLAN_ALTERNANCE (2).pdf" target="_blank" class="quiz-cv-btn">
                       <i class="fas fa-file-pdf"></i> TÉLÉCHARGER MON CV
                   </a>
               </div>`
            : `<div class="quiz-reward quiz-reward--locked">
                   <div class="quiz-reward-title">🔒 CV VERROUILLÉ</div>
                   <p>Il faut 5/8 minimum. Rejoue — tu y es presque !</p>
               </div>`;

    document.getElementById('quiz-body').innerHTML = `
        <div class="quiz-results">
            <div class="quiz-result-emoji">${emoji}</div>
            <div class="quiz-result-score">${score}<span>/${total}</span></div>
            <div class="quiz-result-grade">${grade}</div>
            <div class="quiz-result-pct">${pct}% de réussite</div>
            ${rewardBlock}
            <button class="quiz-restart-btn" onclick="restartQuiz()">↩ REJOUER</button>
        </div>`;
}

function restartQuiz() {
    cinemaQuizData = buildShuffledQuiz(cinemaQuizDataRaw);
    quizState = { ...quizState, current: 0, score: 0, answered: false, forcedNoCV: false };
    renderQuizQuestion();
}

function closeCinemaQuiz() {
    if (quizOverlay) {
        quizOverlay.classList.remove('visible');
        setTimeout(() => { quizOverlay.remove(); quizOverlay = null; }, 400);
    }
}
