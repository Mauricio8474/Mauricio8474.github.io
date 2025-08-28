/* Extracted from games/casino_matematico.html on 2025-08-28T03:35:45.638Z */
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
            chips: 1000,
            level: 1,
            wins: 0,
            totalGames: 0,
            achievements: [],
            currentProblems: {
                team: { n: 12, r: 4, answer: 495 },
                password: { n: 6, r: 4, answer: 360, type: 'permutation' }
            }
        };

        // Logros disponibles
        const achievements = [
            { id: 'first_win', name: 'Primera Victoria', icon: '🎯', unlocked: false },
            { id: 'combo_master', name: 'Maestro Combinaciones', icon: '🎲', unlocked: false },
            { id: 'prob_expert', name: 'Experto Probabilidad', icon: '📊', unlocked: false },
            { id: 'team_leader', name: 'Líder de Equipos', icon: '👥', unlocked: false },
            { id: 'security_expert', name: 'Experto Seguridad', icon: '🔐', unlocked: false },
            { id: 'mathematician', name: 'Matemático VIP', icon: '🧮', unlocked: false }
        ];

        // Problemas predefinidos para variedad
        const teamProblems = [
            { text: "De un grupo de 12 estudiantes, ¿cuántas maneras hay de formar un equipo de 4?", n: 12, r: 4 },
            { text: "Un club con 15 miembros necesita elegir 5 para el comité directivo. ¿Cuántas formas hay?", n: 15, r: 5 },
            { text: "De 20 libros, ¿de cuántas maneras se pueden seleccionar 6 para una exhibición?", n: 20, r: 6 },
            { text: "En una clase de 25 estudiantes, ¿cuántas maneras hay de formar grupos de 3?", n: 25, r: 3 }
        ];

        const passwordProblems = [
            { text: "¿Cuántas contraseñas de 4 dígitos se pueden formar con {1,2,3,4,5,6} sin repetición?", n: 6, r: 4, type: 'permutation' },
            { text: "¿Cuántos códigos de 3 letras se pueden formar con las letras A,B,C,D,E sin repetir?", n: 5, r: 3, type: 'permutation' },
            { text: "De 8 colores disponibles, ¿cuántas secuencias de 5 colores diferentes se pueden crear?", n: 8, r: 5, type: 'permutation' },
            { text: "¿Cuántas maneras hay de organizar 4 personas en una fila de 7 asientos disponibles?", n: 7, r: 4, type: 'permutation' }
        ];

        // Inicialización
        document.addEventListener('DOMContentLoaded', function() {
            createCasinoEffects();
            updateCombinationsGame();
            updateDiceGame();
            newTeamProblem();
            newPasswordProblem();
            updateUI();
        });

        // Crear efectos visuales del casino
        function createCasinoEffects() {
            // Luces del casino
            const lightsContainer = document.querySelector('.casino-lights');
            for (let i = 0; i < 100; i++) {
                const light = document.createElement('div');
                light.className = 'light';
                light.style.left = Math.random() * 100 + '%';
                light.style.top = Math.random() * 100 + '%';
                light.style.animationDelay = Math.random() * 2 + 's';
                light.style.animationDuration = (Math.random() * 2 + 1) + 's';
                lightsContainer.appendChild(light);
            }

            // Cartas flotantes
            const cardsContainer = document.querySelector('.floating-cards');
            for (let i = 0; i < 15; i++) {
                const card = document.createElement('div');
                card.className = 'card';
                card.style.left = Math.random() * 100 + '%';
                card.style.animationDelay = Math.random() * 15 + 's';
                card.style.animationDuration = (Math.random() * 10 + 10) + 's';
                cardsContainer.appendChild(card);
            }
        }

        // === JUEGO DE COMBINACIONES BÁSICAS ===
        function updateCombinationsGame() {
            const n = parseInt(document.getElementById('combN').value) || 5;
            const r = parseInt(document.getElementById('combR').value) || 3;
            const type = document.getElementById('combType').value;
            
            // Validar entrada
            if (r > n) {
                document.getElementById('combR').value = n;
                return;
            }
            
            const symbol = type === 'combination' ? 'C' : 'P';
            document.getElementById('combProblem').textContent = `${symbol}(${n},${r}) = ?`;
            
            // Actualizar pasos explicativos
            const stepsContainer = document.getElementById('combSteps');
            if (type === 'combination') {
                stepsContainer.innerHTML = `
                    <h4 style="color: #ffd700; margin-bottom: 15px;">Combinación - El orden NO importa:</h4>
                    <div class="step">1. Usamos C(n,r) = n!/(r!(n-r)!)</div>
                    <div class="step">2. C(${n},${r}) = ${n}!/(${r}!×${n-r}!)</div>
                    <div class="step">3. Simplificamos y calculamos</div>
                `;
                document.getElementById('combFormula').innerHTML = `C(${n},${r}) = ${n}!/(${r}!×${n-r}!)`;
            } else {
                stepsContainer.innerHTML = `
                    <h4 style="color: #ffd700; margin-bottom: 15px;">Permutación - El orden SÍ importa:</h4>
                    <div class="step">1. Usamos P(n,r) = n!/(n-r)!</div>
                    <div class="step">2. P(${n},${r}) = ${n}!/(${n-r})!</div>
                    <div class="step">3. Multiplicamos desde n hasta (n-r+1)</div>
                `;
                document.getElementById('combFormula').innerHTML = `P(${n},${r}) = ${n}!/(${n-r})! = ${generatePermutationCalc(n,r)}`;
            }
        }

        function generatePermutationCalc(n, r) {
            let calc = '';
            for (let i = n; i > n - r; i--) {
                calc += i;
                if (i > n - r + 1) calc += '×';
            }
            return calc;
        }

        function checkCombinationsAnswer() {
            const n = parseInt(document.getElementById('combN').value);
            const r = parseInt(document.getElementById('combR').value);
            const type = document.getElementById('combType').value;
            const userAnswerText = document.getElementById('combAnswer').value.trim();
            
            if (!userAnswerText) {
                showNotification('Por favor ingresa tu respuesta', 'error');
                return;
            }
            
            const userAnswer = parseInt(userAnswerText);
            if (isNaN(userAnswer)) {
                showNotification('Por favor ingresa un número válido', 'error');
                return;
            }
            
            const correctAnswer = type === 'combination' ? combination(n, r) : permutation(n, r);
            const isCorrect = userAnswer === correctAnswer;
            
            gameState.totalGames++;
            
            if (isCorrect) {
                gameState.wins++;
                gameState.chips += 75;
                document.getElementById('combResult').className = 'result-display result-correct';
                document.getElementById('combResult').textContent = 
                    `¡Correcto! ${type === 'combination' ? 'C' : 'P'}(${n},${r}) = ${correctAnswer}. +75 fichas`;
                checkAchievements('combinations');
            } else {
                gameState.chips = Math.max(0, gameState.chips - 35);
                document.getElementById('combResult').className = 'result-display result-incorrect';
                document.getElementById('combResult').textContent = 
                    `Incorrecto. ${type === 'combination' ? 'C' : 'P'}(${n},${r}) = ${correctAnswer}. -35 fichas`;
            }
            
            updateUI();
        }

        function showCombinationsHint() {
            const type = document.getElementById('combType').value;
            const hint = type === 'combination' ? 
                'COMBINACIÓN: El orden NO importa. Ej: elegir 3 estudiantes de 10 para un proyecto. Usa C(n,r) = n!/(r!(n-r)!)' :
                'PERMUTACIÓN: El orden SÍ importa. Ej: ordenar 3 personas en una fila. Usa P(n,r) = n!/(n-r)!';
            showNotification(hint, 'info');
        }

        function newCombinationsProblem() {
            const n = Math.floor(Math.random() * 15) + 5; // 5-20
            const r = Math.floor(Math.random() * Math.min(n, 8)) + 1; // 1-min(n,8)
            
            document.getElementById('combN').value = n;
            document.getElementById('combR').value = r;
            document.getElementById('combAnswer').value = '';
            document.getElementById('combResult').textContent = '';
            updateCombinationsGame();
        }

        // === JUEGO DE DADOS MEJORADO ===
        function updateDiceGame() {
            const diceCount = parseInt(document.getElementById('diceCount').value);
            const targetSum = parseInt(document.getElementById('targetSum').value) || 7;
            
            // Actualizar límites del input según número de dados
            const targetInput = document.getElementById('targetSum');
            targetInput.min = diceCount;
            targetInput.max = diceCount * 6;
            
            // Mostrar dados
            const container = document.getElementById('diceContainer');
            container.innerHTML = '';
            for (let i = 0; i < diceCount; i++) {
                const dice = document.createElement('div');
                dice.className = 'dice';
                dice.textContent = '?';
                container.appendChild(dice);
            }
            
            // Actualizar display y pasos
            document.getElementById('diceTarget').textContent = targetSum;
            
            const totalOutcomes = Math.pow(6, diceCount);
            const favorableCases = countFavorableCases(diceCount, targetSum);
            
            document.getElementById('diceStep1').textContent = `1. Total de resultados: 6^${diceCount} = ${totalOutcomes}`;
            document.getElementById('diceStep2').textContent = `2. Casos favorables para suma ${targetSum}: ${favorableCases}`;
            document.getElementById('diceStep3').textContent = `3. Probabilidad = ${favorableCases}/${totalOutcomes}`;
            
            document.getElementById('diceFormula').innerHTML = 
                `P(suma = ${targetSum}) = ${favorableCases}/${totalOutcomes}`;
        }

        function countFavorableCases(diceCount, targetSum) {
            // Función recursiva para contar casos favorables
            function count(dices, sum, current = 0) {
                if (dices === 0) {
                    return sum === 0 ? 1 : 0;
                }
                
                let total = 0;
                for (let i = 1; i <= 6; i++) {
                    if (sum - i >= 0) {
                        total += count(dices - 1, sum - i, current + i);
                    }
                }
                return total;
            }
            
            return count(diceCount, targetSum);
        }

        function rollDice() {
            const diceCount = parseInt(document.getElementById('diceCount').value);
            const diceElements = document.querySelectorAll('#diceContainer .dice');
            
            let sum = 0;
            diceElements.forEach(dice => {
                const value = Math.floor(Math.random() * 6) + 1;
                dice.textContent = value;
                sum += value;
                
                // Animación de giro
                dice.style.transform = 'rotate(360deg)';
                setTimeout(() => dice.style.transform = 'rotate(0deg)', 300);
            });
            
            setTimeout(() => {
                showNotification(`Resultado: ${sum}`, 'info');
            }, 300);
        }

        function checkDiceAnswer() {
            const diceCount = parseInt(document.getElementById('diceCount').value);
            const targetSum = parseInt(document.getElementById('targetSum').value);
            const userAnswer = document.getElementById('diceAnswer').value.trim();
            
            if (!userAnswer) {
                showNotification('Por favor ingresa tu respuesta', 'error');
                return;
            }
            
            const totalOutcomes = Math.pow(6, diceCount);
            const favorableCases = countFavorableCases(diceCount, targetSum);
            const correctProb = favorableCases / totalOutcomes;
            
            const userProb = parseUserProbability(userAnswer);
            
            const tolerance = 0.01;
            const isCorrect = Math.abs(userProb - correctProb) < tolerance;
            
            gameState.totalGames++;
            
            if (isCorrect) {
                gameState.wins++;
                gameState.chips += 60;
                document.getElementById('diceResult').className = 'result-display result-correct';
                document.getElementById('diceResult').textContent = 
                    `¡Correcto! P = ${favorableCases}/${totalOutcomes} = ${(correctProb * 100).toFixed(2)}%. +60 fichas`;
                checkAchievements('probability');
            } else {
                gameState.chips = Math.max(0, gameState.chips - 30);
                document.getElementById('diceResult').className = 'result-display result-incorrect';
                document.getElementById('diceResult').textContent = 
                    `Incorrecto. P = ${favorableCases}/${totalOutcomes} = ${(correctProb * 100).toFixed(2)}%. -30 fichas`;
            }
            
            updateUI();
        }

        function showDiceHint() {
            const diceCount = parseInt(document.getElementById('diceCount').value);
            const targetSum = parseInt(document.getElementById('targetSum').value);
            
            let hint = `Para ${diceCount} dados y suma ${targetSum}: `;
            if (diceCount === 2 && targetSum === 7) {
                hint += 'Las combinaciones son: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 casos de 36 posibles.';
            } else {
                hint += `Lista todas las combinaciones posibles que sumen ${targetSum} y divide por ${Math.pow(6, diceCount)}.`;
            }
            
            showNotification(hint, 'info');
        }

        // === JUEGO DE EQUIPOS ===
        function newTeamProblem() {
            const problemIndex = Math.floor(Math.random() * teamProblems.length);
            const problem = teamProblems[problemIndex];
            
            gameState.currentProblems.team = {
                n: problem.n,
                r: problem.r,
                answer: combination(problem.n, problem.r),
                text: problem.text
            };
            
            document.getElementById('teamProblem').textContent = problem.text;
            document.getElementById('teamSteps').innerHTML = `
                <h4 style="color: #ffd700; margin-bottom: 15px;">Análisis:</h4>
                <div class="step">1. ¿Importa el orden de selección? NO</div>
                <div class="step">2. Por tanto, usamos combinaciones</div>
                <div class="step">3. C(${problem.n},${problem.r}) = ${problem.n}!/(${problem.r}!×${problem.n-problem.r}!)</div>
            `;
            document.getElementById('teamFormula').innerHTML = `C(${problem.n},${problem.r}) = ${generateCombinationCalc(problem.n, problem.r)}`;
            document.getElementById('teamAnswer').value = '';
            document.getElementById('teamResult').textContent = '';
        }

        function generateCombinationCalc(n, r) {
            const result = combination(n, r);
            if (n <= 10 && r <= 5) {
                let numerator = '';
                for (let i = n; i > n - r; i--) {
                    numerator += i;
                    if (i > n - r + 1) numerator += '×';
                }
                let denominator = '';
                for (let i = r; i > 0; i--) {
                    denominator += i;
                    if (i > 1) denominator += '×';
                }
                return `(${numerator})/(${denominator}) = ${result}`;
            }
            return result.toString();
        }

        function checkTeamAnswer() {
            const userAnswerText = document.getElementById('teamAnswer').value.trim();
            
            if (!userAnswerText) {
                showNotification('Por favor ingresa tu respuesta', 'error');
                return;
            }
            
            const userAnswer = parseInt(userAnswerText);
            if (isNaN(userAnswer)) {
                showNotification('Por favor ingresa un número válido', 'error');
                return;
            }
            
            const correctAnswer = gameState.currentProblems.team.answer;
            const isCorrect = userAnswer === correctAnswer;
            gameState.totalGames++;
            
            if (isCorrect) {
                gameState.wins++;
                gameState.chips += 100;
                document.getElementById('teamResult').className = 'result-display result-correct';
                document.getElementById('teamResult').textContent = 
                    `¡Correcto! Hay ${correctAnswer} maneras diferentes. +100 fichas`;
                checkAchievements('teams');
            } else {
                gameState.chips = Math.max(0, gameState.chips - 50);
                document.getElementById('teamResult').className = 'result-display result-incorrect';
                document.getElementById('teamResult').textContent = 
                    `Incorrecto. La respuesta correcta es ${correctAnswer}. -50 fichas`;
            }
            
            updateUI();
        }

        function showTeamHint() {
            const problem = gameState.currentProblems.team;
            showNotification(`Pista: Como el orden no importa al formar el equipo, usa combinaciones. C(${problem.n},${problem.r}) = ${problem.n}!/(${problem.r}!×${problem.n-problem.r}!)`, 'info');
        }

        // === JUEGO DE CONTRASEÑAS ===
        function newPasswordProblem() {
            const problemIndex = Math.floor(Math.random() * passwordProblems.length);
            const problem = passwordProblems[problemIndex];
            
            gameState.currentProblems.password = {
                n: problem.n,
                r: problem.r,
                answer: permutation(problem.n, problem.r),
                text: problem.text,
                type: problem.type
            };
            
            document.getElementById('passwordProblem').textContent = problem.text;
            document.getElementById('passwordSteps').innerHTML = `
                <h4 style="color: #ffd700; margin-bottom: 15px;">Análisis de Permutaciones:</h4>
                <div class="step">1. ¿Importa el orden? SÍ (1234 ≠ 4321)</div>
                <div class="step">2. ¿Hay repetición? NO</div>
                <div class="step">3. P(${problem.n},${problem.r}) = ${problem.n}!/(${problem.n-problem.r})!</div>
            `;
            document.getElementById('passwordFormula').innerHTML = `P(${problem.n},${problem.r}) = ${generatePermutationCalc(problem.n, problem.r)} = ${permutation(problem.n, problem.r)}`;
            document.getElementById('passwordAnswer').value = '';
            document.getElementById('passwordResult').textContent = '';
        }

        function checkPasswordAnswer() {
            const userAnswerText = document.getElementById('passwordAnswer').value.trim();
            
            if (!userAnswerText) {
                showNotification('Por favor ingresa tu respuesta', 'error');
                return;
            }
            
            const userAnswer = parseInt(userAnswerText);
            if (isNaN(userAnswer)) {
                showNotification('Por favor ingresa un número válido', 'error');
                return;
            }
            
            const correctAnswer = gameState.currentProblems.password.answer;
            const isCorrect = userAnswer === correctAnswer;
            gameState.totalGames++;
            
            if (isCorrect) {
                gameState.wins++;
                gameState.chips += 125;
                document.getElementById('passwordResult').className = 'result-display result-correct';
                document.getElementById('passwordResult').textContent = 
                    `¡Correcto! Hay ${correctAnswer} posibilidades. +125 fichas`;
                checkAchievements('security');
            } else {
                gameState.chips = Math.max(0, gameState.chips - 60);
                document.getElementById('passwordResult').className = 'result-display result-incorrect';
                document.getElementById('passwordResult').textContent = 
                    `Incorrecto. La respuesta correcta es ${correctAnswer}. -60 fichas`;
            }
            
            updateUI();
        }

        function showPasswordHint() {
            const problem = gameState.currentProblems.password;
            showNotification(`Pista: El orden importa en contraseñas y códigos. Usa permutaciones. P(${problem.n},${problem.r}) = ${problem.n}×${problem.n-1}×${problem.n-2}...`, 'info');
        }

        // === FUNCIONES MATEMÁTICAS ===
        function combination(n, r) {
            if (r > n) return 0;
            if (r === 0 || r === n) return 1;
            
            // Optimización: C(n,r) = C(n,n-r)
            r = Math.min(r, n - r);
            
            let result = 1;
            for (let i = 0; i < r; i++) {
                result = result * (n - i) / (i + 1);
            }
            return Math.round(result);
        }

        function permutation(n, r) {
            if (r > n) return 0;
            if (r === 0) return 1;
            
            let result = 1;
            for (let i = n; i > n - r; i--) {
                result *= i;
            }
            return result;
        }

        function parseUserProbability(input) {
            // Parsear fracciones como 6/36, decimales como 0.167
            input = input.toLowerCase().replace(/[%\s]/g, '');
            
            if (input.includes('/')) {
                const parts = input.split('/');
                return parseFloat(parts[0]) / parseFloat(parts[1]);
            } else if (parseFloat(input) > 1) {
                return parseFloat(input) / 100;
            } else {
                return parseFloat(input);
            }
        }

        // === SISTEMA DE LOGROS ===
        function checkAchievements(gameType) {
            // Primera victoria
            if (gameState.wins === 1 && !achievements[0].unlocked) {
                unlockAchievement(0);
            }
            
            // Maestros de cada tipo de juego
            if (gameType === 'combinations' && gameState.wins >= 3 && !achievements[1].unlocked) {
                unlockAchievement(1);
            }
            if (gameType === 'probability' && gameState.wins >= 5 && !achievements[2].unlocked) {
                unlockAchievement(2);
            }
            if (gameType === 'teams' && gameState.wins >= 7 && !achievements[3].unlocked) {
                unlockAchievement(3);
            }
            if (gameType === 'security' && gameState.wins >= 10 && !achievements[4].unlocked) {
                unlockAchievement(4);
            }
            
            // Matemático VIP
            if (gameState.wins >= 15 && !achievements[5].unlocked) {
                unlockAchievement(5);
            }
        }

        function unlockAchievement(index) {
            achievements[index].unlocked = true;
            gameState.chips += 200;
            showNotification(`¡Logro desbloqueado: ${achievements[index].name} ${achievements[index].icon}! +200 fichas bonus`, 'success');
            updateUI();
        }

        function updateUI() {
            document.getElementById('chips').textContent = gameState.chips.toLocaleString();
            document.getElementById('level').textContent = Math.floor(gameState.chips / 1000) + 1;
            document.getElementById('wins').textContent = gameState.wins;
            
            const accuracy = gameState.totalGames > 0 ? 
                Math.round((gameState.wins / gameState.totalGames) * 100) : 100;
            document.getElementById('accuracy').textContent = accuracy + '%';
            
            // Actualizar logros
            const achievementsContainer = document.getElementById('achievements');
            achievementsContainer.innerHTML = '';
            achievements.forEach(achievement => {
                if (achievement.unlocked) {
                    const elem = document.createElement('div');
                    elem.className = 'achievement';
                    elem.textContent = achievement.icon;
                    elem.title = achievement.name;
                    achievementsContainer.appendChild(elem);
                }
            });
        }

        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.style.position = 'fixed';
            notification.style.top = '20px';
            notification.style.right = '20px';
            notification.style.padding = '15px 25px';
            notification.style.borderRadius = '10px';
            notification.style.fontWeight = '600';
            notification.style.zIndex = '1000';
            notification.style.maxWidth = '400px';
            notification.style.transform = 'translateX(100%)';
            notification.style.transition = 'transform 0.5s ease';
            notification.style.fontSize = '14px';
            notification.style.lineHeight = '1.4';
            
            if (type === 'success') {
                notification.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
                notification.style.color = 'black';
                notification.style.boxShadow = '0 5px 15px rgba(0, 255, 0, 0.3)';
            } else if (type === 'error') {
                notification.style.background = 'linear-gradient(45deg, #ff4444, #cc0000)';
                notification.style.color = 'white';
                notification.style.boxShadow = '0 5px 15px rgba(255, 68, 68, 0.3)';
            } else {
                notification.style.background = 'linear-gradient(45deg, #ffd700, #ffed4e)';
                notification.style.color = 'black';
                notification.style.boxShadow = '0 5px 15px rgba(255, 215, 0, 0.3)';
            }
            
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.style.transform = 'translateX(0)', 100);
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 500);
            }, 4500);
        }

        // Eventos de redimensionamiento
        window.addEventListener('resize', updateUI);
