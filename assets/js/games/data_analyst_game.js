/* Extracted from games/data_analyst_game.html on 2025-08-28T03:35:45.645Z */
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
            score: 0,
            currentStation: 0,
            completedStations: [],
            currentChallenge: 0,
            challengesCompleted: 0,
            totalChallenges: 0,
            currentData: [],
            selectedAnswer: null
        };

        // Definición de estaciones y desafíos
        const stations = {
            1: {
                name: "🏫 La Escuela",
                story: "📚 ¡Bienvenido, joven analista! Tu primera misión te lleva a la escuela local, donde el director necesita tu ayuda para analizar las calificaciones del último examen de matemáticas. Los estudiantes y padres esperan conocer cómo fue el rendimiento general. ¡Usa tus habilidades para descifrar los secretos de estos números!",
                challenges: [
                    {
                        data: [85, 92, 78, 85, 90, 87, 85, 83, 88, 91],
                        dataTitle: "📊 Calificaciones del Examen (sobre 100)",
                        question: "¿Cuál es la MEDIA (promedio) de las calificaciones?",
                        type: "mean",
                        options: [86.4, 85.0, 87.2, 84.8]
                    },
                    {
                        data: [85, 92, 78, 85, 90, 87, 85, 83, 88, 91],
                        dataTitle: "📊 Calificaciones del Examen (ordenadas)",
                        question: "¿Cuál es la MEDIANA de las calificaciones?",
                        type: "median",
                        options: [86.5, 85.0, 87.0, 88.0]
                    },
                    {
                        data: [85, 92, 78, 85, 90, 87, 85, 83, 88, 91],
                        dataTitle: "📊 Calificaciones del Examen (frecuencias)",
                        question: "¿Cuál es la MODA de las calificaciones?",
                        type: "mode",
                        options: [85, 87, 88, 90]
                    }
                ]
            },
            2: {
                name: "🧪 El Laboratorio",
                story: "🔬 ¡Excelente trabajo en la escuela! Ahora te diriges al laboratorio científico, donde los investigadores han estado midiendo las temperaturas de una reacción química durante varios días. Necesitan entender las tendencias para optimizar el proceso. ¡Los datos te esperan!",
                challenges: [
                    {
                        data: [22.5, 24.1, 21.8, 23.2, 25.0, 24.1, 23.7, 22.9, 24.1, 23.5],
                        dataTitle: "🌡️ Temperaturas de Reacción (°C)",
                        question: "¿Cuál es la MEDIA de las temperaturas?",
                        type: "mean",
                        options: [23.6, 23.2, 24.0, 22.8]
                    },
                    {
                        data: [22.5, 24.1, 21.8, 23.2, 25.0, 24.1, 23.7, 22.9, 24.1, 23.5],
                        dataTitle: "🌡️ Temperaturas de Reacción (ordenadas)",
                        question: "¿Cuál es la MEDIANA de las temperaturas?",
                        type: "median",
                        options: [23.6, 23.4, 23.8, 24.0]
                    },
                    {
                        data: [22.5, 24.1, 21.8, 23.2, 25.0, 24.1, 23.7, 22.9, 24.1, 23.5],
                        dataTitle: "🌡️ Temperaturas de Reacción (frecuencias)",
                        question: "¿Cuál es la MODA de las temperaturas?",
                        type: "mode",
                        options: [24.1, 23.2, 22.5, 25.0]
                    }
                ]
            },
            3: {
                name: "🏪 El Mercado",
                story: "💰 ¡Genial! Tu fama como analista se extiende y ahora el dueño del mercado local te ha contratado. Necesita analizar las ventas diarias de la semana pasada para planificar mejor el inventario. Los números del comercio tienen sus propios secretos. ¡A descubrirlos!",
                challenges: [
                    {
                        data: [145, 132, 168, 145, 156, 142, 145, 139, 161, 145],
                        dataTitle: "💰 Ventas Diarias (productos vendidos)",
                        question: "¿Cuál es la MEDIA de las ventas diarias?",
                        type: "mean",
                        options: [147.8, 145.0, 150.2, 143.6]
                    },
                    {
                        data: [145, 132, 168, 145, 156, 142, 145, 139, 161, 145],
                        dataTitle: "💰 Ventas Diarias (ordenadas)",
                        question: "¿Cuál es la MEDIANA de las ventas?",
                        type: "median",
                        options: [145.0, 147.5, 144.0, 146.0]
                    },
                    {
                        data: [145, 132, 168, 145, 156, 142, 145, 139, 161, 145],
                        dataTitle: "💰 Ventas Diarias (frecuencias)",
                        question: "¿Cuál es la MODA de las ventas?",
                        type: "mode",
                        options: [145, 156, 132, 168]
                    }
                ]
            },
            4: {
                name: "🔭 El Observatorio",
                story: "🌌 ¡Impresionante! Has llegado al observatorio astronómico, donde los científicos están estudiando las estrellas y planetas. Tu tarea es analizar los datos de brillo estelar para ayudar en la clasificación de nuevas estrellas. ¡El universo de los datos se expande ante ti!",
                challenges: [
                    {
                        data: [5.1, 5.8, 4.9, 5.5, 6.0, 5.7, 5.2, 5.9, 5.3, 6.1],
                        dataTitle: "🌟 Brillo Estelar (magnitudes)",
                        question: "¿Cuál es la MEDIA del brillo estelar?",
                        type: "mean",
                        options: [5.6, 5.3, 5.8, 5.1]
                    },
                    {
                        data: [5.1, 5.8, 4.9, 5.5, 6.0, 5.7, 5.2, 5.9, 5.3, 6.1],
                        dataTitle: "🌟 Brillo Estelar (magnitudes ordenadas)",
                        question: "¿Cuál es la MEDIANA del brillo estelar?",
                        type: "median",
                        options: [5.55, 5.6, 5.3, 5.7]
                    },
                    {
                        data: [5.1, 5.8, 4.9, 5.5, 6.0, 5.7, 5.2, 5.9, 5.3, 6.1],
                        dataTitle: "🌟 Brillo Estelar (frecuencias)",
                        question: "¿Cuál es la MODA del brillo estelar?",
                        type: "mode",
                        options: [5.1, 5.5, 5.8, 6.0]
                    }
                ]
            }
        };

        // Inicializa el juego
        function initGame() {
            gameState = {
                score: 0,
                currentStation: 1,
                completedStations: [],
                currentChallenge: 0,
                challengesCompleted: 0,
                totalChallenges: 0,
                currentData: [],
                selectedAnswer: null
            };
            updateUI();
            loadStation(1);
        }

        // Actualiza la interfaz de usuario
        function updateUI() {
            document.getElementById('score').innerText = gameState.score;
            document.getElementById('level').innerText = gameState.currentStation;
            document.getElementById('progress').innerText = gameState.challengesCompleted;

            // Actualiza el progreso en el mapa
            const steps = document.querySelectorAll('.progress-step');
            const connectors = document.querySelectorAll('.progress-connector');
            steps.forEach((step, index) => {
                step.classList.remove('completed', 'current');
                if (index < gameState.currentStation - 1) {
                    step.classList.add('completed');
                } else if (index === gameState.currentStation - 1) {
                    step.classList.add('current');
                }
            });
            connectors.forEach((connector, index) => {
                connector.classList.remove('active');
                if (index < gameState.currentStation - 1) {
                    connector.classList.add('active');
                }
            });
        }

        // Carga una estación
        function loadStation(station) {
            const stationData = stations[station];
            if (!stationData) return;

            gameState.currentStation = station;
            gameState.challengesCompleted = 0;
            gameState.totalChallenges = stationData.challenges.length;
            gameState.currentChallenge = 0;
            gameState.currentData = stationData.challenges[0].data;

            document.getElementById('challengeTitle').innerText = stationData.name;
            document.getElementById('challengeStory').innerText = stationData.story;
            document.getElementById('dataTitle').innerText = stationData.challenges[0].dataTitle;

            const dataGrid = document.getElementById('dataGrid');
            dataGrid.innerHTML = '';
            stationData.challenges[0].data.forEach((value) => {
                const dataItem = document.createElement('div');
                dataItem.className = 'data-item';
                dataItem.innerText = value;
                dataGrid.appendChild(dataItem);
            });

            // Reiniciar botones
            document.getElementById('checkBtn').style.display = 'inline-block';
            document.getElementById('showCalcBtn').style.display = 'none';
            document.getElementById('nextBtn').style.display = 'none';
            document.getElementById('completeBtn').style.display = 'none';

            // Reiniciar feedback
            const feedback = document.getElementById('feedback');
            feedback.className = 'feedback';
            feedback.innerHTML = '';

            // Cargar pregunta
            loadQuestion();
            updateUI();
        }

        // Carga una pregunta del desafío
        function loadQuestion() {
            const challenge = stations[gameState.currentStation].challenges[gameState.currentChallenge];
            const questionContainer = document.getElementById('challengeQuestion');
            questionContainer.innerHTML = '';

            const questionText = document.createElement('div');
            questionText.className = 'question-text';
            questionText.innerText = challenge.question;
            questionContainer.appendChild(questionText);

            // Opciones de respuesta
            const answerGrid = document.createElement('div');
            answerGrid.className = 'answer-grid';
            challenge.options.forEach((option) => {
                const optionButton = document.createElement('div');
                optionButton.className = 'answer-option';
                optionButton.innerText = option;
                optionButton.onclick = () => selectAnswer(option);
                answerGrid.appendChild(optionButton);
            });
            questionContainer.appendChild(answerGrid);
        }

        // Selecciona una respuesta
        function selectAnswer(answer) {
            gameState.selectedAnswer = answer;
            const challenge = stations[gameState.currentStation].challenges[gameState.currentChallenge];

            // Actualiza opciones
            const options = document.querySelectorAll('.answer-option');
            options.forEach((option) => {
                option.classList.remove('selected');
                if (option.innerText == answer) {
                    option.classList.add('selected');
                }
            });
        }

        // Verifica la respuesta
        function checkAnswer() {
            const challenge = stations[gameState.currentStation].challenges[gameState.currentChallenge];
            let correct = false;

            // Calcular respuesta correcta según el tipo
            let correctAnswer;
            switch (challenge.type) {
                case 'mean':
                    correctAnswer = (challenge.data.reduce((a, b) => a + b, 0) / challenge.data.length).toFixed(2);
                    break;
                case 'median':
                    const sortedData = [...challenge.data].sort((a, b) => a - b);
                    const mid = Math.floor(sortedData.length / 2);
                    correctAnswer = sortedData.length % 2 === 0 ? ((sortedData[mid - 1] + sortedData[mid]) / 2).toFixed(2) : sortedData[mid].toFixed(2);
                    break;
                case 'mode':
                    const frequency = {};
                    let maxFreq = 0;
                    challenge.data.forEach((value) => {
                        frequency[value] = (frequency[value] || 0) + 1;
                        if (frequency[value] > maxFreq) {
                            maxFreq = frequency[value];
                            correctAnswer = value;
                        }
                    });
                    correctAnswer = correctAnswer.toFixed(2);
                    break;
                default:
                    correctAnswer = null;
            }

            // Verifica si la respuesta del jugador es correcta
            if (gameState.selectedAnswer != null && gameState.selectedAnswer.toString() === correctAnswer.toString()) {
                correct = true;
                gameState.score += 10;
                showFeedback(`✅ ¡Correcto! La respuesta es ${correctAnswer}.`, true);
            } else {
                correct = false;
                showFeedback(`❌ Incorrecto. La respuesta correcta es ${correctAnswer}.`, false);
            }

            // Actualiza puntaje
            document.getElementById('score').innerText = gameState.score;

            // Muestra cálculo si es correcto
            if (correct) {
                document.getElementById('showCalcBtn').style.display = 'inline-block';
            }

            // Desbloquear siguiente desafío o estación
            if (gameState.challengesCompleted < gameState.totalChallenges - 1) {
                document.getElementById('nextBtn').style.display = 'inline-block';
            } else {
                document.getElementById('completeBtn').style.display = 'inline-block';
            }

            // Oculta botón de verificar
            document.getElementById('checkBtn').style.display = 'none';
        }

        // Muestra el cálculo detallado
        function showCalculation() {
            const challenge = stations[gameState.currentStation].challenges[gameState.currentChallenge];
            const stepsContainer = document.getElementById('calculationSteps');
            stepsContainer.innerHTML = '';

            // Ejemplo de pasos para la media
            if (challenge.type === 'mean') {
                const total = challenge.data.reduce((a, b) => a + b, 0);
                const mean = (total / challenge.data.length).toFixed(2);

                stepsContainer.innerHTML += `<div class="step">Suma total: ${total}</div>`;
                stepsContainer.innerHTML += `<div class="step">Cantidad de valores: ${challenge.data.length}</div>`;
                stepsContainer.innerHTML += `<div class="step">Media (promedio): ${mean}</div>`;
            }

            // Ejemplo de pasos para la mediana
            else if (challenge.type === 'median') {
                const sortedData = [...challenge.data].sort((a, b) => a - b);
                const mid = Math.floor(sortedData.length / 2);

                stepsContainer.innerHTML += `<div class="step">Datos ordenados: ${sortedData.join(', ')}</div>`;
                stepsContainer.innerHTML += `<div class="step">Mediana: ${sortedData.length % 2 === 0 ? '(${sortedData[mid - 1]} + ${sortedData[mid]}) / 2' : sortedData[mid]}</div>`;
            }

            // Ejemplo de pasos para la moda
            else if (challenge.type === 'mode') {
                const frequency = {};
                let maxFreq = 0;
                challenge.data.forEach((value) => {
                    frequency[value] = (frequency[value] || 0) + 1;
                    if (frequency[value] > maxFreq) {
                        maxFreq = frequency[value];
                    }
                });
                const modes = Object.keys(frequency).filter((key) => frequency[key] === maxFreq);

                stepsContainer.innerHTML += `<div class="step">Frecuencia de valores: ${JSON.stringify(frequency)}</div>`;
                stepsContainer.innerHTML += `<div class="step">Moda: ${modes.join(', ')}</div>`;
            }

            stepsContainer.classList.add('visible');
            document.getElementById('showCalcBtn').style.display = 'none';
        }

        // Muestra el siguiente desafío
        function nextChallenge() {
            const stationData = stations[gameState.currentStation];
            gameState.currentChallenge++;
            gameState.currentData = stationData.challenges[gameState.currentChallenge].data;

            document.getElementById('dataTitle').innerText = stationData.challenges[gameState.currentChallenge].dataTitle;

            const dataGrid = document.getElementById('dataGrid');
            dataGrid.innerHTML = '';
            stationData.challenges[gameState.currentChallenge].data.forEach((value) => {
                const dataItem = document.createElement('div');
                dataItem.className = 'data-item';
                dataItem.innerText = value;
                dataGrid.appendChild(dataItem);
            });

            // Reiniciar botones
            document.getElementById('checkBtn').style.display = 'inline-block';
            document.getElementById('showCalcBtn').style.display = 'none';
            document.getElementById('nextBtn').style.display = 'none';
            document.getElementById('completeBtn').style.display = 'none';

            // Reiniciar feedback
            const feedback = document.getElementById('feedback');
            feedback.className = 'feedback';
            feedback.innerHTML = '';

            // Cargar nueva pregunta
            loadQuestion();
        }

        // Completa la estación actual
        function completeStation() {
            const station = gameState.currentStation;
            gameState.completedStations.push(station);
            if (gameState.completedStations.length === Object.keys(stations).length) {
                // Todos los estaciones completadas
                showFinalMessage();
            } else {
                // Cargar siguiente estación disponible
                let nextStation = null;
                for (let i = station + 1; i <= Object.keys(stations).length; i++) {
                    if (!gameState.completedStations.includes(i)) {
                        nextStation = i;
                        break;
                    }
                }
                if (nextStation) {
                    loadStation(nextStation);
                }
            }
        }

        // Muestra mensaje final
        function showFinalMessage() {
            const feedback = document.getElementById('feedback');
            feedback.className = 'feedback visible';
            feedback.innerHTML = `
                🎉 ¡Felicidades! Has completado todas las estaciones del Camino del Analista.
                <br>Tu puntaje final es: <strong>${gameState.score}</strong> cristales.
                <br>¡Sigue practicando y mejorando tus habilidades analíticas!
                <br><button class="btn success" onclick="guardarPuntajeAnalista(); window.location.href='student_dashboard.html'">Terminar</button>
            `;
            document.querySelector('.controls').style.display = 'none';
        }

        // Guarda el puntaje del analista
        function guardarPuntajeAnalista() {
            const user = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser'));
            let usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
            const userIndex = usersDB.findIndex(u => u.email === user.email);

            if (userIndex !== -1) {
                const metrics = usersDB[userIndex].metrics;
                if (!metrics.games) metrics.games = [];
                let gameRecord = metrics.games.find(g => g.title === "Analista de Datos");
                if (!gameRecord) {
                    gameRecord = { title: "Analista de Datos", status: "completed", progress: 100, stars: 0, points: 0 };
                    metrics.games.push(gameRecord);
                }
                gameRecord.points = gameState.score;
                gameRecord.status = "completed";
                gameRecord.progress = 100;
                // Calificación en estrellas según puntaje
                if (gameState.score >= 30) {
                    gameRecord.stars = 3;
                } else if (gameState.score >= 20) {
                    gameRecord.stars = 2;
                } else if (gameState.score >= 10) {
                    gameRecord.stars = 1;
                } else {
                    gameRecord.stars = 0;
                }
                metrics.totalPoints = metrics.games.reduce((sum, g) => sum + (g.points || 0), 0);

                usersDB[userIndex].metrics = metrics;
                localStorage.setItem('usersDB', JSON.stringify(usersDB));
                localStorage.setItem('currentUser', JSON.stringify(usersDB[userIndex]));
            }
        }

        // Muestra feedback
        function showFeedback(message, isSuccess) {
            const feedback = document.getElementById('feedback');
            feedback.className = 'feedback visible';
            feedback.innerHTML = message;

            if (isSuccess) {
                feedback.style.background = 'linear-gradient(135deg, #38ef7d, #11998e)';
                feedback.style.border = '3px solid #38ef7d';
                feedback.style.boxShadow = '0 10px 30px rgba(56,239,125,0.3)';
            } else {
                feedback.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
                feedback.style.border = '3px solid #ff6b6b';
                feedback.style.boxShadow = '0 10px 30px rgba(255,107,107,0.3)';
            }
        }

        // Iniciar juego al cargar
        window.onload = initGame;
