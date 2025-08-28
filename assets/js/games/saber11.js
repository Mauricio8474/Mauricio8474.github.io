
/* Extracted from games/arquitecto_geometrico.html on 2025-08-28T03:35:45.627Z */
window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XZ1QWD1TCC');

// Redirige si no hay usuario autenticado
        if (!localStorage.getItem('currentUser') && !sessionStorage.getItem('currentUser')) {
            window.location.replace('/complete-login-html.html');
        }
// Simulador SABER 11 - Matemáticas
// Variables globales del juego
let gameState = {
    currentQuestion: 0,
    totalQuestions: 15,
    score: 0,
    timeRemaining: 150, // 2:30 minutos en segundos
    timer: null,
    selectedAnswer: null,
    answers: [],
    startTime: null,
    questionStartTime: null
};

// Base de datos de preguntas SABER 11
const questionBank = [
    {
        id: 1,
        text: "Si f(x) = 2x² - 3x + 1, ¿cuál es el valor de f(3)?",
        options: ["10", "8", "12", "6"],
        correctAnswer: 0,
        difficulty: "Básico",
        category: "Álgebra",
        explanation: "f(3) = 2(3)² - 3(3) + 1 = 2(9) - 9 + 1 = 18 - 9 + 1 = 10"
    },
    {
        id: 2,
        text: "En un triángulo rectángulo, si un cateto mide 3 cm y la hipotenusa mide 5 cm, ¿cuánto mide el otro cateto?",
        options: ["4 cm", "3 cm", "5 cm", "6 cm"],
        correctAnswer: 0,
        difficulty: "Básico",
        category: "Geometría",
        explanation: "Usando el teorema de Pitágoras: a² + b² = c². Entonces 3² + b² = 5², por lo tanto b² = 25 - 9 = 16, así b = 4 cm"
    },
    {
        id: 3,
        text: "¿Cuál es la derivada de f(x) = x³ - 2x² + 5x - 3?",
        options: ["3x² - 4x + 5", "x² - 4x + 5", "3x² - 2x + 5", "3x² - 4x + 3"],
        correctAnswer: 0,
        difficulty: "Avanzado",
        category: "Cálculo",
        explanation: "La derivada de x³ es 3x², la derivada de -2x² es -4x, la derivada de 5x es 5, y la derivada de -3 es 0"
    },
    {
        id: 4,
        text: "En una encuesta a 100 estudiantes sobre su deporte favorito, 40 prefieren fútbol, 30 baloncesto y 30 voleibol. ¿Cuál es la probabilidad de que un estudiante seleccionado al azar prefiera fútbol?",
        options: ["0.4", "0.3", "0.5", "0.25"],
        correctAnswer: 0,
        difficulty: "Intermedio",
        category: "Estadística",
        explanation: "La probabilidad es el número de casos favorables sobre el total: 40/100 = 0.4"
    },
    {
        id: 5,
        text: "Resuelve el sistema de ecuaciones: 2x + y = 8 y x - y = 1",
        options: ["x = 3, y = 2", "x = 2, y = 3", "x = 4, y = 1", "x = 1, y = 4"],
        correctAnswer: 0,
        difficulty: "Intermedio",
        category: "Álgebra",
        explanation: "Sumando las ecuaciones: 3x = 9, entonces x = 3. Sustituyendo: 2(3) + y = 8, por lo tanto y = 2"
    },
    {
        id: 6,
        text: "¿Cuál es el área de un círculo con radio de 6 cm? (Usa π ≈ 3.14)",
        options: ["113.04 cm²", "37.68 cm²", "18.84 cm²", "75.36 cm²"],
        correctAnswer: 0,
        difficulty: "Básico",
        category: "Geometría",
        explanation: "El área de un círculo es πr². Entonces: 3.14 × 6² = 3.14 × 36 = 113.04 cm²"
    },
    {
        id: 7,
        text: "Si log₂(x) = 5, ¿cuál es el valor de x?",
        options: ["32", "25", "10", "16"],
        correctAnswer: 0,
        difficulty: "Intermedio",
        category: "Logaritmos",
        explanation: "Si log₂(x) = 5, entonces x = 2⁵ = 32"
    },
    {
        id: 8,
        text: "En una progresión aritmética, el primer término es 3 y la diferencia común es 4. ¿Cuál es el décimo término?",
        options: ["39", "35", "43", "31"],
        correctAnswer: 0,
        difficulty: "Intermedio",
        category: "Sucesiones",
        explanation: "El término n-ésimo es: aₙ = a₁ + (n-1)d. Entonces a₁₀ = 3 + (10-1)4 = 3 + 36 = 39"
    },
    {
        id: 9,
        text: "¿Cuál es el valor de sen(30°)?",
        options: ["1/2", "√3/2", "√2/2", "1"],
        correctAnswer: 0,
        difficulty: "Básico",
        category: "Trigonometría",
        explanation: "El seno de 30° es un valor especial que equivale a 1/2"
    },
    {
        id: 10,
        text: "Una caja contiene 5 bolas rojas y 3 bolas azules. Si se extraen 2 bolas sin reposición, ¿cuál es la probabilidad de que ambas sean rojas?",
        options: ["5/14", "3/14", "5/8", "1/2"],
        correctAnswer: 0,
        difficulty: "Avanzado",
        category: "Probabilidad",
        explanation: "P(2 rojas) = (5/8) × (4/7) = 20/56 = 5/14"
    },
    {
        id: 11,
        text: "¿Cuál es la ecuación de la recta que pasa por los puntos (2, 3) y (4, 7)?",
        options: ["y = 2x - 1", "y = x + 1", "y = 3x - 3", "y = 2x + 1"],
        correctAnswer: 0,
        difficulty: "Intermedio",
        category: "Geometría Analítica",
        explanation: "La pendiente es m = (7-3)/(4-2) = 4/2 = 2. Usando y - 3 = 2(x - 2): y = 2x - 1"
    },
    {
        id: 12,
        text: "Si el 20% de un número es 40, ¿cuál es el 35% de ese mismo número?",
        options: ["70", "80", "60", "50"],
        correctAnswer: 0,
        difficulty: "Básico",
        category: "Porcentajes",
        explanation: "Si 20% = 40, entonces el número es 200. Por lo tanto, 35% de 200 = 0.35 × 200 = 70"
    },
    {
        id: 13,
        text: "¿Cuántas permutaciones se pueden formar con las letras de la palabra 'MATEMÁTICAS'?",
        options: ["39,916,800", "3,628,800", "1,814,400", "907,200"],
        correctAnswer: 0,
        difficulty: "Avanzado",
        category: "Combinatoria",
        explanation: "MATEMÁTICAS tiene 11 letras con repeticiones: M(2), A(3), T(2), E(1), I(1), C(1), S(1). Permutaciones = 11!/(2!×3!×2!) = 39,916,800"
    },
    {
        id: 14,
        text: "La media aritmética de 5 números es 12. Si se agrega un sexto número igual a 18, ¿cuál es la nueva media?",
        options: ["13", "12", "15", "14"],
        correctAnswer: 0,
        difficulty: "Intermedio",
        category: "Estadística",
        explanation: "La suma de los 5 números es 5 × 12 = 60. Con el sexto número: (60 + 18)/6 = 78/6 = 13"
    },
    {
        id: 15,
        text: "¿Cuál es la integral indefinida de ∫(3x² + 2x - 1)dx?",
        options: ["x³ + x² - x + C", "3x³ + 2x² - x + C", "x³ + x² + x + C", "3x + 2 - x + C"],
        correctAnswer: 0,
        difficulty: "Avanzado",
        category: "Cálculo",
        explanation: "∫3x²dx = x³, ∫2xdx = x², ∫(-1)dx = -x. Por lo tanto: x³ + x² - x + C"
    }
];

