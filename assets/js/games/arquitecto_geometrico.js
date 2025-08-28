/* Extracted from games/arquitecto_geometrico.html on 2025-08-28T03:35:45.627Z */
window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XZ1QWD1TCC');

// Redirige si no hay usuario autenticado
        if (!localStorage.getItem('currentUser') && !sessionStorage.getItem('currentUser')) {
            window.location.href = "complete-login-html.html";
        }
        // Datos del juego
        let gameData = {
            level: 1,
            points: 0,
            correctAnswers: 0,
            buildings: 0,
            currentTool: 'rectangle',
            shapes: [],
            currentProblem: null,
            isDrawing: false,
            startX: 0,
            startY: 0,
            shapeId: 0
        };

        // Información de las figuras
        const shapeInfo = {
            rectangle: {
                name: 'Rectángulo',
                formulas: ['Área = base × altura', 'Perímetro = 2(base + altura)']
            },
            square: {
                name: 'Cuadrado',
                formulas: ['Área = lado²', 'Perímetro = 4 × lado']
            },
            circle: {
                name: 'Círculo',
                formulas: ['Área = π × radio²', 'Perímetro = 2π × radio']
            },
            triangle: {
                name: 'Triángulo',
                formulas: ['Área = (base × altura) ÷ 2', 'Perímetro = suma de todos los lados']
            }
        };

        // Inicializar juego
        function initGame() {
            setupEventListeners();
            updateStats();
            updateShapeInfo();
        }

        // Configurar event listeners
        function setupEventListeners() {
            const canvas = document.getElementById('canvas');
            const tools = document.querySelectorAll('.shape-tool');
            
            // Herramientas
            tools.forEach(tool => {
                tool.addEventListener('click', () => selectTool(tool.dataset.shape));
            });
            
            // Canvas events
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', drawing);
            canvas.addEventListener('mouseup', stopDrawing);
            
            // Touch events para móviles
            canvas.addEventListener('touchstart', handleTouch);
            canvas.addEventListener('touchmove', handleTouch);
            canvas.addEventListener('touchend', handleTouch);
        }

        // Manejar eventos táctiles
        function handleTouch(e) {
            e.preventDefault();
            const touch = e.touches[0] || e.changedTouches[0];
            if (!touch) return;
            
            const rect = e.target.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            if (e.type === 'touchstart') {
                startDrawing({ target: e.target, offsetX: x, offsetY: y });
            } else if (e.type === 'touchmove' && gameData.isDrawing) {
                drawing({ target: e.target, offsetX: x, offsetY: y });
            } else if (e.type === 'touchend') {
                stopDrawing({ target: e.target, offsetX: x, offsetY: y });
            }
        }

        // Seleccionar herramienta
        function selectTool(shape) {
            gameData.currentTool = shape;
            
            document.querySelectorAll('.shape-tool').forEach(tool => {
                tool.classList.remove('active');
            });
            
            document.querySelector(`[data-shape="${shape}"]`).classList.add('active');
            updateShapeInfo();
        }

        // Actualizar información de la figura
        function updateShapeInfo() {
            const info = shapeInfo[gameData.currentTool];
            const infoDiv = document.getElementById('shapeInfo');
            
            let html = `<h4>${info.name}</h4>`;
            info.formulas.forEach(formula => {
                html += `<div class="formula">${formula}</div>`;
            });
            
            infoDiv.innerHTML = html;
        }

        // Comenzar a dibujar
        function startDrawing(e) {
            const rect = e.target.getBoundingClientRect();
            gameData.isDrawing = true;
            gameData.startX = e.offsetX || (e.clientX - rect.left);
            gameData.startY = e.offsetY || (e.clientY - rect.top);
        }

        // Dibujando
        function drawing(e) {
            if (!gameData.isDrawing) return;
            // Aquí podrías agregar una vista previa si quisieras
        }

        // Terminar de dibujar
        function stopDrawing(e) {
            if (!gameData.isDrawing) return;
            
            const rect = e.target.getBoundingClientRect();
            const endX = e.offsetX || (e.clientX - rect.left);
            const endY = e.offsetY || (e.clientY - rect.top);
            
            const width = Math.abs(endX - gameData.startX);
            const height = Math.abs(endY - gameData.startY);
            
            // Tamaño mínimo
            if (width < 30 || height < 30) {
                gameData.isDrawing = false;
                return;
            }
            
            const x = Math.min(gameData.startX, endX);
            const y = Math.min(gameData.startY, endY);
            
            createShape(x, y, width, height);
            gameData.isDrawing = false;
        }

        // Crear figura
        function createShape(x, y, width, height) {
            const canvas = document.getElementById('canvas');
            const shape = document.createElement('div');
            const shapeId = ++gameData.shapeId;
            
            shape.className = `shape ${gameData.currentTool}`;
            shape.id = `shape-${shapeId}`;
            
            // Ajustar para círculos (hacer cuadrados)
            if (gameData.currentTool === 'circle') {
                const size = Math.min(width, height);
                width = height = size;
            }
            
            // Ajustar para cuadrados
            if (gameData.currentTool === 'square') {
                const size = Math.min(width, height);
                width = height = size;
            }
            
            shape.style.left = x + 'px';
            shape.style.top = y + 'px';
            shape.style.width = width + 'px';
            shape.style.height = height + 'px';
            
            // Agregar etiqueta con dimensiones
            let label = '';
            if (gameData.currentTool === 'circle') {
                const radius = width / 2;
                label = `r=${Math.round(radius)}`;
            } else if (gameData.currentTool === 'square') {
                label = `${Math.round(width)}`;
            } else if (gameData.currentTool === 'triangle') {
                label = `${Math.round(width)}`;
            } else {
                label = `${Math.round(width)}×${Math.round(height)}`;
            }
            
            shape.textContent = label;
            shape.onclick = () => selectShape(shapeId);
            
            canvas.appendChild(shape);
            
            // Ocultar mensaje de canvas vacío
            const emptyMessage = canvas.querySelector('.empty-canvas-message');
            if (emptyMessage) {
                emptyMessage.style.display = 'none';
            }
            
            // Guardar datos de la figura
            gameData.shapes.push({
                id: shapeId,
                type: gameData.currentTool,
                x, y, width, height,
                element: shape
            });
            
            generateProblem();
        }

        // Seleccionar figura
        function selectShape(shapeId) {
            document.querySelectorAll('.shape').forEach(s => s.classList.remove('selected'));
            const shape = document.getElementById(`shape-${shapeId}`);
            if (shape) {
                shape.classList.add('selected');
            }
        }

        // Limpiar canvas
        function clearCanvas() {
            const canvas = document.getElementById('canvas');
            canvas.innerHTML = `
                <div class="empty-canvas-message">
                    <div style="font-size: 3rem; margin-bottom: 10px;">🏗️</div>
                    <div>Haz clic y arrastra para crear figuras</div>
                </div>
            `;
            gameData.shapes = [];
            gameData.currentProblem = null;
            document.getElementById('problemText').textContent = '¡Crea figuras geométricas para comenzar!';
            document.getElementById('feedback').style.display = 'none';
        }

        // Guardar edificio
        function saveBuilding() {
            if (gameData.shapes.length === 0) {
                alert('¡Crea algunas figuras primero para formar tu edificio!');
                return;
            }
            
            gameData.buildings++;
            updateStats();
            
            // Agregar a la galería
            const gallery = document.getElementById('buildingsGallery');
            if (gallery.innerHTML.includes('primer edificio')) {
                gallery.innerHTML = '';
            }
            
            const buildingCard = document.createElement('div');
            buildingCard.className = 'building-card';
            buildingCard.textContent = `#${gameData.buildings}`;
            buildingCard.title = `Edificio ${gameData.buildings} - ${gameData.shapes.length} figuras`;
            gallery.appendChild(buildingCard);
            
            alert(`¡Edificio #${gameData.buildings} guardado exitosamente! 🏢\n+50 puntos`);
            gameData.points += 50;
            updateStats();
        }

        // Generar problema
        function generateProblem() {
            if (gameData.shapes.length === 0) {
                document.getElementById('problemText').textContent = '¡Crea figuras geométricas para comenzar!';
                return;
            }
            
            const shape = gameData.shapes[Math.floor(Math.random() * gameData.shapes.length)];
            const problemTypes = ['area', 'perimeter'];
            const problemType = problemTypes[Math.floor(Math.random() * problemTypes.length)];
            
            gameData.currentProblem = createProblem(shape, problemType);
            document.getElementById('problemText').innerHTML = gameData.currentProblem.question;
            document.getElementById('answerInput').value = '';
            document.getElementById('feedback').style.display = 'none';
        }

        // Crear problema específico
        function createProblem(shape, type) {
            const { width, height } = shape;
            let question, answer, explanation;
            
            switch (shape.type) {
                case 'rectangle':
                    if (type === 'area') {
                        answer = width * height;
                        question = `¿Cuál es el área del rectángulo de ${Math.round(width)} × ${Math.round(height)} unidades?`;
                        explanation = `Área = base × altura = ${Math.round(width)} × ${Math.round(height)} = ${Math.round(answer)} unidades²`;
                    } else {
                        answer = 2 * (width + height);
                        question = `¿Cuál es el perímetro del rectángulo de ${Math.round(width)} × ${Math.round(height)} unidades?`;
                        explanation = `Perímetro = 2(base + altura) = 2(${Math.round(width)} + ${Math.round(height)}) = ${Math.round(answer)} unidades`;
                    }
                    break;
                    
                case 'square':
                    const side = width;
                    if (type === 'area') {
                        answer = side * side;
                        question = `¿Cuál es el área del cuadrado de lado ${Math.round(side)} unidades?`;
                        explanation = `Área = lado² = ${Math.round(side)}² = ${Math.round(answer)} unidades²`;
                    } else {
                        answer = 4 * side;
                        question = `¿Cuál es el perímetro del cuadrado de lado ${Math.round(side)} unidades?`;
                        explanation = `Perímetro = 4 × lado = 4 × ${Math.round(side)} = ${Math.round(answer)} unidades`;
                    }
                    break;
                    
                case 'circle':
                    const radius = width / 2;
                    if (type === 'area') {
                        answer = Math.PI * radius * radius;
                        question = `¿Cuál es el área del círculo de radio ${Math.round(radius)} unidades? (usa π ≈ 3.14)`;
                        explanation = `Área = π × radio² = 3.14 × ${Math.round(radius)}² = ${Math.round(answer)} unidades²`;
                    } else {
                        answer = 2 * Math.PI * radius;
                        question = `¿Cuál es el perímetro del círculo de radio ${Math.round(radius)} unidades? (usa π ≈ 3.14)`;
                        explanation = `Perímetro = 2π × radio = 2 × 3.14 × ${Math.round(radius)} = ${Math.round(answer)} unidades`;
                    }
                    break;
                    
                case 'triangle':
                    const base = width;
                    const triangleHeight = height;
                    if (type === 'area') {
                        answer = (base * triangleHeight) / 2;
                        question = `¿Cuál es el área del triángulo de base ${Math.round(base)} y altura ${Math.round(triangleHeight)} unidades?`;
                        explanation = `Área = (base × altura) ÷ 2 = (${Math.round(base)} × ${Math.round(triangleHeight)}) ÷ 2 = ${Math.round(answer)} unidades²`;
                    } else {
                        answer = 3 * base;
                        question = `Si el triángulo es equilátero con lado ${Math.round(base)} unidades, ¿cuál es su perímetro?`;
                        explanation = `Perímetro = 3 × lado = 3 × ${Math.round(base)} = ${Math.round(answer)} unidades`;
                    }
                    break;
            }
            
            return { question, answer: Math.round(answer), explanation };
        }

        // Verificar respuesta
        function checkAnswer() {
            if (!gameData.currentProblem) return;
            
            const userAnswer = parseFloat(document.getElementById('answerInput').value);
            const feedback = document.getElementById('feedback');
            
            if (isNaN(userAnswer)) {
                feedback.innerHTML = '¡Por favor ingresa un número válido!';
                feedback.className = 'feedback incorrect';
                feedback.style.display = 'block';
                return;
            }
            
            const tolerance = Math.max(1, Math.round(gameData.currentProblem.answer * 0.05));
            const isCorrect = Math.abs(userAnswer - gameData.currentProblem.answer) <= tolerance;
            
            if (isCorrect) {
                feedback.innerHTML = `¡Correcto! 🎉<br><small>${gameData.currentProblem.explanation}</small>`;
                feedback.className = 'feedback correct';
                gameData.points += 100;
                gameData.correctAnswers++;
                
                if (gameData.correctAnswers >= 3) {
                    levelUp();
                }
            } else {
                feedback.innerHTML = `Incorrecto. La respuesta correcta es ${gameData.currentProblem.answer}<br><small>${gameData.currentProblem.explanation}</small>`;
                feedback.className = 'feedback incorrect';
            }
            
            feedback.style.display = 'block';
            updateStats();
            
            setTimeout(() => {
                generateProblem();
            }, 3000);
        }

        // Subir de nivel
        function levelUp() {
            gameData.level++;
            gameData.correctAnswers = 0;
            alert(`¡Felicitaciones! Has alcanzado el nivel ${gameData.level} 🎊\n¡Eres un mejor arquitecto!`);
            updateStats();
        }

        // Actualizar estadísticas
        function updateStats() {
            document.getElementById('buildings').textContent = gameData.buildings;
            document.getElementById('level').textContent = gameData.level;
            document.getElementById('points').textContent = gameData.points;
            document.getElementById('correct').textContent = gameData.correctAnswers;
        }

        // Eliminar figura seleccionada
        function deleteSelectedShape() {
            const selected = document.querySelector('.shape.selected');
            if (selected) {
                const shapeId = parseInt(selected.id.replace('shape-', ''));
                selected.remove();
                gameData.shapes = gameData.shapes.filter(s => s.id !== shapeId);
                
                // Mostrar mensaje de canvas vacío si no hay figuras
                if (gameData.shapes.length === 0) {
                    const canvas = document.getElementById('canvas');
                    const emptyMessage = canvas.querySelector('.empty-canvas-message');
                    if (emptyMessage) {
                        emptyMessage.style.display = 'block';
                    }
                }
                
                generateProblem();
            }
        }

        // Detectar teclas para funciones rápidas
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Delete':
                case 'Backspace':
                    deleteSelectedShape();
                    break;
                case '1':
                    selectTool('rectangle');
                    break;
                case '2':
                    selectTool('square');
                    break;
                case '3':
                    selectTool('circle');
                    break;
                case '4':
                    selectTool('triangle');
                    break;
                case 'Enter':
                    checkAnswer();
                    break;
            }
        });

        // Inicializar cuando cargue la página
        window.onload = initGame;
