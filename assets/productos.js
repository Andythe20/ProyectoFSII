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
            <div class="card mx-auto shadow-sm" style="width: 60%; display: flex; flex-direction: column; flex: 1;">
              <img src="./assets/img/logo.jpg" class="card-img-top" alt="${producto.nombre}">
              <div class="card-body d-flex flex-column flex-grow-1">
                <h5 class="card-title fs-6">${producto.nombre}</h5>
                <p class="card-text fs-2 fw-bold">Precio: ${formatoMoneda.format(producto.precio)}</p>
                <p class="flex-grow-1 text-center">${producto.descripcion || ''}</p>
                <a href="#" class="btn btnBrown mt-auto">Go somewhere</a>
              </div>
            </div>
          </div>
        `;
      });

      contenedor.innerHTML = html;
    } catch (error) {
      console.error('Error cargando productos:', error);
      contenedor.innerHTML = `<p>Error al cargar productos.</p>`;
    }
  }

  cargarProductos();
});
