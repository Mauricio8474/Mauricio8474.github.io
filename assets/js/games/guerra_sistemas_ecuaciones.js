/* Extracted from games/guerra_sistemas_ecuaciones.html on 2025-08-28T03:35:45.657Z */
window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XZ1QWD1TCC');

let gameState = {
            playerHealth: 100,
            enemyHealth: 100,
            currentMethod: 'substitution',
            currentEquation: null,
            level: 1,
            stats: {
                victories: 0,
                streak: 0,
                totalAttempts: 0,
                correctAttempts: 0,
                points: 0,
                combo: 0
            },
            timer: 0,
            timerInterval: null,
            enemies: [
                { name: 'General Álgebra', icon: '👹', power: 100 },
                { name: 'Coronel Coeficiente', icon: '😈', power: 120 },
                { name: 'Capitán Incógnita', icon: '👺', power: 140 },
                { name: 'Lord Variable', icon: '💀', power: 160 },
                { name: 'Rey Ecuación', icon: '👑', power: 200 }
            ]
        };

        class EquationGenerator {
            static generateSystem(difficulty = 1) {
                let x, y, a, b, c, d, e, f;
                
                // Generar solución aleatoria
                x = Math.floor(Math.random() * 10) - 5;
                y = Math.floor(Math.random() * 10) - 5;
                
                // Evitar x=0 o y=0 para hacer más interesante
                if (x === 0) x = 1;
                if (y === 0) y = 1;
                
                // Generar coeficientes basados en dificultad
                const range = Math.min(difficulty * 2 + 3, 10);
                a = Math.floor(Math.random() * range) + 1;
                b = Math.floor(Math.random() * range) + 1;
                c = Math.floor(Math.random() * range) + 1;
                d = Math.floor(Math.random() * range) + 1;
                
                // Asegurar que no sea múltiplo (sistema compatible determinado)
                while (a * d === b * c) {
                    d = Math.floor(Math.random() * range) + 1;
                }
                
                // Ocasionalmente hacer negativos algunos coeficientes
                if (Math.random() < 0.3) a = -a;
                if (Math.random() < 0.3) b = -b;
                if (Math.random() < 0.3) c = -c;
                if (Math.random() < 0.3) d = -d;
                
                // Calcular términos independientes
                e = a * x + b * y;
                f = c * x + d * y;
                
                return {
                    equation1: { a, b, e },
                    equation2: { c: c, d: d, f: f },
                    solution: { x, y }
                };
            }

            static formatEquation(eq1, eq2) {
                const formatTerm = (coef, variable, isFirst = false) => {
                    if (coef === 0) return '';
                    const sign = coef > 0 ? (isFirst ? '' : ' + ') : ' - ';
                    const absCoef = Math.abs(coef);
                    const coefStr = absCoef === 1 ? '' : absCoef;
                    return sign + coefStr + variable;
                };

                const line1 = `${eq1.a === 1 ? '' : eq1.a === -1 ? '-' : eq1.a}x${formatTerm(eq1.b, 'y')} = ${eq1.e}`;
                const line2 = `${eq2.c === 1 ? '' : eq2.c === -1 ? '-' : eq2.c}x${formatTerm(eq2.d, 'y')} = ${eq2.f}`;
                
                return { line1, line2 };
            }
        }

        function initGame() {
            updateEnemyDisplay();
            startTimer();
            newEquation();
            updateUI();
            logMessage('¡La batalla ha comenzado! Resuelve el sistema para atacar.', 'info');
        }

        function attack() {
            const xInput = parseFloat(document.getElementById('xValue').value);
            const yInput = parseFloat(document.getElementById('yValue').value);
            
            if (isNaN(xInput) || isNaN(yInput)) {
                logMessage('⚠️ Por favor ingresa valores numéricos para X e Y', 'error');
                return;
            }
            
            const solution = gameState.currentEquation.solution;
            
            gameState.stats.totalAttempts++;
            
            // Verificar solución (con tolerancia para decimales)
            const tolerance = 0.1;
            const isCorrect = Math.abs(xInput - solution.x) < tolerance && 
                             Math.abs(yInput - solution.y) < tolerance;
            
            if (isCorrect) {
                // Ataque exitoso
                const damage = calculateDamage();
                gameState.enemyHealth = Math.max(0, gameState.enemyHealth - damage);
                gameState.stats.correctAttempts++;
                gameState.stats.combo++;
                gameState.stats.points += damage * gameState.stats.combo;
                
                logMessage(`✅ ¡Ataque exitoso! Daño: ${damage} (Combo x${gameState.stats.combo})`, 'success');
                
                if (gameState.enemyHealth <= 0) {
                    victory();
                } else {
                    enemyCounterAttack();
                }
                
                // Mostrar combo
                if (gameState.stats.combo > 1) {
                    showCombo();
                }
                
            } else {
                // Ataque fallido
                gameState.stats.combo = 0;
                hideCombo();
                logMessage(`❌ Solución incorrecta. La respuesta era: x = ${solution.x}, y = ${solution.y}`, 'error');
                enemyCounterAttack();
            }
            
            updateUI();
            
            // Nueva ecuación después del ataque
            setTimeout(() => {
                if (gameState.enemyHealth > 0 && gameState.playerHealth > 0) {
                    newEquation();
                }
            }, 2000);
        }

        function showHint() {
            const eq = gameState.currentEquation;
            let hint = '';
            
            switch (gameState.currentMethod) {
                case 'substitution':
                    if (Math.abs(eq.equation2.c) === 1) {
                        hint = `💡 Pista: Despeja x de la segunda ecuación: x = ${eq.equation2.f} - (${eq.equation2.d})y`;
                    } else {
                        hint = `💡 Pista: Intenta despejar la variable con coeficiente más simple`;
                    }
                    break;
                case 'elimination':
                    hint = `💡 Pista: Multiplica para igualar coeficientes y luego suma/resta las ecuaciones`;
                    break;
                case 'graphical':
                    hint = `💡 Pista: Convierte a forma y = mx + b y encuentra donde se cruzan las rectas`;
                    break;
            }
            
            logMessage(hint, 'info');
        }

        function startTimer() {
            if (gameState.timerInterval) {
                clearInterval(gameState.timerInterval);
            }
            
            gameState.timer = 0;
            gameState.timerInterval = setInterval(() => {
                gameState.timer++;
                updateTimer();
            }, 1000);
        }

        function updateTimer() {
            const minutes = Math.floor(gameState.timer / 60);
            const seconds = gameState.timer % 60;
            document.getElementById('timer').textContent = 
                `⏱️ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        function newEquation() {
            gameState.currentEquation = EquationGenerator.generateSystem(gameState.level);
            displayEquation();
            document.getElementById('solutionSteps').innerHTML = '';
            document.getElementById('xValue').value = '';
            document.getElementById('yValue').value = '';
        }

        function displayEquation() {
            const eq = gameState.currentEquation;
            const formatted = EquationGenerator.formatEquation(eq.equation1, eq.equation2);
            
            document.getElementById('currentEquation').innerHTML = `
                <div class="equation-line">${formatted.line1}</div>
                <div class="equation-line">${formatted.line2}</div>
            `;
        }

        function selectMethod(method) {
            gameState.currentMethod = method;
            
            // Actualizar botones
            document.querySelectorAll('.method-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            showMethodSteps();
        }

        function showMethodSteps() {
            const steps = document.getElementById('solutionSteps');
            const eq = gameState.currentEquation;
            
            let stepHtml = '';
            
            switch (gameState.currentMethod) {
                case 'substitution':
                    stepHtml = `
                        <div class="step"><strong>Método de Sustitución:</strong></div>
                        <div class="step">1. Despeja una variable de una ecuación</div>
                        <div class="step">2. Sustituye en la otra ecuación</div>
                        <div class="step">3. Resuelve para encontrar una variable</div>
                        <div class="step">4. Sustituye de vuelta para la otra variable</div>
                    `;
                    break;
                case 'elimination':
                    stepHtml = `
                        <div class="step"><strong>Método de Eliminación:</strong></div>
                        <div class="step">1. Multiplica ecuaciones si es necesario</div>
                        <div class="step">2. Suma o resta para eliminar una variable</div>
                        <div class="step">3. Resuelve la ecuación resultante</div>
                        <div class="step">4. Sustituye para encontrar la otra variable</div>
                    `;
                    break;
                case 'graphical':
                    stepHtml = `
                        <div class="step"><strong>Método Gráfico:</strong></div>
                        <div class="step">1. Despeja y de ambas ecuaciones</div>
                        <div class="step">2. Grafica ambas rectas</div>
                        <div class="step">3. El punto de intersección es la solución</div>
                    `;
                    break;
            }
            
            steps.innerHTML = stepHtml;
        }

        function showHint() {
            const eq = gameState.currentEquation;
            let hint = '';
            
            switch (gameState.currentMethod) {
                case 'substitution':
                    hint = `💡 Pista: Despeja x de la segunda ecuación: x = ${eq.solution.y} + ${eq.equation2.f - eq.equation2.d * eq.solution.y}`;
                    break;
                case 'elimination':
                    hint = `💡 Pista: Multiplica la primera ecuación por ${eq.equation2.c} y la segunda por ${-eq.equation1.a} para eliminar x`;
                    break;
                case 'graphical':
                    hint = `💡 Pista: La primera recta pasa por (0, ${eq.equation1.e/eq.equation1.b}) y (${eq.equation1.e/eq.equation1.a}, 0)`;
                    break;
            }
            
            logMessage(hint, 'info');
        }

        function calculateDamage() {
            let baseDamage = 20 + (gameState.level * 5);
            let methodBonus = 1;
            
            // Bonus por método usado
            switch (gameState.currentMethod) {
                case 'substitution': methodBonus = 1.0; break;
                case 'elimination': methodBonus = 1.2; break;
                case 'graphical': methodBonus = 1.1; break;
            }
            
            // Bonus por tiempo (más rápido = más daño)
            let timeBonus = Math.max(0.5, 2 - (gameState.timer / 300));
            
            return Math.floor(baseDamage * methodBonus * timeBonus * (1 + gameState.stats.combo * 0.1));
        }

        function enemyCounterAttack() {
            const enemy = gameState.enemies[Math.min(gameState.level - 1, gameState.enemies.length - 1)];
            const damage = Math.floor(enemy.power / 5 + Math.random() * 10);
            
            gameState.playerHealth = Math.max(0, gameState.playerHealth - damage);
            
            logMessage(`💥 ${enemy.name} contraataca por ${damage} de daño!`, 'error');
            
            if (gameState.playerHealth <= 0) {
                defeat();
            }
        }

        function victory() {
            const enemy = gameState.enemies[Math.min(gameState.level - 1, gameState.enemies.length - 1)];
            
            gameState.stats.victories++;
            gameState.stats.streak++;
            gameState.stats.points += 100 * gameState.level;
            
            // Mostrar pantalla de victoria
            const victoryScreen = document.getElementById('victoryScreen');
            const title = document.getElementById('victoryTitle');
            const message = document.getElementById('victoryMessage');
            const stats = document.getElementById('victoryStats');
            
            title.textContent = '🏆 ¡VICTORIA!';
            message.textContent = `Has derrotado a ${enemy.name}!`;
            
            stats.innerHTML = `
                <div style="margin: 20px 0;">
                    <div>⚡ Daño total: ${100 - gameState.enemyHealth}</div>
                    <div>🎯 Precisión: ${Math.round((gameState.stats.correctAttempts / gameState.stats.totalAttempts) * 100)}%</div>
                    <div>⏱️ Tiempo: ${Math.floor(gameState.timer / 60)}:${(gameState.timer % 60).toString().padStart(2, '0')}</div>
                    <div>💎 Puntos ganados: ${100 * gameState.level}</div>
                </div>
            `;
            
            victoryScreen.classList.add('show');
            
            logMessage(`🎉 ¡Has derrotado a ${enemy.name}! Nivel completado.`, 'success');
            
            // Parar el timer
            if (gameState.timerInterval) {
                clearInterval(gameState.timerInterval);
            }
        }

        function defeat() {
            gameState.stats.streak = 0;
            
            logMessage('💀 Has sido derrotado. ¡Inténtalo de nuevo!', 'error');
            
            // Reiniciar después de 3 segundos
            setTimeout(() => {
                restartBattle();
            }, 3000);
        }

        function nextBattle() {
            gameState.level++;
            closeVictory();
            restartBattle();
            logMessage(`🆙 Nivel ${gameState.level}: ¡Un enemigo más poderoso aparece!`, 'info');
        }

        function restartBattle() {
            gameState.playerHealth = 100;
            gameState.enemyHealth = 100;
            gameState.stats.combo = 0;
            hideCombo();
            
            updateEnemyDisplay();
            newEquation();
            startTimer();
            updateUI();
        }

        function closeVictory() {
            document.getElementById('victoryScreen').classList.remove('show');
        }

        function updateEnemyDisplay() {
            const enemy = gameState.enemies[Math.min(gameState.level - 1, gameState.enemies.length - 1)];
            
            document.getElementById('enemyIcon').textContent = enemy.icon;
            document.getElementById('enemyName').textContent = enemy.name;
            document.getElementById('enemyStatus').textContent = 'Preparándose para la batalla...';
            document.getElementById('enemyPowerValue').textContent = enemy.power;
        }

        function showCombo() {
            const combo = document.getElementById('combo');
            document.getElementById('comboValue').textContent = gameState.stats.combo;
            combo.style.display = 'block';
            combo.classList.add('bounce');
            
            setTimeout(() => {
                combo.classList.remove('bounce');
            }, 500);
        }

        function hideCombo() {
            document.getElementById('combo').style.display = 'none';
        }

        function updateUI() {
            // Actualizar barras de vida
            document.getElementById('playerHealth').style.width = gameState.playerHealth + '%';
            document.getElementById('enemyHealth').style.width = gameState.enemyHealth + '%';
            
            document.getElementById('playerHealthText').textContent = `${gameState.playerHealth}/100`;
            document.getElementById('enemyHealthText').textContent = `${gameState.enemyHealth}/100`;
            
            // Actualizar estadísticas
            document.getElementById('victories').textContent = gameState.stats.victories;
            document.getElementById('streak').textContent = gameState.stats.streak;
            document.getElementById('points').textContent = gameState.stats.points;
            
            const accuracy = gameState.stats.totalAttempts > 0 ? 
                Math.round((gameState.stats.correctAttempts / gameState.stats.totalAttempts) * 100) : 0;
            document.getElementById('accuracy').textContent = accuracy + '%';
        }

        function logMessage(message, type) {
            const logEntries = document.getElementById('logEntries');
            const entry = document.createElement('div');
            entry.className = `log-entry log-${type}`;
            entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
            
            logEntries.insertBefore(entry, logEntries.firstChild);
            
            // Limitar a 10 entradas
            while (logEntries.children.length > 10) {
                logEntries.removeChild(logEntries.lastChild);
            }
        }

        // Event listeners
        document.getElementById('xValue').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('yValue').focus();
            }
        });

        document.getElementById('yValue').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                attack();
            }
        });

        // Inicializar el juego
        initGame();
