// Global Variables
let currentUserType = 'student';
let currentUser = null;

// Mock Users Database
const mockUsers = [
    { id: 1, email: 'profesor@escuela.com', password: '123456', type: 'teacher', firstName: 'María', lastName: 'González' },
    { id: 2, email: 'estudiante@escuela.com', password: '123456', type: 'student', firstName: 'Carlos', lastName: 'Rodríguez' },
    { id: 3, email: 'admin@escuela.com', password: '123456', type: 'admin', firstName: 'Ana', lastName: 'Martínez' }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    checkExistingSession();
    setupEventListeners();
});

function setupEventListeners() {
    // User Type Selectors
    document.querySelectorAll('.user-type').forEach(button => {
        button.addEventListener('click', function() {
            const form = this.getAttribute('data-form') || 'login';
            selectUserType(this.getAttribute('data-type'), form);
        });
    });

    // Password Toggle
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            togglePasswordVisibility(this.getAttribute('data-target'));
        });
    });

    // Form Submissions
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
    document.getElementById('forgotPasswordFormElement').addEventListener('submit', handleForgotPassword);
    document.getElementById('resetPasswordFormElement').addEventListener('submit', handleResetPassword);
}

function selectUserType(type, form = 'login') {
    currentUserType = type;
    
    const selector = form === 'register' ? 
        '#registerForm .user-type-selector' : 
        '#loginForm .user-type-selector';
        
    document.querySelectorAll(`${selector} .user-type`).forEach(button => {
        button.classList.remove('active');
    });
    
    document.querySelector(`${selector} [data-type="${type}"]`).classList.add('active');
}

function togglePasswordVisibility(targetId) {
    const input = document.getElementById(targetId);
    const icon = document.querySelector(`[data-target="${targetId}"]`);
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function showMessage(type, text) {
    const messageEl = document.getElementById('message');
    const messageTextEl = document.getElementById('messageText');
    const icon = messageEl.querySelector('i');
    
    messageEl.className = `message ${type} show`;
    messageTextEl.textContent = text;
    
    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
    } else {
        icon.className = 'fas fa-exclamation-circle';
    }
    
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 5000);
}

function showLoading(buttonId, show = true) {
    const button = document.getElementById(buttonId);
    const span = button.querySelector('span');
    const icon = button.querySelector('i');
    
    if (show) {
        button.disabled = true;
        icon.className = 'spinner';
    } else {
        button.disabled = false;
        // Restore original icon based on button
        if (buttonId === 'loginBtn') icon.className = 'fas fa-arrow-right';
        else if (buttonId === 'registerBtn') icon.className = 'fas fa-user-check';
        else if (buttonId === 'forgotBtn') icon.className = 'fas fa-arrow-right';
        else if (buttonId === 'resetBtn') icon.className = 'fas fa-check-circle';
    }
}

// Navigation Functions
function showLogin() {
    hideAllForms();
    document.getElementById('loginForm').classList.remove('hidden');
}

function showRegister() {
    hideAllForms();
    document.getElementById('registerForm').classList.remove('hidden');
}

function showForgotPassword() {
    hideAllForms();
    document.getElementById('forgotPasswordForm').classList.remove('hidden');
}

function showResetPassword() {
    hideAllForms();
    document.getElementById('resetPasswordForm').classList.remove('hidden');
}

function showDashboard() {
    hideAllForms();
    document.getElementById('dashboard').classList.add('show');
}

