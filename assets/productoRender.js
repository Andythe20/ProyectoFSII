document.addEventListener('DOMContentLoaded', function () {
  async function cargarProductos() {

    // Clase para manejar el carrito de compras
    const carrito = new Carrito();

    const contenedor = document.getElementById("productos");
    try {
      const response = await fetch('assets/db.json');
      if (!response.ok) {
        throw new Error('Error en la respuesta: ' + response.status);
      }
      const productos = await response.json();

      // Formateador de moneda para pesos chilenos
      const formatoMoneda = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
      });

      let html = '';

      // Generar el HTML para cada producto
      productos.forEach(producto => {
        html += `
        <div class="col-12 col-md-6 col-lg-4 d-flex">
          <div class="card mx-auto shadow-sm btnConcavo d-flex flex-column w-100">
              <form class="formulario__producto d-flex flex-column h-100">
                  <a href="./detalleProducto.html?cod=${producto.codigo}"><img src="${producto.url}" class="card-img-top shadow" alt="${producto.nombre}"></a>
                  <div class="card-body d-flex flex-column flex-grow-1 text-center">
                      <h5 class="card-title fs-3">${producto.nombre}</h5>
                      <p class="card-text fs-2 fw-bold producto__precio">
                          Precio: <span id="producto__precio--moneda">${formatoMoneda.format(producto.precio)}</span>
                      </p>
                      <small>Código: ${producto.codigo}</small>
                      <p class="flex-grow-1 producto__descripcion">${producto.descripcion || ''}</p>
                      <button type="submit" class="btn btnBrown mt-auto fs-5 id="btnAgregar">
                          <i class="fa-solid fa-cart-plus"></i> Agregar
                      </button>
                  </div>
              </form>
          </div>
        </div>
        `;
      });

      // Insertar el HTML generado en el contenedor
      contenedor.innerHTML = html;

      // Agregar event listeners a los formularios después de que se hayan agregado al DOM
      const forms = document.querySelectorAll('.formulario__producto');

      // Manejar el evento de envío del formulario
      forms.forEach(form => {
        form.addEventListener('submit', function (event) {
          //console.log(event.target)
          const codigo = event.target.childNodes[3].childNodes[5].innerText.split('Código: ')[1];
          const nombre = event.target.childNodes[3].childNodes[1].innerText;
          const precio = parseInt(event.target.childNodes[3].childNodes[3].innerText.split('$')[1].replace(/\./g, ''));
          const descripcion = event.target.childNodes[3].childNodes[7].innerHTML;
          //const imgUrl = event.target.childNodes[1].src;
          const imgUrl = document.querySelector('.formulario__producto img').src;

          // Crear un nuevo producto con cantidad 1
          const producto = new Producto(codigo, nombre, precio, descripcion, imgUrl);

          // Agregar el producto al carrito
          carrito.agregarProducto(producto);
          
          // Guardar el carrito en localStorage
          carrito.guardarEnLocalStorage();
          
          mostrarAlerta(nombre, precio);
          // Actualizar el contador de productos en el carrito
          let contadorProductos = document.getElementById('cart-count');
          contadorProductos.innerText = carrito.contarProductos();

          // Prevenir el envío del formulario
          event.preventDefault();

        });
      });

    } catch (error) {
      console.error('Error cargando productos:', error);
      contenedor.innerHTML = `<p class="text-danger">Error al cargar productos.</p>`;
    }
  }

  // Detectar evento agregar producto al carrito
  function mostrarAlerta(nombre, precio) {
    Swal.fire({
      position: "top-start",
      icon: "success",
      title: `¡${nombre} agregado al carrito!`,
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
      toast: true,
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
      }
    });

  }

  // Cargar los productos al iniciar la página
  cargarProductos();
});
