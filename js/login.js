/**
 * js/login.js
 * Maneja el inicio de sesión (versión localStorage).
 * VERSIÓN ACTUALIZADA: Valida contra usuarios guardados y crea una sesión.
 */
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');

    function handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            alert('Por favor, complete todos los campos');
            return;
        }
        
        loginButton.textContent = "Verificando...";
        loginButton.disabled = true;
        
        // --- Lógica de validación ---
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('logitrack_users')) || [];
            
            // Buscar al usuario
            const foundUser = users.find(user => user.username === username && user.password === password);
            
            if (foundUser) {
                // ¡Éxito! Guardar sesión
                localStorage.setItem('logitrack_session', JSON.stringify({
                    username: foundUser.username,
                    fullname: foundUser.fullname
                }));
                
                loginButton.textContent = "✓ Acceso confirmado";
                loginButton.style.backgroundColor = "#2e7d32";
                
                // Redireccionar a la app principal
                setTimeout(() => {
                    window.location.href = "index.html"; 
                }, 1000);
                
            } else {
                // Falla
                alert('Usuario o contraseña incorrectos.');
                loginButton.textContent = "Iniciar Sesión";
                loginButton.disabled = false;
            }
        }, 1000); // Simular demora de red
    }

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    
    // Efectos de focus (sin cambios)
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'translateY(-2px)';
            input.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'translateY(0)';
        });
    });
});