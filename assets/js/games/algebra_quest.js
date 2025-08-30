window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XZ1QWD1TCC');


// Redirige si no hay usuario autenticado
if (!localStorage.getItem('currentUser') && !sessionStorage.getItem('currentUser')) {
    window.location.href = "complete-login-html.html";
}

// Estado del juego
let gameState = {
    score: 0,
    level: 1,
    streak: 0,
    currentEquation: null,
    hintsUsed: 0,
    totalQuestions: 0,
    correctAnswersInLevel: 0,
    canLevelUp: false
};

// Banco de ecuaciones por nivel de dificultad
const equations = {
    1: [
        { equation: "2x + 5 = 13", answer: 4, steps: ["2x + 5 = 13", "2x = 13 - 5", "2x = 8", "x = 8 ÷ 2", "x = 4"] },
        { equation: "3x - 7 = 8", answer: 5, steps: ["3x - 7 = 8", "3x = 8 + 7", "3x = 15", "x = 15 ÷ 3", "x = 5"] },
        // ...
    ],
    2: [
        { equation: "4x - 3 = 2x + 7", answer: 5, steps: ["4x - 3 = 2x + 7", "4x - 2x = 7 + 3", "2x = 10", "x = 5"] },
        // ...
    ],
    3: [
        { equation: "2(x + 3) = 14", answer: 4, steps: ["2(x + 3) = 14", "2x + 6 = 14", "2x = 14 - 6", "2x = 8", "x = 4"] },
        // ...
    ]
};

// Historias por nivel
const stories = {
    1: "🐉 Un dragón guarda el tesoro del reino. Solo las ecuaciones básicas pueden derrotarlo.",
    2: "🏰 Los guardianes del castillo te desafían con ecuaciones más complejas.",
    3: "👑 El rey final te espera con las ecuaciones más poderosas del reino."
};

let MAX_LEVEL = 3;
let MAX_TOTAL_QUESTIONS = 9;

// ... aquí copias todas las funciones: initGame, generateEquation, nextQuestion, checkAnswer, showSteps, showHint, etc ...

// Inicializar el juego
window.onload = initGame;
