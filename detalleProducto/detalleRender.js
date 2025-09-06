document.addEventListener('DOMContentLoaded', function () {
  const btnAddToCart = document.getElementById("btnAddToCart");
  let producto = null;

  // Obtener el parámetro de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("cod");

  // Inicializar el carrito
  let carrito = new Carrito();

  async function fetchProductData() {
    try {
      const response = await fetch('../assets/db.json');
      if (!response.ok) throw new Error('Error en la respuesta: ' + response.status);

      const productos = await response.json();

      // Buscar producto case-insensitive
      producto = productos.find(p => p.codigo.toLowerCase() === productId.toLowerCase());

      if (!producto) {
        document.getElementById("noDataFound").classList.remove("d-none");
        document.getElementById("product-details").classList.add("d-none");
        return;
      }

      const formatoMoneda = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
      });

      // Renderizar en el DOM
      document.getElementById("product-image").src = producto.url;
      document.getElementById("product-title").textContent = producto.nombre;
      document.getElementById("product-code").textContent = producto.codigo;
      document.getElementById("product-description").textContent = producto.descripcion;
      document.getElementById("product-price").textContent = formatoMoneda.format(producto.precio);

    } catch (error) {
      console.error(error);
    }
  }

    // Mostrar notificación
    function mostrarAlerta(nombre, cantidad) {
    Swal.fire({
      position: "top-start",
      icon: "success",
      title: `¡${cantidad} ${nombre} agregada al carrito!`,
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
    }).then(() => {
      window.location.href = "./productos.html";
    });

  }

  // Manejar el evento del botón "Agregar al Carrito"
  btnAddToCart.addEventListener("click", function () {
    const cantidad = parseInt(document.getElementById('quantity').value, 10);
    // Crear una instancia de Producto y agregarla al carrito
    const productoToCart = new Producto(
      producto.codigo,
      producto.nombre,
      producto.precio,
      producto.descripcion,
      producto.url,
      cantidad
    );
    // Agregar al carrito
    carrito.agregarProducto(productoToCart);
    carrito.guardarEnLocalStorage();
    document.getElementById('cart-count').innerText = carrito.contarProductos()
    
    mostrarAlerta(producto.nombre, cantidad);

    // Redirigir a la página de productos
    //window.location.href = "./productos.html";
  });

  fetchProductData();
});
