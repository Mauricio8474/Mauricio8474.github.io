/* Extracted from games/batalla_de_fracciones.html on 2025-08-28T03:35:45.635Z */
window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XZ1QWD1TCC');

// Redirige si no hay usuario autenticado
        if (!localStorage.getItem('currentUser') && !sessionStorage.getItem('currentUser')) {
            window.location.href = "complete-login-html.html";
        }
        // Variables globales del juego
        let gameState = {
            mode: 'comparacion',
            playerHealth: 100,
            enemyHealth: 100,
            score: 0,
            wins: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            currentStreak: 0,
            combo: 0,
            timeElapsed: 0,
            gameTimer: null,
            soundEnabled: true,
            powerUps: {
                hints: 3,
                timeBonus: 2
            },
            currentQuestion: null,
            difficulty: 1
        };

        // Inicializar el juego
        function initGame() {
            updateStats();
            newBattle();
            startTimer();
        }

        // Gestión del temporizador
        function startTimer() {
            gameState.gameTimer = setInterval(() => {
                gameState.timeElapsed++;
                updateTimerDisplay();
            }, 1000);
        }

        function updateTimerDisplay() {
            const minutes = Math.floor(gameState.timeElapsed / 60);
            const seconds = gameState.timeElapsed % 60;
            document.getElementById('timerDisplay').textContent = 
                `⏱️ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        // Generadores de fracciones
        function generateFraction(difficulty = 1) {
            const maxNum = difficulty <= 2 ? 12 : 20;
            const maxDen = difficulty <= 2 ? 12 : 20;
            
            let numerator, denominator;
            do {
                numerator = Math.floor(Math.random() * maxNum) + 1;
                denominator = Math.floor(Math.random() * maxDen) + 2;
            } while (numerator >= denominator && Math.random() > 0.3); // Prefiere fracciones propias
            
            return { numerator, denominator };
        }

        function simplifyFraction(numerator, denominator) {
            const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
            const commonDivisor = gcd(numerator, denominator);
            return {
                numerator: numerator / commonDivisor,
                denominator: denominator / commonDivisor
            };
        }

        function fractionToDecimal(fraction) {
            return fraction.numerator / fraction.denominator;
        }

        // Generadores de preguntas por modo
        function generateComparisonQuestion() {
            const fraction1 = generateFraction(gameState.difficulty);
            const fraction2 = generateFraction(gameState.difficulty);
            
            const value1 = fractionToDecimal(fraction1);
            const value2 = fractionToDecimal(fraction2);
            
            let correctAnswer, options;
            
            if (Math.abs(value1 - value2) < 0.01) {
                correctAnswer = 2; // Son iguales
                options = [
                    `${fraction1.numerator}/${fraction1.denominator}`,
                    `${fraction2.numerator}/${fraction2.denominator}`,
                    "Son iguales",
                    "No se puede determinar"
                ];
            } else if (value1 > value2) {
                correctAnswer = 0;
                options = [
                    `${fraction1.numerator}/${fraction1.denominator}`,
                    `${fraction2.numerator}/${fraction2.denominator}`,
                    "Son iguales",
                    "No se puede determinar"
                ];
            } else {
                correctAnswer = 1;
                options = [
                    `${fraction1.numerator}/${fraction1.denominator}`,
                    `${fraction2.numerator}/${fraction2.denominator}`,
                    "Son iguales",
                    "No se puede determinar"
                ];
            }
            
            return {
                question: "¿Cuál fracción es mayor?",
                playerFraction: fraction1,
                enemyFraction: fraction2,
                options,
                correctAnswer,
                explanation: generateComparisonExplanation(fraction1, fraction2)
            };
        }

        function generateSumQuestion() {
            const fraction1 = generateFraction(gameState.difficulty);
            const fraction2 = generateFraction(gameState.difficulty);
            
            // Calcular la suma
            const commonDen = fraction1.denominator * fraction2.denominator;
            const sumNum = (fraction1.numerator * fraction2.denominator) + (fraction2.numerator * fraction1.denominator);
            const result = simplifyFraction(sumNum, commonDen);
            
            // Generar opciones incorrectas
            const options = [
                `${result.numerator}/${result.denominator}`,
                `${result.numerator + 1}/${result.denominator}`,
                `${fraction1.numerator + fraction2.numerator}/${fraction1.denominator + fraction2.denominator}`,
                `${result.numerator}/${result.denominator + 1}`
            ];
            
            // Mezclar opciones
            const correctAnswer = 0;
            shuffleArray(options);
            const newCorrectIndex = options.indexOf(`${result.numerator}/${result.denominator}`);
            
            return {
                question: `¿Cuál es el resultado de ${fraction1.numerator}/${fraction1.denominator} + ${fraction2.numerator}/${fraction2.denominator}?`,
                playerFraction: fraction1,
                enemyFraction: fraction2,
                options,
                correctAnswer: newCorrectIndex,
                explanation: generateSumExplanation(fraction1, fraction2, result)
            };
        }

        function generateSubtractionQuestion() {
            let fraction1 = generateFraction(gameState.difficulty);
            let fraction2 = generateFraction(gameState.difficulty);
            
            // Asegurar que fraction1 > fraction2 para resultado positivo
            if (fractionToDecimal(fraction1) < fractionToDecimal(fraction2)) {
                [fraction1, fraction2] = [fraction2, fraction1];
            }
            
            const commonDen = fraction1.denominator * fraction2.denominator;
            const diffNum = (fraction1.numerator * fraction2.denominator) - (fraction2.numerator * fraction1.denominator);
            const result = simplifyFraction(diffNum, commonDen);
            
            const options = [
                `${result.numerator}/${result.denominator}`,
                `${result.numerator + 1}/${result.denominator}`,
                `${Math.abs(fraction1.numerator - fraction2.numerator)}/${Math.abs(fraction1.denominator - fraction2.denominator)}`,
                `${result.numerator}/${result.denominator + 1}`
            ];
            
            shuffleArray(options);
            const newCorrectIndex = options.indexOf(`${result.numerator}/${result.denominator}`);
            
            return {
                question: `¿Cuál es el resultado de ${fraction1.numerator}/${fraction1.denominator} - ${fraction2.numerator}/${fraction2.denominator}?`,
                playerFraction: fraction1,
                enemyFraction: fraction2,
                options,
                correctAnswer: newCorrectIndex,
                explanation: generateSubtractionExplanation(fraction1, fraction2, result)
            };
        }

        function generateMultiplicationQuestion() {
            const fraction1 = generateFraction(gameState.difficulty);
            const fraction2 = generateFraction(gameState.difficulty);
            
            const resultNum = fraction1.numerator * fraction2.numerator;
            const resultDen = fraction1.denominator * fraction2.denominator;
            const result = simplifyFraction(resultNum, resultDen);
            
            const options = [
                `${result.numerator}/${result.denominator}`,
                `${resultNum}/${resultDen}`, // Sin simplificar
                `${fraction1.numerator * fraction2.numerator}/${fraction1.denominator + fraction2.denominator}`,
                `${fraction1.numerator + fraction2.numerator}/${fraction1.denominator * fraction2.denominator}`
            ];
            
            shuffleArray(options);
            const newCorrectIndex = options.indexOf(`${result.numerator}/${result.denominator}`);
            
            return {
                question: `¿Cuál es el resultado de ${fraction1.numerator}/${fraction1.denominator} × ${fraction2.numerator}/${fraction2.denominator}?`,
                playerFraction: fraction1,
                enemyFraction: fraction2,
                options,
                correctAnswer: newCorrectIndex,
                explanation: generateMultiplicationExplanation(fraction1, fraction2, result)
            };
        }

        function generateDivisionQuestion() {
            const fraction1 = generateFraction(gameState.difficulty);
            const fraction2 = generateFraction(gameState.difficulty);
            
            const resultNum = fraction1.numerator * fraction2.denominator;
            const resultDen = fraction1.denominator * fraction2.numerator;
            const result = simplifyFraction(resultNum, resultDen);
            
            const options = [
                `${result.numerator}/${result.denominator}`,
                `${fraction1.numerator * fraction2.numerator}/${fraction1.denominator * fraction2.denominator}`,
                `${resultNum}/${resultDen}`, // Sin simplificar
                `${fraction1.numerator}/${fraction2.numerator}`
            ];
            
            shuffleArray(options);
            const newCorrectIndex = options.indexOf(`${result.numerator}/${result.denominator}`);
            
            return {
                question: `¿Cuál es el resultado de ${fraction1.numerator}/${fraction1.denominator} ÷ ${fraction2.numerator}/${fraction2.denominator}?`,
                playerFraction: fraction1,
                enemyFraction: fraction2,
                options,
                correctAnswer: newCorrectIndex,
                explanation: generateDivisionExplanation(fraction1, fraction2, result)
            };
        }

        // Generar explicaciones
        function generateComparisonExplanation(f1, f2) {
            const commonDen = f1.denominator * f2.denominator;
            const num1 = f1.numerator * f2.denominator;
            const num2 = f2.numerator * f1.denominator;
            
            return `Para comparar ${f1.numerator}/${f1.denominator} y ${f2.numerator}/${f2.denominator}:
                    <br>1. Encontramos denominador común: ${commonDen}
                    <br>2. ${f1.numerator}/${f1.denominator} = ${num1}/${commonDen}
                    <br>3. ${f2.numerator}/${f2.denominator} = ${num2}/${commonDen}
                    <br>4. Como ${num1} ${num1 > num2 ? '>' : num1 < num2 ? '<' : '='} ${num2}, entonces ${f1.numerator}/${f1.denominator} ${num1 > num2 ? '>' : num1 < num2 ? '<' : '='} ${f2.numerator}/${f2.denominator}`;
        }

        function generateSumExplanation(f1, f2, result) {
            const commonDen = f1.denominator * f2.denominator;
            const num1 = f1.numerator * f2.denominator;
            const num2 = f2.numerator * f1.denominator;
            
            return `Para sumar ${f1.numerator}/${f1.denominator} + ${f2.numerator}/${f2.denominator}:
                    <br>1. Denominador común: ${commonDen}
                    <br>2. ${f1.numerator}/${f1.denominator} = ${num1}/${commonDen}
                    <br>3. ${f2.numerator}/${f2.denominator} = ${num2}/${commonDen}
                    <br>4. ${num1}/${commonDen} + ${num2}/${commonDen} = ${num1 + num2}/${commonDen}
                    <br>5. Simplificando: ${result.numerator}/${result.denominator}`;
        }

        function generateSubtractionExplanation(f1, f2, result) {
            const commonDen = f1.denominator * f2.denominator;
            const num1 = f1.numerator * f2.denominator;
            const num2 = f2.numerator * f1.denominator;
            
            return `Para restar ${f1.numerator}/${f1.denominator} - ${f2.numerator}/${f2.denominator}:
                    <br>1. Denominador común: ${commonDen}
                    <br>2. ${f1.numerator}/${f1.denominator} = ${num1}/${commonDen}
                    <br>3. ${f2.numerator}/${f2.denominator} = ${num2}/${commonDen}
                    <br>4. ${num1}/${commonDen} - ${num2}/${commonDen} = ${num1 - num2}/${commonDen}
                    <br>5. Simplificando: ${result.numerator}/${result.denominator}`;
        }

        function generateMultiplicationExplanation(f1, f2, result) {
            return `Para multiplicar ${f1.numerator}/${f1.denominator} × ${f2.numerator}/${f2.denominator}:
                    <br>1. Multiplicamos numeradores: ${f1.numerator} × ${f2.numerator} = ${f1.numerator * f2.numerator}
                    <br>2. Multiplicamos denominadores: ${f1.denominator} × ${f2.denominator} = ${f1.denominator * f2.denominator}
                    <br>3. Resultado: ${f1.numerator * f2.numerator}/${f1.denominator * f2.denominator}
                    <br>4. Simplificando: ${result.numerator}/${result.denominator}`;
        }

        function generateDivisionExplanation(f1, f2, result) {
            return `Para dividir ${f1.numerator}/${f1.denominator} ÷ ${f2.numerator}/${f2.denominator}:
                    <br>1. Invertimos la segunda fracción: ${f2.denominator}/${f2.numerator}
                    <br>2. Multiplicamos: ${f1.numerator}/${f1.denominator} × ${f2.denominator}/${f2.numerator}
                    <br>3. ${f1.numerator} × ${f2.denominator} = ${f1.numerator * f2.denominator}
                    <br>4. ${f1.denominator} × ${f2.numerator} = ${f1.denominator * f2.numerator}
                    <br>5. Resultado: ${result.numerator}/${result.denominator}`;
        }

        // Funciones utilitarias
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        // Cambiar modo de juego
        function setGameMode(mode) {
            gameState.mode = mode;
            
            // Actualizar botones activos
            document.querySelectorAll('.mode-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Generar nueva pregunta
            newBattle();
            
            showAlert(`Modo cambiado a: ${mode}`, 'info');
        }

        // Nueva batalla
        function newBattle() {
            // Incrementar dificultad cada 5 preguntas correctas
            gameState.difficulty = Math.floor(gameState.correctAnswers / 5) + 1;
            
            let question;
            switch (gameState.mode) {
                case 'comparacion':
                    question = generateComparisonQuestion();
                    break;
                case 'suma':
                    question = generateSumQuestion();
                    break;
                case 'resta':
                    question = generateSubtractionQuestion();
                    break;
                case 'multiplicacion':
                    question = generateMultiplicationQuestion();
                    break;
                case 'division':
                    question = generateDivisionQuestion();
                    break;
                default:
                    question = generateComparisonQuestion();
            }
            
            gameState.currentQuestion = question;
            displayQuestion(question);
            updateFractionDisplays(question.playerFraction, question.enemyFraction);
        }

        // Mostrar pregunta
        function displayQuestion(question) {
            document.getElementById('questionText').innerHTML = question.question;
            
            const optionsContainer = document.getElementById('answerOptions');
            optionsContainer.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'answer-btn';
                button.textContent = option;
                button.onclick = () => selectAnswer(index);
                optionsContainer.appendChild(button);
            });
            
            // Ocultar explicación
            document.getElementById('explanationPanel').classList.remove('show');
        }

        // Actualizar displays de fracciones
        function updateFractionDisplays(playerFraction, enemyFraction) {
            // Actualizar fracción del jugador
            document.querySelector('#playerFraction .fraction-numerator').textContent = playerFraction.numerator;
            document.querySelector('#playerFraction .fraction-denominator').textContent = playerFraction.denominator;
            
            // Actualizar fracción del enemigo
            document.querySelector('#enemyFraction .fraction-numerator').textContent = enemyFraction.numerator;
            document.querySelector('#enemyFraction .fraction-denominator').textContent = enemyFraction.denominator;
            
            // Actualizar barras visuales
            const playerPercent = Math.min(100, (playerFraction.numerator / playerFraction.denominator) * 100);
            const enemyPercent = Math.min(100, (enemyFraction.numerator / enemyFraction.denominator) * 100);
            
            document.getElementById('playerFractionBar').style.width = playerPercent + '%';
            document.getElementById('enemyFractionBar').style.width = enemyPercent + '%';
        }

        // Seleccionar respuesta
        function selectAnswer(selectedIndex) {
            const buttons = document.querySelectorAll('.answer-btn');
            const isCorrect = selectedIndex === gameState.currentQuestion.correctAnswer;
            
            gameState.totalQuestions++;
            
            if (isCorrect) {
                buttons[selectedIndex].classList.add('correct');
                gameState.correctAnswers++;
                gameState.currentStreak++;
                gameState.combo++;
                
                // Daño al enemigo
                damageEnemy();
                
                // Puntuación con bonus por combo
                const baseScore = 100;
                const comboBonus = gameState.combo * 10;
                const timeBonus = Math.max(0, 30 - (gameState.timeElapsed % 60));
                gameState.score += baseScore + comboBonus + timeBonus;
                
                showAlert('¡Correcto! +' + (baseScore + comboBonus + timeBonus) + ' puntos', 'success');
                
                if (gameState.soundEnabled) playSound('correct');
            } else {
                buttons[selectedIndex].classList.add('wrong');
                buttons[gameState.currentQuestion.correctAnswer].classList.add('correct');
                
                gameState.currentStreak = 0;
                gameState.combo = 0;
                
                // Daño al jugador
                damagePlayer();
                
                showAlert('Incorrecto. La respuesta correcta es: ' + 
                         gameState.currentQuestion.options[gameState.currentQuestion.correctAnswer], 'error');
                
                if (gameState.soundEnabled) playSound('wrong');
            }
            
            // Deshabilitar botones
            buttons.forEach(btn => btn.disabled = true);
            
            updateStats();
            
            // Generar nueva pregunta después de un delay
            setTimeout(() => {
                if (gameState.playerHealth <= 0) {
                    showBattleResult(false);
                } else if (gameState.enemyHealth <= 0) {
                    showBattleResult(true);
                } else {
                    newBattle();
                }
            }, 2000);
        }

        // Sistema de daño
        function damagePlayer() {
            gameState.playerHealth = Math.max(0, gameState.playerHealth - 20);
            updateHealthBar('player', gameState.playerHealth);
        }

        function damageEnemy() {
            const damage = 15 + (gameState.combo * 2);
            gameState.enemyHealth = Math.max(0, gameState.enemyHealth - damage);
            updateHealthBar('enemy', gameState.enemyHealth);
        }

        function updateHealthBar(type, health) {
            const healthBar = document.getElementById(type + 'Health');
            const healthText = healthBar.querySelector('.health-text');
            
            healthBar.style.width = health + '%';
            healthText.textContent = health + ' HP';
        }

        // Actualizar estadísticas
        function updateStats() {
            document.getElementById('wins').textContent = gameState.wins;
            document.getElementById('streak').textContent = gameState.currentStreak;
            document.getElementById('score').textContent = gameState.score;
            document.getElementById('comboCounter').textContent = 'COMBO: ' + gameState.combo;
            
            const accuracy = gameState.totalQuestions > 0 ? 
                Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100) : 0;
            document.getElementById('accuracy').textContent = accuracy + '%';
        }

        // Mostrar resultado de batalla
        function showBattleResult(won) {
            if (won) {
                gameState.wins++;
                gameState.enemyHealth = 100; // Resetear para próxima batalla
            } else {
                gameState.playerHealth = 100; // Resetear para próxima batalla
            }
            
            const resultModal = document.getElementById('battleResult');
            const resultTitle = document.getElementById('resultTitle');
            const finalTime = document.getElementById('finalTime');
            const finalAccuracy = document.getElementById('finalAccuracy');
            const finalScore = document.getElementById('finalScore');
            
            resultTitle.textContent = won ? '🏆 ¡VICTORIA!' : '💀 DERROTA';
            
            const minutes = Math.floor(gameState.timeElapsed / 60);
            const seconds = gameState.timeElapsed % 60;
            finalTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            const accuracy = gameState.totalQuestions > 0 ? 
                Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100) : 0;
            finalAccuracy.textContent = accuracy + '%';
            finalScore.textContent = gameState.score;
            
            resultModal.classList.add('show');
            
            // Resetear salud
            gameState.playerHealth = 100;
            gameState.enemyHealth = 100;
            updateHealthBar('player', 100);
            updateHealthBar('enemy', 100);
        }

        function closeBattleResult() {
            document.getElementById('battleResult').classList.remove('show');
        }

        // Power-ups
        function usePowerUp(type) {
            if (type === 'hint' && gameState.powerUps.hints > 0) {
                gameState.powerUps.hints--;
                showExplanation();
                showAlert('💡 Pista utilizada! Te quedan ' + gameState.powerUps.hints, 'info');
            } else if (type === 'time' && gameState.powerUps.timeBonus > 0) {
                gameState.powerUps.timeBonus--;
                gameState.timeElapsed = Math.max(0, gameState.timeElapsed - 30);
                updateTimerDisplay();
                showAlert('⏰ ¡30 segundos añadidos! Te quedan ' + gameState.powerUps.timeBonus, 'info');
            } else {
                showAlert('❌ No tienes más power-ups de este tipo', 'error');
            }
        }

        // Mostrar explicación
        function showExplanation() {
            if (gameState.currentQuestion) {
                const panel = document.getElementById('explanationPanel');
                const stepByStep = document.getElementById('stepByStep');
                
                stepByStep.innerHTML = gameState.currentQuestion.explanation;
                panel.classList.add('show');
            }
        }

        // Funciones de control
        function resetGame() {
            if (confirm('¿Estás seguro de que quieres reiniciar el juego?')) {
                gameState = {
                    mode: 'comparacion',
                    playerHealth: 100,
                    enemyHealth: 100,
                    score: 0,
                    wins: 0,
                    totalQuestions: 0,
                    correctAnswers: 0,
                    currentStreak: 0,
                    combo: 0,
                    timeElapsed: 0,
                    gameTimer: gameState.gameTimer,
                    soundEnabled: gameState.soundEnabled,
                    powerUps: {
                        hints: 3,
                        timeBonus: 2
                    },
                    currentQuestion: null,
                    difficulty: 1
                };
                
                updateStats();
                updateHealthBar('player', 100);
                updateHealthBar('enemy', 100);
                newBattle();
                showAlert('🔄 Juego reiniciado', 'info');
            }
        }

        function toggleSound() {
            gameState.soundEnabled = !gameState.soundEnabled;
            const soundToggle = document.getElementById('soundToggle');
            soundToggle.textContent = gameState.soundEnabled ? '🔊' : '🔇';
        }

        // Funciones de sonido (simuladas)
        function playSound(type) {
            if (!gameState.soundEnabled) return;
            
            // En una implementación real, aquí se reproducirían sonidos
            console.log('Playing sound:', type);
        }

        // Sistema de alertas
        function showAlert(message, type) {
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.textContent = message;
            
            document.body.appendChild(alert);
            
            setTimeout(() => {
                alert.remove();
            }, 3000);
        }

        // Inicializar el juego cuando se carga la página
        window.addEventListener('load', initGame);
