/* Extracted from games/graficador_espacial.html on 2025-08-28T03:35:45.654Z */
window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XZ1QWD1TCC');

// Redirige si no hay usuario autenticado
        if (!localStorage.getItem('currentUser') && !sessionStorage.getItem('currentUser')) {
            window.location.href = "complete-login-html.html";
        }
        // Variables globales del juego
        let currentFunction = 'linear';
        let parameters = { m: 1, b: 0, a: 1, h: 0, k: 0 };
        let gameState = {
            score: 0,
            level: 1,
            challenges: 0,
            streak: 0,
            currentChallenge: 0
        };

        // Desafíos del juego
        const challenges = [
            {
                title: "Desafío 1: Primera Función Lineal",
                description: "Crea una función lineal que pase por los puntos (0, 2) y (2, 6).",
                hint: "Si la línea pasa por (0, 2), entonces b = 2. Para encontrar m, usa la fórmula: m = (y2-y1)/(x2-x1)",
                type: "linear",
                target: { m: 2, b: 2 },
                tolerance: 0.1,
                points: 100
            },
            {
                title: "Desafío 2: Pendiente Negativa",
                description: "Crea una función lineal con pendiente -1.5 que pase por el punto (0, 4).",
                hint: "Una pendiente negativa significa que la línea baja de izquierda a derecha.",
                type: "linear",
                target: { m: -1.5, b: 4 },
                tolerance: 0.1,
                points: 150
            },
            {
                title: "Desafío 3: Tu Primera Parábola",
                description: "Crea una función cuadrática y = x² + 3.",
                hint: "En la forma y = ax² + bx + c, necesitas a = 1, b = 0, c = 3.",
                type: "quadratic",
                target: { a: 1, b: 0, c: 3 },
                tolerance: 0.1,
                points: 200
            },
            {
                title: "Desafío 4: Parábola Invertida",
                description: "Crea una parábola que se abra hacia abajo con vértice en (0, 5).",
                hint: "Para que se abra hacia abajo, el coeficiente 'a' debe ser negativo.",
                type: "quadratic",
                target: { a: -1, b: 0, c: 5 },
                tolerance: 0.1,
                points: 250
            },
            {
                title: "Desafío 5: Parábola Desplazada",
                description: "Crea la función cuadrática y = 2(x - 1)² - 3.",
                hint: "Esta es la forma vértice: y = a(x - h)² + k, donde (h, k) es el vértice.",
                type: "quadratic",
                target: { a: 2, h: 1, k: -3 },
                tolerance: 0.1,
                points: 300
            }
        ];

        // Logros disponibles
        const achievements = [
            { id: 'first_graph', name: 'Primer Gráfico', icon: '📊', unlocked: false },
            { id: 'linear_master', name: 'Maestro Lineal', icon: '📏', unlocked: false },
            { id: 'curve_explorer', name: 'Explorador de Curvas', icon: '🌊', unlocked: false },
            { id: 'perfect_streak', name: 'Racha Perfecta', icon: '🔥', unlocked: false },
            { id: 'space_navigator', name: 'Navegante Espacial', icon: '🚀', unlocked: false }
        ];

        // Inicialización
        document.addEventListener('DOMContentLoaded', function() {
            createStars();
            initializeCanvas();
            updateGraph();
            updateChallenge();
            updateUI();
        });

        // Crear estrellas de fondo
        function createStars() {
            const starsContainer = document.querySelector('.stars');
            for (let i = 0; i < 100; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.width = Math.random() * 3 + 1 + 'px';
                star.style.height = star.style.width;
                star.style.animationDelay = Math.random() * 3 + 's';
                starsContainer.appendChild(star);
            }
        }

        // Configurar canvas
        function initializeCanvas() {
            const canvas = document.getElementById('graphCanvas');
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        }

        // Seleccionar tipo de función
        function selectFunction(type) {
            currentFunction = type;
            
            // Actualizar botones
            document.getElementById('linearBtn').classList.remove('active');
            document.getElementById('quadraticBtn').classList.remove('active');
            document.getElementById(type + 'Btn').classList.add('active');
            
            // Actualizar controles de parámetros
            updateParameterControls();
            updateGraph();
            updateEquation();
        }

        // Actualizar controles de parámetros
        function updateParameterControls() {
            const controlsContainer = document.getElementById('parameterControls');
            
            if (currentFunction === 'linear') {
                controlsContainer.innerHTML = `
                    <div class="parameter-group">
                        <label class="parameter-label">Pendiente (m)</label>
                        <input type="range" class="slider" min="-5" max="5" step="0.1" value="${parameters.m}" 
                               onInput="updateParameter('m', this.value)" id="mSlider">
                        <input type="number" class="parameter-input" min="-5" max="5" step="0.1" value="${parameters.m}" 
                               onInput="updateParameter('m', this.value)" id="mInput">
                    </div>
                    
                    <div class="parameter-group">
                        <label class="parameter-label">Intersección Y (b)</label>
                        <input type="range" class="slider" min="-10" max="10" step="0.1" value="${parameters.b}" 
                               onInput="updateParameter('b', this.value)" id="bSlider">
                        <input type="number" class="parameter-input" min="-10" max="10" step="0.1" value="${parameters.b}" 
                               onInput="updateParameter('b', this.value)" id="bInput">
                    </div>
                `;
            } else {
                controlsContainer.innerHTML = `
                    <div class="parameter-group">
                        <label class="parameter-label">Coeficiente a</label>
                        <input type="range" class="slider" min="-3" max="3" step="0.1" value="${parameters.a}" 
                               onInput="updateParameter('a', this.value)" id="aSlider">
                        <input type="number" class="parameter-input" min="-3" max="3" step="0.1" value="${parameters.a}" 
                               onInput="updateParameter('a', this.value)" id="aInput">
                    </div>
                    
                    <div class="parameter-group">
                        <label class="parameter-label">Desplazamiento X (h)</label>
                        <input type="range" class="slider" min="-5" max="5" step="0.1" value="${parameters.h}" 
                               onInput="updateParameter('h', this.value)" id="hSlider">
                        <input type="number" class="parameter-input" min="-5" max="5" step="0.1" value="${parameters.h}" 
                               onInput="updateParameter('h', this.value)" id="hInput">
                    </div>
                    
                    <div class="parameter-group">
                        <label class="parameter-label">Desplazamiento Y (k)</label>
                        <input type="range" class="slider" min="-10" max="10" step="0.1" value="${parameters.k}" 
                               onInput="updateParameter('k', this.value)" id="kSlider">
                        <input type="number" class="parameter-input" min="-10" max="10" step="0.1" value="${parameters.k}" 
                               onInput="updateParameter('k', this.value)" id="kInput">
                    </div>
                `;
            }
        }

        // Actualizar parámetro
        function updateParameter(param, value) {
            parameters[param] = parseFloat(value);
            
            // Sincronizar slider e input
            const slider = document.getElementById(param + 'Slider');
            const input = document.getElementById(param + 'Input');
            if (slider) slider.value = value;
            if (input) input.value = value;
            
            updateGraph();
            updateEquation();
        }

        // Actualizar ecuación mostrada
        function updateEquation() {
            const equationElement = document.getElementById('currentEquation');
            let equation = '';
            
            if (currentFunction === 'linear') {
                const m = parameters.m.toFixed(1);
                const b = parameters.b.toFixed(1);
                const bStr = parameters.b >= 0 ? `+ ${b}` : `- ${Math.abs(parameters.b).toFixed(1)}`;
                equation = `y = ${m}x ${bStr}`;
            } else {
                const a = parameters.a.toFixed(1);
                const h = parameters.h.toFixed(1);
                const k = parameters.k.toFixed(1);
                const kStr = parameters.k >= 0 ? `+ ${k}` : `- ${Math.abs(parameters.k).toFixed(1)}`;
                equation = `y = ${a}(x - ${h})² ${kStr}`;
            }
            
            equationElement.textContent = equation;
        }

        // Actualizar gráfico
        function updateGraph() {
            const canvas = document.getElementById('graphCanvas');
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;
            
            // Limpiar canvas
            ctx.fillStyle = 'rgba(0, 20, 40, 0.9)';
            ctx.fillRect(0, 0, width, height);
            
            // Configuración del plano cartesiano
            const centerX = width / 2;
            const centerY = height / 2;
            const scale = 20; // pixeles por unidad
            
            // Dibujar cuadrícula
            drawGrid(ctx, width, height, centerX, centerY, scale);
            
            // Dibujar ejes
            drawAxes(ctx, width, height, centerX, centerY);
            
            // Dibujar función
            if (currentFunction === 'linear') {
                drawLinearFunction(ctx, centerX, centerY, scale);
            } else {
                drawQuadraticFunction(ctx, centerX, centerY, scale);
            }
            
            // Dibujar puntos de referencia si es necesario para el desafío actual
            drawChallengePoints(ctx, centerX, centerY, scale);
        }

        // Dibujar cuadrícula
        function drawGrid(ctx, width, height, centerX, centerY, scale) {
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            
            // Líneas verticales
            for (let x = centerX % scale; x < width; x += scale) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            
            // Líneas horizontales
            for (let y = centerY % scale; y < height; y += scale) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
        }

        // Dibujar ejes
        function drawAxes(ctx, width, height, centerX, centerY) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            
            // Eje X
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(width, centerY);
            ctx.stroke();
            
            // Eje Y
            ctx.beginPath();
            ctx.moveTo(centerX, 0);
            ctx.lineTo(centerX, height);
            ctx.stroke();
            
            // Etiquetas de los ejes
            ctx.fillStyle = 'white';
            ctx.font = '14px Orbitron';
            ctx.textAlign = 'center';
            
            // Números en eje X
            for (let i = -10; i <= 10; i++) {
                if (i !== 0) {
                    const x = centerX + i * 20;
                    if (x >= 0 && x <= width) {
                        ctx.fillText(i.toString(), x, centerY + 20);
                    }
                }
            }
            
            // Números en eje Y
            ctx.textAlign = 'right';
            for (let i = -10; i <= 10; i++) {
                if (i !== 0) {
                    const y = centerY - i * 20;
                    if (y >= 0 && y <= height) {
                        ctx.fillText(i.toString(), centerX - 10, y + 5);
                    }
                }
            }
        }

        // Dibujar función lineal
        function drawLinearFunction(ctx, centerX, centerY, scale) {
            const m = parameters.m;
            const b = parameters.b;
            
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 10;
            
            ctx.beginPath();
            
            const startX = -centerX / scale;
            const endX = (ctx.canvas.width - centerX) / scale;
            
            for (let x = startX; x <= endX; x += 0.1) {
                const y = m * x + b;
                const canvasX = centerX + x * scale;
                const canvasY = centerY - y * scale;
                
                if (x === startX) {
                    ctx.moveTo(canvasX, canvasY);
                } else {
                    ctx.lineTo(canvasX, canvasY);
                }
            }
            
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        // Dibujar función cuadrática
        function drawQuadraticFunction(ctx, centerX, centerY, scale) {
            const a = parameters.a;
            const h = parameters.h;
            const k = parameters.k;
            
            ctx.strokeStyle = '#ff00ff';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#ff00ff';
            ctx.shadowBlur = 10;
            
            ctx.beginPath();
            
            const startX = -centerX / scale;
            const endX = (ctx.canvas.width - centerX) / scale;
            
            let firstPoint = true;
            for (let x = startX; x <= endX; x += 0.05) {
                const y = a * Math.pow(x - h, 2) + k;
                const canvasX = centerX + x * scale;
                const canvasY = centerY - y * scale;
                
                if (canvasY >= -50 && canvasY <= ctx.canvas.height + 50) {
                    if (firstPoint) {
                        ctx.moveTo(canvasX, canvasY);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(canvasX, canvasY);
                    }
                }
            }
            
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            // Dibujar vértice
            const vertexX = centerX + h * scale;
            const vertexY = centerY - k * scale;
            
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(vertexX, vertexY, 6, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Dibujar puntos del desafío
        function drawChallengePoints(ctx, centerX, centerY, scale) {
            const challenge = challenges[gameState.currentChallenge];
            if (!challenge || !challenge.points) return;
            
            ctx.fillStyle = '#ffff00';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            
            if (challenge.points) {
                challenge.points.forEach(point => {
                    const canvasX = centerX + point.x * scale;
                    const canvasY = centerY - point.y * scale;
                    
                    ctx.beginPath();
                    ctx.arc(canvasX, canvasY, 8, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Etiqueta del punto
                    ctx.fillStyle = 'white';
                    ctx.font = '12px Orbitron';
                    ctx.textAlign = 'center';
                    ctx.fillText(`(${point.x}, ${point.y})`, canvasX, canvasY - 15);
                    ctx.fillStyle = '#ffff00';
                });
            }
        }

        // Verificar desafío
        function checkChallenge() {
            const challenge = challenges[gameState.currentChallenge];
            const tolerance = challenge.tolerance;
            let isCorrect = true;
            
            if (challenge.type === 'linear') {
                const mDiff = Math.abs(parameters.m - challenge.target.m);
                const bDiff = Math.abs(parameters.b - challenge.target.b);
                isCorrect = mDiff <= tolerance && bDiff <= tolerance;
            } else if (challenge.type === 'quadratic') {
                if (challenge.target.a !== undefined) {
                    const aDiff = Math.abs(parameters.a - challenge.target.a);
                    isCorrect = isCorrect && aDiff <= tolerance;
                }
                if (challenge.target.h !== undefined) {
                    const hDiff = Math.abs(parameters.h - challenge.target.h);
                    isCorrect = isCorrect && hDiff <= tolerance;
                }
                if (challenge.target.k !== undefined) {
                    const kDiff = Math.abs(parameters.k - challenge.target.k);
                    isCorrect = isCorrect && kDiff <= tolerance;
                }
                if (challenge.target.b !== undefined) {
                    const bDiff = Math.abs(parameters.b - challenge.target.b);
                    isCorrect = isCorrect && bDiff <= tolerance;
                }
                if (challenge.target.c !== undefined) {
                    const cDiff = Math.abs(parameters.k - challenge.target.c);
                    isCorrect = isCorrect && cDiff <= tolerance;
                }
            }
            
            const feedbackElement = document.getElementById('feedback');
            
            if (isCorrect) {
                feedbackElement.className = 'feedback correct';
                feedbackElement.textContent = '¡Excelente! Has resuelto el desafío correctamente. 🚀';
                
                // Actualizar puntuación
                gameState.score += challenge.points;
                gameState.challenges++;
                gameState.streak++;
                
                // Verificar logros
                checkAchievements();
                
                // Avanzar al siguiente desafío
                setTimeout(() => {
                    nextChallenge();
                }, 2000);
                
            } else {
                feedbackElement.className = 'feedback incorrect';
                feedbackElement.textContent = 'Aún no es correcto. Revisa los parámetros e inténtalo de nuevo. 🔍';
                gameState.streak = 0;
            }
            
            updateUI();
        }

        // Mostrar pista
        function showHint() {
            const challenge = challenges[gameState.currentChallenge];
            const feedbackElement = document.getElementById('feedback');
            feedbackElement.className = 'feedback';
            feedbackElement.style.background = 'rgba(255, 255, 0, 0.2)';
            feedbackElement.style.color = '#ffff00';
            feedbackElement.style.border = '1px solid #ffff00';
            feedbackElement.textContent = '💡 ' + challenge.hint;
        }

        // Siguiente desafío
        function nextChallenge() {
            gameState.currentChallenge++;
            if (gameState.currentChallenge >= challenges.length) {
                // Juego completado
                showGameComplete();
                return;
            }
            
            updateChallenge();
            document.getElementById('feedback').textContent = '';
            document.getElementById('feedback').className = 'feedback';
        }

        // Actualizar desafío actual
        function updateChallenge() {
            const challenge = challenges[gameState.currentChallenge];
            const challengeElement = document.getElementById('currentChallenge');
            
            challengeElement.innerHTML = `
                <div class="challenge-title">${challenge.title}</div>
                <div class="challenge-description">${challenge.description}</div>
                <button class="check-btn" onclick="checkChallenge()">Verificar Solución</button>
                <button class="hint-btn" onclick="showHint()">💡 Pista</button>
                <div class="feedback" id="feedback"></div>
            `;
            
            // Cambiar a la función correcta
            if (challenge.type !== currentFunction) {
                selectFunction(challenge.type);
            }
            
            // Agregar puntos de referencia si los hay
            if (challenge.title.includes("puntos")) {
                if (challenge.target.m === 2 && challenge.target.b === 2) {
                    challenge.points = [{x: 0, y: 2}, {x: 2, y: 6}];
                }
            }
        }

        // Verificar logros
        function checkAchievements() {
            // Primer gráfico
            if (!achievements[0].unlocked && gameState.challenges >= 1) {
                unlockAchievement(0);
            }
            
            // Maestro lineal
            if (!achievements[1].unlocked && gameState.challenges >= 2) {
                unlockAchievement(1);
            }
            
            // Explorador de curvas
            if (!achievements[2].unlocked && gameState.challenges >= 3) {
                unlockAchievement(2);
            }
            
            // Racha perfecta
            if (!achievements[3].unlocked && gameState.streak >= 3) {
                unlockAchievement(3);
            }
            
            // Navegante espacial
            if (!achievements[4].unlocked && gameState.challenges >= 5) {
                unlockAchievement(4);
            }
        }

        // Desbloquear logro
        function unlockAchievement(index) {
            achievements[index].unlocked = true;
            gameState.score += 50; // Bonus por logro
            
            // Mostrar notificación
            showNotification(`¡Logro desbloqueado: ${achievements[index].name}! ${achievements[index].icon}`);
            
            updateUI();
        }

        // Mostrar notificación
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.style.position = 'fixed';
            notification.style.top = '20px';
            notification.style.right = '20px';
            notification.style.background = 'linear-gradient(45deg, #00ff00, #00ffff)';
            notification.style.color = 'black';
            notification.style.padding = '15px 25px';
            notification.style.borderRadius = '10px';
            notification.style.fontFamily = 'Orbitron, monospace';
            notification.style.fontWeight = '600';
            notification.style.zIndex = '1000';
            notification.style.transform = 'translateX(100%)';
            notification.style.transition = 'transform 0.5s ease';
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 500);
            }, 3000);
        }

        // Actualizar interfaz
        function updateUI() {
            document.getElementById('score').textContent = gameState.score;
            document.getElementById('level').textContent = Math.floor(gameState.score / 500) + 1;
            document.getElementById('challenges').textContent = gameState.challenges;
            document.getElementById('streak').textContent = gameState.streak;
            
            // Actualizar logros
            const achievementsContainer = document.getElementById('achievements');
            achievementsContainer.innerHTML = '';
            
            achievements.forEach(achievement => {
                if (achievement.unlocked) {
                    const achievementElement = document.createElement('div');
                    achievementElement.className = 'achievement';
                    achievementElement.textContent = achievement.icon;
                    achievementElement.title = achievement.name;
                    achievementsContainer.appendChild(achievementElement);
                }
            });
        }

        // Mostrar completación del juego
        function showGameComplete() {
            const challengeElement = document.getElementById('currentChallenge');
            challengeElement.innerHTML = `
                <div class="challenge-title">🎉 ¡Felicitaciones, Navegante Espacial! 🎉</div>
                <div class="challenge-description">
                    Has completado todos los desafíos del Graficador Espacial. Has demostrado un excelente dominio de las funciones lineales y cuadráticas.
                    <br><br>
                    <strong>Puntuación Final:</strong> ${gameState.score} puntos<br>
                    <strong>Desafíos Completados:</strong> ${gameState.challenges}/5<br>
                    <strong>Logros Desbloqueados:</strong> ${achievements.filter(a => a.unlocked).length}/${achievements.length}
                    <br><br>
                    ¡Sigue explorando el fascinante mundo de las matemáticas!
                </div>
                <button class="check-btn" onclick="resetGame()">🔄 Jugar de Nuevo</button>
            `;
        }

        // Reiniciar juego
        function resetGame() {
            gameState = {
                score: 0,
                level: 1,
                challenges: 0,
                streak: 0,
                currentChallenge: 0
            };
            
            achievements.forEach(a => a.unlocked = false);
            
            parameters = { m: 1, b: 0, a: 1, h: 0, k: 0 };
            currentFunction = 'linear';
            
            selectFunction('linear');
            updateChallenge();
            updateUI();
        }

        // Eventos de redimensionamiento
        window.addEventListener('resize', function() {
            setTimeout(() => {
                initializeCanvas();
                updateGraph();
            }, 100);
        });
