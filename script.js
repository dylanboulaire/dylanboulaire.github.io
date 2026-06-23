document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const glowContainer = document.querySelector('.mouse-glow');
    const videoBg = document.querySelector('.video-background');

    // ── THEME TOGGLE (handles multiple buttons) ──────────────────────
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
    const burger = document.querySelector('.burger-menu');
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
        const burger = document.querySelector('.burger-menu');
        const navOverlay = document.querySelector('.nav-overlay');
        if (burger) burger.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('open');
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

    // ── HEADER SHRINK ON SCROLL ──────────────────────────────────────
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 80);
        });
    }

    // ── JUICY CLICK BURST ────────────────────────────────────────────
    document.addEventListener('click', spawnClickBurst);

    function spawnClickBurst(e) {
        // Ne pas déclencher sur les boutons interactifs importants
        if (e.target.closest('.modal-overlay, #cinema-quiz-overlay, .quiz-answer-btn, .submit-btn')) return;

        const burst = document.createElement('div');
        burst.className = 'click-burst';
        burst.style.left = e.clientX + 'px';
        burst.style.top  = e.clientY + 'px';
        document.body.appendChild(burst);

        // Génère 6 particules
        for (let i = 0; i < 6; i++) {
            const dot = document.createElement('div');
            dot.className = 'burst-dot';
            const angle  = (i / 6) * 360;
            const dist   = 28 + Math.random() * 18;
            const rad    = (angle * Math.PI) / 180;
            const tx     = Math.cos(rad) * dist;
            const ty     = Math.sin(rad) * dist;
            dot.style.setProperty('--tx', tx + 'px');
            dot.style.setProperty('--ty', ty + 'px');
            dot.style.animationDelay = (i * 18) + 'ms';
            burst.appendChild(dot);
        }

        // Nettoyage après animation
        setTimeout(() => burst.remove(), 700);
    }
});

// ── MODAL KEYBOARD & TOUCH ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    document.addEventListener('keydown', (e) => {
        if (!modal || !modal.classList.contains('open')) return;
        if (e.key === 'ArrowLeft')  { e.preventDefault(); moveSlide(-1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); moveSlide(1); }
        else if (e.key === 'Escape')     { e.preventDefault(); closeModal(); }
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

// =====================================================================
// QUIZ PERSO — CV gate
// =====================================================================

const cinemaQuizDataRaw = [
    {
        question: "🎾 Quel joueur de tennis a remporté le plus de titres du Grand Chelem de l'histoire ?",
        answers: ["Novak Djokovic", "Rafael Nadal", "Roger Federer", "Pete Sampras"],
        correct: 0,
        fact: "Novak Djokovic détient le record avec 24 titres du Grand Chelem. Nadal est 2ème avec 22, Federer 3ème avec 20."
    },
    {
        question: "🎾 Sur quelle surface Roland-Garros est-il joué ?",
        answers: ["Terre battue", "Gazon", "Dur", "Moquette"],
        correct: 0,
        fact: "Roland-Garros se joue sur terre battue — la surface préférée de Rafael Nadal, surnommé 'le Roi de la terre battue' avec 14 titres !"
    },
    {
        question: "🎬 Dans quel film Christopher Nolan raconte-t-il une histoire à l'envers ?",
        answers: ["Memento", "Inception", "Interstellar", "The Prestige"],
        correct: 0,
        fact: "Memento (2000) suit Leonard Shelby, un homme sans mémoire à court terme — la narration remonte le temps scène après scène. Un chef-d'œuvre de montage !"
    },
    {
        question: "🎬 Quelle est la durée approximative du film 'Il faut sauver le soldat Ryan' de Spielberg ?",
        answers: ["2h49", "1h45", "3h20", "2h10"],
        correct: 0,
        fact: "Le film dure 2h49. Les 27 premières minutes consacrées au débarquement de Normandie sont considérées comme l'une des séquences d'action les plus intenses de l'histoire du cinéma."
    },
    {
        question: "🎓 Dans quelle ville Dylan a-t-il fait son BUT MMI ?",
        answers: ["Lannion", "Rennes", "Brest", "Saint-Brieuc"],
        correct: 0,
        fact: "C'est à Lannion, en Bretagne, que Dylan a étudié le BUT MMI à l'IUT — une ville connue pour ses télécommunications et son dynamisme numérique !"
    },
    {
        question: "🎓 MMI, c'est quoi comme formation ?",
        answers: ["Métiers du Multimédia et de l'Internet", "Master en Marketing International", "Management des Médias et de l'Image", "Montage et Mise en Image"],
        correct: 0,
        fact: "MMI = Métiers du Multimédia et de l'Internet. Un BUT polyvalent qui mêle vidéo, webdesign, communication et développement — le terrain de jeu idéal pour Dylan !"
    },
    {
        question: "💇 Quelle est la couleur des cheveux de Dylan ?",
        answers: ["Bruns", "Blonds", "Roux", "Noirs"],
        correct: 0,
        fact: "Dylan a les cheveux bruns. Maintenant tu peux le reconnaître si tu le croises dans un couloir d'entreprise 😄"
    },
    {
        question: "📄 Bon, soyons directs… tu veux vraiment son CV ?",
        answers: ["OUI, évidemment !", "Non, je suis juste curieux"],
        correct: 0,
        fact: "Bonne décision ! Un profil créatif, polyvalent, motivé — tu ne vas pas le regretter 🎯"
    }
];