// Elementos del DOM
const elements = {
    // Screens
    welcomeScreen: document.getElementById('welcome-screen'),
    questionScreen: document.getElementById('question-screen'),
    resultsScreen: document.getElementById('results-screen'),
    reviewScreen: document.getElementById('review-screen'),
    
    // Header elements
    currentQuestionSpan: document.getElementById('current-question'),
    totalQuestionsSpan: document.getElementById('total-questions'),
    currentScoreSpan: document.getElementById('current-score'),
    timerSpan: document.getElementById('timer'),
    
    // Question elements
    progressFill: document.getElementById('progress-fill'),
    difficultyLevel: document.getElementById('difficulty-level'),
    questionCategory: document.getElementById('question-category'),
    questionText: document.getElementById('question-text'),
    answersGrid: document.getElementById('answers-grid'),
    
    // Buttons
    startGameBtn: document.getElementById('start-game'),
    skipQuestionBtn: document.getElementById('skip-question'),
    confirmAnswerBtn: document.getElementById('confirm-answer'),
    nextQuestionBtn: document.getElementById('next-question'),
    restartGameBtn: document.getElementById('restart-game'),
    reviewAnswersBtn: document.getElementById('review-answers'),
    shareResultsBtn: document.getElementById('share-results'),
    backToResultsBtn: document.getElementById('back-to-results'),
    
    // Modal and feedback
    feedbackModal: document.getElementById('feedback-modal'),
    feedbackContent: document.getElementById('feedback-content'),
    feedbackTitle: document.getElementById('feedback-title'),
    feedbackExplanation: document.getElementById('feedback-explanation'),
    
    // Results elements
    finalScore: document.getElementById('final-score'),
    correctAnswers: document.getElementById('correct-answers'),
    incorrectAnswers: document.getElementById('incorrect-answers'),
    skippedQuestions: document.getElementById('skipped-questions'),
    averageTime: document.getElementById('average-time'),
    performanceLevel: document.getElementById('performance-level'),
    levelDescription: document.getElementById('level-description'),
    levelBar: document.getElementById('level-bar'),
    categoriesChart: document.getElementById('categories-chart'),
    studyRecommendations: document.getElementById('study-recommendations'),
    
    // Review elements
    reviewList: document.getElementById('review-list'),
    
    // Loading
    loading: document.getElementById('loading')
};

