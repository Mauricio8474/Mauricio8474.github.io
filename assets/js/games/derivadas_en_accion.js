window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XZ1QWD1TCC');

// Redirige si no hay usuario autenticado
        if (!localStorage.getItem('currentUser') && !sessionStorage.getItem('currentUser')) {
            window.location.replace('/complete-login-html.html');
        }
// Derivadas en Acción - JavaScript Game Logic
class DerivativesGame {
    constructor() {
        this.gameState = {
            currentLevel: 1,
            totalPoints: 0,
            streak: 0,
            energy: 100,
            currentScreen: 'welcome',
            gameMode: null,
            tutorialStep: 0,
            practiceProblems: [],
            challengeTimer: null,
            currentProblem: null,
            hintsUsed: 0,
            problemsCompleted: 0,
            correctAnswers: 0
        };

        this.problems = this.generateProblems();
        this.tutorialSteps = this.generateTutorialSteps();
        this.achievements = this.generateAchievements();
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.showScreen('welcome');
        this.updateStats();
        this.setupCanvas();
        this.createNotificationSystem();
    }

    bindEvents() {
        // Mode selection
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.startMode(mode);
            });
        });

        // Tutorial navigation
        document.getElementById('next-tutorial')?.addEventListener('click', () => this.nextTutorial());
        document.getElementById('prev-tutorial')?.addEventListener('click', () => this.prevTutorial());
        document.getElementById('tutorial-quiz')?.addEventListener('click', () => this.showTutorialQuiz());

        // Practice mode
        document.getElementById('check-answer')?.addEventListener('click', () => this.checkAnswer());
        document.getElementById('show-hint')?.addEventListener('click', () => this.showHint());
        document.getElementById('show-steps')?.addEventListener('click', () => this.toggleSteps());
        document.getElementById('skip-problem')?.addEventListener('click', () => this.skipProblem());

        // Input helpers
        document.querySelectorAll('.helper-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const symbol = e.target.dataset.symbol;
                this.insertSymbol(symbol);
            });
        });

        // Challenge mode
        document.querySelectorAll('.choice').forEach(choice => {
            choice.addEventListener('click', (e) => this.selectChoice(e.currentTarget));
        });

        // Visual lab controls
        document.getElementById('play-animation')?.addEventListener('click', () => this.playAnimation());
        document.getElementById('reset-graph')?.addEventListener('click', () => this.resetGraph());
        document.getElementById('function-select')?.addEventListener('change', (e) => this.changeFunction(e.target.value));
        document.getElementById('x-slider')?.addEventListener('input', (e) => this.updatePoint(parseFloat(e.target.value)));

        // Results actions
        document.getElementById('continue-playing')?.addEventListener('click', () => this.showScreen('welcome'));
        document.getElementById('review-mistakes')?.addEventListener('click', () => this.reviewMistakes());
        document.getElementById('share-progress')?.addEventListener('click', () => this.shareProgress());

        // FAB menu
        document.getElementById('help-fab')?.addEventListener('click', () => this.toggleFabMenu());
        document.querySelectorAll('.fab-option').forEach(option => {
            option.addEventListener('click', (e) => this.handleFabAction(e.target.dataset.action));
        });

        // Modal close
        document.querySelectorAll('.close-modal, .modal').forEach(element => {
            element.addEventListener('click', (e) => {
                if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal')) {
                    this.closeModal();
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    startMode(mode) {
        this.gameState.gameMode = mode;
        this.showScreen(mode);
        
        switch(mode) {
            case 'tutorial':
                this.startTutorial();
                break;
            case 'practice':
                this.startPractice();
                break;
            case 'challenge':
                this.startChallenge();
                break;
            case 'visual':
                this.startVisualLab();
                break;
        }
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(`${screenId}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.gameState.currentScreen = screenId;
        }
    }

    updateStats() {
        document.getElementById('current-level').textContent = this.gameState.currentLevel;
        document.getElementById('total-points').textContent = this.gameState.totalPoints;
        document.getElementById('streak').textContent = this.gameState.streak;
        document.getElementById('energy').textContent = this.gameState.energy;
    }

    // Tutorial System
    startTutorial() {
        this.gameState.tutorialStep = 0;
        this.showTutorialStep();
    }

    showTutorialStep() {
        const step = this.tutorialSteps[this.gameState.tutorialStep];
        if (!step) return;

        document.getElementById('tutorial-title').textContent = step.title;
        document.getElementById('tutorial-explanation').innerHTML = step.content;
        document.getElementById('tutorial-step').textContent = `${this.gameState.tutorialStep + 1} / ${this.tutorialSteps.length}`;
        
        const progressBar = document.getElementById('tutorial-progress-bar');
        const progress = ((this.gameState.tutorialStep + 1) / this.tutorialSteps.length) * 100;
        progressBar.style.width = `${progress}%`;

        // Update navigation buttons
        document.getElementById('prev-tutorial').disabled = this.gameState.tutorialStep === 0;
        document.getElementById('next-tutorial').disabled = this.gameState.tutorialStep === this.tutorialSteps.length - 1;

        if (step.interactive) {
            this.setupTutorialInteractive(step.interactive);
        }
    }

    nextTutorial() {
        if (this.gameState.tutorialStep < this.tutorialSteps.length - 1) {
            this.gameState.tutorialStep++;
            this.showTutorialStep();
        }
    }

    prevTutorial() {
        if (this.gameState.tutorialStep > 0) {
            this.gameState.tutorialStep--;
            this.showTutorialStep();
        }
    }

    setupTutorialInteractive(type) {
        const demoContainer = document.getElementById('tutorial-demo');
        
        switch(type) {
            case 'derivative_concept':
                demoContainer.innerHTML = `
                    <div class="interactive-slider">
                        <label>Mueve el punto x:</label>
                        <input type="range" id="concept-slider" min="-3" max="3" step="0.1" value="1">
                        <p>Observa cómo cambia la pendiente de la recta tangente</p>
                    </div>
                `;
                this.setupConceptDemo();
                break;
                
            case 'power_rule':
                demoContainer.innerHTML = `
                    <div class="rule-practice">
                        <h4>Practica la regla de la potencia:</h4>
                        <p>Si f(x) = x^n, entonces f'(x) = n·x^(n-1)</p>
                        <div class="practice-input">
                            <span>Deriva: x^</span>
                            <input type="number" id="power-input" min="1" max="10" value="3">
                            <button onclick="game.checkPowerRule()">Verificar</button>
                        </div>
                        <div id="power-result"></div>
                    </div>
                `;
                break;
        }
    }

    setupConceptDemo() {
        const slider = document.getElementById('concept-slider');
        if (slider) {
            slider.addEventListener('input', (e) => {
                const x = parseFloat(e.target.value);
                this.drawTangentLine(x);
            });
        }
    }

    checkPowerRule() {
        const power = parseInt(document.getElementById('power-input').value);
        const result = document.getElementById('power-result');
        
        result.innerHTML = `
            <div class="rule-result">
                <p><strong>f(x) = x^${power}</strong></p>
                <p><strong>f'(x) = ${power}·x^${power-1}</strong></p>
                <p class="explanation">Aplicando la regla: bajamos el exponente como coeficiente y restamos 1 al exponente.</p>
            </div>
        `;
        
        this.addPoints(50);
        this.showNotification('¡Correcto!', 'Has aplicado correctamente la regla de la potencia', 'success');
    }

    // Practice Mode
    startPractice() {
        this.loadNewProblem();
        this.gameState.hintsUsed = 0;
        document.getElementById('hints-count').textContent = '3';
    }

    loadNewProblem() {
        const difficulty = Math.min(Math.floor(this.gameState.currentLevel / 5) + 1, 5);
        this.gameState.currentProblem = this.getRandomProblem(difficulty);
        
        if (!this.gameState.currentProblem) return;

        document.getElementById('function-to-derive').textContent = this.gameState.currentProblem.function;
        document.getElementById('problem-type').textContent = this.gameState.currentProblem.type;
        document.getElementById('problem-difficulty').textContent = `Nivel ${difficulty}`;
        
        // Clear previous input
        document.getElementById('derivative-input').value = '';
        document.getElementById('steps-container').innerHTML = '';
        
        this.startTimer();
    }

    getRandomProblem(difficulty) {
        const problemsByDifficulty = this.problems.filter(p => p.difficulty === difficulty);
        return problemsByDifficulty[Math.floor(Math.random() * problemsByDifficulty.length)];
    }

    startTimer() {
        let timeLeft = 30;
        document.getElementById('problem-timer').textContent = timeLeft;
        
        const timer = setInterval(() => {
            timeLeft--;
            document.getElementById('problem-timer').textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                this.timeUp();
            }
        }, 1000);
        
        this.gameState.problemTimer = timer;
    }

    timeUp() {
        this.showNotification('¡Tiempo agotado!', 'Se te acabó el tiempo para resolver este problema', 'warning');
        this.skipProblem();
    }

    checkAnswer() {
        const userAnswer = document.getElementById('derivative-input').value.trim();
        if (!userAnswer) {
            this.showNotification('Respuesta vacía', 'Por favor ingresa tu respuesta', 'warning');
            return;
        }

        const isCorrect = this.validateAnswer(userAnswer, this.gameState.currentProblem.answer);
        
        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }
    }

    validateAnswer(userAnswer, correctAnswer) {
        // Simplificación básica de comparación de expresiones matemáticas
        const normalize = (expr) => expr.replace(/\s+/g, '').toLowerCase()
            .replace(/\*\*/g, '^')
            .replace(/\*/g, '')
            .replace(/\+\+/g, '+')
            .replace(/--/g, '+');
        
        return normalize(userAnswer) === normalize(correctAnswer);
    }

    handleCorrectAnswer() {
        clearInterval(this.gameState.problemTimer);
        
        const points = this.calculatePoints();
        this.addPoints(points);
        this.gameState.streak++;
        this.gameState.correctAnswers++;
        
        this.showNotification('¡Correcto!', `+${points} puntos`, 'success');
        this.showSteps();
        
        setTimeout(() => {
            this.loadNewProblem();
        }, 2000);
    }

    handleIncorrectAnswer() {
        this.gameState.streak = 0;
        this.reduceEnergy(10);
        
        this.showNotification('Respuesta incorrecta', 'Revisa tu solución e intenta nuevamente', 'error');
        
        if (this.gameState.energy <= 0) {
            this.endSession();
        }
    }

    calculatePoints() {
        let basePoints = 100;
        let timeBonus = Math.max(0, parseInt(document.getElementById('problem-timer').textContent) * 2);
        let streakBonus = this.gameState.streak * 10;
        let hintPenalty = this.gameState.hintsUsed * 10;
        
        return basePoints + timeBonus + streakBonus - hintPenalty;
    }

    showHint() {
        if (this.gameState.hintsUsed >= 3) {
            this.showNotification('Sin pistas', 'Ya has usado todas las pistas disponibles', 'warning');
            return;
        }

        const hint = this.gameState.currentProblem.hints[this.gameState.hintsUsed];
        document.getElementById('hint-content').innerHTML = `
            <div class="hint-text">
                <h4>Pista ${this.gameState.hintsUsed + 1}:</h4>
                <p>${hint}</p>
            </div>
        `;
        
        this.showModal('hint-modal');
        this.gameState.hintsUsed++;
        document.getElementById('hints-count').textContent = 3 - this.gameState.hintsUsed;
    }

    toggleSteps() {
        const stepsContainer = document.getElementById('steps-container');
        if (stepsContainer.children.length === 0) {
            this.showSteps();
        } else {
            stepsContainer.innerHTML = '';
        }
    }

    showSteps() {
        const stepsContainer = document.getElementById('steps-container');
        const steps = this.gameState.currentProblem.steps;
        
        stepsContainer.innerHTML = steps.map((step, index) => `
            <div class="step-item">
                <div class="step-number">${index + 1}</div>
                <div class="step-text">${step}</div>
            </div>
        `).join('');
    }

    skipProblem() {
        clearInterval(this.gameState.problemTimer);
        this.gameState.streak = 0;
        this.reduceEnergy(5);
        
        this.showNotification('Problema saltado', 'Se cargará un nuevo problema', 'info');
        
        setTimeout(() => {
            this.loadNewProblem();
        }, 1000);
    }

    insertSymbol(symbol) {
        const input = document.getElementById('derivative-input');
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const text = input.value;
        
        input.value = text.substring(0, start) + symbol + text.substring(end);
        input.focus();
        input.setSelectionRange(start + symbol.length, start + symbol.length);
    }

    // Challenge Mode
    startChallenge() {
        this.gameState.challengeTimer = 120; // 2 minutes
        this.gameState.problemsCompleted = 0;
        this.gameState.scoreMultiplier = 1;
        this.gameState.combo = 0;
        
        this.loadChallengeQuestion();
        this.startChallengeTimer();
    }

    startChallengeTimer() {
        const timerDisplay = document.getElementById('challenge-timer');
        
        const timer = setInterval(() => {
            this.gameState.challengeTimer--;
            const minutes = Math.floor(this.gameState.challengeTimer / 60);
            const seconds = this.gameState.challengeTimer % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (this.gameState.challengeTimer <= 0) {
                clearInterval(timer);
                this.endChallenge();
            }
        }, 1000);
    }

    loadChallengeQuestion() {
        const problem = this.getRandomProblem(Math.floor(Math.random() * 3) + 1);
        document.getElementById('rapid-function').textContent = problem.function;
        document.getElementById('current-problem-num').textContent = this.gameState.problemsCompleted + 1;
        
        // Generate multiple choice options
        const choices = this.generateChoices(problem.answer);
        const choiceElements = document.querySelectorAll('.choice');
        
        choiceElements.forEach((choice, index) => {
            choice.textContent = `${String.fromCharCode(65 + index)}) ${choices[index]}`;
            choice.dataset.choice = index;
            choice.dataset.correct = choices[index] === problem.answer ? 'true' : 'false';
            choice.classList.remove('selected', 'correct', 'incorrect');
        });
        
        this.gameState.currentProblem = problem;
    }

    generateChoices(correctAnswer) {
        const choices = [correctAnswer];
        
        // Generate 3 incorrect but plausible answers
        while (choices.length < 4) {
            const wrongAnswer = this.generateWrongAnswer(correctAnswer);
            if (!choices.includes(wrongAnswer)) {
                choices.push(wrongAnswer);
            }
        }
        
        // Shuffle choices
        for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }
        
        return choices;
    }

    generateWrongAnswer(correct) {
        // Simple wrong answer generation
        const variations = [
            correct.replace(/\d+/g, match => parseInt(match) + 1),
            correct.replace(/\d+/g, match => Math.max(1, parseInt(match) - 1)),
            correct + 'x',
            correct.replace('x', ''),
        ];
        
        return variations[Math.floor(Math.random() * variations.length)];
    }

    selectChoice(choiceElement) {
        document.querySelectorAll('.choice').forEach(c => c.classList.remove('selected'));
        choiceElement.classList.add('selected');
        
        const isCorrect = choiceElement.dataset.correct === 'true';
        
        setTimeout(() => {
            if (isCorrect) {
                choiceElement.classList.add('correct');
                this.handleChallengeCorrect();
            } else {
                choiceElement.classList.add('incorrect');
                document.querySelector('.choice[data-correct="true"]').classList.add('correct');
                this.handleChallengeIncorrect();
            }
            
            setTimeout(() => {
                this.loadChallengeQuestion();
            }, 1500);
        }, 500);
    }

    handleChallengeCorrect() {
        this.gameState.combo++;
        this.gameState.problemsCompleted++;
        
        const points = 50 * this.gameState.scoreMultiplier;
        this.addPoints(points);
        
        // Update multiplier based on combo
        if (this.gameState.combo > 0 && this.gameState.combo % 5 === 0) {
            this.gameState.scoreMultiplier = Math.min(this.gameState.scoreMultiplier + 0.5, 3);
        }
        
        this.updateChallengeDisplay();
        this.showNotification('¡Correcto!', `+${points} puntos`, 'success');
    }

    handleChallengeIncorrect() {
        this.gameState.combo = 0;
        this.gameState.scoreMultiplier = 1;
        this.updateChallengeDisplay();
        this.showNotification('Incorrecto', 'El combo se reinicia', 'error');
    }

    updateChallengeDisplay() {
        document.getElementById('problems-count').textContent = this.gameState.problemsCompleted;
        document.getElementById('score-multiplier').textContent = `${this.gameState.scoreMultiplier}x`;
        document.getElementById('combo-count').textContent = this.gameState.combo;
        
        const comboFill = document.getElementById('combo-fill');
        const comboProgress = (this.gameState.combo % 5) * 20;
        comboFill.style.width = `${comboProgress}%`;
    }

    endChallenge() {
        this.showNotification('¡Tiempo agotado!', `Problemas resueltos: ${this.gameState.problemsCompleted}`, 'info');
        this.showResults();
    }

    // Visual Laboratory
    startVisualLab() {
        this.setupGraph();
        this.changeFunction('polynomial');
    }

    setupGraph() {
        const canvas = document.getElementById('main-graph');
        if (!canvas) return;
        
        this.ctx = canvas.getContext('2d');
        this.graphState = {
            xMin: -4,
            xMax: 4,
            yMin: -4,
            yMax: 4,
            currentX: 1,
            currentFunction: 'polynomial'
        };
    }

    changeFunction(functionType) {
        this.graphState.currentFunction = functionType;
        this.drawGraph();
        this.updateAnalysis();
    }

    updatePoint(x) {
        this.graphState.currentX = x;
        document.getElementById('x-value').textContent = x.toFixed(1);
        this.drawGraph();
        this.updateAnalysis();
    }

    drawGraph() {
        if (!this.ctx) return;
        
        const canvas = this.ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, width, height);
        
        // Draw axes
        this.drawAxes();
        
        // Draw function
        this.drawFunction();
        
        // Draw tangent line
        this.drawTangentLine(this.graphState.currentX);
        
        // Draw current point
        this.drawCurrentPoint();
    }

    drawAxes() {
        const canvas = this.ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 1;
        
        // Grid lines
        for (let i = 0; i <= 10; i++) {
            const x = (width / 10) * i;
            const y = (height / 10) * i;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
        
        // Main axes
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(0, centerY);
        this.ctx.lineTo(width, centerY);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, 0);
        this.ctx.lineTo(centerX, height);
        this.ctx.stroke();
    }

    drawFunction() {
        const canvas = this.ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        
        this.ctx.strokeStyle = '#6366f1';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        for (let px = 0; px < width; px++) {
            const x = this.pixelToX(px);
            const y = this.evaluateFunction(x);
            const py = this.yToPixel(y);
            
            if (px === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        
        this.ctx.stroke();
    }

    drawTangentLine(x) {
        const canvas = this.ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        
        const y = this.evaluateFunction(x);
        const slope = this.evaluateDerivative(x);
        
        // Calculate line endpoints
        const x1 = x - 1;
        const y1 = y - slope;
        const x2 = x + 1;
        const y2 = y + slope;
        
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.xToPixel(x1), this.yToPixel(y1));
        this.ctx.lineTo(this.xToPixel(x2), this.yToPixel(y2));
        this.ctx.stroke();
    }

    drawCurrentPoint() {
        const x = this.graphState.currentX;
        const y = this.evaluateFunction(x);
        
        this.ctx.fillStyle = '#ef4444';
        this.ctx.beginPath();
        this.ctx.arc(this.xToPixel(x), this.yToPixel(y), 6, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    evaluateFunction(x) {
        switch (this.graphState.currentFunction) {
            case 'polynomial':
                return x * x * x - 3 * x;
            case 'quadratic':
                return x * x;
            case 'sine':
                return Math.sin(x);
            case 'exponential':
                return Math.exp(x / 2);
            case 'logarithmic':
                return x > 0 ? Math.log(x) : -Infinity;
            default:
                return 0;
        }
    }

    evaluateDerivative(x) {
        switch (this.graphState.currentFunction) {
            case 'polynomial':
                return 3 * x * x - 3;
            case 'quadratic':
                return 2 * x;
            case 'sine':
                return Math.cos(x);
            case 'exponential':
                return Math.exp(x / 2) / 2;
            case 'logarithmic':
                return x > 0 ? 1 / x : 0;
            default:
                return 0;
        }
    }

    pixelToX(px) {
        const canvas = this.ctx.canvas;
        return this.graphState.xMin + (px / canvas.width) * (this.graphState.xMax - this.graphState.xMin);
    }

    xToPixel(x) {
        const canvas = this.ctx.canvas;
        return ((x - this.graphState.xMin) / (this.graphState.xMax - this.graphState.xMin)) * canvas.width;
    }

    yToPixel(y) {
        const canvas = this.ctx.canvas;
        return canvas.height - ((y - this.graphState.yMin) / (this.graphState.yMax - this.graphState.yMin)) * canvas.height;
    }

    updateAnalysis() {
        const x = this.graphState.currentX;
        const y = this.evaluateFunction(x);
        const derivative = this.evaluateDerivative(x);
        
        document.getElementById('point-x').textContent = x.toFixed(1);
        document.getElementById('point-y').textContent = y.toFixed(1);
        document.getElementById('derivative-value').textContent = derivative.toFixed(1);
        
        let slopeDescription;
        if (Math.abs(derivative) < 0.1) {
            slopeDescription = 'Horizontal';
        } else if (derivative > 0) {
            slopeDescription = 'Creciente';
        } else {
            slopeDescription = 'Decreciente';
        }
        
        document.getElementById('slope-description').textContent = slopeDescription;
        
        this.updateInterpretation(derivative);
    }

    updateInterpretation(derivative) {
        let interpretation;
        
        if (Math.abs(derivative) < 0.1) {
            interpretation = 'En este punto, la función tiene una pendiente horizontal, lo que indica un máximo o mínimo local.';
        } else if (derivative > 0) {
            interpretation = `La función está creciendo con una pendiente de ${derivative.toFixed(2)}. Esto significa que por cada unidad que aumenta x, y aumenta aproximadamente ${derivative.toFixed(2)} unidades.`;
        } else {
            interpretation = `La función está decreciendo con una pendiente de ${derivative.toFixed(2)}. Esto significa que por cada unidad que aumenta x, y disminuye aproximadamente ${Math.abs(derivative).toFixed(2)} unidades.`;
        }
        
        document.getElementById('interpretation-text').textContent = interpretation;
    }

    playAnimation() {
        let animationX = -3;
        const animateStep = () => {
            if (animationX <= 3) {
                this.updatePoint(animationX);
                document.getElementById('x-slider').value = animationX;
                animationX += 0.1;
                setTimeout(animateStep, 100);
            }
        };
        animateStep();
    }

    resetGraph() {
        this.updatePoint(0);
        document.getElementById('x-slider').value = 0;
    }

    // Results and Statistics
    showResults() {
        this.showScreen('results');
        
        const accuracy = this.gameState.problemsCompleted > 0 
            ? Math.round((this.gameState.correctAnswers / this.gameState.problemsCompleted) * 100)
            : 0;
        
        document.getElementById('final-score').textContent = this.gameState.totalPoints;
        document.getElementById('problems-solved').textContent = this.gameState.problemsCompleted;
        document.getElementById('accuracy-rate').textContent = `${accuracy}%`;
        
        this.displayAchievements();
        this.updateSkillProgress();
    }

    displayAchievements() {
        const achievementsGrid = document.getElementById('achievements-grid');
        const unlockedAchievements = this.checkAchievements();
        
        achievementsGrid.innerHTML = unlockedAchievements.map(achievement => `
            <div class="achievement-card ${achievement.unlocked ? 'unlocked' : ''}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-description">${achievement.description}</div>
            </div>
        `).join('');
    }

    checkAchievements() {
        return this.achievements.map(achievement => ({
            ...achievement,
            unlocked: achievement.condition(this.gameState)
        }));
    }

    updateSkillProgress() {
        // Esta función actualizaría el progreso de habilidades basado en el rendimiento
        // Por simplicidad, usamos valores simulados
    }

    // Utility Functions
    addPoints(points) {
        this.gameState.totalPoints += points;
        this.updateStats();
        
        // Check for level up
        const newLevel = Math.floor(this.gameState.totalPoints / 1000) + 1;
        if (newLevel > this.gameState.currentLevel) {
            this.levelUp(newLevel);
        }
    }

    levelUp(newLevel) {
        this.gameState.currentLevel = newLevel;
        this.showNotification('¡Nivel superior!', `Ahora estás en el nivel ${newLevel}`, 'success');
        this.updateStats();
    }

    reduceEnergy(amount) {
        this.gameState.energy = Math.max(0, this.gameState.energy - amount);
        this.updateStats();
    }

    endSession() {
        this.showNotification('Sesión terminada', 'Te has quedado sin energía', 'warning');
        setTimeout(() => this.showResults(), 2000);
    }

    // Modal System
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    // Notification System
    createNotificationSystem() {
        if (!document.getElementById('notifications')) {
            const notificationsContainer = document.createElement('div');
            notificationsContainer.id = 'notifications';
            notificationsContainer.className = 'notifications-container';
            document.body.appendChild(notificationsContainer);
        }
    }

    showNotification(title, message, type = 'info', duration = 3000) {
        const notificationsContainer = document.getElementById('notifications');
        if (!notificationsContainer) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        `;

        notificationsContainer.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    // Canvas Setup
    setupCanvas() {
        const tutorialCanvas = document.getElementById('tutorial-canvas');
        if (tutorialCanvas) {
            this.tutorialCtx = tutorialCanvas.getContext('2d');
            this.drawTutorialGraph();
        }
    }

    drawTutorialGraph() {
        if (!this.tutorialCtx) return;

        const canvas = this.tutorialCtx.canvas;
        canvas.width = 400;
        canvas.height = 300;
        
        // Clear and setup
        this.tutorialCtx.fillStyle = 'white';
        this.tutorialCtx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw simple parabola for tutorial
        this.tutorialCtx.strokeStyle = '#6366f1';
        this.tutorialCtx.lineWidth = 3;
        this.tutorialCtx.beginPath();
        
        for (let x = -2; x <= 2; x += 0.1) {
            const screenX = (x + 2) * (canvas.width / 4);
            const y = x * x - 1;
            const screenY = canvas.height - ((y + 2) * (canvas.height / 4));
            
            if (x === -2) {
                this.tutorialCtx.moveTo(screenX, screenY);
            } else {
                this.tutorialCtx.lineTo(screenX, screenY);
            }
        }
        
        this.tutorialCtx.stroke();
    }

    // FAB Menu
    toggleFabMenu() {
        const fabMenu = document.querySelector('.fab-menu');
        if (fabMenu) {
            fabMenu.classList.toggle('active');
        }
    }

    handleFabAction(action) {
        switch (action) {
            case 'tutorial':
                this.startMode('tutorial');
                break;
            case 'formulas':
                this.showFormulas();
                break;
            case 'calculator':
                this.openCalculator();
                break;
        }
    }

    showFormulas() {
        const formulasContent = `
            <h3>📝 Fórmulas de Derivadas</h3>
            <div class="formulas-list">
                <div class="formula-item">
                    <strong>Regla de la Potencia:</strong> (x^n)' = n·x^(n-1)
                </div>
                <div class="formula-item">
                    <strong>Regla de la Constante:</strong> (c)' = 0
                </div>
                <div class="formula-item">
                    <strong>Regla de la Suma:</strong> (f + g)' = f' + g'
                </div>
                <div class="formula-item">
                    <strong>Regla del Producto:</strong> (f·g)' = f'·g + f·g'
                </div>
                <div class="formula-item">
                    <strong>Regla del Cociente:</strong> (f/g)' = (f'·g - f·g')/g²
                </div>
                <div class="formula-item">
                    <strong>Regla de la Cadena:</strong> (f(g(x)))' = f'(g(x))·g'(x)
                </div>
            </div>
        `;
        
        document.getElementById('hint-content').innerHTML = formulasContent;
        this.showModal('hint-modal');
    }

    openCalculator() {
        this.showNotification('Calculadora', 'Funcionalidad en desarrollo', 'info');
    }

    // Keyboard Shortcuts
    handleKeyboard(e) {
        if (this.gameState.currentScreen === 'practice') {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.checkAnswer();
            } else if (e.key === 'h' && e.ctrlKey) {
                e.preventDefault();
                this.showHint();
            } else if (e.key === 's' && e.ctrlKey) {
                e.preventDefault();
                this.toggleSteps();
            }
        }
        
        if (e.key === 'Escape') {
            this.closeModal();
        }
    }

    // Additional actions for results screen
    reviewMistakes() {
        this.showNotification('Revisión', 'Funcionalidad en desarrollo', 'info');
    }

    shareProgress() {
        const shareText = `¡Acabo de completar una sesión de Derivadas en Acción!\n\nPuntos: ${this.gameState.totalPoints}\nProblemas resueltos: ${this.gameState.problemsCompleted}\nNivel: ${this.gameState.currentLevel}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Mi progreso en Derivadas en Acción',
                text: shareText
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Copiado', 'Progreso copiado al portapapeles', 'success');
            });
        }
    }

    // Data Generation Functions
    generateProblems() {
        return [
            // Nivel 1 - Regla de la potencia básica
            {
                id: 1,
                function: "f(x) = x³",
                answer: "3x²",
                type: "Regla de la Potencia",
                difficulty: 1,
                steps: [
                    "Identificar que es una función potencia: f(x) = x³",
                    "Aplicar la regla: (x^n)' = n·x^(n-1)",
                    "Sustituir n=3: (x³)' = 3·x^(3-1) = 3x²"
                ],
                hints: [
                    "Recuerda la regla de la potencia: (x^n)' = n·x^(n-1)",
                    "En este caso, n = 3",
                    "Baja el exponente como coeficiente y resta 1 al exponente"
                ]
            },
            {
                id: 2,
                function: "f(x) = 2x⁴",
                answer: "8x³",
                type: "Regla de la Potencia",
                difficulty: 1,
                steps: [
                    "Identificar la constante multiplicativa: 2",
                    "Aplicar la regla de la potencia: (x⁴)' = 4x³",
                    "Multiplicar por la constante: 2 × 4x³ = 8x³"
                ],
                hints: [
                    "Las constantes se mantienen al derivar",
                    "Deriva x⁴ usando la regla de la potencia",
                    "No olvides multiplicar por el coeficiente 2"
                ]
            },
            // Nivel 2 - Suma de términos
            {
                id: 3,
                function: "f(x) = x² + 3x - 5",
                answer: "2x + 3",
                type: "Regla de la Suma",
                difficulty: 2,
                steps: [
                    "Derivar cada término por separado",
                    "(x²)' = 2x",
                    "(3x)' = 3",
                    "(-5)' = 0",
                    "Sumar los resultados: 2x + 3 + 0 = 2x + 3"
                ],
                hints: [
                    "Deriva término por término",
                    "La derivada de una constante es 0",
                    "La derivada de 3x es 3"
                ]
            },
            {
                id: 4,
                function: "f(x) = 4x³ - 2x² + 7x",
                answer: "12x² - 4x + 7",
                type: "Regla de la Suma",
                difficulty: 2,
                steps: [
                    "(4x³)' = 4 × 3x² = 12x²",
                    "(-2x²)' = -2 × 2x = -4x",
                    "(7x)' = 7",
                    "Resultado: 12x² - 4x + 7"
                ],
                hints: [
                    "Deriva cada término usando la regla de la potencia",
                    "No olvides los signos negativos",
                    "La derivada de 7x es simplemente 7"
                ]
            },
            // Nivel 3 - Regla del producto
            {
                id: 5,
                function: "f(x) = x²(x + 1)",
                answer: "3x² + 2x",
                type: "Regla del Producto",
                difficulty: 3,
                steps: [
                    "Expandir primero: x²(x + 1) = x³ + x²",
                    "Derivar: (x³)' + (x²)' = 3x² + 2x",
                    "O usar regla del producto: (uv)' = u'v + uv'"
                ],
                hints: [
                    "Puedes expandir primero o usar la regla del producto",
                    "Si expandes: x²(x + 1) = x³ + x²",
                    "Luego deriva término por término"
                ]
            }
            // Se pueden agregar más problemas de niveles superiores...
        ];
    }

    generateTutorialSteps() {
        return [
            {
                title: "¿Qué es una derivada?",
                content: `
                    <h3>🎯 Concepto Principal</h3>
                    <p>La derivada de una función representa la <strong>tasa de cambio instantánea</strong> o la <strong>pendiente de la recta tangente</strong> en cualquier punto de la función.</p>
                    
                    <div class="key-points">
                        <h4>💡 Puntos Clave:</h4>
                        <ul>
                            <li>La derivada nos dice qué tan rápido cambia una función</li>
                            <li>Se denota como f'(x) o df/dx</li>
                            <li>Geométricamente es la pendiente de la recta tangente</li>
                        </ul>
                    </div>
                `,
                interactive: 'derivative_concept'
            },
            {
                title: "Regla de la Potencia",
                content: `
                    <h3>⚡ Regla Fundamental</h3>
                    <p>Para derivar funciones de la forma x^n:</p>
                    <div class="formula-box">
                        <strong>Si f(x) = x^n, entonces f'(x) = n·x^(n-1)</strong>
                    </div>
                    
                    <h4>Ejemplos:</h4>
                    <ul>
                        <li>f(x) = x³ → f'(x) = 3x²</li>
                        <li>f(x) = x⁵ → f'(x) = 5x⁴</li>
                        <li>f(x) = x → f'(x) = 1</li>
                    </ul>
                `,
                interactive: 'power_rule'
            },
            {
                title: "Regla de la Constante",
                content: `
                    <h3>🔢 Constantes</h3>
                    <p>Las constantes desaparecen al derivar:</p>
                    <div class="formula-box">
                        <strong>Si f(x) = c (constante), entonces f'(x) = 0</strong>
                    </div>
                    
                    <p>Sin embargo, si la constante multiplica a una función:</p>
                    <div class="formula-box">
                        <strong>Si f(x) = c·g(x), entonces f'(x) = c·g'(x)</strong>
                    </div>
                `
            },
            {
                title: "Regla de la Suma",
                content: `
                    <h3>➕ Suma de Funciones</h3>
                    <p>La derivada de una suma es la suma de las derivadas:</p>
                    <div class="formula-box">
                        <strong>(f + g)' = f' + g'</strong>
                    </div>
                    
                    <h4>Ejemplo:</h4>
                    <p>f(x) = x³ + 2x² - 5x + 3</p>
                    <p>f'(x) = 3x² + 4x - 5 + 0 = 3x² + 4x - 5</p>
                `
            },
            {
                title: "Regla del Producto",
                content: `
                    <h3>✖️ Producto de Funciones</h3>
                    <p>Para el producto de dos funciones:</p>
                    <div class="formula-box">
                        <strong>(f·g)' = f'·g + f·g'</strong>
                    </div>
                    
                    <h4>Ejemplo:</h4>
                    <p>f(x) = x²(x + 1)</p>
                    <p>u = x², u' = 2x</p>
                    <p>v = x + 1, v' = 1</p>
                    <p>f'(x) = 2x(x + 1) + x²(1) = 2x² + 2x + x² = 3x² + 2x</p>
                `
            },
            {
                title: "¡A Practicar!",
                content: `
                    <h3>🎮 Hora de Practicar</h3>
                    <p>Ahora que conoces las reglas básicas, es momento de aplicarlas.</p>
                    
                    <div class="practice-tips">
                        <h4>💡 Consejos para practicar:</h4>
                        <ul>
                            <li>Identifica qué regla aplicar</li>
                            <li>Trabaja paso a paso</li>
                            <li>Verifica tu resultado</li>
                            <li>Usa las pistas si necesitas ayuda</li>
                        </ul>
                    </div>
                    
                    <p><strong>¡Estás listo para el modo práctica!</strong></p>
                `
            }
        ];
    }

    generateAchievements() {
        return [
            {
                id: 'first_correct',
                title: 'Primer Éxito',
                description: 'Resuelve tu primera derivada correctamente',
                icon: '🎯',
                condition: (state) => state.correctAnswers >= 1
            },
            {
                id: 'streak_5',
                title: 'En Racha',
                description: 'Consigue una racha de 5 respuestas correctas',
                icon: '🔥',
                condition: (state) => state.streak >= 5
            },
            {
                id: 'points_1000',
                title: 'Millar',
                description: 'Alcanza 1000 puntos',
                icon: '💰',
                condition: (state) => state.totalPoints >= 1000
            },
            {
                id: 'level_5',
                title: 'Experto',
                description: 'Alcanza el nivel 5',
                icon: '🏆',
                condition: (state) => state.currentLevel >= 5
            },
            {
                id: 'problems_50',
                title: 'Incansable',
                description: 'Resuelve 50 problemas',
                icon: '⚡',
                condition: (state) => state.problemsCompleted >= 50
            }
        ];
    }
}

// Initialize the game when the page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new DerivativesGame();
});

// Export for global access
window.game = game;