function buildShuffledQuiz(rawData) {
    // Toutes les questions sauf la dernière (OUI/NON) sont mélangées
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

    // La dernière question reste toujours en dernière position, réponses fixes
    return [...toShuffle, fixedLast];
}

let cinemaQuizData = [];
let quizOverlay = null;
let quizState = { current: 0, score: 0, answered: false, cvMode: false };

function openCinemaQuizForCV() { _openQuiz(true); }
function openCinemaQuiz()      { _openQuiz(false); }

function _openQuiz(cvMode) {
    if (quizOverlay) return;
    cinemaQuizData = buildShuffledQuiz(cinemaQuizDataRaw);
    quizState = { current: 0, score: 0, answered: false, cvMode };

    quizOverlay = document.createElement('div');
    quizOverlay.id = 'cinema-quiz-overlay';

    const intro = cvMode
        ? `<p>Mon CV ? Il se mérite ! 😏<br>8 questions pour voir si on est sur la même longueur d'onde.</p>`
        : `<p>Tu as trouvé l'easter egg ! 8 questions pour mieux me connaître.</p>`;

    const titleTag = cvMode
        ? `MON CV ? IL FAUT LE MÉRITER ! 🏆`
        : `QUIZ SECRET 🎬`;

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
    const body  = document.getElementById('quiz-body');
    const q     = cinemaQuizData[quizState.current];
    const total = cinemaQuizData.length;
    const isLastQuestion = quizState.current === total - 1;

    body.innerHTML = `
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${(quizState.current / total) * 100}%"></div></div>
        <div class="quiz-counter">${quizState.current + 1} / ${total}</div>
        <div class="quiz-question">${q.question}</div>
        <div class="quiz-answers ${isLastQuestion ? 'quiz-answers--yesno' : ''}">
            ${q.answers.map((a, i) => `
                <button class="quiz-answer-btn ${isLastQuestion ? (i === 0 ? 'quiz-btn--yes' : 'quiz-btn--no') : ''}" onclick="answerQuiz(${i})">
                    <span class="quiz-letter">${isLastQuestion ? '' : ['A','B','C','D'][i]}</span>${a}
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

    const q            = cinemaQuizData[quizState.current];
    const total        = cinemaQuizData.length;
    const isLastQ      = quizState.current === total - 1;

    // Sur la dernière question OUI/NON, seul "OUI" (index 0) donne le CV
    // mais les deux réponses sont "correctes" pour le score (on compte juste OUI)
    const isCorrect = (index === q.correct);
    if (isCorrect) quizState.score++;

    // Animation juicy sur le bouton cliqué
    const btns = document.querySelectorAll('.quiz-answer-btn');
    btns.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.correct) {
            btn.classList.add('correct');
            btn.classList.add('quiz-pop');
        } else if (i === index && !isCorrect) {
            btn.classList.add('wrong');
            btn.classList.add('quiz-shake');
        }
    });

    const fact = document.getElementById('quiz-fact');
    if (isLastQ && !isCorrect) {
        fact.textContent = '😅 Dommage ! Reviens quand tu seras convaincu.';
    } else {
        fact.textContent = '💡 ' + q.fact;
    }
    fact.classList.add('visible');
    document.getElementById('quiz-next').style.display = 'block';

    // Si "NON" sur la dernière question → résultat direct sans CV
    if (isLastQ && !isCorrect) {
        quizState.forcedNoCV = true;
    }
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
    const score   = quizState.score;
    const total   = cinemaQuizData.length;
    const pct     = Math.round((score / total) * 100);
    const cvMode  = quizState.cvMode;
    const saidNo  = quizState.forcedNoCV;

    const grades = [
        { min: 87, grade: "Tu me connais déjà presque mieux que moi 👀", emoji: "🏆" },
        { min: 62, grade: "Bon feeling — on va bien s'entendre !",        emoji: "🎯" },
        { min: 37, grade: "Pas mal, mais il reste des mystères…",         emoji: "🎞️" },
        { min: 0,  grade: "On part de loin, mais c'est pas grave !",      emoji: "🍿" }
    ];
    const { grade, emoji } = grades.find(g => pct >= g.min);

    // Cas spécial : a dit NON à la dernière question
    const cvUnlocked = !saidNo && score >= 5;

    const rewardBlock = saidNo
        ? `<div class="quiz-reward quiz-reward--locked">
               <div class="quiz-reward-title">🚫 TU AS DIT NON…</div>
               <p>Respect de ta décision. Si tu changes d'avis, le bouton sera toujours là 😏</p>
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
