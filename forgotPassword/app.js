document.addEventListener('DOMContentLoaded', () => {
    const BtnSendMessageRecover = $('BtnSendMessageRecover');

    // Añadimos el evento de clic al botón de login
    BtnSendMessageRecover.addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir el envío del formulario

        // Elementos del DOM
        const emailInput = $('recoveryEmail');

        // Validar campos
        if (emailInput.value.trim() === '' || !validateEmail(emailInput.value)) {
            Swal.fire({
                icon: 'error',
                title: 'Información incorrecta o incompleta',
                text: 'Por favor, completa con tu correo electrónico.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#8B4513'
            });
            return;
        }

        // Aquí iría la lógica para autenticar al usuario
        // Por ejemplo, enviar una solicitud al servidor

        Swal.fire({
            icon: 'success',
            title: 'Validación exitosa',
            text: "Se ha enviado información de recuperación a su correo electrónico.",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        }).then(() => {
            window.location.href = '../login/login.html'; // Redirigir a la vista de login
        });
    });

    // Función para validar el formato del correo electrónico
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    };

    // Función para obtener un elemento por su ID
    function $(element) {
        return document.getElementById(element);
    }
});

