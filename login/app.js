document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const emailInput = $('email');
    const passwordInput = $('password');
    const btnLogin = $('login');

    // Añadimos el evento de clic al botón de login
    btnLogin.addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir el envío del formulario

        // Validar campos
        if (emailInput.value.trim() === '' || passwordInput.value.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Campos Vacíos',
                text: 'Por favor, completa todos los campos.',
                confirmButtonColor: '#8B4513'
            });
            return;
        }

        // Logica de autenticacion usuario (Local Storage)
        const users = JSON.parse(localStorage.getItem('users')) || []; // Traigo la lista de los usuarios registrados

        // Buscar si el usuario existe y si la contraseña es correcta
        const foundUser = users.find(
            user => user.email === emailInput.value && user.password === passwordInput.value
        );

        if (foundUser) {
            // Si se encuentra al usuario, inicia la sesión
            localStorage.setItem('currentUserEmail', foundUser.email);
            localStorage.setItem('currentUserFirstName', foundUser.firstName);

            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: `¡Bienvenido, ${foundUser.firstName}! Has iniciado sesión correctamente.`,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            }).then(() => {
                window.location.href = '../index.html'; // Redirigir a la vista de usuario
            });

        } else {
            // Si no se encuentra, muestra un mensaje de error
            Swal.fire({
                icon: 'error',
                title: 'Error de credenciales',
                text: 'El correo electrónico o la contraseña son incorrectos.',
                confirmButtonColor: '#8B4513'
            });
        }

    });

    // Función para obtener un elemento por su ID
    function $(element) {
        return document.getElementById(element);
    }
});

