/* Extracted from games/ruleta-probabilidades-game.html on 2025-08-28T03:35:45.672Z */
window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XZ1QWD1TCC');

// Redirige si no hay usuario autenticado
        if (!localStorage.getItem('currentUser') && !sessionStorage.getItem('currentUser')) {
            window.location.replace('/complete-login-html.html');
        }
        // Estado del juego
        let gameState = {
            currentLevel: 0,
            totalScore: 0,
            correctAnswers: 0,
            totalQuestions: 0,
            experimentResults: [],
            isSpinning: false,
            lastResult: null
        };

        // Configuraciones de niveles
        const levels = [
            {
                title: "Ruleta de Colores Básica",
                description: "Una ruleta dividida en 6 secciones iguales con diferentes colores.",
                segments: [
                    {color: "#e74c3c", label: "Rojo", count: 2},
                    {color: "#3498db", label: "Azul", count: 2},
                    {color: "#2ecc71", label: "Verde", count: 1},
                    {color: "#f39c12", label: "Amarillo", count: 1}
                ],
                question: "el color ROJO",
                correctFraction: [2, 6],
                tip: "Cuenta cuántas secciones rojas hay del total de secciones."
            },
            {
                title: "Dados de Seis Caras",
                description: "Un dado estándar con números del 1 al 6.",
                segments: [
                    {color: "#9b59b6", label: "1", count: 1},
                    {color: "#e67e22", label: "2", count: 1},
                    {color: "#1abc9c", label: "3", count: 1},
                    {color: "#e74c3c", label: "4", count: 1},
                    {color: "#3498db", label: "5", count: 1},
                    {color: "#2ecc71", label: "6", count: 1}
                ],
                question: "un número PAR",
                correctFraction: [3, 6],
                tip: "Los números pares en un dado son: 2, 4, 6"
            },
            {
                title: "Bolsa de Caramelos",
                description: "Una bolsa con 12 caramelos de diferentes sabores.",
                segments: [
                    {color: "#e74c3c", label: "Fresa", count: 4},
                    {color: "#f39c12", label: "Naranja", count: 3},
                    {color: "#2ecc71", label: "Menta", count: 3},
                    {color: "#9b59b6", label: "Uva", count: 2}
                ],
                question: "un caramelo de FRESA",
                correctFraction: [4, 12],
                tip: "Simplifica la fracción dividiendo numerador y denominador por su máximo común divisor."
            },
            {
                title: "Cartas Básicas",
                description: "8 cartas: 4 rojas y 4 negras.",
                segments: [
                    {color: "#e74c3c", label: "♥️", count: 2},
                    {color: "#e74c3c", label: "♦️", count: 2},
                    {color: "#2c3e50", label: "♠️", count: 2},
                    {color: "#2c3e50", label: "♣️", count: 2}
                ],
                question: "una carta ROJA",
                correctFraction: [4, 8],
                tip: "Las cartas rojas son corazones y diamantes."
            },
            {
                title: "Spinner de Deportes",
                description: "Ruleta con diferentes deportes, algunos más frecuentes que otros.",
                segments: [
                    {color: "#27ae60", label: "Fútbol", count: 5},
                    {color: "#e67e22", label: "Básquet", count: 3},
                    {color: "#3498db", label: "Tenis", count: 2},
                    {color: "#9b59b6", label: "Natación", count: 2},
                    {color: "#e74c3c", label: "Atletismo", count: 1},
                    {color: "#f39c12", label: "Voleibol", count: 1}
                ],
                question: "FÚTBOL",
                correctFraction: [5, 14],
                tip: "El fútbol ocupa 5 secciones de un total de 14 secciones."
            }
        ];

        // Inicializar juego
        function initGame() {
            updateScoreboard();
            loadLevel();
        }

        // Actualizar marcadores
        function updateScoreboard() {
            document.getElementById('current-level').textContent = gameState.currentLevel + 1;
            document.getElementById('total-score').textContent = gameState.totalScore;
            document.getElementById('experiments-done').textContent = gameState.experimentResults.length;
            
            const accuracy = gameState.totalQuestions > 0 ? 
                Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100) : 0;
            document.getElementById('accuracy').textContent = accuracy + '%';
        }

        // Cargar nivel actual
        function loadLevel() {
            if (gameState.currentLevel >= levels.length) {
                endGame();
                return;
            }

            const level = levels[gameState.currentLevel];
            
            document.getElementById('wheel-title').textContent = level.title;
            document.getElementById('scenario-title').textContent = level.title;
            document.getElementById('scenario-description').textContent = level.description;
            document.getElementById('target-outcome').textContent = level.question;
            
            createWheel(level.segments);
            clearInputs();
            hideElements();
            updateScoreboard();
        }

        // Crear ruleta visual
        function createWheel(segments) {
            const wheel = document.getElementById('probability-wheel');
            wheel.innerHTML = '';

            let totalSegments = segments.reduce((sum, seg) => sum + seg.count, 0);
            let currentAngle = 0;
            const segmentAngle = 360 / totalSegments;

            segments.forEach(segment => {
                for (let i = 0; i < segment.count; i++) {
                    const segmentDiv = document.createElement('div');
                    segmentDiv.style.position = 'absolute';
                    segmentDiv.style.width = '50%';
                    segmentDiv.style.height = '50%';
                    segmentDiv.style.backgroundColor = segment.color;
                    segmentDiv.style.transformOrigin = '100% 100%';
                    segmentDiv.style.transform = `rotate(${currentAngle}deg)`;
                    segmentDiv.style.clipPath = `polygon(100% 100%, 100% 0%, ${100 - (100 * Math.sin(segmentAngle * Math.PI / 180))}% ${100 * Math.cos(segmentAngle * Math.PI / 180)}%)`;
                    
                    // Añadir etiqueta
                    const label = document.createElement('span');
                    label.textContent = segment.label;
                    label.style.position = 'absolute';
                    label.style.top = '20%';
                    label.style.left = '70%';
                    label.style.transform = 'translate(-50%, -50%)';
                    label.style.fontWeight = 'bold';
                    label.style.fontSize = '0.8rem';
                    label.style.color = segment.color === '#f39c12' || segment.color === '#2ecc71' ? '#000' : '#fff';
                    segmentDiv.appendChild(label);
                    
                    wheel.appendChild(segmentDiv);
                    currentAngle += segmentAngle;
                }
            });
        }

        // Girar ruleta
        function spinWheel() {
            if (gameState.isSpinning) return;

            gameState.isSpinning = true;
            const wheel = document.getElementById('probability-wheel');
            const spinButton = document.getElementById('spin-button');
            const resultDiv = document.getElementById('wheel-result');

            spinButton.disabled = true;
            spinButton.textContent = '🌀 Girando...';

            const level = levels[gameState.currentLevel];
            const totalSegments = level.segments.reduce((sum, seg) => sum + seg.count, 0);
            
            // Crear array con todos los resultados posibles
            let possibleResults = [];
            level.segments.forEach(segment => {
                for (let i = 0; i < segment.count; i++) {
                    possibleResults.push(segment);
                }
            });

            // Seleccionar resultado aleatorio
            const randomIndex = Math.floor(Math.random() * possibleResults.length);
            const result = possibleResults[randomIndex];
            gameState.lastResult = result;

            // Calcular ángulo final
            const segmentAngle = 360 / totalSegments;
            const finalAngle = (randomIndex * segmentAngle) + (Math.random() * segmentAngle);
            const spins = 5 + Math.random() * 3; // 5-8 vueltas completas
            const totalRotation = (spins * 360) + finalAngle;

            wheel.style.transform = `rotate(${totalRotation}deg)`;

            setTimeout(() => {
                gameState.isSpinning = false;
                spinButton.disabled = false;
                spinButton.textContent = '🎯 ¡Girar Ruleta!';
                
                resultDiv.innerHTML = `
                    <div style="color: ${result.color}; font-size: 1.5rem;">
                        Resultado: ${result.label}
                    </div>
                `;
            }, 3000);
        }

        // Verificar respuesta
        function checkAnswer() {
            const level = levels[gameState.currentLevel];
            const numerator = parseInt(document.getElementById('numerator').value);
            const denominator = parseInt(document.getElementById('denominator').value);
            const decimal = parseFloat(document.getElementById('decimal').value);
            const percentage = parseFloat(document.getElementById('percentage').value);

            gameState.totalQuestions++;

            // Calcular respuesta correcta
            const correctNum = level.correctFraction[0];
            const correctDen = level.correctFraction[1];
            const correctDecimal = correctNum / correctDen;
            const correctPercentage = correctDecimal * 100;

            // Verificar si alguna respuesta es correcta
            let isCorrect = false;
            let correctFormats = [];

            // Verificar fracción (incluyendo equivalentes)
            if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
                if (numerator / denominator === correctDecimal) {
                    isCorrect = true;
                    correctFormats.push('fracción');
                }
            }

            // Verificar decimal (con tolerancia)
            if (!isNaN(decimal)) {
                if (Math.abs(decimal - correctDecimal) < 0.01) {
                    isCorrect = true;
                    correctFormats.push('decimal');
                }
            }

            // Verificar porcentaje (con tolerancia)
            if (!isNaN(percentage)) {
                if (Math.abs(percentage - correctPercentage) < 1) {
                    isCorrect = true;
                    correctFormats.push('porcentaje');
                }
            }

            const feedback = document.getElementById('feedback');
            
            if (isCorrect) {
                gameState.correctAnswers++;
                gameState.totalScore += 100;
                feedback.className = 'feedback correct';
                feedback.innerHTML = `
                    <div>🎉 ¡Correcto! +100 puntos</div>
                    <div style="margin-top: 10px;">
                        <strong>Respuestas correctas:</strong><br>
                        • Fracción: ${correctNum}/${correctDen} (simplificada: ${simplifyFraction(correctNum, correctDen).join('/')})<br>
                        • Decimal: ${correctDecimal.toFixed(3)}<br>
                        • Porcentaje: ${correctPercentage.toFixed(1)}%
                    </div>
                    <div style="margin-top: 10px; font-size: 0.9rem;">
                        ${level.tip}
                    </div>
                `;
            } else {
                feedback.className = 'feedback wrong';
                feedback.innerHTML = `
                    <div>❌ Incorrecto. ¡Inténtalo de nuevo!</div>
                    <div style="margin-top: 10px;">
                        <strong>Respuestas correctas:</strong><br>
                        • Fracción: ${correctNum}/${correctDen} (simplificada: ${simplifyFraction(correctNum, correctDen).join('/')})<br>
                        • Decimal: ${correctDecimal.toFixed(3)}<br>
                        • Porcentaje: ${correctPercentage.toFixed(1)}%
                    </div>
                    <div style="margin-top: 10px; font-size: 0.9rem;">
                        💡 ${level.tip}
                    </div>
                `;
            }

            feedback.style.display = 'block';
            document.getElementById('next-button').style.display = 'block';
            updateScoreboard();
        }

        // Simplificar fracción
        function simplifyFraction(num, den) {
            const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
            const divisor = gcd(num, den);
            return [num / divisor, den / divisor];
        }

        // Ejecutar experimento
        function runExperiment() {
            const level = levels[gameState.currentLevel];
            const totalSegments = level.segments.reduce((sum, seg) => sum + seg.count, 0);
            
            // Crear array con todos los resultados posibles
            let possibleResults = [];
            level.segments.forEach(segment => {
                for (let i = 0; i < segment.count; i++) {
                    possibleResults.push(segment);
                }
            });

            // Simular 20 experimentos
            const experimentCount = 20;
            let results = [];
            
            for (let i = 0; i < experimentCount; i++) {
                const randomIndex = Math.floor(Math.random() * possibleResults.length);
                results.push(possibleResults[randomIndex]);
            }

            // Agregar a resultados globales
            gameState.experimentResults = gameState.experimentResults.concat(results);

            // Mostrar resultados visuales
            displayExperimentResults(results);
            updateStatistics();
            updateScoreboard();
        }

        // Mostrar resultados del experimento
        function displayExperimentResults(results) {
            const container = document.getElementById('experiment-results');
            
            results.forEach((result, index) => {
                setTimeout(() => {
                    const circle = document.createElement('div');
                    circle.className = 'result-circle';
                    circle.style.backgroundColor = result.color;
                    circle.textContent = result.label;
                    container.appendChild(circle);
                }, index * 100);
            });
        }

        // Actualizar estadísticas
        function updateStatistics() {
            if (gameState.experimentResults.length === 0) return;

            const level = levels[gameState.currentLevel];
            const targetSegments = level.segments.find(seg => 
                level.question.toLowerCase().includes(seg.label.toLowerCase()) ||
                (level.question.includes('PAR') && ['2', '4', '6'].includes(seg.label)) ||
                (level.question.includes('ROJA') && (seg.label === '♥️' || seg.label === '♦️')) ||
                (level.question.includes('ROJO') && seg.color === '#e74c3c')
            );

            let successCount = 0;
            
            // Contar éxitos según el tipo de pregunta
            gameState.experimentResults.forEach(result => {
                if (level.question.includes('PAR') && ['2', '4', '6'].includes(result.label)) {
                    successCount++;
                } else if (level.question.includes('ROJA') && (result.label === '♥️' || result.label === '♦️')) {
                    successCount++;
                } else if (level.question.includes('ROJO') && result.color === '#e74c3c') {
                    successCount++;
                } else if (result.label === targetSegments?.label) {
                    successCount++;
                }
            });

            const experimentalProbability = successCount / gameState.experimentResults.length;
            const theoreticalProbability = level.correctFraction[0] / level.correctFraction[1];

            document.getElementById('statistics').innerHTML = `
                <div class="stat-card">
                    <h5>Experimentos Totales</h5>
                    <div style="font-size: 1.5rem; font-weight: bold; color: #3498db;">
                        ${gameState.experimentResults.length}
                    </div>
                </div>
                <div class="stat-card">
                    <h5>Éxitos Observados</h5>
                    <div style="font-size: 1.5rem; font-weight: bold; color: #27ae60;">
                        ${successCount}
                    </div>
                </div>
                <div class="stat-card">
                    <h5>Probabilidad Experimental</h5>
                    <div style="font-size: 1.2rem; font-weight: bold; color: #e74c3c;">
                        ${(experimentalProbability * 100).toFixed(1)}%
                    </div>
                </div>
                <div class="stat-card">
                    <h5>Probabilidad Teórica</h5>
                    <div style="font-size: 1.2rem; font-weight: bold; color: #9b59b6;">
                        ${(theoreticalProbability * 100).toFixed(1)}%
                    </div>
                </div>
            `;
        }

        // Siguiente nivel
        function nextLevel() {
            gameState.currentLevel++;
            gameState.experimentResults = []; // Limpiar experimentos del nivel anterior
            document.getElementById('experiment-results').innerHTML = '';
            document.getElementById('statistics').innerHTML = '';
            loadLevel();
        }

        // Limpiar inputs
        function clearInputs() {
            document.getElementById('numerator').value = '';
            document.getElementById('denominator').value = '';
            document.getElementById('decimal').value = '';
            document.getElementById('percentage').value = '';
        }

        // Ocultar elementos
        function hideElements() {
            document.getElementById('feedback').style.display = 'none';
            document.getElementById('next-button').style.display = 'none';
            document.getElementById('wheel-result').innerHTML = '';
        }

        // Terminar juego
        function endGame() {
            document.getElementById('game-content').style.display = 'none';
            document.getElementById('game-complete').style.display = 'block';
            
            document.getElementById('final-score').textContent = gameState.totalScore + ' puntos';
            
            // Determinar medallas y mensaje
            let medals = '';
            let message = '';
            const accuracy = gameState.totalQuestions > 0 ? 
                (gameState.correctAnswers / gameState.totalQuestions) * 100 : 0;

            if (accuracy >= 80) {
                medals = '<div style="font-size: 3rem; margin: 20px 0;">🥇🎯🏆</div>';
                message = '¡Increíble! Dominas perfectamente los conceptos de probabilidad básica.';
            } else if (accuracy >= 60) {
                medals = '<div style="font-size: 3rem; margin: 20px 0;">🥈🎲</div>';
                message = '¡Excelente trabajo! Tienes una buena comprensión de las probabilidades.';
            } else if (accuracy >= 40) {
                medals = '<div style="font-size: 3rem; margin: 20px 0;">🥉📊</div>';
                message = '¡Buen esfuerzo! Sigues aprendiendo sobre probabilidades.';
            } else {
                medals = '<div style="font-size: 3rem; margin: 20px 0;">🎲📈</div>';
                message = '¡Sigue practicando! Las probabilidades requieren práctica y experimentación.';
            }

            document.getElementById('final-medals').innerHTML = medals;
            document.getElementById('final-message').textContent = message;
        }

        // Reiniciar juego
        function restartGame() {
            gameState = {
                currentLevel: 0,
                totalScore: 0,
                correctAnswers: 0,
                totalQuestions: 0,
                experimentResults: [],
                isSpinning: false,
                lastResult: null
            };

            document.getElementById('game-content').style.display = 'block';
            document.getElementById('game-complete').style.display = 'none';
            document.getElementById('experiment-results').innerHTML = '';
            document.getElementById('statistics').innerHTML = '';
            
            initGame();
        }

        // Eventos de entrada automática
        document.getElementById('numerator').addEventListener('input', autoCalculate);
        document.getElementById('denominator').addEventListener('input', autoCalculate);
        document.getElementById('decimal').addEventListener('input', autoCalculateFromDecimal);
        document.getElementById('percentage').addEventListener('input', autoCalculateFromPercentage);

        function autoCalculate() {
            const num = parseFloat(document.getElementById('numerator').value);
            const den = parseFloat(document.getElementById('denominator').value);
            
            if (!isNaN(num) && !isNaN(den) && den !== 0) {
                const decimal = num / den;
                const percentage = decimal * 100;
                
                document.getElementById('decimal').value = decimal.toFixed(3);
                document.getElementById('percentage').value = percentage.toFixed(1);
            }
        }

        function autoCalculateFromDecimal() {
            const decimal = parseFloat(document.getElementById('decimal').value);
            
            if (!isNaN(decimal) && decimal >= 0 && decimal <= 1) {
                const percentage = decimal * 100;
                document.getElementById('percentage').value = percentage.toFixed(1);
                
                // Intentar encontrar una fracción simple
                const fraction = decimalToFraction(decimal);
                if (fraction) {
                    document.getElementById('numerator').value = fraction[0];
                    document.getElementById('denominator').value = fraction[1];
                }
            }
        }

        function autoCalculateFromPercentage() {
            const percentage = parseFloat(document.getElementById('percentage').value);
            
            if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
                const decimal = percentage / 100;
                document.getElementById('decimal').value = decimal.toFixed(3);
                
                // Intentar encontrar una fracción simple
                const fraction = decimalToFraction(decimal);
                if (fraction) {
                    document.getElementById('numerator').value = fraction[0];
                    document.getElementById('denominator').value = fraction[1];
                }
            }
        }

        function decimalToFraction(decimal) {
            // Convertir decimal común a fracción simple
            const commonFractions = [
                [1, 2, 0.5], [1, 3, 0.333], [2, 3, 0.667], [1, 4, 0.25], [3, 4, 0.75],
                [1, 5, 0.2], [2, 5, 0.4], [3, 5, 0.6], [4, 5, 0.8], [1, 6, 0.167],
                [5, 6, 0.833], [1, 8, 0.125], [3, 8, 0.375], [5, 8, 0.625], [7, 8, 0.875],
                [1, 10, 0.1], [3, 10, 0.3], [7, 10, 0.7], [9, 10, 0.9], [1, 12, 0.083]
            ];
            
            for (let [num, den, val] of commonFractions) {
                if (Math.abs(decimal - val) < 0.01) {
                    return [num, den];
                }
            }
            return null;
        }

        // Inicializar el juego cuando se carga la página
        window.onload = initGame;
