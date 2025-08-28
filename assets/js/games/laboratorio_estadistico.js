/* Extracted from games/laboratorio_estadistico.html on 2025-08-28T03:35:45.662Z */
window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XZ1QWD1TCC');

// Redirige si no hay usuario autenticado
        if (!localStorage.getItem('currentUser') && !sessionStorage.getItem('currentUser')) {
            window.location.replace('/complete-login-html.html');
        }
        let currentData = [];
        let currentChart = null;
        let gameStats = {
            experiments: 0,
            dataPoints: 0,
            correctAnswers: 0,
            score: 0
        };
        let currentExercise = 0;

        const exercises = [
            {
                question: "¿Cuál es la diferencia entre media y mediana?",
                options: [
                    "La media es el valor central, la mediana es el promedio",
                    "La media es el promedio, la mediana es el valor central",
                    "Son exactamente lo mismo",
                    "La mediana siempre es mayor que la media"
                ],
                correct: 1,
                explanation: "La media es el promedio aritmético de todos los valores, mientras que la mediana es el valor que queda en el centro cuando los datos se ordenan."
            },
            {
                question: "Si tienes los datos: 2, 4, 4, 6, 8, 10, ¿cuál es la moda?",
                options: ["4", "5", "6", "No hay moda"],
                correct: 0,
                explanation: "La moda es el valor que aparece con mayor frecuencia. En este caso, el 4 aparece dos veces."
            },
            {
                question: "¿Qué mide la desviación estándar?",
                options: [
                    "El promedio de los datos",
                    "La dispersión de los datos respecto a la media",
                    "El valor máximo menos el mínimo",
                    "La cantidad de datos"
                ],
                correct: 1,
                explanation: "La desviación estándar mide qué tan dispersos están los datos respecto al promedio. Valores más altos indican mayor dispersión."
            }
        ];

        function updateStats() {
            document.getElementById('experimentsCount').textContent = gameStats.experiments;
            document.getElementById('dataPointsCount').textContent = gameStats.dataPoints;
            document.getElementById('correctAnswers').textContent = gameStats.correctAnswers;
            document.getElementById('currentScore').textContent = gameStats.score;
        }

        function addDataPoint() {
            const input = document.getElementById('dataValue');
            const value = parseFloat(input.value);
            
            if (isNaN(value)) {
                showAlert('Por favor ingresa un número válido', 'warning');
                return;
            }
            
            currentData.push(value);
            input.value = '';
            gameStats.dataPoints++;
            updateDataDisplay();
            updateStats();
            
            showAlert('¡Dato agregado exitosamente!', 'success');
        }

        function generateRandomData() {
            currentData = [];
            const count = Math.floor(Math.random() * 15) + 10; // 10-24 datos
            
            for (let i = 0; i < count; i++) {
                currentData.push(Math.floor(Math.random() * 100) + 1);
            }
            
            gameStats.dataPoints += count;
            gameStats.experiments++;
            updateDataDisplay();
            updateStats();
            
            showAlert(`¡Generados ${count} datos aleatorios!`, 'success');
        }

        function clearData() {
            currentData = [];
            updateDataDisplay();
            if (currentChart) {
                currentChart.destroy();
                currentChart = null;
            }
            showAlert('Datos eliminados', 'warning');
        }

        function updateDataDisplay() {
            const container = document.getElementById('dataValues');
            const countElement = document.getElementById('dataCount');
            
            container.innerHTML = '';
            currentData.forEach(value => {
                const span = document.createElement('span');
                span.className = 'data-value';
                span.textContent = value;
                container.appendChild(span);
            });
            
            countElement.textContent = currentData.length;
        }

        function calculateStatistics() {
            if (currentData.length === 0) {
                showAlert('¡Primero agrega algunos datos!', 'warning');
                return;
            }
            
            const sortedData = [...currentData].sort((a, b) => a - b);
            const n = currentData.length;
            
            // Media
            const mean = currentData.reduce((sum, value) => sum + value, 0) / n;
            
            // Mediana
            let median;
            if (n % 2 === 0) {
                median = (sortedData[n/2 - 1] + sortedData[n/2]) / 2;
            } else {
                median = sortedData[Math.floor(n/2)];
            }
            
            // Moda
            const frequency = {};
            currentData.forEach(value => {
                frequency[value] = (frequency[value] || 0) + 1;
            });
            const maxFreq = Math.max(...Object.values(frequency));
            const mode = Object.keys(frequency).filter(key => frequency[key] === maxFreq);
            
            // Rango
            const range = Math.max(...currentData) - Math.min(...currentData);
            
            // Desviación estándar
            const variance = currentData.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / n;
            const standardDeviation = Math.sqrt(variance);
            
            // Cuartiles
            const q1 = calculateQuartile(sortedData, 0.25);
            const q3 = calculateQuartile(sortedData, 0.75);
            
            displayResults({
                media: mean.toFixed(2),
                mediana: median.toFixed(2),
                moda: mode.length === n ? 'No hay moda' : mode.join(', '),
                rango: range.toFixed(2),
                desviacion: standardDeviation.toFixed(2),
                q1: q1.toFixed(2),
                q3: q3.toFixed(2),
                minimo: Math.min(...currentData),
                maximo: Math.max(...currentData)
            });
            
            gameStats.experiments++;
            gameStats.score += 10;
            updateStats();
        }

        function calculateQuartile(sortedData, percentile) {
            const index = percentile * (sortedData.length - 1);
            if (Number.isInteger(index)) {
                return sortedData[index];
            } else {
                const lower = Math.floor(index);
                const upper = Math.ceil(index);
                return sortedData[lower] + (sortedData[upper] - sortedData[lower]) * (index - lower);
            }
        }

        function displayResults(stats) {
            const container = document.getElementById('statisticsResults');
            container.innerHTML = '';
            
            const statsArray = [
                { title: 'Media', value: stats.media },
                { title: 'Mediana', value: stats.mediana },
                { title: 'Moda', value: stats.moda },
                { title: 'Rango', value: stats.rango },
                { title: 'Desviación Estándar', value: stats.desviacion },
                { title: 'Q1', value: stats.q1 },
                { title: 'Q3', value: stats.q3 },
                { title: 'Mínimo', value: stats.minimo },
                { title: 'Máximo', value: stats.maximo }
            ];
            
            statsArray.forEach(stat => {
                const card = document.createElement('div');
                card.className = 'result-card';
                card.innerHTML = `
                    <div class="result-title">${stat.title}</div>
                    <div class="result-value">${stat.value}</div>
                `;
                container.appendChild(card);
            });
        }

        function createChart() {
            if (currentData.length === 0) {
                showAlert('¡Primero agrega algunos datos!', 'warning');
                return;
            }
            
            const ctx = document.getElementById('dataChart').getContext('2d');
            const chartType = document.getElementById('chartType').value;
            
            if (currentChart) {
                currentChart.destroy();
            }
            
            if (chartType === 'histogram') {
                createHistogram(ctx);
            } else if (chartType === 'boxplot') {
                createBoxPlot(ctx);
            } else if (chartType === 'line') {
                createLineChart(ctx);
            }
        }

        function createHistogram(ctx) {
            const bins = {};
            const binSize = 10;
            
            currentData.forEach(value => {
                const bin = Math.floor(value / binSize) * binSize;
                bins[bin] = (bins[bin] || 0) + 1;
            });
            
            const labels = Object.keys(bins).sort((a, b) => a - b).map(bin => `${bin}-${parseInt(bin) + binSize - 1}`);
            const data = Object.keys(bins).sort((a, b) => a - b).map(bin => bins[bin]);
            
            currentChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Frecuencia',
                        data: data,
                        backgroundColor: 'rgba(102, 126, 234, 0.7)',
                        borderColor: 'rgba(102, 126, 234, 1)',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Histograma de Frecuencias'
                        }
                    }
                }
            });
        }

        function createBoxPlot(ctx) {
            const sortedData = [...currentData].sort((a, b) => a - b);
            const q1 = calculateQuartile(sortedData, 0.25);
            const median = calculateQuartile(sortedData, 0.5);
            const q3 = calculateQuartile(sortedData, 0.75);
            const min = Math.min(...currentData);
            const max = Math.max(...currentData);
            
            currentChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Datos'],
                    datasets: [{
                        label: 'Valores',
                        data: [min, q1, median, q3, max],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(153, 102, 255, 0.7)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Valores Estadísticos Clave'
                        },
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        function createLineChart(ctx) {
            currentChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: currentData.map((_, index) => `Dato ${index + 1}`),
                    datasets: [{
                        label: 'Valores',
                        data: currentData,
                        borderColor: 'rgba(102, 126, 234, 1)',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Distribución de Datos'
                        }
                    }
                }
            });
        }

        function showAlert(message, type) {
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.textContent = message;
            
            const container = document.querySelector('.game-container');
            container.insertBefore(alert, container.firstChild);
            
            setTimeout(() => {
                alert.remove();
            }, 3000);
        }

        function loadExercise() {
            if (currentExercise >= exercises.length) {
                document.getElementById('exerciseContainer').innerHTML = `
                    <div class="exercise-card">
                        <h4>¡Felicitaciones! 🎉</h4>
                        <p>Has completado todos los desafíos estadísticos. Tu comprensión de la estadística descriptiva ha mejorado significativamente.</p>
                        <button class="btn" onclick="restartExercises()">Reiniciar Desafíos</button>
                    </div>
                `;
                return;
            }
            
            const exercise = exercises[currentExercise];
            const container = document.getElementById('exerciseContainer');
            
            container.innerHTML = `
                <div class="exercise-card">
                    <h4 class="exercise-title">Pregunta ${currentExercise + 1} de ${exercises.length}</h4>
                    <p><strong>${exercise.question}</strong></p>
                    <div style="margin: 15px 0;">
                        ${exercise.options.map((option, index) => `
                            <button class="btn btn-secondary" onclick="answerExercise(${index})" style="display: block; width: 100%; margin: 5px 0; text-align: left;">
                                ${String.fromCharCode(65 + index)}. ${option}
                            </button>
                        `).join('')}
                    </div>
                    <div id="exerciseResult"></div>
                </div>
            `;
            
            updateProgress();
        }

        function answerExercise(selectedIndex) {
            const exercise = exercises[currentExercise];
            const resultDiv = document.getElementById('exerciseResult');
            
            if (selectedIndex === exercise.correct) {
                resultDiv.innerHTML = `
                    <div class="alert alert-success">
                        <strong>¡Correcto! 🎉</strong><br>
                        ${exercise.explanation}
                    </div>
                `;
                gameStats.correctAnswers++;
                gameStats.score += 20;
            } else {
                resultDiv.innerHTML = `
                    <div class="alert alert-warning">
                        <strong>Incorrecto 😔</strong><br>
                        La respuesta correcta es: <strong>${exercise.options[exercise.correct]}</strong><br>
                        ${exercise.explanation}
                    </div>
                `;
            }
            
            updateStats();
            
            setTimeout(() => {
                currentExercise++;
                loadExercise();
            }, 3000);
        }

        function updateProgress() {
            const progress = (currentExercise / exercises.length) * 100;
            document.getElementById('progressFill').style.width = progress + '%';
        }

        function restartExercises() {
            currentExercise = 0;
            loadExercise();
        }

        // Inicialización
        updateStats();
        loadExercise();
        
        // Event listeners
        document.getElementById('dataValue').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addDataPoint();
            }
        });
