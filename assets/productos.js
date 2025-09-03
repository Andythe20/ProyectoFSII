document.addEventListener('DOMContentLoaded', function () {
  async function cargarProductos() {
    const contenedor = document.getElementById("productos");
    try {
      const response = await fetch('assets/db.json');
      if (!response.ok) {
        throw new Error('Error en la respuesta: ' + response.status);
      }
      const productos = await response.json();

      const formatoMoneda = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
      });

      let html = '';

      productos.forEach(producto => {
        html += `
        <div class="col-12 col-md-6 col-lg-4 d-flex">
        <div class="card mx-auto shadow-sm btnConcavo" style="width: 60%; display: flex; flex-direction: column; flex: 1;">
        <form class="formulario__producto">
                <img src="./assets/img/logo.jpg" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body d-flex flex-column flex-grow-1 text-center">
                  <h5 class="card-title fs-3">${producto.nombre}</h5>
                  <p class="card-text fs-2 fw-bold producto__precio">Precio: <span id="producto__precio--moneda">${formatoMoneda.format(producto.precio)}</span></p>
                  <p class="flex-grow-1 producto__descripcion">${producto.descripcion || ''}</p>
                  <button type="submit" class="btn btnBrown mt-auto fs-5"><i class="fa-solid fa-cart-plus"></i> Agregar</button>
                </div>
                </form>
              </div>
            </div>
        `;
      });

      contenedor.innerHTML = html;

      const forms = document.querySelectorAll('.formulario__producto');
      console.log(forms);

      forms.forEach(form => {
        form.addEventListener('submit', function (event) {
          const nombre = event.target.childNodes[3].childNodes[1].innerText;
          const precio = parseInt(event.target.childNodes[3].childNodes[3].innerText.split('$')[1].replace(/\./g, ''));

          console.log(`Producto agregado: ${nombre}, Precio: ${precio}`);
          event.preventDefault();

        });
      });

    } catch (error) {
      console.error('Error cargando productos:', error);
      contenedor.innerHTML = `<p class="text-danger">Error al cargar productos.</p>`;
    }
  }

  function crearDataLocalStorage() {
    if (!existeDataLocalStorage()) {
      localStorage.setItem('carrito', []);
    } else {
      carrito = console.log(localStorage.getItem('carrito'));
    }
  }

  function existeDataLocalStorage() {
    return localStorage.getItem('carrito') !== null
  }



  let carrito = [];

  cargarProductos();
  crearDataLocalStorage();
});