function hideAllForms() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('forgotPasswordForm').classList.add('hidden');
    document.getElementById('resetPasswordForm').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('show');
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    showLoading('loginBtn', true);

    setTimeout(() => {
        let usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
        let userIndex = usersDB.findIndex(u =>
            u.email === email &&
            u.password === password &&
            u.type === currentUserType
        );
        let user = userIndex !== -1 ? usersDB[userIndex] : null;

        if (!user) {
            user = mockUsers.find(u =>
                u.email === email &&
                u.password === password &&
                u.type === currentUserType
            );
        } else {
            // Registrar visita
            const today = new Date().toISOString().slice(0, 10);
            if (!user.metrics.visits.includes(today)) {
                user.metrics.visits.push(today);
                usersDB[userIndex] = user;
                localStorage.setItem('usersDB', JSON.stringify(usersDB));
            }
        }

        if (user) {
            currentUser = { ...user };
            delete currentUser.password;

            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            }

            showMessage('success', `¡Bienvenido ${currentUser.firstName}!`);
            setTimeout(() => {
                if (currentUser.type === 'student') {
                    window.location.href = "student_dashboard.html";
                } else if (currentUser.type === 'teacher') {
                    // window.location.href = "teacher_dashboard.html";
                } else if (currentUser.type === 'admin') {
                    // window.location.href = "admin_dashboard.html";
                } else {
                    setupDashboard();
                    showDashboard();
                }
            }, 1500);
        } else {
            showMessage('error', 'Credenciales incorrectas o tipo de usuario incorrecto');
        }

        showLoading('loginBtn', false);
    }, 1500);
}

async function handleRegister(e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const institution = document.getElementById('institution').value;
    const grade = parseInt(document.getElementById('registerGrade').value, 10);
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validaciones
    if (password !== confirmPassword) {
        showMessage('error', 'Las contraseñas no coinciden');
        return;
    }
    if (password.length < 6) {
        showMessage('error', 'La contraseña debe tener al menos 6 caracteres');
        return;
    }
    if (!agreeTerms) {
        showMessage('error', 'Debes aceptar los términos y condiciones');
        return;
    }
    if (!grade || grade < 6 || grade > 11) {
        showMessage('error', 'Selecciona un grado válido');
        return;
    }

    showLoading('registerBtn', true);

    setTimeout(() => {
        let usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
        if (usersDB.some(u => u.email === email)) {
            showMessage('error', 'Este email ya está registrado');
            showLoading('registerBtn', false);
            return;
        }
        // Crear nuevo usuario con métricas iniciales
        const newUser = {
            id: usersDB.length ? usersDB[usersDB.length - 1].id + 1 : 1,
            firstName,
            lastName,
            email,
            password,
            institution,
            grade,
            avatar: firstName[0],
            type: currentUserType,
            metrics: {
                totalPoints: 0,
                gamesCompleted: 0,
                level: grade,
                streak: 0,
                visits: [],
                progress: {
                    algebra: 0,
                    geometria: 0,
                    estadistica: 0
                }
            }
        };
        usersDB.push(newUser);
        localStorage.setItem('usersDB', JSON.stringify(usersDB));

        document.getElementById('registerFormElement').reset();
        selectUserType('student', 'register');
        showMessage('success', '¡Cuenta creada exitosamente! Puedes iniciar sesión ahora.');
        setTimeout(() => {
            showLogin();
        }, 2000);

        showLoading('registerBtn', false);
    }, 2000);
}

async function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    showLoading('forgotBtn', true);

    setTimeout(() => {
        // Buscar usuario en LocalStorage
        const usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
        const user = usersDB.find(u => u.email === email);

        if (user) {
            // Simula envío de código (puedes guardar el código en LocalStorage si lo deseas)
            localStorage.setItem('resetEmail', email);
            showMessage('success', 'Se ha enviado un enlace de recuperación a tu email');
            setTimeout(() => {
                showResetPassword();
            }, 2000);
        } else {
            showMessage('error', 'No se encontró una cuenta con este email');
        }

        showLoading('forgotBtn', false);
    }, 1500);
}

