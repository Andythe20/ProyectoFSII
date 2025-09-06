document.addEventListener('DOMContentLoaded', function () {
    const tablaCarrito = document.getElementById('cart-items');
    const emptyCartDiv = document.getElementById('empty-cart');
    const totalSection = document.getElementById('total-section');

    const carrito = new Carrito();

    carrito.cargarDesdeLocalStorage();

    if (carrito.items.length === 0) {
        // Mostrar mensaje carrito vacío
        emptyCartDiv.classList.remove('d-none');
        totalSection.classList.add('d-none');
        //tbody.innerHTML = ''; // limpiar tabla
        document.getElementById('cart-total').innerText = '0';
        obtenerProductos(); // mostrar 4 productos sugeridos de forma aleatoria
        return;
    } else {
        emptyCartDiv.classList.add('d-none');
        totalSection.classList.remove('d-none');
    }

    let html = '';

    // Número máximo de caracteres para la descripción corta
    const cantidadCaracteresDescripcion = 30;

    // Generar el HTML para cada producto en el carrito
    carrito.items.forEach(item => {
        //const subtotal = item.precio * item.cantidad;
        const descripcionCorta = item.descripcion.length > cantidadCaracteresDescripcion
            ? item.descripcion.slice(0, cantidadCaracteresDescripcion) + '...'
            : item.descripcion;
        html += `<tr>
                    <td>
                        <div class="d-flex align-items-center" data-codigo="${item.codigo}">
                            <a href="./detalleProducto.html?cod=${item.codigo}" data-bs-toggle="tooltip" data-bs-placement="top" title="Click para ver detalle de ${item.nombre}">
                                <img src="${item.imgUrl}"
                                    alt="${item.nombre}" class="me-3"
                                    style="width: 60px; height: 60px; border-radius: 10px; object-fit: cover;"
                                >
                            </a>
                            <div>
                                <h6 class="mb-1">${item.nombre}</h6>
                                <small class="text-muted" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${item.descripcion}">${descripcionCorta}</small>
                            </div>
                        </div>
                    </td>
                    <td class="text-center">
                        <div class="quantity-control">
                            <button class="quantity-btn" data-codigo="${item.codigo}" data-action="restar">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-display fs-6">${item.cantidad}</span>
                            <button class="quantity-btn" data-codigo="${item.codigo}" data-action="sumar">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </td>
                    <td class="text-center">${formatearMoneda(item.precio)}</td>
                    <td class="text-center product-price">${formatearMoneda(item.precio * item.cantidad)}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-danger-outline eliminar-producto" 
                                title="Eliminar producto" 
                                data-codigo="${item.codigo}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
            </tr>
            `
    })

    // Insertar el HTML generado en el contenedor
    tablaCarrito.innerHTML = html;

    // Actualizar el total del carrito
    document.getElementById('cart-total').innerText = formatearMoneda(carrito.calcularTotal());

    // Agregar event listeners a los botones de cantidad
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const codigo = e.currentTarget.dataset.codigo;
            const action = e.currentTarget.dataset.action;

            if (action === 'sumar') {
                // crear un producto temporal para sumar 1
                const producto = carrito.items.find(p => p.codigo === codigo);
                carrito.agregarProducto(new Producto(producto.codigo, producto.nombre, producto.precio, 1));
            } else if (action === 'restar') {
                carrito.removerProducto(codigo, 1);
            }

            // actualizar el carrito en el DOM y en localStorage
            carrito.guardarEnLocalStorage();
            location.reload(); // recarga la página
        });
    });

    // Agregar event listeners a los botones de eliminar
    document.querySelectorAll('.eliminar-producto').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const codigo = e.currentTarget.dataset.codigo;

            // Llamar al método removerProducto con cantidad suficiente para eliminarlo
            carrito.removerProducto(codigo, carrito.items.find(p => p.codigo === codigo).cantidad);

            // Guardar los cambios en localStorage
            carrito.guardarEnLocalStorage();

            // Recargar la página para reflejar los cambios
            location.reload();
        });
    });

    // Agregar listener al botón Proceder al Pago
    document.getElementById('checkout-button').addEventListener('click', () => {

        // Generar numero aleatorio 0 o 1 para simular exito o error en el pago
        const exitoPago = Math.random() < 0.4; // % de probabilidad de éxito

        let timerInterval;
        Swal.fire({
            title: "Procesando pago...",
            html: "Espere un momento...",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                timerInterval = setInterval(() => {
                }, 100);
            },
            willClose: () => {
                clearInterval(timerInterval);

                if (!exitoPago) {
                    // Mensaje de error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error en el pago',
                        text: 'Hubo un problema al procesar su pago. Por favor, intente nuevamente.',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#8B4513'
                    });
                    return;
                }

                // Mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: '¡Pago exitoso!',
                    text: 'Gracias por su compra.',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#8B4513'
                }).then(() => {
                    // Vaciar el carrito y actualizar la vista
                    localStorage.removeItem('carrito');
                    location.reload(); // recarga la página
                });
            }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log("I was closed by the timer");
            }
        });
    });

    // Mostrar 4 productos aleatorios que no estén en el carrito
    async function obtenerProductos(){
        try {
            const response = await fetch('assets/db.json');
            if(!response.ok){
                throw new Error('Error en la respuesta: ' + response.status);
            }
            const data = await response.json();
            
            // Desordenar aleatoriamente los productos
            const productosDesordenados = data.sort(() => Math.random() - 0.5);
            //console.log(productosDesordenados)

            // Filtrar productos que no estén en el carrito
            const productosFiltrados = productosDesordenados.filter(p => !carrito.items.some(item => item.codigo === p.codigo));
            console.log(productosFiltrados)

            // Tomar los primeros 4 productos del arreglo filtrado
            const productosParaMostrar = productosFiltrados.slice(0, 4);
            console.log(productosParaMostrar)

            // Renderizar los productos sugeridos
            const sugeridosContainer = document.getElementById('product-list');
            sugeridosContainer.innerHTML = ''; // Limpiar contenido previo

            let htmlSugeridos = '';

            productosParaMostrar.forEach(producto => {
                htmlSugeridos += `
                <div class="col-12 col-md-6 col-lg-12 col-xl-6 mb-4">
                    <div class="card h-100">
                        <img src="${producto.url}"
                            class="card-img-top product-image" alt="${producto.nombre}">
                        <div class="card-body text-center">
                            <h6 class="card-title">${producto.nombre}</h6>
                            <p class="card-text small text-muted">${producto.descripcion}</p>
                            <p class="product-price mb-3">${formatearMoneda(producto.precio)} c/u </p>
                            <button class="btn btnBrown btn-sm w-100">
                                <i class="fas fa-plus me-1"></i>Agregar al Carrito
                            </button>
                        </div>
                    </div>
                </div>
                `
                sugeridosContainer.innerHTML = htmlSugeridos;
            });
        } catch (error) {
            console.error('Error al obtener productos:', error);
        };
    }

    // Funciones auxiliares
    function formatearMoneda(valor) {
        return valor.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    }

    // Invocar funciones
    obtenerProductos();
});
