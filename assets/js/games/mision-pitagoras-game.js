/* Extracted from games/mision-pitagoras-game.html on 2025-08-28T03:35:45.667Z */
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
            currentMission: 0,
            totalScore: 0,
            correctAnswers: 0,
            totalQuestions: 0,
            hintsUsed: 0,
            showingSteps: false
        };

        // Configuraciones de misiones
        const missions = [
            {
                icon: "🏗️",
                title: "Constructor de Edificios",
                story: "Eres un arquitecto que debe calcular la longitud de una viga diagonal para el techo de una casa. Conoces las medidas de los catetos (base y altura), pero necesitas encontrar la hipotenusa.",
                triangle: { a: 3, b: 4, unknown: 'c' },
                answer: 5,
                hint: "Recuerda: c² = a² + b². Entonces c² = 3² + 4² = 9 + 16 = 25, por lo tanto c = √25 = 5",
                difficulty: "Básico"
            },
            {
                icon: "🧗",
                title: "Escalador de Montañas",
                story: "Un escalador necesita saber qué tan lejos está de la base de la montaña. Subió 8 metros verticalmente y su cuerda mide 10 metros. ¿Cuál es la distancia horizontal hasta la base?",
                triangle: { a: null, b: 8, c: 10, unknown: 'a' },
                answer: 6,
                hint: "Usamos a² + b² = c², entonces a² + 8² = 10². Despejando: a² = 100 - 64 = 36, por lo tanto a = 6",
                difficulty: "Intermedio"
            },
            {
                icon: "📺",
                title: "Instalador de Antenas",
                story: "Un técnico debe instalar una antena en el techo. La escalera mide 13 metros y debe apoyarse a 5 metros de la pared. ¿A qué altura llegará la escalera?",
                triangle: { a: 5, b: null, c: 13, unknown: 'b' },
                answer: 12,
                hint: "Como a² + b² = c², entonces 5² + b² = 13². Despejando: b² = 169 - 25 = 144, por lo tanto b = 12",
                difficulty: "Intermedio"
            },
            {
                icon: "⚽",
                title: "Campo de Fútbol",
                story: "En un campo rectangular de 60m x 80m, un jugador quiere saber la distancia diagonal de una esquina a la esquina opuesta para planear su estrategia.",
                triangle: { a: 60, b: 80, unknown: 'c' },
                answer: 100,
                hint: "c² = 60² + 80² = 3600 + 6400 = 10000, entonces c = √10000 = 100",
                difficulty: "Intermedio"
            },
            {
                icon: "🚁",
                title: "Piloto de Rescate",
                story: "Un helicóptero vuela a 15 metros de altura y debe llegar a un punto que está a 20 metros de distancia horizontal. ¿Cuál es la distancia directa que debe recorrer?",
                triangle: { a: 20, b: 15, unknown: 'c' },
                answer: 25,
                hint: "c² = 20² + 15² = 400 + 225 = 625, entonces c = √625 = 25",
                difficulty: "Avanzado"
            },
            {
                icon: "🛰️",
                title: "Ingeniero Espacial",
                story: "Un satélite orbita a 400 km de altura sobre la Tierra. Si está a 500 km de distancia directa de una estación terrestre, ¿a qué distancia horizontal está la estación del punto más cercano en la superficie?",
                triangle: { a: null, b: 400, c: 500, unknown: 'a' },
                answer: 300,
                hint: "a² + 400² = 500², entonces a² = 250000 - 160000 = 90000, por lo tanto a = 300",
                difficulty: "Avanzado"
            }
        ];

        // Inicializar juego
        function initGame() {
            updateDashboard();
            loadMission();
        }

        // Actualizar tablero de misiones
        function updateDashboard() {
            document.getElementById('current-mission').textContent = gameState.currentMission + 1;
            document.getElementById('total-score').textContent = gameState.totalScore;
            document.getElementById('hints-used').textContent = gameState.hintsUsed;
            
            const successRate = gameState.totalQuestions > 0 ? 
                Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100) : 0;
            document.getElementById('success-rate').textContent = successRate + '%';
            
            const progress = ((gameState.currentMission) / missions.length) * 100;
            document.getElementById('progress-fill').style.width = progress + '%';
        }

        // Cargar misión actual
        function loadMission() {
            if (gameState.currentMission >= missions.length) {
                completeMissions();
                return;
            }

            const mission = missions[gameState.currentMission];
            
            // Actualizar interfaz
            document.getElementById('mission-icon').textContent = mission.icon;
            document.getElementById('challenge-title-text').textContent = mission.title;
            document.getElementById('challenge-story').textContent = mission.story;

            // Configurar campos de entrada
            setupMeasurements(mission.triangle);
            
            // Crear triángulo visual
            createTriangle(mission.triangle);
            
            // Limpiar interfaz
            hideElements();
            updateDashboard();
        }

        // Configurar medidas del triángulo
        function setupMeasurements(triangle) {
            const catetoA = document.getElementById('cateto-a');
            const catetoB = document.getElementById('cateto-b');
            const hipotenusa = document.getElementById('hipotenusa');

            // Limpiar campos
            catetoA.value = '';
            catetoB.value = '';
            hipotenusa.value = '';

            // Configurar campos según lo conocido/desconocido
            if (triangle.unknown === 'a') {
                catetoA.removeAttribute('readonly');
                catetoA.style.background = 'white';
                catetoB.value = triangle.b;
                catetoB.setAttribute('readonly', true);
                hipotenusa.value = triangle.c;
                hipotenusa.setAttribute('readonly', true);
            } else if (triangle.unknown === 'b') {
                catetoA.value = triangle.a;
                catetoA.setAttribute('readonly', true);
                catetoB.removeAttribute('readonly');
                catetoB.style.background = 'white';
                hipotenusa.value = triangle.c;
                hipotenusa.setAttribute('readonly', true);
            } else { // unknown === 'c'
                catetoA.value = triangle.a;
                catetoA.setAttribute('readonly', true);
                catetoB.value = triangle.b;
                catetoB.setAttribute('readonly', true);
                hipotenusa.removeAttribute('readonly');
                hipotenusa.style.background = 'white';
            }
        }

        // Crear triángulo visual
        function createTriangle(triangle) {
            const container = document.getElementById('triangle-container');
            container.innerHTML = '';

            const scale = 15; // Factor de escala para visualización
            const a = triangle.a || triangle.c * 0.6; // Valor temporal para visualización
            const b = triangle.b || triangle.c * 0.8; // Valor temporal para visualización
            const c = triangle.c || Math.sqrt(a*a + b*b); // Calcular hipotenusa temporal

            // Crear SVG
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '350');
            svg.setAttribute('height', '300');
            svg.style.position = 'absolute';
            svg.style.top = '50%';
            svg.style.left = '50%';
            svg.style.transform = 'translate(-50%, -50%)';

            // Coordenadas del triángulo
            const points = [
                { x: 50, y: 250 }, // Vértice inferior izquierdo (ángulo recto)
                { x: 50 + (a * scale), y: 250 }, // Vértice inferior derecho
                { x: 50, y: 250 - (b * scale) } // Vértice superior izquierdo
            ];

            // Dibujar triángulo
            const trianglePath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');
            trianglePath.setAttribute('points', pointsStr);
            trianglePath.setAttribute('fill', 'rgba(116, 185, 255, 0.2)');
            trianglePath.setAttribute('stroke', '#2c3e50');
            trianglePath.setAttribute('stroke-width', '3');
            trianglePath.classList.add('animated-triangle');
            svg.appendChild(trianglePath);

            // Indicador de ángulo recto
            const rightAngle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            rightAngle.setAttribute('d', `M 60 250 L 60 240 L 50 240`);
            rightAngle.setAttribute('fill', 'none');
            rightAngle.setAttribute('stroke', '#e74c3c');
            rightAngle.setAttribute('stroke-width', '2');
            svg.appendChild(rightAngle);

            // Etiquetas de lados
            addSideLabel(svg, points[0], points[1], `a = ${triangle.a || '?'}m`, 'bottom');
            addSideLabel(svg, points[0], points[2], `b = ${triangle.b || '?'}m`, 'left');
            addSideLabel(svg, points[1], points[2], `c = ${triangle.c || '?'}m`, 'diagonal');

            container.appendChild(svg);
        }

        // Añadir etiqueta de lado
        function addSideLabel(svg, p1, p2, text, position) {
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', midX);
            label.setAttribute('y', midY);
            label.setAttribute('fill', '#2c3e50');
            label.setAttribute('font-weight', 'bold');
            label.setAttribute('font-size', '14');
            label.setAttribute('text-anchor', 'middle');
            
            // Ajustar posición según el lado
            if (position === 'bottom') {
                label.setAttribute('y', midY + 20);
            } else if (position === 'left') {
                label.setAttribute('x', midX - 25);
                label.setAttribute('y', midY + 5);
            } else if (position === 'diagonal') {
                label.setAttribute('x', midX + 15);
                label.setAttribute('y', midY - 10);
            }
            
            label.textContent = text;
            svg.appendChild(label);
        }

        // Mostrar pasos de cálculo
        function showCalculationSteps() {
            const mission = missions[gameState.currentMission];
            const stepsContainer = document.getElementById('steps-container');
            const calculationDiv = document.getElementById('calculation-steps');
            
            stepsContainer.innerHTML = '';
            calculationDiv.style.display = 'block';
            
            const triangle = mission.triangle;
            let steps = [];
            
            if (triangle.unknown === 'c') {
                // Calcular hipotenusa
                steps = [
                    `Fórmula del Teorema de Pitágoras: c² = a² + b²`,
                    `Sustituir valores conocidos: c² = ${triangle.a}² + ${triangle.b}²`,
                    `Calcular cuadrados: c² = ${triangle.a * triangle.a} + ${triangle.b * triangle.b}`,
                    `Sumar: c² = ${triangle.a * triangle.a + triangle.b * triangle.b}`,
                    `Sacar raíz cuadrada: c = √${triangle.a * triangle.a + triangle.b * triangle.b} = ${mission.answer}m`
                ];
            } else if (triangle.unknown === 'a') {
                // Calcular cateto a
                steps = [
                    `Fórmula del Teorema de Pitágoras: a² + b² = c²`,
                    `Despejar a²: a² = c² - b²`,
                    `Sustituir valores: a² = ${triangle.c}² - ${triangle.b}²`,
                    `Calcular cuadrados: a² = ${triangle.c * triangle.c} - ${triangle.b * triangle.b}`,
                    `Restar: a² = ${triangle.c * triangle.c - triangle.b * triangle.b}`,
                    `Sacar raíz cuadrada: a = √${triangle.c * triangle.c - triangle.b * triangle.b} = ${mission.answer}m`
                ];
            } else { // unknown === 'b'
                // Calcular cateto b
                steps = [
                    `Fórmula del Teorema de Pitágoras: a² + b² = c²`,
                    `Despejar b²: b² = c² - a²`,
                    `Sustituir valores: b² = ${triangle.c}² - ${triangle.a}²`,
                    `Calcular cuadrados: b² = ${triangle.c * triangle.c} - ${triangle.a * triangle.a}`,
                    `Restar: b² = ${triangle.c * triangle.c - triangle.a * triangle.a}`,
                    `Sacar raíz cuadrada: b = √${triangle.c * triangle.c - triangle.a * triangle.a} = ${mission.answer}m`
                ];
            }
            
            steps.forEach((step, index) => {
                const stepDiv = document.createElement('div');
                stepDiv.className = 'step';
                stepDiv.innerHTML = `
                    <span class="step-number">${index + 1}</span>
                    ${step}
                `;
                stepsContainer.appendChild(stepDiv);
                
                // Animación secuencial
                setTimeout(() => {
                    stepDiv.style.opacity = '0';
                    stepDiv.style.transform = 'translateX(-20px)';
                    stepDiv.style.transition = 'all 0.5s ease';
                    setTimeout(() => {
                        stepDiv.style.opacity = '1';
                        stepDiv.style.transform = 'translateX(0)';
                    }, 100);
                }, index * 300);
            });
            
            gameState.showingSteps = true;
        }

        // Mostrar pista
        function showHint() {
            const mission = missions[gameState.currentMission];
            const feedback = document.getElementById('feedback');
            
            feedback.className = 'feedback hint';
            feedback.style.display = 'block';
            feedback.innerHTML = `
                <div>💡 <strong>Pista:</strong></div>
                <div style="margin-top: 10px; font-size: 1rem;">${mission.hint}</div>
            `;
            
            gameState.hintsUsed++;
            updateDashboard();
        }

        // Verificar respuesta
        function checkAnswer() {
            const mission = missions[gameState.currentMission];
            const triangle = mission.triangle;
            let userAnswer;
            
            // Obtener respuesta del usuario según qué se está calculando
            if (triangle.unknown === 'a') {
                userAnswer = parseFloat(document.getElementById('cateto-a').value);
            } else if (triangle.unknown === 'b') {
                userAnswer = parseFloat(document.getElementById('cateto-b').value);
            } else {
                userAnswer = parseFloat(document.getElementById('hipotenusa').value);
            }
            
            if (isNaN(userAnswer)) {
                showFeedback('wrong', '❌ Por favor, ingresa un valor numérico válido.');
                return;
            }
            
            gameState.totalQuestions++;
            const feedback = document.getElementById('feedback');
            const tolerance = 0.1; // Tolerancia para decimales
            
            if (Math.abs(userAnswer - mission.answer) <= tolerance) {
                // Respuesta correcta
                gameState.correctAnswers++;
                let points = 100;
                
                // Bonus por no usar pistas
                if (!gameState.showingSteps) points += 50;
                if (gameState.hintsUsed === 0) points += 25;
                
                gameState.totalScore += points;
                
                showFeedback('correct', `
                    🎉 ¡Excelente! +${points} puntos
                    <div style="margin-top: 10px;">
                        <strong>Respuesta correcta: ${mission.answer}m</strong>
                    </div>
                    <div style="margin-top: 10px; font-size: 0.9rem;">
                        Has aplicado correctamente el Teorema de Pitágoras. ${mission.difficulty === 'Básico' ? '¡Gran trabajo para empezar!' : mission.difficulty === 'Intermedio' ? '¡Bien hecho, vas progresando!' : '¡Impresionante dominio del teorema!'}
                    </div>
                `);
                
                // Animar triángulo
                const triangle = document.querySelector('.animated-triangle');
                if (triangle) {
                    triangle.classList.add('correct-animation');
                }
                
                document.getElementById('next-mission-btn').style.display = 'block';
            } else {
                // Respuesta incorrecta
                showFeedback('wrong', `
                    ❌ Incorrecto. Respuesta esperada: ${mission.answer}m
                    <div style="margin-top: 10px; font-size: 0.9rem;">
                        💡 Revisa tus cálculos. ${userAnswer > mission.answer ? 'Tu respuesta es muy alta.' : 'Tu respuesta es muy baja.'}
                        ${!gameState.showingSteps ? 'Prueba usar el botón "Mostrar Cálculos" para ver los pasos.' : ''}
                    </div>
                `);
            }
            
            updateDashboard();
        }

        // Mostrar retroalimentación
        function showFeedback(type, message) {
            const feedback = document.getElementById('feedback');
            feedback.className = `feedback ${type}`;
            feedback.innerHTML = message;
            feedback.style.display = 'block';
        }

        // Siguiente misión
        function nextMission() {
            gameState.currentMission++;
            gameState.showingSteps = false;
            loadMission();
        }

        // Ocultar elementos
        function hideElements() {
            document.getElementById('feedback').style.display = 'none';
            document.getElementById('next-mission-btn').style.display = 'none';
            document.getElementById('calculation-steps').style.display = 'none';
        }

        // Completar todas las misiones
        function completeMissions() {
            document.getElementById('game-content').style.display = 'none';
            document.getElementById('mission-complete').style.display = 'block';
            
            document.getElementById('final-score').textContent = gameState.totalScore + ' puntos';
            
            // Determinar logros
            const successRate = (gameState.correctAnswers / gameState.totalQuestions) * 100;
            let badges = '';
            let message = '';
            
            if (successRate >= 90) {
                badges = '<div class="badge">🥇</div><div class="badge">🎯</div><div class="badge">🏆</div>';
                message = '¡Increíble! Eres un maestro del Teorema de Pitágoras. Dominas completamente los triángulos rectángulos.';
            } else if (successRate >= 75) {
                badges = '<div class="badge">🥈</div><div class="badge">🎯</div>';
                message = '¡Excelente trabajo! Tienes una sólida comprensión del Teorema de Pitágoras.';
            } else if (successRate >= 60) {
                badges = '<div class="badge">🥉</div>';
                message = '¡Buen progreso! Sigues mejorando en la aplicación del teorema.';
            } else {
                badges = '<div class="badge">📐</div>';
                message = '¡Sigue practicando! El Teorema de Pitágoras es fundamental en geometría.';
            }
            
            // Logros especiales
            if (gameState.hintsUsed === 0) {
                badges += '<div class="badge">🧠</div>'; // Sin pistas
            }
            if (gameState.totalScore >= 800) {
                badges += '<div class="badge">⭐</div>'; // Puntuación alta
            }
            
            document.getElementById('achievement-badges').innerHTML = badges;
            document.getElementById('final-message').textContent = message;
        }

        // Reiniciar juego
        function restartGame() {
            gameState = {
                currentMission: 0,
                totalScore: 0,
                correctAnswers: 0,
                totalQuestions: 0,
                hintsUsed: 0,
                showingSteps: false
            };
            
            document.getElementById('game-content').style.display = 'block';
            document.getElementById('mission-complete').style.display = 'none';
            
            initGame();
        }

        // Eventos de teclado para mejor UX
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                checkAnswer();
            } else if (e.key === 'Escape') {
                hideElements();
            }
        });

        // Auto-focus en el campo editable
        function autoFocusEditableField() {
            const mission = missions[gameState.currentMission];
            if (!mission) return;
            
            const triangle = mission.triangle;
            setTimeout(() => {
                if (triangle.unknown === 'a') {
                    document.getElementById('cateto-a').focus();
                } else if (triangle.unknown === 'b') {
                    document.getElementById('cateto-b').focus();
                } else {
                    document.getElementById('hipotenusa').focus();
                }
            }, 500);
        }

        // Validación en tiempo real
        function setupRealTimeValidation() {
            const inputs = document.querySelectorAll('.measurement-field:not([readonly])');
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    const value = parseFloat(this.value);
                    if (!isNaN(value) && value > 0) {
                        this.style.borderColor = '#28a745';
                        this.style.background = '#f8fff9';
                    } else if (this.value === '') {
                        this.style.borderColor = '#dee2e6';
                        this.style.background = 'white';
                    } else {
                        this.style.borderColor = '#dc3545';
                        this.style.background = '#fff5f5';
                    }
                });
            });
        }

        // Inicializar el juego cuando se carga la página
        window.onload = function() {
            initGame();
            autoFocusEditableField();
            setupRealTimeValidation();
        };

        // Actualizar validación cada vez que se carga una misión nueva
        function loadMission() {
            if (gameState.currentMission >= missions.length) {
                completeMissions();
                return;
            }

            const mission = missions[gameState.currentMission];
            
            // Actualizar interfaz
            document.getElementById('mission-icon').textContent = mission.icon;
            document.getElementById('challenge-title-text').textContent = mission.title;
            document.getElementById('challenge-story').textContent = mission.story;

            // Configurar campos de entrada
            setupMeasurements(mission.triangle);
            
            // Crear triángulo visual
            createTriangle(mission.triangle);
            
            // Limpiar interfaz
            hideElements();
            updateDashboard();
            
            // Configurar validación y focus
            setTimeout(() => {
                autoFocusEditableField();
                setupRealTimeValidation();
            }, 100);
        }