async function handleResetPassword(e) {
    e.preventDefault();

    const token = document.getElementById('resetToken').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;

    if (password !== confirmPassword) {
        showMessage('error', 'Las contraseñas no coinciden');
        return;
    }

    if (password.length < 6) {
        showMessage('error', 'La contraseña debe tener al menos 6 caracteres');
        return;
    }

    showLoading('resetBtn', true);

    setTimeout(() => {
        // Simula validación de código y cambio de contraseña
        const email = localStorage.getItem('resetEmail');
        let usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
        const userIndex = usersDB.findIndex(u => u.email === email);

        if (token.length >= 4 && userIndex !== -1) {
            usersDB[userIndex].password = password;
            localStorage.setItem('usersDB', JSON.stringify(usersDB));
            localStorage.removeItem('resetEmail');
            document.getElementById('resetPasswordFormElement').reset();
            showMessage('success', '¡Contraseña actualizada exitosamente!');
            setTimeout(() => {
                showLogin();
            }, 2000);
        } else {
            showMessage('error', 'Código de verificación inválido o usuario no encontrado');
        }

        showLoading('resetBtn', false);
    }, 1500);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    showMessage('success', 'Sesión cerrada correctamente');
    setTimeout(() => {
        showLogin();
    }, 1000);
}

function checkExistingSession() {
    const savedUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || 'null');
    if (savedUser) {
        currentUser = savedUser;
        setupDashboard();
        showDashboard();
    }
}

function setupDashboard() {
    if (!currentUser) return;
    
    // Setup avatar
    const avatar = document.getElementById('dashboardAvatar');
    avatar.textContent = `${currentUser.firstName[0]}${currentUser.lastName[0]}`;
    
    // Setup welcome message
    const welcome = document.getElementById('dashboardWelcome');
    welcome.textContent = `¡Bienvenido, ${currentUser.firstName}!`;
    
    // Setup role
    const role = document.getElementById('dashboardRole');
    const roleText = getUserTypeLabel(currentUser.type);
    const roleIcon = getUserTypeIcon(currentUser.type);
    role.innerHTML = `<i class="${roleIcon}"></i><span>${roleText}</span>`;
    
    // Setup user info
    const userInfo = document.getElementById('userInfo');
    userInfo.innerHTML = `
        <strong>Nombre:</strong> ${currentUser.firstName} ${currentUser.lastName}<br>
        <strong>Email:</strong> ${currentUser.email}<br>
        <strong>Tipo:</strong> ${roleText}<br>
        <strong>ID:</strong> ${currentUser.id}
    `;
    
    // Setup quick actions based on user type
    setupQuickActions();
}

function setupQuickActions() {
    const quickActions = document.getElementById('quickActions');
    let actionsHTML = '';
    
    switch (currentUser.type) {
        case 'teacher':
            actionsHTML = `
                <div class="dashboard-card">
                    <h4>📊 Dashboard Docente</h4>
                    <p>Accede a tu panel de control con métricas de estudiantes y rendimiento académico.</p>
                </div>
                <div class="dashboard-card">
                    <h4>👥 Gestionar Estudiantes</h4>
                    <p>Administra la lista de estudiantes, calificaciones y seguimiento individual.</p>
                </div>
                <div class="dashboard-card">
                    <h4>📝 Crear Evaluación</h4>
                    <p>Diseña y programa nuevas evaluaciones, exámenes y actividades académicas.</p>
                </div>
                <div class="dashboard-card">
                    <h4>📚 Gestionar Cursos</h4>
                    <p>Administra el contenido de tus cursos, materiales y cronograma de clases.</p>
                </div>
            `;
            break;
        case 'student':
            actionsHTML = `
                <div class="dashboard-card">
                    <h4>📚 Mis Cursos</h4>
                    <p>Accede a todos tus cursos matriculados, materiales y contenido académico.</p>
                </div>
                <div class="dashboard-card">
                    <h4>📊 Mis Calificaciones</h4>
                    <p>Consulta tus notas, promedios y seguimiento de tu rendimiento académico.</p>
                </div>
                <div class="dashboard-card">
                    <h4>📅 Mi Horario</h4>
                    <p>Revisa tu horario de clases, fechas de exámenes y eventos académicos.</p>
                </div>
                <div class="dashboard-card">
                    <h4>📋 Tareas Pendientes</h4>
                    <p>Consulta las tareas y proyectos que tienes pendientes por entregar.</p>
                </div>
            `;
            break;
        case 'admin':
            actionsHTML = `
                <div class="dashboard-card">
                    <h4>🏫 Panel Administrativo</h4>
                    <p>Accede al panel de control principal con métricas y estadísticas generales.</p>
                </div>
                <div class="dashboard-card">
                    <h4>👥 Gestionar Usuarios</h4>
                    <p>Administra estudiantes, profesores y personal de la institución educativa.</p>
                </div>
                <div class="dashboard-card">
                    <h4>📈 Reportes</h4>
                    <p>Genera reportes detallados de rendimiento, asistencia y estadísticas académicas.</p>
                </div>
                <div class="dashboard-card">
                    <h4>⚙️ Configuración</h4>
                    <p>Configura parámetros del sistema, períodos académicos y configuración general.</p>
                </div>
            `;
            break;
        default:
            actionsHTML = `
                <div class="dashboard-card">
                    <h4>👤 Perfil de Usuario</h4>
                    <p>Administra tu información personal y configuración de cuenta.</p>
                </div>
            `;
    }
    
    quickActions.innerHTML = actionsHTML;
}

