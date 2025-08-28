/* Extracted from games/mercado_virtual.html on 2025-08-28T03:35:45.665Z */
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
            money: 10000,
            level: 1,
            points: 0,
            correctAnswers: 0,
            cart: {},
            currentProblem: null,
            products: [
                { id: 1, name: 'Manzanas', emoji: '🍎', basePrice: 1200, unit: 'kg' },
                { id: 2, name: 'Bananos', emoji: '🍌', basePrice: 800, unit: 'kg' },
                { id: 3, name: 'Leche', emoji: '🥛', basePrice: 3500, unit: 'litro' },
                { id: 4, name: 'Pan', emoji: '🍞', basePrice: 2000, unit: 'unidad' },
                { id: 5, name: 'Huevos', emoji: '🥚', basePrice: 4500, unit: 'docena' },
                { id: 6, name: 'Arroz', emoji: '🍚', basePrice: 1800, unit: 'kg' },
                { id: 7, name: 'Pollo', emoji: '🍗', basePrice: 8000, unit: 'kg' },
                { id: 8, name: 'Tomates', emoji: '🍅', basePrice: 1500, unit: 'kg' }
            ]
        };

        // Inicializar el juego
        function initGame() {
            displayProducts();
            updateStats();
            generateProblem();
        }

        // Mostrar productos
        function displayProducts() {
            const grid = document.getElementById('productsGrid');
            grid.innerHTML = '';
            
            gameData.products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.onclick = () => addToCart(product.id);
                
                productDiv.innerHTML = `
                    <span class="product-emoji">${product.emoji}</span>
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">$${product.basePrice} / ${product.unit}</div>
                `;
                
                grid.appendChild(productDiv);
            });
        }

        // Agregar al carrito
        function addToCart(productId) {
            const product = gameData.products.find(p => p.id === productId);
            if (!product) return;
            
            if (gameData.cart[productId]) {
                gameData.cart[productId].quantity += 1;
            } else {
                gameData.cart[productId] = {
                    product: product,
                    quantity: 1
                };
            }
            
            updateCart();
            generateProblem();
        }

        // Actualizar carrito
        function updateCart() {
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');
            
            if (Object.keys(gameData.cart).length === 0) {
                cartItems.innerHTML = '<p style="text-align: center; color: #718096;">Tu carrito está vacío</p>';
                cartTotal.innerHTML = 'Total: $0';
                return;
            }
            
            let html = '';
            let total = 0;
            
            for (const [productId, item] of Object.entries(gameData.cart)) {
                const subtotal = item.product.basePrice * item.quantity;
                total += subtotal;
                
                html += `
                    <div class="cart-item">
                        <div>
                            <strong>${item.product.name}</strong><br>
                            $${item.product.basePrice} × ${item.quantity}
                        </div>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="changeQuantity(${productId}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="changeQuantity(${productId}, 1)">+</button>
                        </div>
                    </div>
                `;
            }
            
            cartItems.innerHTML = html;
            cartTotal.innerHTML = `Total: $${total.toLocaleString()}`;
        }

        // Cambiar cantidad
        function changeQuantity(productId, change) {
            if (gameData.cart[productId]) {
                gameData.cart[productId].quantity += change;
                
                if (gameData.cart[productId].quantity <= 0) {
                    delete gameData.cart[productId];
                }
                
                updateCart();
                generateProblem();
            }
        }

        // Vaciar carrito
        function clearCart() {
            gameData.cart = {};
            updateCart();
            generateProblem();
        }

        // Generar problema matemático
        function generateProblem() {
            const problemText = document.getElementById('problemText');
            const answerInput = document.getElementById('answerInput');
            const feedback = document.getElementById('feedback');
            
            feedback.style.display = 'none';
            answerInput.value = '';
            
            if (Object.keys(gameData.cart).length === 0) {
                problemText.innerHTML = '¡Selecciona productos para comenzar!';
                gameData.currentProblem = null;
                return;
            }
            
            const problemTypes = [
                generatePercentageProblem,
                generateProportionProblem,
                generateDiscountProblem
            ];
            
            const problemGenerator = problemTypes[Math.floor(Math.random() * problemTypes.length)];
            gameData.currentProblem = problemGenerator();
            problemText.innerHTML = gameData.currentProblem.question;
        }

        // Problema de porcentajes
        function generatePercentageProblem() {
            const cartItems = Object.values(gameData.cart);
            const randomItem = cartItems[Math.floor(Math.random() * cartItems.length)];
            const percentage = [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)];
            const total = randomItem.product.basePrice * randomItem.quantity;
            const result = (total * percentage / 100);
            
            return {
                question: `Si el ${percentage}% del costo de ${randomItem.product.name} (${randomItem.quantity} ${randomItem.product.unit}) es para impuestos, ¿cuánto pagas en impuestos?`,
                answer: Math.round(result),
                explanation: `${percentage}% de $${total} = $${total} × ${percentage}/100 = $${Math.round(result)}`
            };
        }

        // Problema de proporciones
        function generateProportionProblem() {
            const cartItems = Object.values(gameData.cart);
            const randomItem = cartItems[Math.floor(Math.random() * cartItems.length)];
            const multiplier = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
            const newQuantity = randomItem.quantity * multiplier;
            const result = randomItem.product.basePrice * newQuantity;
            
            return {
                question: `Si ${randomItem.quantity} ${randomItem.product.unit} de ${randomItem.product.name} cuesta $${randomItem.product.basePrice * randomItem.quantity}, ¿cuánto costarán ${newQuantity} ${randomItem.product.unit}?`,
                answer: result,
                explanation: `Si ${randomItem.quantity} ${randomItem.product.unit} = $${randomItem.product.basePrice * randomItem.quantity}, entonces ${newQuantity} ${randomItem.product.unit} = $${result}`
            };
        }

        // Problema de descuentos
        function generateDiscountProblem() {
            const cartItems = Object.values(gameData.cart);
            const randomItem = cartItems[Math.floor(Math.random() * cartItems.length)];
            const discount = [5, 10, 15, 20, 25][Math.floor(Math.random() * 5)];
            const total = randomItem.product.basePrice * randomItem.quantity;
            const discountAmount = total * discount / 100;
            const result = total - discountAmount;
            
            return {
                question: `${randomItem.product.name} (${randomItem.quantity} ${randomItem.product.unit}) tiene un descuento del ${discount}%. Si el precio original es $${total}, ¿cuál es el precio final?`,
                answer: Math.round(result),
                explanation: `Precio original: $${total}. Descuento: ${discount}% = $${Math.round(discountAmount)}. Precio final: $${total} - $${Math.round(discountAmount)} = $${Math.round(result)}`
            };
        }

        // Verificar respuesta
        function checkAnswer() {
            if (!gameData.currentProblem) return;
            
            const userAnswer = parseInt(document.getElementById('answerInput').value);
            const feedback = document.getElementById('feedback');
            
            if (isNaN(userAnswer)) {
                feedback.innerHTML = '¡Por favor ingresa un número válido!';
                feedback.className = 'feedback incorrect';
                feedback.style.display = 'block';
                return;
            }
            
            const tolerance = Math.max(1, Math.round(gameData.currentProblem.answer * 0.02)); // 2% de tolerancia
            
            if (Math.abs(userAnswer - gameData.currentProblem.answer) <= tolerance) {
                feedback.innerHTML = `¡Correcto! 🎉<br><small>${gameData.currentProblem.explanation}</small>`;
                feedback.className = 'feedback correct';
                gameData.points += 100;
                gameData.correctAnswers++;
                
                if (gameData.correctAnswers >= 5) {
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
            gameData.money += 5000;
            alert(`¡Felicitaciones! Has alcanzado el nivel ${gameData.level} 🎊\n¡Recibes $5000 de bonificación!`);
            updateStats();
        }

        // Actualizar estadísticas
        function updateStats() {
            document.getElementById('money').textContent = gameData.money.toLocaleString();
            document.getElementById('level').textContent = gameData.level;
            document.getElementById('points').textContent = gameData.points;
            document.getElementById('correct').textContent = gameData.correctAnswers;
            
            const progress = (gameData.correctAnswers / 5) * 100;
            document.getElementById('levelProgress').style.width = progress + '%';
        }

        // Inicializar cuando cargue la página
        window.onload = initGame;
