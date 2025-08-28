/* Extracted from games/detective-datos-game.html on 2025-08-28T03:35:45.650Z */
window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XZ1QWD1TCC');

window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XZ1QWD1TCC');

// Redirige si no hay usuario autenticado
        if (!localStorage.getItem('currentUser') && !sessionStorage.getItem('currentUser')) {
        window.location.href = "complete-login-html.html";
        }
        // Estado del juego
        let gameState = {
            currentQuestion: 0,
            score: 0,
            streak: 0,
            answered: false,
            chart: null
        };

        // Datos para las gráficas y preguntas
        const gameData = [
            {
                type: 'bar',
                title: 'Deportes Favoritos en el Colegio San José',
                description: 'Encuesta realizada a 120 estudiantes',
                data: {
                    labels: ['Fútbol', 'Baloncesto', 'Voleibol', 'Natación', 'Atletismo'],
                    datasets: [{
                        label: 'Número de estudiantes',
                        data: [45, 32, 18, 15, 10],
                        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff']
                    }]
                },
                question: '¿Cuál es el deporte más popular entre los estudiantes?',
                options: ['Fútbol', 'Baloncesto', 'Voleibol', 'Natación'],
                correct: 0,
                explanation: '¡Correcto! El fútbol tiene 45 estudiantes, que es el valor más alto en la gráfica.'
            },
            {
                type: 'line',
                title: 'Temperatura de Bogotá - Semana del 1 al 7 de Mayo',
                description: 'Temperatura máxima diaria en grados Celsius',
                data: {
                    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
                    datasets: [{
                        label: 'Temperatura (°C)',
                        data: [18, 20, 22, 19, 21, 23, 20],
                        borderColor: '#ff6384',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        tension: 0.4
                    }]
                },
                question: '¿En qué día se registró la temperatura más alta?',
                options: ['Viernes', 'Sábado', 'Domingo', 'Miércoles'],
                correct: 1,
                explanation: '¡Excelente! El sábado registró 23°C, la temperatura más alta de la semana.'
            },
            {
                type: 'pie',
                title: 'Distribución del Presupuesto Familiar Mensual',
                description: 'Familia González - Ingresos: $2,000,000 COP',
                data: {
                    labels: ['Alimentación', 'Vivienda', 'Transporte', 'Educación', 'Otros'],
                    datasets: [{
                        data: [800000, 600000, 300000, 200000, 100000],
                        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff']
                    }]
                },
                question: '¿Qué porcentaje del presupuesto se destina a alimentación?',
                options: ['30%', '40%', '35%', '45%'],
                correct: 1,
                explanation: '¡Correcto! $800,000 de $2,000,000 representa el 40% del presupuesto.'
            },
            {
                type: 'bar',
                title: 'Ventas de Helados por Mes - Heladería "El Polo"',
                description: 'Número de helados vendidos en el primer semestre',
                data: {
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                    datasets: [{
                        label: 'Helados vendidos',
                        data: [150, 200, 350, 500, 750, 900],
                        backgroundColor: ['#87ceeb', '#98fb98', '#dda0dd', '#f0e68c', '#ffa07a', '#ffb6c1']
                    }]
                },
                question: '¿En cuáles meses se vendieron más de 400 helados?',
                options: ['Abril, Mayo y Junio', 'Mayo y Junio', 'Marzo, Abril y Mayo', 'Solo Junio'],
                correct: 0,
                explanation: '¡Perfecto! Abril (500), Mayo (750) y Junio (900) son los meses con más de 400 helados vendidos.'
            },
            {
                type: 'line',
                title: 'Crecimiento de una Planta de Fríjol',
                description: 'Altura medida semanalmente en centímetros',
                data: {
                    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5', 'Semana 6'],
                    datasets: [{
                        label: 'Altura (cm)',
                        data: [2, 5, 12, 20, 28, 35],
                        borderColor: '#4bc0c0',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.3
                    }]
                },
                question: '¿Cuántos centímetros creció la planta entre la semana 2 y la semana 4?',
                options: ['15 cm', '20 cm', '12 cm', '8 cm'],
                correct: 0,
                explanation: '¡Bien hecho! La planta medía 5 cm en la semana 2 y 20 cm en la semana 4. 20 - 5 = 15 cm.'
            },
            {
                type: 'bar',
                title: 'Número de Libros Leídos por Curso',
                description: 'Concurso de lectura - Colegio Cervantes',
                data: {
                    labels: ['6A', '6B', '6C', '6D', '6E'],
                    datasets: [{
                        label: 'Libros leídos',
                        data: [24, 18, 30, 15, 27],
                        backgroundColor: ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#ff99cc']
                    }]
                },
                question: '¿Cuál es la diferencia entre el curso que más leyó y el que menos leyó?',
                options: ['12 libros', '15 libros', '9 libros', '18 libros'],
                correct: 1,
                explanation: '¡Excelente! 6C leyó 30 libros (máximo) y 6D leyó 15 libros (mínimo). 30 - 15 = 15 libros.'
            },
            {
                type: 'pie',
                title: 'Medios de Transporte al Colegio',
                description: 'Encuesta a 200 estudiantes del grado 6°',
                data: {
                    labels: ['Bus escolar', 'Carro particular', 'Transporte público', 'Caminando', 'Bicicleta'],
                    datasets: [{
                        data: [80, 50, 40, 20, 10],
                        backgroundColor: ['#ffcd56', '#ff6384', '#36a2eb', '#4bc0c0', '#9966ff']
                    }]
                },
                question: '¿Cuántos estudiantes más usan bus escolar que transporte público?',
                options: ['30 estudiantes', '40 estudiantes', '50 estudiantes', '20 estudiantes'],
                correct: 1,
                explanation: '¡Correcto! 80 estudiantes usan bus escolar y 40 usan transporte público. 80 - 40 = 40 estudiantes.'
            },
            {
                type: 'line',
                title: 'Evolución del Ahorro de Sofía',
                description: 'Dinero ahorrado mes a mes en pesos colombianos',
                data: {
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                    datasets: [{
                        label: 'Ahorro ($COP)',
                        data: [50000, 75000, 60000, 90000, 110000, 135000],
                        borderColor: '#9966ff',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        tension: 0.2
                    }]
                },
                question: '¿En qué mes Sofía tuvo menos dinero ahorrado que el mes anterior?',
                options: ['Febrero', 'Marzo', 'Abril', 'Mayo'],
                correct: 1,
                explanation: '¡Muy bien! En marzo Sofía tenía $60,000, menos que en febrero cuando tenía $75,000.'
            },
            {
                type: 'bar',
                title: 'Mascotas Favoritas - Encuesta Barrio La Esperanza',
                description: 'Preferencia de 150 familias encuestadas',
                data: {
                    labels: ['Perros', 'Gatos', 'Peces', 'Pájaros', 'Hamsters', 'Ninguna'],
                    datasets: [{
                        label: 'Número de familias',
                        data: [65, 35, 20, 15, 10, 5],
                        backgroundColor: ['#8b4513', '#ff69b4', '#00ced1', '#ffd700', '#dda0dd', '#696969']
                    }]
                },
                question: '¿Qué fracción de las familias prefiere gatos?',
                options: ['1/4', '7/30', '1/3', '2/5'],
                correct: 1,
                explanation: '¡Perfecto! 35 de 150 familias prefieren gatos. 35/150 = 7/30 (simplificando dividiendo por 5).'
            },
            {
                type: 'line',
                title: 'Velocidad de un Ciclista en Entrenamiento',
                description: 'Velocidad promedio cada 10 minutos (km/h)',
                data: {
                    labels: ['0-10 min', '10-20 min', '20-30 min', '30-40 min', '40-50 min', '50-60 min'],
                    datasets: [{
                        label: 'Velocidad (km/h)',
                        data: [15, 25, 30, 28, 35, 20],
                        borderColor: '#ff6384',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        tension: 0.4
                    }]
                },
                question: '¿Cuál fue la velocidad máxima alcanzada por el ciclista?',
                options: ['30 km/h', '35 km/h', '28 km/h', '25 km/h'],
                correct: 1,
                explanation: '¡Excelente! La velocidad máxima fue de 35 km/h durante los minutos 40-50 del entrenamiento.'
            }
        ];

        // Inicializar juego
        function initGame() {
            updateScoreboard();
            loadQuestion();
        }

        // Actualizar marcadores
        function updateScoreboard() {
            document.getElementById('score').textContent = gameState.score;
            document.getElementById('current-question').textContent = gameState.currentQuestion + 1;
            document.getElementById('total-questions').textContent = gameData.length;
            document.getElementById('streak').textContent = gameState.streak;
            
            const progress = ((gameState.currentQuestion) / gameData.length) * 100;
            document.getElementById('progress-fill').style.width = progress + '%';
        }

        // Cargar pregunta actual
        function loadQuestion() {
            if (gameState.currentQuestion >= gameData.length) {
                endGame();
                return;
            }

            const questionData = gameData[gameState.currentQuestion];
            gameState.answered = false;

            // Actualizar título y descripción
            document.getElementById('chart-title').textContent = questionData.title;
            document.getElementById('chart-description').textContent = questionData.description;

            // Crear gráfica
            createChart(questionData);

            // Actualizar pregunta y opciones
            document.getElementById('question-text').textContent = questionData.question;
            createOptions(questionData.options, questionData.correct);

            // Ocultar feedback y botón siguiente
            document.getElementById('feedback').style.display = 'none';
            document.getElementById('next-btn').style.display = 'none';
        }

        // Crear gráfica
        function createChart(questionData) {
            const ctx = document.getElementById('main-chart').getContext('2d');
            
            if (gameState.chart) {
                gameState.chart.destroy();
            }

            const config = {
                type: questionData.type,
                data: questionData.data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: questionData.type !== 'pie',
                            position: 'top'
                        },
                        tooltip: {
                            enabled: true
                        }
                    },
                    scales: questionData.type !== 'pie' ? {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            }
                        }
                    } : {}
                }
            };

            gameState.chart = new Chart(ctx, config);
        }

        // Crear opciones de respuesta
        function createOptions(options, correctIndex) {
            const container = document.getElementById('options-container');
            container.innerHTML = '';

            options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'option-btn';
                button.textContent = option;
                button.onclick = () => selectAnswer(index, correctIndex);
                container.appendChild(button);
            });
        }

        // Seleccionar respuesta
        function selectAnswer(selectedIndex, correctIndex) {
            if (gameState.answered) return;

            gameState.answered = true;
            const questionData = gameData[gameState.currentQuestion];
            const buttons = document.querySelectorAll('.option-btn');
            const feedback = document.getElementById('feedback');

            buttons.forEach((btn, index) => {
                btn.disabled = true;
                if (index === correctIndex) {
                    btn.classList.add('correct');
                } else if (index === selectedIndex) {
                    btn.classList.add('wrong');
                }
            });

            if (selectedIndex === correctIndex) {
                // Respuesta correcta
                gameState.score += 100 + (gameState.streak * 10);
                gameState.streak++;
                feedback.className = 'feedback correct';
                feedback.innerHTML = `
                    <div>🎉 ¡Correcto! +${100 + ((gameState.streak - 1) * 10)} puntos</div>
                    <div style="margin-top: 10px; font-size: 0.9rem;">${questionData.explanation}</div>
                `;
            } else {
                // Respuesta incorrecta
                gameState.streak = 0;
                feedback.className = 'feedback wrong';
                feedback.innerHTML = `
                    <div>❌ Incorrecto. La respuesta correcta era: ${questionData.options[correctIndex]}</div>
                    <div style="margin-top: 10px; font-size: 0.9rem;">${questionData.explanation}</div>
                `;
            }

            feedback.style.display = 'block';
            document.getElementById('next-btn').style.display = 'block';
            updateScoreboard();
        }

        // Siguiente pregunta
        function nextQuestion() {
            gameState.currentQuestion++;
            updateScoreboard();
            loadQuestion();
        }

        // Terminar juego
        function endGame() {
            document.getElementById('game-content').style.display = 'none';
            document.getElementById('game-complete').style.display = 'block';
            document.getElementById('final-score').textContent = gameState.score;

            // Determinar medallas y mensaje
            let medals = '';
            let message = '';

            if (gameState.score >= 900) {
                medals = '<div class="medal">🥇</div><div class="medal">🌟</div><div class="medal">🏆</div>';
                message = '¡Increíble! Eres un verdadero detective de datos. ¡Puntuación perfecta!';
            } else if (gameState.score >= 700) {
                medals = '<div class="medal">🥈</div><div class="medal">🌟</div>';
                message = '¡Excelente trabajo! Tienes gran habilidad interpretando gráficas.';
            } else if (gameState.score >= 500) {
                medals = '<div class="medal">🥉</div>';
                message = '¡Buen trabajo! Sigues mejorando como detective de datos.';
            } else {
                medals = '<div class="medal">🎯</div>';
                message = '¡Sigue practicando! Cada detective necesita tiempo para perfeccionar sus habilidades.';
            }

            document.getElementById('medals').innerHTML = medals;
            document.getElementById('final-message').textContent = message;

            // Guardar el puntaje en la base de datos local
            const user = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
            let usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
            const userIndex = usersDB.findIndex(u => u.email === user.email);

            if (userIndex !== -1) {
                // Buscar el juego en metrics.games y actualizar puntaje, estado y progreso
                const metrics = usersDB[userIndex].metrics;
                if (!metrics.games) metrics.games = [];
                let gameRecord = metrics.games.find(g => g.title === "Detective de Datos");
                if (!gameRecord) {
                    gameRecord = { title: "Detective de Datos", status: "completed", progress: 100, stars: 0, points: 0 };
                    metrics.games.push(gameRecord);
                }
                gameRecord.points = gameState.score;
                gameRecord.status = "completed";
                gameRecord.progress = 100;
                // Calificación en estrellas según puntaje
                if (gameState.score >= 900) {
                    gameRecord.stars = 3;
                } else if (gameState.score >= 700) {
                    gameRecord.stars = 2;
                } else if (gameState.score >= 500) {
                    gameRecord.stars = 1;
                } else {
                    gameRecord.stars = 0;
                }
                // Actualizar el total de puntos del usuario
                metrics.totalPoints = metrics.games.reduce((sum, g) => sum + (g.points || 0), 0);

                // Guardar cambios en LocalStorage
                usersDB[userIndex].metrics = metrics;
                localStorage.setItem('usersDB', JSON.stringify(usersDB));
                localStorage.setItem('currentUser', JSON.stringify(usersDB[userIndex]));
            }
        }

        // Reiniciar juego
        function restartGame() {
            gameState = {
                currentQuestion: 0,
                score: 0,
                streak: 0,
                answered: false,
                chart: null
            };

            document.getElementById('game-content').style.display = 'block';
            document.getElementById('game-complete').style.display = 'none';
            
            initGame();
        }

        // Iniciar el juego cuando se carga la página
        window.onload = initGame;