// Inicialización del juego
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    setupEventListeners();
});

function initializeGame() {
    // Resetear estado del juego
    gameState = {
        currentQuestion: 0,
        totalQuestions: 15,
        score: 0,
        timeRemaining: 150,
        timer: null,
        selectedAnswer: null,
        answers: [],
        startTime: null,
        questionStartTime: null
    };
    
    // Mezclar preguntas
    shuffleArray(questionBank);
    
    // Actualizar UI inicial
    updateHeader();
    showScreen('welcome');
}

function setupEventListeners() {
    // Botones principales
    elements.startGameBtn.addEventListener('click', startGame);
    elements.skipQuestionBtn.addEventListener('click', skipQuestion);
    elements.confirmAnswerBtn.addEventListener('click', confirmAnswer);
    elements.nextQuestionBtn.addEventListener('click', nextQuestion);
    elements.restartGameBtn.addEventListener('click', initializeGame);
    elements.reviewAnswersBtn.addEventListener('click', showReviewScreen);
    elements.shareResultsBtn.addEventListener('click', shareResults);
    elements.backToResultsBtn.addEventListener('click', () => showScreen('results'));
}

function startGame() {
    gameState.startTime = Date.now();
    gameState.currentQuestion = 0;
    showScreen('question');
    loadQuestion();
    startTimer();
}

function loadQuestion() {
    const question = questionBank[gameState.currentQuestion];
    gameState.questionStartTime = Date.now();
    gameState.selectedAnswer = null;
    
    // Actualizar header
    updateHeader();
    
    // Actualizar progress bar
    const progress = ((gameState.currentQuestion + 1) / gameState.totalQuestions) * 100;
    elements.progressFill.style.width = progress + '%';
    
    // Cargar contenido de la pregunta
    elements.difficultyLevel.textContent = `Nivel: ${question.difficulty}`;
    elements.questionCategory.textContent = question.category;
    elements.questionText.textContent = question.text;
    
    // Generar opciones de respuesta
    generateAnswerOptions(question);
    
    // Resetear timer para esta pregunta
    gameState.timeRemaining = 150; // 2:30 por pregunta
    
    // Deshabilitar botón de confirmar
    elements.confirmAnswerBtn.disabled = true;
}

