/* Extracted from games/constructor_figuras.html on 2025-08-28T03:35:45.642Z */
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
            mode: 'construccion',
            currentShape: 'rectangle',
            currentColor: '#ff6b6b',
            soundEnabled: true,
            canvas: null,
            ctx: null,
            shapes: [],
            stats: {
                figuresCreated: 0,
                challengesCompleted: 0,
                totalPerimeter: 0,
                totalArea: 0,
                totalScore: 0
            },
            currentChallenge: null,
            tutorialStep: 0
        };

        // Inicializar el juego
        function initGame() {
            gameState.canvas = document.getElementById('constructorCanvas');
            gameState.ctx = gameState.canvas.getContext('2d');
            
            // Configurar canvas
            setupCanvas();
            
            // Actualizar interfaz inicial
            updateMeasurements();
            updateStats();
            
            // Configurar eventos
            setupEventListeners();
            
            showNotification('¡Bienvenido al Constructor de Figuras!', 'success');
        }

        function setupCanvas() {
            const canvas = gameState.canvas;
            const container = canvas.parentElement;
            
            // Hacer el canvas responsivo
            function resizeCanvas() {
                const rect = container.getBoundingClientRect();
                canvas.width = rect.width - 20;
                canvas.height = rect.height - 20;
                redrawCanvas();
            }
            
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            
            // Configurar estilo del canvas
            gameState.ctx.lineCap = 'round';
            gameState.ctx.lineJoin = 'round';
            gameState.ctx.textAlign = 'center';
            gameState.ctx.textBaseline = 'middle';
        }

        function setupEventListeners() {
            // Eventos del canvas
            gameState.canvas.addEventListener('click', handleCanvasClick);
            gameState.canvas.addEventListener('mousemove', handleCanvasMouseMove);
            
            // Eventos de inputs
            document.getElementById('widthInput').addEventListener('input', updateMeasurements);
            document.getElementById('heightInput').addEventListener('input', updateMeasurements);
        }

        // Gestión de formas geométricas
        const shapeDefinitions = {
            rectangle: {
                name: 'Rectángulo',
                icon: '⬜',
                needsHeight: true,
                perimeter: (w, h) => 2 * (w + h),
                area: (w, h) => w * h,
                formula: 'Perímetro: 2(a + b)<br>Área: a × b'
            },
            square: {
                name: 'Cuadrado',
                icon: '🟦',
                needsHeight: false,
                perimeter: (w) => 4 * w,
                area: (w) => w * w,
                formula: 'Perímetro: 4a<br>Área: a²'
            },
            triangle: {
                name: 'Triángulo',
                icon: '🔺',
                needsHeight: true,
                perimeter: (w, h) => w + 2 * Math.sqrt((w/2) * (w/2) + h * h),
                area: (w, h) => (w * h) / 2,
                formula: 'Perímetro: a + 2√((a/2)² + h²)<br>Área: (b × h) / 2'
            },
            circle: {
                name: 'Círculo',
                icon: '🔵',
                needsHeight: false,
                perimeter: (r) => 2 * Math.PI * r,
                area: (r) => Math.PI * r * r,
                formula: 'Perímetro: 2πr<br>Área: πr²'
            }
        };

        // Selección de forma
        function selectShape(shape) {
            gameState.currentShape = shape;
            
            // Actualizar botones activos
            document.querySelectorAll('.shape-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-shape="${shape}"]`).classList.add('active');
            
            // Actualizar controles
            const heightInput = document.getElementById('heightInput');
            const heightGroup = heightInput.parentElement;
            
            if (shapeDefinitions[shape].needsHeight) {
                heightGroup.style.display = 'block';
                document.querySelector('label[for="widthInput"]').textContent = 
                    shape === 'circle' ? 'Radio:' : shape === 'triangle' ? 'Base:' : 'Ancho:';
            } else {
                heightGroup.style.display = 'none';
                document.querySelector('label[for="widthInput"]').textContent = 
                    shape === 'square' ? 'Lado:' : shape === 'circle' ? 'Radio:' : 'Ancho:';
            }
            
            updateMeasurements();
        }

        // Selección de color
        function selectColor(color) {
            gameState.currentColor = color;
            
            // Actualizar botones activos
            document.querySelectorAll('.color-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-color="${color}"]`).classList.add('active');
        }

        // Actualizar medidas y cálculos
        function updateMeasurements() {
            const width = parseFloat(document.getElementById('widthInput').value) || 0;
            const height = parseFloat(document.getElementById('heightInput').value) || 0;
            const shape = shapeDefinitions[gameState.currentShape];
            
            let perimeter, area;
            
            if (shape.needsHeight) {
                perimeter = shape.perimeter(width, height);
                area = shape.area(width, height);
            } else {
                perimeter = shape.perimeter(width);
                area = shape.area(width);
            }
            
            // Actualizar display
            document.getElementById('currentPerimeter').textContent = perimeter.toFixed(2);
            document.getElementById('currentArea').textContent = area.toFixed(2);
            document.getElementById('currentShape').textContent = shape.name;
            document.getElementById('formulaText').innerHTML = shape.formula;
            
            // Actualizar información detallada
            updateShapeDetails(width, height, perimeter, area);
        }

        function updateShapeDetails(width, height, perimeter, area) {
            const shape = shapeDefinitions[gameState.currentShape];
            let details = `<strong>${shape.name}</strong><br>`;
            
            switch (gameState.currentShape) {
                case 'rectangle':
                    details += `Ancho: ${width}<br>Alto: ${height}<br>`;
                    details += `Cálculo del perímetro: 2(${width} + ${height}) = ${perimeter.toFixed(2)}<br>`;
                    details += `Cálculo del área: ${width} × ${height} = ${area.toFixed(2)}`;
                    break;
                case 'square':
                    details += `Lado: ${width}<br>`;
                    details += `Cálculo del perímetro: 4 × ${width} = ${perimeter.toFixed(2)}<br>`;
                    details += `Cálculo del área: ${width}² = ${area.toFixed(2)}`;
                    break;
                case 'triangle':
                    details += `Base: ${width}<br>Altura: ${height}<br>`;
                    details += `Cálculo del área: (${width} × ${height}) ÷ 2 = ${area.toFixed(2)}<br>`;
                    details += `Perímetro (triángulo isósceles): ${perimeter.toFixed(2)}`;
                    break;
                case 'circle':
                    details += `Radio: ${width}<br>`;
                    details += `Cálculo del perímetro: 2π × ${width} = ${perimeter.toFixed(2)}<br>`;
                    details += `Cálculo del área: π × ${width}² = ${area.toFixed(2)}`;
                    break;
            }
            
            document.getElementById('shapeDetails').innerHTML = details;
        }

        // Crear forma en el canvas
        function createShape() {
            const width = parseFloat(document.getElementById('widthInput').value) || 0;
            const height = parseFloat(document.getElementById('heightInput').value) || 0;
            
            if (width <= 0 || (shapeDefinitions[gameState.currentShape].needsHeight && height <= 0)) {
                showNotification('Por favor ingresa medidas válidas', 'error');
                return;
            }
            
            const shape = {
                type: gameState.currentShape,
                width: width,
                height: height,
                color: gameState.currentColor,
                x: Math.random() * (gameState.canvas.width - width * 20 - 40) + 20,
                y: Math.random() * (gameState.canvas.height - height * 20 - 40) + 20,
                scale: Math.min(20, Math.max(10, 400 / Math.max(width, height)))
            };
            
            gameState.shapes.push(shape);
            drawShape(shape);
            
            // Actualizar estadísticas
            const shapeData = shapeDefinitions[gameState.currentShape];
            let perimeter, area;
            
            if (shapeData.needsHeight) {
                perimeter = shapeData.perimeter(width, height);
                area = shapeData.area(width, height);
            } else {
                perimeter = shapeData.perimeter(width);
                area = shapeData.area(width);
            }
            
            gameState.stats.figuresCreated++;
            gameState.stats.totalPerimeter += perimeter;
            gameState.stats.totalArea += area;
            gameState.stats.totalScore += Math.round(perimeter + area);
            
            updateStats();
            
            // Verificar desafío
            if (gameState.mode === 'desafio' && gameState.currentChallenge) {
                checkChallengeCompletion(perimeter, area);
            }
            
            showNotification(`${shapeData.name} creado: P=${perimeter.toFixed(2)}, A=${area.toFixed(2)}`, 'success');
            
            if (gameState.soundEnabled) playSound('create');
        }

        // Dibujar forma en el canvas
        function drawShape(shape) {
            const ctx = gameState.ctx;
            ctx.fillStyle = shape.color;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            
            ctx.save();
            ctx.translate(shape.x, shape.y);
            
            switch (shape.type) {
                case 'rectangle':
                    const rectWidth = shape.width * shape.scale;
                    const rectHeight = shape.height * shape.scale;
                    ctx.fillRect(0, 0, rectWidth, rectHeight);
                    ctx.strokeRect(0, 0, rectWidth, rectHeight);
                    
                    // Etiquetas de medidas
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '12px Arial';
                    ctx.fillText(`${shape.width}`, rectWidth/2, -10);
                    ctx.fillText(`${shape.height}`, -15, rectHeight/2);
                    break;
                    
                case 'square':
                    const squareSize = shape.width * shape.scale;
                    ctx.fillRect(0, 0, squareSize, squareSize);
                    ctx.strokeRect(0, 0, squareSize, squareSize);
                    
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '12px Arial';
                    ctx.fillText(`${shape.width}`, squareSize/2, -10);
                    break;
                    
                case 'triangle':
                    const triWidth = shape.width * shape.scale;
                    const triHeight = shape.height * shape.scale;
                    ctx.beginPath();
                    ctx.moveTo(triWidth/2, 0);
                    ctx.lineTo(0, triHeight);
                    ctx.lineTo(triWidth, triHeight);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '12px Arial';
                    ctx.fillText(`b=${shape.width}`, triWidth/2, triHeight + 15);
                    ctx.fillText(`h=${shape.height}`, triWidth/2 - 20, triHeight/2);
                    break;
                    
                case 'circle':
                    const radius = shape.width * shape.scale;
                    ctx.beginPath();
                    ctx.arc(radius, radius, radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Dibujar radio
                    ctx.strokeStyle = '#ffffff';
                    ctx.setLineDash([5, 5]);
                    ctx.beginPath();
                    ctx.moveTo(radius, radius);
                    ctx.lineTo(radius * 2, radius);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '12px Arial';
                    ctx.fillText(`r=${shape.width}`, radius * 1.5, radius - 10);
                    break;
            }
            
            ctx.restore();
        }

        // Redibujar canvas
        function redrawCanvas() {
            gameState.ctx.clearRect(0, 0, gameState.canvas.width, gameState.canvas.height);
            gameState.shapes.forEach(shape => drawShape(shape));
        }

        // Limpiar canvas
        function clearCanvas() {
            if (gameState.shapes.length === 0) {
                showNotification('El canvas ya está vacío', 'info');
                return;
            }
            
            if (confirm('¿Estás seguro de que quieres limpiar todas las figuras?')) {
                gameState.shapes = [];
                gameState.ctx.clearRect(0, 0, gameState.canvas.width, gameState.canvas.height);
                showNotification('Canvas limpiado', 'info');
            }
        }

        // Sistema de desafíos
        const challenges = [
            {
                type: 'area',
                target: 20,
                shape: 'rectangle',
                description: 'Crea un rectángulo con área de 20 unidades cuadradas',
                tolerance: 0.1
            },
            {
                type: 'perimeter',
                target: 16,
                shape: 'square',
                description: 'Crea un cuadrado con perímetro de 16 unidades',
                tolerance: 0.1
            },
            {
                type: 'area',
                target: 12,
                shape: 'triangle',
                description: 'Crea un triángulo con área de 12 unidades cuadradas',
                tolerance: 0.1
            },
            {
                type: 'area',
                target: 28.27,
                shape: 'circle',
                description: 'Crea un círculo con área aproximada de 28.27 unidades cuadradas',
                tolerance: 1
            },
            {
                type: 'perimeter',
                target: 24,
                shape: 'rectangle',
                description: 'Crea un rectángulo con perímetro de 24 unidades',
                tolerance: 0.1
            }
        ];

        function generateChallenge() {
            const challenge = challenges[Math.floor(Math.random() * challenges.length)];
            gameState.currentChallenge = { ...challenge };
            
            document.getElementById('challengeDescription').textContent = challenge.description;
            document.getElementById('challengeTarget').textContent = 
                `Meta: ${challenge.type === 'area' ? 'Área' : 'Perímetro'} = ${challenge.target}`;
            document.getElementById('challengeProgress').style.width = '0%';
        }

        function checkChallengeCompletion(perimeter, area) {
            if (!gameState.currentChallenge) return;
            
            const challenge = gameState.currentChallenge;
            const currentValue = challenge.type === 'area' ? area : perimeter;
            const difference = Math.abs(currentValue - challenge.target);
            
            if (difference <= challenge.tolerance) {
                // Desafío completado
                gameState.stats.challengesCompleted++;
                gameState.stats.totalScore += 500;
                
                showAchievement('🏆 ¡Desafío Completado!');
                showNotification('¡Excelente! Has completado el desafío', 'success');
                
                setTimeout(() => {
                    generateChallenge();
                }, 2000);
            } else {
                // Actualizar progreso
                const progress = Math.max(0, 100 - (difference / challenge.target) * 100);
                document.getElementById('challengeProgress').style.width = progress + '%';
                
                if (progress > 70) {
                    showNotification('¡Muy cerca! Sigue intentando', 'info');
                }
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
            
            // Mostrar/ocultar paneles según el modo
            const challengePanel = document.getElementById('challengePanel');
            
            switch (mode) {
                case 'construccion':
                    challengePanel.style.display = 'none';
                    break;
                case 'desafio':
                    challengePanel.style.display = 'block';
                    generateChallenge();
                    break;
                case 'tutorial':
                    showTutorial();
                    break;
            }
            
            showNotification(`Modo cambiado a: ${mode}`, 'info');
        }

        // Sistema de tutorial
        function showTutorial() {
            document.getElementById('tutorialOverlay').style.display = 'flex';
            gameState.tutorialStep = 1;
        }

        function nextTutorialStep() {
            const currentStep = document.getElementById(`step${gameState.tutorialStep}`);
            currentStep.classList.remove('active');
            
            gameState.tutorialStep++;
            
            if (gameState.tutorialStep <= 4) {
                const nextStep = document.getElementById(`step${gameState.tutorialStep}`);
                nextStep.classList.add('active');
            } else {
                closeTutorial();
            }
        }

        function closeTutorial() {
            document.getElementById('tutorialOverlay').style.display = 'none';
            setGameMode('construccion');
        }

        // Funciones auxiliares
        function calculateAll() {
            if (gameState.shapes.length === 0) {
                showNotification('No hay figuras para calcular', 'info');
                return;
            }
            
            let totalPerimeter = 0;
            let totalArea = 0;
            
            gameState.shapes.forEach(shape => {
                const shapeData = shapeDefinitions[shape.type];
                let perimeter, area;
                
                if (shapeData.needsHeight) {
                    perimeter = shapeData.perimeter(shape.width, shape.height);
                    area = shapeData.area(shape.width, shape.height);
                } else {
                    perimeter = shapeData.perimeter(shape.width);
                    area = shapeData.area(shape.width);
                }
                
                totalPerimeter += perimeter;
                totalArea += area;
            });
            
            showNotification(`Total: P=${totalPerimeter.toFixed(2)}, A=${totalArea.toFixed(2)}`, 'success');
        }

        function showHint() {
            const hints = [
                "💡 Para calcular el área de un rectángulo: multiplica ancho × alto",
                "💡 El perímetro es la suma de todos los lados",
                "💡 En un cuadrado, todos los lados son iguales",
                "💡 El área de un triángulo es: (base × altura) ÷ 2",
                "💡 En un círculo: π ≈ 3.14159",
                "💡 Usa números pequeños para comenzar y experimenta",
                "💡 Las fórmulas aparecen en el panel izquierdo"
            ];
            
            const hint = hints[Math.floor(Math.random() * hints.length)];
            showNotification(hint, 'info');
        }

        function newChallenge() {
            generateChallenge();
            showNotification('Nuevo desafío generado', 'info');
        }

        // Eventos del canvas
        function handleCanvasClick(event) {
            // Aquí se podría implementar funcionalidad de click en el canvas
        }

        function handleCanvasMouseMove(event) {
            // Aquí se podría implementar funcionalidad de hover
        }

        // Actualizar estadísticas
        function updateStats() {
            document.getElementById('figuresCreated').textContent = gameState.stats.figuresCreated;
            document.getElementById('challengesCompleted').textContent = gameState.stats.challengesCompleted;
            document.getElementById('totalPerimeter').textContent = gameState.stats.totalPerimeter.toFixed(1);
            document.getElementById('totalArea').textContent = gameState.stats.totalArea.toFixed(1);
            document.getElementById('totalScore').textContent = gameState.stats.totalScore;
        }

        // Sistema de notificaciones
        function showNotification(message, type) {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Sistema de logros
        function showAchievement(message) {
            const achievement = document.createElement('div');
            achievement.className = 'achievement';
            achievement.textContent = message;
            
            document.body.appendChild(achievement);
            
            setTimeout(() => {
                achievement.remove();
            }, 2000);
        }

        // Control de sonido
        function toggleSound() {
            gameState.soundEnabled = !gameState.soundEnabled;
            const soundToggle = document.getElementById('soundToggle');
            soundToggle.textContent = gameState.soundEnabled ? '🔊' : '🔇';
        }

        function playSound(type) {
            if (!gameState.soundEnabled) return;
            // En una implementación real, aquí se reproducirían sonidos
            console.log('Playing sound:', type);
        }

        // Inicializar el juego cuando se carga la página
        window.addEventListener('load', initGame);