function getUserTypeLabel(type) {
    switch(type) {
        case 'teacher': return 'Profesor';
        case 'student': return 'Estudiante';
        case 'admin': return 'Administrador';
        default: return 'Usuario';
    }
}

function getUserTypeIcon(type) {
    switch(type) {
        case 'teacher': return 'fas fa-chalkboard-teacher';
        case 'student': return 'fas fa-graduation-cap';
        case 'admin': return 'fas fa-shield-alt';
        default: return 'fas fa-user';
    }
}

// Auto-fill demo credentials (for testing)
function fillDemoCredentials(userType) {
    const user = mockUsers.find(u => u.type === userType);
    if (user) {
        document.getElementById('loginEmail').value = user.email;
        document.getElementById('loginPassword').value = user.password;
        selectUserType(userType);
    }
}

// Keyboard shortcuts (optional)
document.addEventListener('keydown', function(e) {
    // Alt + 1/2/3 to switch user types quickly
    if (e.altKey) {
        switch(e.key) {
            case '1':
                fillDemoCredentials('student');
                break;
            case '2':
                fillDemoCredentials('teacher');
                break;
            case '3':
                fillDemoCredentials('admin');
                break;
        }
    }
});

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Add real-time validation
document.addEventListener('input', function(e) {
    if (e.target.type === 'email') {
        const isValid = validateEmail(e.target.value);
        e.target.style.borderColor = isValid ? '#e1e5e9' : '#dc3545';
    }
    
    if (e.target.id === 'confirmPassword' || e.target.id === 'confirmNewPassword') {
        const passwordField = e.target.id === 'confirmPassword' ? 
            document.getElementById('registerPassword') : 
            document.getElementById('newPassword');
        
        const match = e.target.value === passwordField.value;
        e.target.style.borderColor = match ? '#e1e5e9' : '#dc3545';
    }
});

// Add loading states for better UX
function addLoadingState(element) {
    element.style.opacity = '0.7';
    element.style.pointerEvents = 'none';
}

function removeLoadingState(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
}

// Auto-hide messages after 5 seconds
function autoHideMessage() {
    const messageEl = document.getElementById('message');
    if (messageEl.classList.contains('show')) {
        setTimeout(() => {
            messageEl.classList.remove('show');
        }, 5000);
    }
}

// Initialize tooltips for better UX (optional)
function initTooltips() {
    const tooltips = document.querySelectorAll('[title]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            // Could implement custom tooltip here
        });
    });
}

// Call initialization functions
initTooltips();

console.log('🚀 Matejuegos inicializado correctamente');
console.log('💡 Atajos de teclado: Alt+1 (Estudiante), Alt+2 (Profesor), Alt+3 (Admin)');