function generateAnswerOptions(question) {
    elements.answersGrid.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'answer-option';
        optionDiv.setAttribute('data-index', index);
        
        optionDiv.innerHTML = `
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span class="option-text">${option}</span>
        `;
        
        optionDiv.addEventListener('click', () => selectAnswer(index));
        elements.answersGrid.appendChild(optionDiv);
    });
}

function selectAnswer(index) {
    // Remover selección anterior
    document.querySelectorAll('.answer-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Seleccionar nueva respuesta
    const selectedOption = document.querySelector(`[data-index="${index}"]`);
    selectedOption.classList.add('selected');
    
    gameState.selectedAnswer = index;
    elements.confirmAnswerBtn.disabled = false;
}

function confirmAnswer() {
    if (gameState.selectedAnswer === null) return;
    
    const question = questionBank[gameState.currentQuestion];
    const isCorrect = gameState.selectedAnswer === question.correctAnswer;
    const timeTaken = Math.floor((Date.now() - gameState.questionStartTime) / 1000);
    
    // Guardar respuesta
    gameState.answers.push({
        questionId: question.id,
        selectedAnswer: gameState.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: isCorrect,
        timeTaken: timeTaken,
        skipped: false
    });
    
    // Actualizar puntaje
    if (isCorrect) {
        gameState.score += 20;
        updateScore();
    }
    
    // Mostrar feedback
    showFeedback(isCorrect, question);
    
    // Highlight respuestas
    highlightAnswers(question);
    
    // Deshabilitar opciones
    document.querySelectorAll('.answer-option').forEach(option => {
        option.style.pointerEvents = 'none';
    });
}

function skipQuestion() {
    const question = questionBank[gameState.currentQuestion];
    
    // Guardar como saltada
    gameState.answers.push({
        questionId: question.id,
        selectedAnswer: null,
        correctAnswer: question.correctAnswer,
        isCorrect: false,
        timeTaken: Math.floor((Date.now() - gameState.questionStartTime) / 1000),
        skipped: true
    });
    
    nextQuestion();
}

function highlightAnswers(question) {
    document.querySelectorAll('.answer-option').forEach((option, index) => {
        if (index === question.correctAnswer) {
            option.classList.add('correct');
        } else if (index === gameState.selectedAnswer) {
            option.classList.add('incorrect');
        }
    });
}

function showFeedback(isCorrect, question) {
    const modal = elements.feedbackModal;
    const icon = modal.querySelector('.feedback-icon');
    const title = elements.feedbackTitle;
    const explanation = elements.feedbackExplanation;
    const stats = modal.querySelector('.feedback-stats');
    
    if (isCorrect) {
        icon.textContent = '🎉';
        title.textContent = '¡Excelente!';
        stats.innerHTML = '+20 puntos';
        stats.style.background = 'var(--success-color)';
    } else {
        icon.textContent = '❌';
        title.textContent = 'Respuesta incorrecta';
        stats.innerHTML = '+0 puntos';
        stats.style.background = 'var(--danger-color)';
    }
    
    explanation.textContent = question.explanation;
    modal.classList.add('active');
}

function nextQuestion() {
    elements.feedbackModal.classList.remove('active');
    gameState.currentQuestion++;
    
    if (gameState.currentQuestion >= gameState.totalQuestions) {
        endGame();
    } else {
        showLoadingScreen();
        setTimeout(() => {
            elements.loading.classList.add('hidden');
            loadQuestion();
        }, 1000);
    }
}

function showLoadingScreen() {
    elements.loading.classList.remove('hidden');
}

function endGame() {
    clearInterval(gameState.timer);
    calculateResults();
    showScreen('results');
}

function calculateResults() {
    const totalTime = Math.floor((Date.now() - gameState.startTime) / 1000);
    const correctCount = gameState.answers.filter(a => a.isCorrect).length;
    const incorrectCount = gameState.answers.filter(a => !a.isCorrect && !a.skipped).length;
    const skippedCount = gameState.answers.filter(a => a.skipped).length;
    const averageTime = Math.floor(gameState.answers.reduce((sum, a) => sum + a.timeTaken, 0) / gameState.totalQuestions);
    
    // Actualizar elementos de resultados
    elements.finalScore.textContent = gameState.score;
    elements.correctAnswers.textContent = correctCount;
    elements.incorrectAnswers.textContent = incorrectCount;
    elements.skippedQuestions.textContent = skippedCount;
    elements.averageTime.textContent = averageTime + 's';
    
    // Calcular nivel de rendimiento
    const percentage = (gameState.score / 300) * 100;
    let level, description, levelProgress;
    
    if (percentage >= 90) {
        level = '🏆 Excelente';
        description = 'Tu rendimiento es sobresaliente. Estás completamente preparado para el SABER 11.';
        levelProgress = 100;
    } else if (percentage >= 80) {
        level = '🥇 Muy Bueno';
        description = 'Muy buen rendimiento. Con un poco más de práctica estarás perfecto.';
        levelProgress = 85;
    } else if (percentage >= 70) {
        level = '🥈 Bueno';
        description = 'Buen rendimiento general. Revisa algunos temas para mejorar.';
        levelProgress = 70;
    } else if (percentage >= 60) {
        level = '🥉 Regular';
        description = 'Rendimiento regular. Es importante reforzar varios conceptos.';
        levelProgress = 55;
    } else {
        level = '📚 Necesitas Estudiar';
        description = 'Es necesario dedicar más tiempo al estudio y práctica.';
        levelProgress = 30;
    }
    
    elements.performanceLevel.textContent = level;
    elements.levelDescription.textContent = description;
    elements.levelBar.style.width = levelProgress + '%';
    
    // Análisis por categorías
    generateCategoryAnalysis();
    
    // Generar recomendaciones
    generateStudyRecommendations(correctCount, incorrectCount);
}

function generateCategoryAnalysis() {
    const categories = {};
    
    // Agrupar por categorías
    gameState.answers.forEach((answer, index) => {
        const question = questionBank[index];
        const category = question.category;
        
        if (!categories[category]) {
            categories[category] = { correct: 0, total: 0 };
        }
        
        categories[category].total++;
        if (answer.isCorrect) {
            categories[category].correct++;
        }
    });
    
    // Generar HTML para categorías
    elements.categoriesChart.innerHTML = '';
    
    Object.entries(categories).forEach(([category, stats]) => {
        const percentage = Math.round((stats.correct / stats.total) * 100);
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-item';
        
        categoryDiv.innerHTML = `
            <div class="category-name">${category}</div>
            <div class="category-progress">
                <div class="category-fill" style="width: ${percentage}%; background: ${getColorForPercentage(percentage)};"></div>
            </div>
            <div class="category-score">${stats.correct}/${stats.total}</div>
        `;
        
        elements.categoriesChart.appendChild(categoryDiv);
    });
}

function generateStudyRecommendations(correct, incorrect) {
    const recommendations = [];
    const percentage = (gameState.score / 300) * 100;
    
    if (percentage < 70) {
        recommendations.push('📖 Revisar conceptos fundamentales de álgebra y geometría');
        recommendations.push('🧮 Practicar más ejercicios de cálculo mental');
    }
    
    if (percentage < 80) {
        recommendations.push('📊 Reforzar conocimientos en estadística y probabilidad');
        recommendations.push('📐 Estudiar más problemas de geometría analítica');
    }
    
    if (percentage < 90) {
        recommendations.push('🎯 Practicar con más simulacros SABER 11');
        recommendations.push('⏰ Mejorar la gestión del tiempo en el examen');
    }
    
    recommendations.push('📚 Revisar las explicaciones de las respuestas incorrectas');
    recommendations.push('👨‍🏫 Consultar con tu docente sobre los temas más difíciles');
    
    elements.studyRecommendations.innerHTML = '';
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        elements.studyRecommendations.appendChild(li);
    });
}

