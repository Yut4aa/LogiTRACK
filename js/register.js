/**
 * js/register.js
 * Maneja el registro de usuarios (versión localStorage).
 * VERSIÓN ACTUALIZADA: Guarda usuarios reales en localStorage.
 */
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerButton = document.getElementById('registerButton');

    function handleRegister(event) {
        event.preventDefault();
        
        const fullname = document.getElementById('fullname').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const terms = document.getElementById('terms').checked;
        
        if (!fullname || !username || !email || !password || !confirmPassword) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }
        if (!terms) {
            alert('Debe aceptar los términos y condiciones.');
            return;
        }

        registerButton.textContent = "Creando cuenta...";
        registerButton.disabled = true;
        
        // --- Lógica de guardado ---
        try {
            const users = JSON.parse(localStorage.getItem('logitrack_users')) || [];
            
            // Comprobar si el usuario o email ya existen
            if (users.some(user => user.username === username)) {
                alert('El nombre de usuario ya está en uso.');
                registerButton.textContent = "Crear Cuenta";
                registerButton.disabled = false;
                return;
            }
            if (users.some(user => user.email === email)) {
                alert('El correo electrónico ya está registrado.');
                registerButton.textContent = "Crear Cuenta";
                registerButton.disabled = false;
                return;
            }

            // Agregar nuevo usuario (contraseña se guarda en texto plano, NO SEGURO para producción)
            const newUser = { fullname, username, email, password };
            users.push(newUser);
            localStorage.setItem('logitrack_users', JSON.stringify(users));

            // Simular éxito
            setTimeout(() => {
                registerButton.textContent = "✓ Cuenta creada";
                registerButton.style.backgroundColor = "#2e7d32";
                
                alert('¡Cuenta creada con éxito! Serás redirigido al login.');
                
                setTimeout(() => {
                    window.location.href = "login.html"; // Redirigir al login
                }, 1500);

            }, 1000);

        } catch (error) {
            alert('Ha ocurrido un error al guardar los datos.');
            registerButton.textContent = "Crear Cuenta";
            registerButton.disabled = false;
        }
    }

    // Usamos 'submit' en el formulario para mejor accesibilidad
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    
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