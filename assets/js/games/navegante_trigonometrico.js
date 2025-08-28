/* Extracted from games/navegante_trigonometrico.html on 2025-08-28T03:35:45.670Z */
window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XZ1QWD1TCC');

// Redirige si no hay usuario autenticado
        if (!localStorage.getItem('currentUser') && !sessionStorage.getItem('currentUser')) {
            window.location.replace('/complete-login-html.html');
        }
        let gameState = {
            ship: { x: 50, y: 50 },
            treasure: { x: 0, y: 0 },
            currentFunction: 'sin',
            difficulty: 'facil',
            level: 1,
            treasuresInLevel: 0,
            treasuresPerLevel: 5,
            stats: {
                treasuresFound: 0,
                navigationAttempts: 0,
                successfulNavigations: 0,
                totalScore: 0,
                totalDistance: 0
            },
            mapSize: { width: 100, height: 100 },
            tolerance: { facil: 25, medio: 15, dificil: 8 },
            shipTrail: [],
            soundEnabled: true,
            achievements: new Set(),
            hintsUsed: 0
        };

        const trigFunctions = {
            sin: (angle, distance) => ({
                x: distance * Math.sin(angle * Math.PI / 180),
                y: distance * Math.cos(angle * Math.PI / 180),
                formula: `x = ${distance} × sin(${angle}°) = ${(distance * Math.sin(angle * Math.PI / 180)).toFixed(2)}\ny = ${distance} × cos(${angle}°) = ${(distance * Math.cos(angle * Math.PI / 180)).toFixed(2)}`
            }),
            cos: (angle, distance) => ({
                x: distance * Math.cos(angle * Math.PI / 180),
                y: distance * Math.sin(angle * Math.PI / 180),
                formula: `x = ${distance} × cos(${angle}°) = ${(distance * Math.cos(angle * Math.PI / 180)).toFixed(2)}\ny = ${distance} × sin(${angle}°) = ${(distance * Math.sin(angle * Math.PI / 180)).toFixed(2)}`
            }),
            tan: (angle, distance) => {
                const tanValue = Math.tan(angle * Math.PI / 180);
                let x, y;
                
                if (angle === 90 || angle === 270) {
                    x = 0;
                    y = angle === 90 ? distance : -distance;
                } else {
                    x = distance / Math.sqrt(1 + (tanValue * tanValue));
                    y = x * tanValue;
                    
                    if (angle > 90 && angle < 270) x = -Math.abs(x);
                    if (angle > 180) y = -Math.abs(y);
                }
                
                return {
                    x: x,
                    y: y,
                    formula: `tan(${angle}°) = ${tanValue.toFixed(3)}\nx = ${distance} / √(1 + tan²(${angle}°)) = ${x.toFixed(2)}\ny = x × tan(${angle}°) = ${y.toFixed(2)}`
                };
            }
        };

        const achievements = {
            'primer_tesoro': { name: '🏴‍☠️ Primer Tesoro', desc: 'Encuentra tu primer tesoro' },
            'navegante_experto': { name: '🧭 Navegante Experto', desc: 'Encuentra 5 tesoros' },
            'maestro_trigonometria': { name: '📐 Maestro Trigonometría', desc: 'Usa las 3 funciones trigonométricas' },
            'precision_perfecta': { name: '🎯 Precisión Perfecta', desc: 'Navega con 90% de precisión' },
            'cazatesoros': { name: '💎 Cazatesoros', desc: 'Encuentra 10 tesoros' },
            'sin_pistas': { name: '🧠 Navegación Pura', desc: 'Encuentra un tesoro sin usar pistas' },
            'velocidad_luz': { name: '⚡ Velocidad de Luz', desc: 'Encuentra un tesoro en menos de 30 segundos' },
            'explorador': { name: '🗺️ Explorador', desc: 'Navega más de 500 millas' }
        };

        const hints = {
            facil: [
                "🧭 Para ir hacia el Norte (arriba), usa un ángulo de 0°",
                "📐 La función SEN te da el desplazamiento horizontal (X)",
                "📐 La función COS te da el desplazamiento vertical (Y)",
                "🎯 Imagina el mapa como un plano cartesiano con el barco en el centro",
                "💡 Si el tesoro está a la derecha, necesitas un ángulo entre 45° y 135°"
            ],
            medio: [
                "📊 Recuerda: SEN(0°) = 0, COS(0°) = 1",
                "🔄 Los ángulos se miden desde el Norte en sentido horario",
                "📐 Para ángulos mayores a 90°, considera los signos de las funciones",
                "🎯 La distancia euclidiana se calcula con √((x₂-x₁)² + (y₂-y₁)²)",
                "💭 Piensa en el círculo unitario para recordar los valores"
            ],
            dificil: [
                "🧮 En el segundo cuadrante: SEN(+), COS(-), TAN(-)",
                "📈 Usa identidades: sin²θ + cos²θ = 1",
                "🔍 Para TAN, considera las asíntotas en 90° y 270°",
                "⚖️ Equilibra precisión con eficiencia en tus cálculos",
                "🎨 Visualiza vectores para entender mejor las direcciones"
            ]
        };

        // Funciones de inicialización
        function initGame() {
            generateNewTreasure();
            updateDisplay();
            updateCompass(0);
            showAlert('🎮 ¡Bienvenido, capitán! Usa la trigonometría para encontrar tesoros.', 'info');
            playSound('start');
        }

        function generateNewTreasure() {
            const difficulty = gameState.difficulty;
            let minDistance = { facil: 15, medio: 20, dificil: 25 }[difficulty];
            let maxDistance = { facil: 40, medio: 50, dificil: 60 }[difficulty];
            
            do {
                gameState.treasure.x = Math.random() * 80 + 10;
                gameState.treasure.y = Math.random() * 80 + 10;
            } while (calculateDistance(gameState.ship, gameState.treasure) < minDistance || 
                     calculateDistance(gameState.ship, gameState.treasure) > maxDistance);
            
            updateTreasurePosition();
            updateMissionText();
            gameState.hintsUsed = 0;
            
            // Reset calculation displays
            document.getElementById('calculatedX').value = '';
            document.getElementById('calculatedY').value = '';
            document.getElementById('navigateBtn').disabled = true;
        }

        // Funciones de cálculo y navegación
        function calculateDistance(point1, point2) {
            return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
        }

        function selectFunction(func) {
            gameState.currentFunction = func;
            
            document.querySelectorAll('.func-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            updateCalculationSteps();
            playSound('click');
        }

        function calculatePosition() {
            const angle = parseFloat(document.getElementById('angleInput').value);
            const distance = parseFloat(document.getElementById('distanceInput').value);
            
            if (isNaN(angle) || isNaN(distance)) {
                showAlert('⚠️ Por favor ingresa valores válidos para ángulo y distancia', 'warning');
                return;
            }
            
            if (angle < 0 || angle > 360) {
                showAlert('⚠️ El ángulo debe estar entre 0° y 360°', 'warning');
                return;
            }
            
            if (distance < 1 || distance > 50) {
                showAlert('⚠️ La distancia debe estar entre 1 y 50 millas', 'warning');
                return;
            }
            
            const result = trigFunctions[gameState.currentFunction](angle, distance);
            
            const newX = Math.max(0, Math.min(100, gameState.ship.x + result.x));
            const newY = Math.max(0, Math.min(100, gameState.ship.y + result.y));
            
            document.getElementById('calculatedX').value = newX.toFixed(1);
            document.getElementById('calculatedY').value = newY.toFixed(1);
            document.getElementById('navigateBtn').disabled = false;
            
            updateCompass(angle);
            showCalculationSteps(angle, distance, result);
            
            showAlert(`📊 Posición calculada: (${newX.toFixed(1)}, ${newY.toFixed(1)})`, 'info');
            playSound('calculate');
        }

        function navigate() {
            const newX = parseFloat(document.getElementById('calculatedX').value);
            const newY = parseFloat(document.getElementById('calculatedY').value);
            
            if (isNaN(newX) || isNaN(newY)) {
                showAlert('⚠️ Primero calcula la nueva posición', 'warning');
                return;
            }
            
            // Añadir rastro del barco
            gameState.shipTrail.push({x: gameState.ship.x, y: gameState.ship.y});
            if (gameState.shipTrail.length > 10) gameState.shipTrail.shift();
            
            // Mover el barco
            const oldPosition = {x: gameState.ship.x, y: gameState.ship.y};
            gameState.ship.x = newX;
            gameState.ship.y = newY;
            
            // Actualizar estadísticas
            gameState.stats.navigationAttempts++;
            const distance = calculateDistance(oldPosition, gameState.ship);
            gameState.stats.totalDistance += distance;
            
            updateShipPosition();
            updateDisplay();
            
            // Verificar si encontró el tesoro
            const distanceToTreasure = calculateDistance(gameState.ship, gameState.treasure);
            const tolerance = gameState.tolerance[gameState.difficulty];
            
            if (distanceToTreasure <= tolerance) {
                treasureFound();
            } else {
                const message = distanceToTreasure <= tolerance * 1.5 ? 
                    '🔥 ¡Muy cerca! Sigue navegando' : 
                    '🌊 Continúa navegando hacia el tesoro';
                showAlert(message, 'info');
                playSound('navigate');
            }
            
            // Limpiar inputs para próxima navegación
            document.getElementById('angleInput').value = '';
            document.getElementById('distanceInput').value = '';
            document.getElementById('calculatedX').value = '';
            document.getElementById('calculatedY').value = '';
            document.getElementById('navigateBtn').disabled = true;
            
            checkAchievements();
        }

        function treasureFound() {
            gameState.stats.treasuresFound++;
            gameState.stats.successfulNavigations++;
            gameState.treasuresInLevel++;
            
            // Calcular puntuación
            const baseScore = { facil: 100, medio: 200, dificil: 300 }[gameState.difficulty];
            const hintPenalty = gameState.hintsUsed * 10;
            const accuracyBonus = gameState.stats.navigationAttempts > 0 ? 
                Math.round((gameState.stats.successfulNavigations / gameState.stats.navigationAttempts) * 100) : 0;
            
            const score = Math.max(50, baseScore - hintPenalty + accuracyBonus);
            gameState.stats.totalScore += score;
            
            updateDisplay();
            showTreasureScreen(score);
            playSound('treasure');
            createParticleEffect();
            
            checkAchievements();
            checkLevelUp();
        }

        // Funciones de interfaz
        function updateDisplay() {
            document.getElementById('shipX').textContent = gameState.ship.x.toFixed(1);
            document.getElementById('shipY').textContent = gameState.ship.y.toFixed(1);
            document.getElementById('treasuresFound').textContent = gameState.stats.treasuresFound;
            document.getElementById('navigationAttempts').textContent = gameState.stats.navigationAttempts;
            document.getElementById('totalScore').textContent = gameState.stats.totalScore;
            document.getElementById('totalDistance').textContent = gameState.stats.totalDistance.toFixed(1) + ' millas';
            
            const accuracy = gameState.stats.navigationAttempts > 0 ? 
                Math.round((gameState.stats.successfulNavigations / gameState.stats.navigationAttempts) * 100) : 0;
            document.getElementById('accuracy').textContent = accuracy + '%';
            
            const distanceToTreasure = calculateDistance(gameState.ship, gameState.treasure);
            document.getElementById('treasureDistance').textContent = `Distancia al tesoro: ${distanceToTreasure.toFixed(1)} millas`;
            
            updateProgressBar();
        }

        function updateProgressBar() {
            const progress = (gameState.treasuresInLevel / gameState.treasuresPerLevel) * 100;
            document.getElementById('progressBar').style.width = progress + '%';
            document.getElementById('progressText').textContent = 
                `Nivel ${gameState.level} - ${gameState.treasuresInLevel}/${gameState.treasuresPerLevel} tesoros`;
        }

        function updateShipPosition() {
            const shipMarker = document.getElementById('shipMarker');
            shipMarker.style.left = gameState.ship.x + '%';
            shipMarker.style.top = (100 - gameState.ship.y) + '%';
            
            updateShipTrail();
        }

        function updateTreasurePosition() {
            const treasureMarker = document.getElementById('treasureMarker');
            treasureMarker.style.left = gameState.treasure.x + '%';
            treasureMarker.style.top = (100 - gameState.treasure.y) + '%';
        }

        function updateShipTrail() {
            // Limpiar rastros anteriores
            document.querySelectorAll('.ship-trail').forEach(trail => trail.remove());
            
            // Crear nuevos rastros
            gameState.shipTrail.forEach((point, index) => {
                const trail = document.createElement('div');
                trail.className = 'ship-trail';
                trail.style.left = point.x + '%';
                trail.style.top = (100 - point.y) + '%';
                trail.style.height = '10px';
                trail.style.opacity = (index + 1) / gameState.shipTrail.length * 0.5;
                document.getElementById('mapCanvas').appendChild(trail);
            });
        }

        function updateCompass(angle) {
            document.getElementById('compassNeedle').style.transform = `rotate(${angle}deg)`;
            document.getElementById('currentHeading').textContent = angle + '°';
        }

        function showCalculationSteps(angle, distance, result) {
            const stepsContainer = document.getElementById('calculationSteps');
            const funcName = gameState.currentFunction.toUpperCase();
            
            stepsContainer.innerHTML = `
                <div class="calculation-step">1. Función seleccionada: ${funcName}</div>
                <div class="calculation-step">2. Ángulo: ${angle}°, Distancia: ${distance} millas</div>
                <div class="calculation-step">3. Cálculos:</div>
                <div class="calculation-step" style="font-size: 0.9rem; margin-left: 20px; white-space: pre-line;">${result.formula}</div>
                <div class="calculation-step">4. Nueva posición: (${(gameState.ship.x + result.x).toFixed(1)}, ${(gameState.ship.y + result.y).toFixed(1)})</div>
            `;
        }

        function showAlert(message, type) {
            const existingAlert = document.querySelector('.alert');
            if (existingAlert) existingAlert.remove();
            
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.textContent = message;
            
            document.querySelector('.container').appendChild(alert);
            
            setTimeout(() => {
                if (alert.parentNode) alert.remove();
            }, 4000);
        }

        function showTreasureScreen(score) {
            const screen = document.getElementById('treasureScreen');
            const message = document.getElementById('treasureMessage');
            const stats = document.getElementById('treasureStats');
            
            message.textContent = `¡Excelente navegación! Has encontrado el tesoro usando ${gameState.currentFunction.toUpperCase()}.`;
            stats.innerHTML = `
                <div style="font-size: 1.2rem; margin: 10px 0;">
                    <strong>Puntuación obtenida: ${score} puntos</strong><br>
                    Navegaciones realizadas: ${gameState.stats.navigationAttempts}<br>
                    Pistas usadas: ${gameState.hintsUsed}
                </div>
            `;
            
            displayNewAchievements();
            screen.classList.add('show');
        }

        function displayNewAchievements() {
            const container = document.getElementById('achievementBadges');
            container.innerHTML = '';
            
            // Mostrar solo logros recientes (últimos 3)
            const recentAchievements = Array.from(gameState.achievements).slice(-3);
            recentAchievements.forEach(achievementId => {
                if (achievements[achievementId]) {
                    const badge = document.createElement('div');
                    badge.className = 'achievement-badge';
                    badge.textContent = achievements[achievementId].name;
                    badge.title = achievements[achievementId].desc;
                    container.appendChild(badge);
                }
            });
        }

        // Funciones de juego avanzadas
        function setDifficulty(level) {
            gameState.difficulty = level;
            
            document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            // Reiniciar posición del barco y generar nuevo tesoro
            gameState.ship.x = 50;
            gameState.ship.y = 50;
            generateNewTreasure();
            updateShipPosition();
            
            const messages = {
                facil: '📚 Dificultad Fácil: Tolerancia de 25 millas',
                medio: '⚖️ Dificultad Media: Tolerancia de 15 millas',
                dificil: '🎯 Dificultad Difícil: Tolerancia de 8 millas'
            };
            
            showAlert(messages[level], 'info');
            playSound('click');
        }

        function showHint() {
            const hintPanel = document.getElementById('hintPanel');
            const hintContent = document.getElementById('hintContent');
            
            if (hintPanel.classList.contains('show')) {
                hintPanel.classList.remove('show');
                return;
            }
            
            gameState.hintsUsed++;
            const hintsForLevel = hints[gameState.difficulty];
            const randomHint = hintsForLevel[Math.floor(Math.random() * hintsForLevel.length)];
            
            // Pista específica basada en la posición del tesoro
            const angle = Math.atan2(gameState.treasure.y - gameState.ship.y, gameState.treasure.x - gameState.ship.x) * 180 / Math.PI;
            const distance = calculateDistance(gameState.ship, gameState.treasure);
            
            let specificHint = '';
            if (angle >= -45 && angle <= 45) specificHint = 'El tesoro está hacia el ESTE →';
            else if (angle > 45 && angle <= 135) specificHint = 'El tesoro está hacia el NORTE ↑';
            else if (angle > 135 || angle <= -135) specificHint = 'El tesoro está hacia el OESTE ←';
            else specificHint = 'El tesoro está hacia el SUR ↓';
            
            hintContent.innerHTML = `
                <div style="margin-bottom: 15px;"><strong>${randomHint}</strong></div>
                <div style="color: #74b9ff;">🧭 ${specificHint}</div>
                <div style="color: #00cec9; margin-top: 10px;">📏 Distancia aproximada: ${Math.round(distance)} millas</div>
                <div style="color: #fdcb6e; font-size: 0.9rem; margin-top: 10px;">
                    💰 Usar pistas reduce tu puntuación (-10 puntos por pista)
                </div>
            `;
            
            hintPanel.classList.add('show');
            playSound('hint');
        }

        function newTreasure() {
            generateNewTreasure();
            document.getElementById('hintPanel').classList.remove('show');
            showAlert('🗺️ ¡Nuevo tesoro generado! Comienza tu navegación.', 'info');
            playSound('click');
        }

        function nextTreasure() {
            document.getElementById('treasureScreen').classList.remove('show');
            generateNewTreasure();
            document.getElementById('hintPanel').classList.remove('show');
        }

        function closeTreasure() {
            document.getElementById('treasureScreen').classList.remove('show');
        }

        function resetGame() {
            if (confirm('¿Estás seguro de que quieres reiniciar el juego? Se perderá todo el progreso.')) {
                gameState = {
                    ship: { x: 50, y: 50 },
                    treasure: { x: 0, y: 0 },
                    currentFunction: 'sin',
                    difficulty: 'facil',
                    level: 1,
                    treasuresInLevel: 0,
                    treasuresPerLevel: 5,
                    stats: {
                        treasuresFound: 0,
                        navigationAttempts: 0,
                        successfulNavigations: 0,
                        totalScore: 0,
                        totalDistance: 0
                    },
                    mapSize: { width: 100, height: 100 },
                    tolerance: { facil: 25, medio: 15, dificil: 8 },
                    shipTrail: [],
                    soundEnabled: true,
                    achievements: new Set(),
                    hintsUsed: 0
                };
                
                initGame();
                showAlert('🔄 Juego reiniciado. ¡Buena suerte, capitán!', 'info');
            }
        }

        function checkAchievements() {
            const stats = gameState.stats;
            const newAchievements = new Set();
            
            if (stats.treasuresFound >= 1 && !gameState.achievements.has('primer_tesoro')) {
                newAchievements.add('primer_tesoro');
            }
            
            if (stats.treasuresFound >= 5 && !gameState.achievements.has('navegante_experto')) {
                newAchievements.add('navegante_experto');
            }
            
            if (stats.treasuresFound >= 10 && !gameState.achievements.has('cazatesoros')) {
                newAchievements.add('cazatesoros');
            }
            
            const accuracy = stats.navigationAttempts > 0 ? 
                (stats.successfulNavigations / stats.navigationAttempts) * 100 : 0;
            if (accuracy >= 90 && stats.navigationAttempts >= 5 && !gameState.achievements.has('precision_perfecta')) {
                newAchievements.add('precision_perfecta');
            }
            
            if (stats.totalDistance >= 500 && !gameState.achievements.has('explorador')) {
                newAchievements.add('explorador');
            }
            
            if (gameState.hintsUsed === 0 && stats.treasuresFound > 0 && !gameState.achievements.has('sin_pistas')) {
                newAchievements.add('sin_pistas');
            }
            
            // Añadir nuevos logros
            newAchievements.forEach(achievement => {
                gameState.achievements.add(achievement);
                if (gameState.soundEnabled) playSound('achievement');
            });
        }

        function checkLevelUp() {
            if (gameState.treasuresInLevel >= gameState.treasuresPerLevel) {
                gameState.level++;
                gameState.treasuresInLevel = 0;
                gameState.treasuresPerLevel += 2; // Aumentar dificultad
                
                showAlert(`🎉 ¡NIVEL ${gameState.level}! Ahora necesitas ${gameState.treasuresPerLevel} tesoros por nivel.`, 'success');
                
                // Bonus por subir de nivel
                gameState.stats.totalScore += gameState.level * 100;
                updateDisplay();
            }
        }

        function updateMissionText() {
            const missions = [
                "🎯 Encuentra el tesoro dorado usando cálculos trigonométricos precisos",
                "🗺️ Navega hacia el tesoro perdido con ayuda de la trigonometría",
                "💎 Localiza el cofre del tesoro calculando coordenadas exactas",
                "⚓ Usa tus conocimientos de navegación para llegar al tesoro",
                "🧭 Emplea funciones trigonométricas para trazar tu ruta al tesoro"
            ];
            
            const mission = missions[Math.floor(Math.random() * missions.length)];
            document.getElementById('missionText').textContent = mission;
        }

        function updateCalculationSteps() {
            const func = gameState.currentFunction;
            const descriptions = {
                sin: "SEN se usa para calcular desplazamientos horizontales desde un ángulo",
                cos: "COS se usa para calcular desplazamientos verticales desde un ángulo", 
                tan: "TAN relaciona los desplazamientos X e Y directamente"
            };
            
            document.getElementById('calculationSteps').innerHTML = `
                <div class="calculation-step">1. Función ${func.toUpperCase()}: ${descriptions[func]}</div>
                <div class="calculation-step">2. Ingresa el ángulo de navegación (0° = Norte)</div>
                <div class="calculation-step">3. Ingresa la distancia a navegar</div>
                <div class="calculation-step">4. Calcula las nuevas coordenadas</div>
                <div class="calculation-step">5. Navega hacia la nueva posición</div>
            `;
        }

        // Funciones de efectos y sonido
        function createParticleEffect() {
            const colors = ['#ffd700', '#ffed4e', '#ff9ff3', '#74b9ff', '#00cec9'];
            
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.position = 'fixed';
                    particle.style.left = '50%';
                    particle.style.top = '50%';
                    particle.style.width = '6px';
                    particle.style.height = '6px';
                    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    particle.style.borderRadius = '50%';
                    particle.style.pointerEvents = 'none';
                    particle.style.zIndex = '1001';
                    
                    const angle = (Math.PI * 2 * i) / 20;
                    const velocity = Math.random() * 100 + 50;
                    
                    particle.style.animation = `particleFloat 2s ease-out forwards`;
                    particle.style.transform = `translate(-50%, -50%) translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px)`;
                    
                    document.body.appendChild(particle);
                    
                    setTimeout(() => particle.remove(), 2000);
                }, i * 50);
            }
        }

        function playSound(type) {
            if (!gameState.soundEnabled) return;
            
            // Crear contexto de audio simple para feedback sonoro
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const                 oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                const frequencies = {
                    start: 440,
                    click: 800,
                    calculate: 600,
                    navigate: 500,
                    treasure: 880,
                    achievement: 1000,
                    hint: 350
                };
                
                oscillator.frequency.value = frequencies[type] || 440;
                oscillator.type = type === 'treasure' ? 'triangle' : 'sine';
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.3);
            } catch (e) {
                console.log('Audio no disponible');
            }
        }

        function toggleSound() {
            gameState.soundEnabled = !gameState.soundEnabled;
            const btn = document.getElementById('soundToggle');
            btn.textContent = gameState.soundEnabled ? '🔊' : '🔇';
            
            showAlert(gameState.soundEnabled ? '🔊 Sonido activado' : '🔇 Sonido desactivado', 'info');
        }

        // Event listeners para mejorar la experiencia
        document.addEventListener('DOMContentLoaded', function() {
            initGame();
            
            // Permitir Enter para calcular y navegar
            document.getElementById('distanceInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    calculatePosition();
                }
            });
            
            document.getElementById('angleInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    calculatePosition();
                }
            });
            
            // Auto-validación de inputs
            document.getElementById('angleInput').addEventListener('input', function(e) {
                const value = parseFloat(e.target.value);
                if (value < 0) e.target.value = 0;
                if (value > 360) e.target.value = 360;
            });
            
            document.getElementById('distanceInput').addEventListener('input', function(e) {
                const value = parseFloat(e.target.value);
                if (value < 1) e.target.value = 1;
                if (value > 50) e.target.value = 50;
            });
            
            // Efectos de hover para el mapa
            const mapCanvas = document.getElementById('mapCanvas');
            mapCanvas.addEventListener('mousemove', function(e) {
                const rect = mapCanvas.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((rect.bottom - e.clientY) / rect.height) * 100;
                
                mapCanvas.title = `Coordenadas: (${x.toFixed(1)}, ${y.toFixed(1)})`;
            });
            
            // Guardar progreso en localStorage (si está disponible)
            window.addEventListener('beforeunload', function() {
                try {
                    localStorage.setItem('naveganteTrigonometrico', JSON.stringify({
                        stats: gameState.stats,
                        achievements: Array.from(gameState.achievements),
                        level: gameState.level,
                        difficulty: gameState.difficulty
                    }));
                } catch (e) {
                    console.log('No se pudo guardar el progreso');
                }
            });
            
            // Cargar progreso guardado
            try {
                const saved = localStorage.getItem('naveganteTrigonometrico');
                if (saved) {
                    const data = JSON.parse(saved);
                    gameState.stats = data.stats || gameState.stats;
                    gameState.achievements = new Set(data.achievements || []);
                    gameState.level = data.level || 1;
                    gameState.difficulty = data.difficulty || 'facil';
                    
                    // Actualizar UI con datos guardados
                    updateDisplay();
                    setDifficulty(gameState.difficulty);
                }
            } catch (e) {
                console.log('No se pudo cargar el progreso guardado');
            }
        });

        // Funciones adicionales de utilidad
        function exportProgress() {
            const data = {
                stats: gameState.stats,
                achievements: Array.from(gameState.achievements),
                level: gameState.level,
                totalTime: Date.now()
            };
            
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = 'navegante_trigonometrico_progreso.json';
            link.click();
        }

        // Función para mostrar estadísticas detalladas
        function showDetailedStats() {
            const accuracy = gameState.stats.navigationAttempts > 0 ? 
                ((gameState.stats.successfulNavigations / gameState.stats.navigationAttempts) * 100).toFixed(1) : 0;
                
            const avgScore = gameState.stats.treasuresFound > 0 ? 
                (gameState.stats.totalScore / gameState.stats.treasuresFound).toFixed(0) : 0;
                
            const achievementCount = gameState.achievements.size;
            const totalAchievements = Object.keys(achievements).length;
            
            const statsHTML = `
                <div style="background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 15px; max-width: 400px; margin: 20px auto;">
                    <h3 style="text-align: center; color: #74b9ff; margin-bottom: 20px;">📊 Estadísticas Detalladas</h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div>🏆 Tesoros: <strong>${gameState.stats.treasuresFound}</strong></div>
                        <div>🎯 Precisión: <strong>${accuracy}%</strong></div>
                        <div>⭐ Puntuación: <strong>${gameState.stats.totalScore}</strong></div>
                        <div>📈 Promedio: <strong>${avgScore} pts</strong></div>
                        <div>🗺️ Distancia: <strong>${gameState.stats.totalDistance.toFixed(1)}m</strong></div>
                        <div>🏅 Logros: <strong>${achievementCount}/${totalAchievements}</strong></div>
                    </div>
                    
                    <div style="margin-top: 20px;">
                        <strong>🏆 Logros Obtenidos:</strong><br>
                        ${Array.from(gameState.achievements).map(id => 
                            `<span style="color: #ffd700;">• ${achievements[id]?.name || id}</span>`
                        ).join('<br>') || '<em>Ningún logro aún</em>'}
                    </div>
                    
                    <button onclick="this.parentElement.remove()" style="
                        background: #74b9ff; color: white; border: none; padding: 10px 20px; 
                        border-radius: 8px; cursor: pointer; margin-top: 20px; width: 100%;
                    ">Cerrar</button>
                </div>
            `;
            
            const statsDiv = document.createElement('div');
            statsDiv.innerHTML = statsHTML;
            statsDiv.style.position = 'fixed';
            statsDiv.style.top = '0';
            statsDiv.style.left = '0';
            statsDiv.style.width = '100%';
            statsDiv.style.height = '100%';
            statsDiv.style.background = 'rgba(0,0,0,0.7)';
            statsDiv.style.display = 'flex';
            statsDiv.style.alignItems = 'center';
            statsDiv.style.justifyContent = 'center';
            statsDiv.style.zIndex = '1002';
            
            document.body.appendChild(statsDiv);
        }

        // Añadir botón de estadísticas detalladas
        setTimeout(() => {
            const statsButton = document.createElement('button');
            statsButton.textContent = '📊';
            statsButton.onclick = showDetailedStats;
            statsButton.style.cssText = `
                position: fixed; top: 20px; right: 80px; background: linear-gradient(135deg, #00b894, #00cec9);
                border: none; color: white; padding: 15px; border-radius: 50%; cursor: pointer;
                z-index: 1001; font-size: 1.2rem; transition: all 0.3s ease;
            `;
            statsButton.onmouseenter = () => statsButton.style.transform = 'scale(1.1)';
            statsButton.onmouseleave = () => statsButton.style.transform = 'scale(1)';
            
            document.body.appendChild(statsButton);
        }, 1000);

        // Sistema de consejos inteligentes
        function getSmartHint() {
            const distanceToTreasure = calculateDistance(gameState.ship, gameState.treasure);
            const angle = Math.atan2(gameState.treasure.x - gameState.ship.x, gameState.treasure.y - gameState.ship.y) * 180 / Math.PI;
            const correctedAngle = angle < 0 ? angle + 360 : angle;
            
            let smartHint = '';
            
            // Sugerencia de función trigonométrica basada en el ángulo
            if (correctedAngle >= 315 || correctedAngle < 45) {
                smartHint = `💡 Para ir al Norte (${correctedAngle.toFixed(0)}°), COS da el desplazamiento Y principal`;
            } else if (correctedAngle >= 45 && correctedAngle < 135) {
                smartHint = `💡 Para ir al Este (${correctedAngle.toFixed(0)}°), SEN da el desplazamiento X principal`;
            } else if (correctedAngle >= 135 && correctedAngle < 225) {
                smartHint = `💡 Para ir al Sur (${correctedAngle.toFixed(0)}°), considera ángulos negativos en COS`;
            } else {
                smartHint = `💡 Para ir al Oeste (${correctedAngle.toFixed(0)}°), considera ángulos negativos en SEN`;
            }
            
            // Sugerencia de distancia
            const suggestedDistance = Math.min(distanceToTreasure * 0.8, 25);
            smartHint += `<br>📏 Intenta con una distancia de aproximadamente ${suggestedDistance.toFixed(0)} millas`;
            
            return smartHint;
        }

        // Mejorar la función showHint para incluir consejos inteligentes
        const originalShowHint = showHint;
        showHint = function() {
            const hintPanel = document.getElementById('hintPanel');
            const hintContent = document.getElementById('hintContent');
            
            if (hintPanel.classList.contains('show')) {
                hintPanel.classList.remove('show');
                return;
            }
            
            gameState.hintsUsed++;
            const hintsForLevel = hints[gameState.difficulty];
            const randomHint = hintsForLevel[Math.floor(Math.random() * hintsForLevel.length)];
            const smartHint = getSmartHint();
            
            hintContent.innerHTML = `
                <div style="margin-bottom: 15px;"><strong>${randomHint}</strong></div>
                <div style="color: #74b9ff; margin-bottom: 15px;">${smartHint}</div>
                <div style="color: #fdcb6e; font-size: 0.9rem;">
                    💰 Usar pistas reduce tu puntuación (-10 puntos por pista)
                </div>
            `;
            
            hintPanel.classList.add('show');
            playSound('hint');
        };

        console.log('🎮 Navegante Trigonométrico cargado correctamente');
        console.log('🧭 Consejos: Usa las funciones SEN, COS y TAN para calcular tus movimientos');
        console.log('📐 Recuerda: 0° = Norte, 90° = Este, 180° = Sur, 270° = Oeste');