function showReviewScreen() {
    showScreen('review');
    generateReviewContent();
}

function generateReviewContent() {
    elements.reviewList.innerHTML = '';
    
    gameState.answers.forEach((answer, index) => {
        const question = questionBank[index];
        const reviewItem = document.createElement('div');
        reviewItem.className = `review-item ${answer.isCorrect ? 'correct' : (answer.skipped ? 'skipped' : 'incorrect')}`;
        
        const statusIcon = answer.isCorrect ? '✅' : (answer.skipped ? '⏭️' : '❌');
        const userAnswerText = answer.skipped ? 'Pregunta saltada' : question.options[answer.selectedAnswer];
        
        reviewItem.innerHTML = `
            <div class="review-question">
                ${statusIcon} Pregunta ${index + 1}: ${question.text}
            </div>
            <div class="review-answers">
                <div class="review-answer user-answer">
                    Tu respuesta: ${userAnswerText}
                </div>
                <div class="review-answer correct-answer">
                    Respuesta correcta: ${question.options[question.correctAnswer]}
                </div>
            </div>
            <div class="review-explanation">
                💡 ${question.explanation}
            </div>
        `;
        
        elements.reviewList.appendChild(reviewItem);
    });
}

function shareResults() {
    const percentage = Math.round((gameState.score / 300) * 100);
    const text = `¡Completé el Simulador SABER 11 de Matemáticas!\n📊 Puntaje: ${gameState.score}/300 (${percentage}%)\n✅ Respuestas correctas: ${gameState.answers.filter(a => a.isCorrect).length}/${gameState.totalQuestions}\n\n¡Practica tú también! 🎯`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Mis resultados SABER 11',
            text: text
        });
    } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(text).then(() => {
            alert('¡Resultados copiados al portapapeles!');
        });
    }
}

