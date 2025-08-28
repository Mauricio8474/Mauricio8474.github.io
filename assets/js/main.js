// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Counter animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (element.id === 'success-rate') {
            element.textContent = Math.floor(current) + '%';
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Animate counters when stats section is visible
const statsSection = document.querySelector('.stats-section');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            animateCounter(document.getElementById('students-count'), 2543);
            animateCounter(document.getElementById('games-completed'), 15762);
            animateCounter(document.getElementById('schools-count'), 127);
            animateCounter(document.getElementById('success-rate'), 94);
            statsAnimated = true;
        }
    });
});

statsObserver.observe(statsSection);

// Grade selection
function selectGrade(grade) {
    // alert(`¡Excelente! Seleccionaste ${grade}° grado. 🎯\n\nAquí encontrarás juegos diseñados específicamente para tu nivel educativo.\n\n¿Te gustaría que desarrolle algún juego específico para este grado?`);
}

// Play game function
function playGame(gameId) {
    if (gameId === 'detective-datos') {
        window.location.href = 'detective-datos-game.html';
    } else {
        //alert(`🎮 ¡El juego ${gameId} se está cargando!\n\n¿Te gustaría que desarrolle este juego como el próximo paso?`);
    }
}

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(15, 23, 42, 0.98)';
    } else {
        header.style.background = 'rgba(15, 23, 42, 0.95)';
    }
});

// Add some interactive elements
document.querySelectorAll('.math-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05) rotateY(5deg)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1) rotateY(0deg)';
    });
});

console.log('🚀 MateJuegos - Página principal cargada exitosamente');
