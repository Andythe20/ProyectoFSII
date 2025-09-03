//FUNCION IIFE
(function () {
  const form = document.getElementById("contactForm");
  const alerta = document.getElementById("alerta");

  const nombre = document.getElementById("nombre");
  const correo = document.getElementById("correo");
  const mensaje = document.getElementById("mensaje");

  function setOk(element) {
    element.classList.remove("is-invalid");
    element.classList.add("is-valid");
  }

  function setError(element, msg) {
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");

    const fb = element.parentElement.querySelector(".invalid");

    if (fb && msg) fb.textContent = msg;
  }

  function validarNombre() {
    const name = nombre.value.trim();

    if (name.length < 3) {
      setError(nombre, "El nombre debe tener al menos 3 carácteres");
      return false;
    }

    setOk(nombre);
    return true;
  }

  function validarCorreo() {
    const v = correo.value.trim();
    const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!rx.test(v)) {
      setError(correo, "Ingrese un correo válido (ej: example@gmail.com).");
      return false;
    }

    setOk(correo);
    return true;
  }

  function validarMensaje() {
    const v = mensaje.value.trim();

    if (v.length < 10) {
      setError(mensaje, "El mensaje debe tener más de 10 carácteres.");
      return false;
    }

    if (v.length > 50) {
      setError(mensaje, "El mensaje debe tener menos de 50 carácteres.");
      return false;
    }

    setOk(mensaje);
    return true;
  }

  //feedback en tiempo real
  nombre.addEventListener("input", validarNombre);
  correo.addEventListener("input", validarCorreo);
  mensaje.addEventListener("input", validarMensaje);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    alerta.innerHTML = "";

    const ok = validarNombre() && validarCorreo() && validarMensaje();

    if (ok) {
      Swal.fire({
        title: "<span class='swal-title-custom'>Éxito</span>",
        showClass: {
            popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
            `
        },
        hideClass: {
            popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
            `
        },
        html: "<span class='swal-text-custom'>Formulario enviado correctamente.</span>",
        icon: "success",
        confirmButtonText: "<span class='swal-text-custom'>Aceptar</span>",
      });
    } else {
      Swal.fire({
        title: "<span class='swal-title-custom'>Error</span>",
        showClass: {
            popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
            `
        },
        hideClass: {
            popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
            `
        },
        html: "<span class='swal-text-custom'>Por favor, verifique los datos ingresados.</span>",
        icon: "error",
        confirmButtonText: "<span class='swal-text-custom'>Aceptar</span>",
      });
      //encuentra el primer campo inválido y lo enfoca
      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });
})();