// Timer functions
function startTimer() {
    gameState.timer = setInterval(() => {
        gameState.timeRemaining--;
        updateTimer();
        
        if (gameState.timeRemaining <= 0) {
            // Tiempo agotado para esta pregunta
            skipQuestion();
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    elements.timerSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Cambiar color del timer cuando queda poco tiempo
    if (gameState.timeRemaining <= 30) {
        elements.timerSpan.parentElement.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    }
}

function updateHeader() {
    elements.currentQuestionSpan.textContent = gameState.currentQuestion + 1;
    elements.totalQuestionsSpan.textContent = gameState.totalQuestions;
}

function updateScore() {
    elements.currentScoreSpan.textContent = gameState.score;
    
    // Animación de puntaje
    elements.currentScoreSpan.style.transform = 'scale(1.2)';
    elements.currentScoreSpan.style.color = 'var(--success-color)';
    
    setTimeout(() => {
        elements.currentScoreSpan.style.transform = 'scale(1)';
        elements.currentScoreSpan.style.color = 'var(--primary-color)';
    }, 300);
}

function showScreen(screenName) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar la pantalla seleccionada
    elements[screenName + 'Screen'].classList.add('active');
}

// Utility functions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getColorForPercentage(percentage) {
    if (percentage >= 80) return 'var(--success-color)';
    if (percentage >= 60) return 'var(--warning-color)';
    return 'var(--danger-color)';
}

// Event listeners para el modal
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Prevenir cierre accidental de la página
window.addEventListener('beforeunload', function(e) {
    if (gameState.currentQuestion > 0 && gameState.currentQuestion < gameState.totalQuestions) {
        e.preventDefault();
        e.returnValue = '¿Estás seguro de que quieres salir? Perderás el progreso del simulacro.';
    }
});

// Manejar visibilidad de la página (pausar timer cuando no está visible)
document.addEventListener('visibilitychange', function() {
    if (document.hidden && gameState.timer) {
        clearInterval(gameState.timer);
    } else if (!document.hidden && gameState.currentQuestion < gameState.totalQuestions) {
        startTimer();
    }
});

// Atajos de teclado
document.addEventListener('keydown', function(e) {
    // Solo funciona en la pantalla de preguntas
    if (!elements.questionScreen.classList.contains('active')) return;
    
    // Teclas A, B, C, D para seleccionar respuestas
    if (e.key.toLowerCase() >= 'a' && e.key.toLowerCase() <= 'd') {
        const index = e.key.toLowerCase().charCodeAt(0) - 97;
        if (index < questionBank[gameState.currentQuestion].options.length) {
            selectAnswer(index);
        }
    }
    
    // Enter para confirmar respuesta
    if (e.key === 'Enter' && !elements.confirmAnswerBtn.disabled) {
        confirmAnswer();
    }
    
    // Espacio para saltar pregunta
    if (e.key === ' ') {
        e.preventDefault();
        skipQuestion();
    }
});

console.log('🎯 Simulador SABER 11 - Matemáticas cargado correctamente!');