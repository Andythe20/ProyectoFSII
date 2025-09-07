// Codigo para modificar el apartado de iniciar sesion en el navbar

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM del navbar
    const loginSection = document.getElementById('loginSection');
    const userMenu = document.getElementById('userMenu');
    const welcomeText = document.getElementById('welcomeText');
    const logoutLink = document.getElementById('logoutLink');

    // Revisar si hay un usuario logueado en localStorage
    const userEmail = localStorage.getItem('currentUserEmail');
    const userFirstName = localStorage.getItem('currentUserFirstName');

    if (userEmail && userFirstName) {
        // Si hay un usuario, actualiza el navbar
        if (loginSection) {
            loginSection.style.display = 'none'; // Oculta la sección de "Iniciar Sesión"
        }
        if (userMenu && welcomeText) {
            userMenu.style.display = 'block'; // Muestra el menú de usuario
            welcomeText.textContent = `¡Hola, ${userFirstName}!`; // Muestra el nombre
        }
    } else {
        // Si no hay usuario, asegura que el navbar se vea por defecto
        if (loginSection) {
            loginSection.style.display = 'block';
        }
        if (userMenu) {
            userMenu.style.display = 'none';
        }
    }

    // Lógica para cerrar la sesión
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault(); // Evita el comportamiento de enlace
            localStorage.removeItem('currentUserEmail');
            localStorage.removeItem('currentUserFirstName');
            window.location.href = '../index.html'; // Redirige a la página principal
        });
    }
});
