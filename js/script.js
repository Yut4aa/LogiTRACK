/**
 * js/script.js
 * Script principal de la app (versión localStorage).
 * VERSIÓN ACTUALIZADA: Protege la ruta, muestra el saludo y limpia sesión.
 */

// Variables globales
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
let currentDate = new Date();

/**
 * Muestra una sección de la app y oculta las demás.
 * @param {string} sectionId El ID de la sección a mostrar ('upload', 'calendar', 'vehicles').
 */
function showSection(sectionId) {
    const trucks = JSON.parse(localStorage.getItem('logitrack_trucks')) || [];
    if (trucks.length === 0 && (sectionId === 'upload' || sectionId === 'calendar')) {
        alert('Debe agregar al menos un camión para usar esta sección.');
        showSection('vehicles'); 
        return;
    }

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }
}

/**
 * Cierra la sesión (simulada) y redirige al login.
 * VERSIÓN ACTUALIZADA: Limpia la sesión de localStorage.
 */
function logout() {
    localStorage.removeItem('logitrack_session'); // Limpiar sesión
    window.location.href = 'login.html';
}

/**
 * Habilita o deshabilita los botones de la barra lateral
 * basado en si existen camiones registrados.
 */
function updateSidebarButtons() {
    const trucks = JSON.parse(localStorage.getItem('logitrack_trucks')) || [];
    const uploadBtn = document.getElementById('btn-upload');
    const calendarBtn = document.getElementById('btn-calendar');
    
    if (trucks.length > 0) {
        if (uploadBtn) uploadBtn.disabled = false;
        if (calendarBtn) calendarBtn.disabled = false;
    } else {
        if (uploadBtn) uploadBtn.disabled = true;
        if (calendarBtn) calendarBtn.disabled = true;
    }
    return trucks.length > 0;
}

/**
 * ==== NUEVA FUNCIÓN ====
 * Muestra el mensaje de bienvenida en el sidebar.
 */
function displayWelcomeMessage() {
    const session = JSON.parse(localStorage.getItem('logitrack_session'));
    const welcomeEl = document.getElementById('sidebar-welcome');

    if (!session || !welcomeEl) {
        // Si no hay sesión, proteger la página
        alert('Debe iniciar sesión para acceder a la aplicación.');
        window.location.href = 'login.html';
        return;
    }
    
    // Usar el nombre completo. Si no existe, usar el username.
    const name = session.fullname || session.username || 'Usuario';
    
    // Dividir el nombre para mostrar solo el primero (opcional)
    const firstName = name.split(' ')[0];
    
    welcomeEl.innerHTML = `Hola, <strong>${firstName}</strong>`;
}

// --- Código principal (al cargar la página) ---
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Verificar sesión y mostrar saludo (ESTO ES NUEVO)
    displayWelcomeMessage();

    // 2. Inicializar AOS (animaciones)
    AOS.init({
        duration: 800,
        once: true
    });

    // 3. Crear estrellas (si el contenedor existe)
    const starsContainer = document.getElementById('stars-container');
    if (starsContainer) {
        const starCount = 50; 
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            const size = Math.random() * 3 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 5 + 3;
            const delay = Math.random() * 5;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.setProperty('--duration', `${duration}s`);
            star.style.animationDelay = `${delay}s`;
            starsContainer.appendChild(star);
        }
    }
    
    // 4. Inicializar iconos Feather
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // 5. Cargar datos
    if (typeof renderCalendar === 'function') {
        renderCalendar();
    }
    if (typeof renderTrucksList === 'function') {
        renderTrucksList();
    }
    if (typeof populateTruckSelectForUpload === 'function') {
        populateTruckSelectForUpload();
    }
    
    // 6. Comprobar si hay camiones al cargar
    const hasTrucks = updateSidebarButtons();
    
    // 7. Decidir qué sección mostrar al inicio
    if (!hasTrucks) {
        showSection('vehicles');
    } else {
        showSection('upload'); // Mostrar 'upload' por defecto si hay camiones
    }
});