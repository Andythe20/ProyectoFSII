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
        tbody.innerHTML = ''; // limpiar tabla
        document.getElementById('cart-total').innerText = '0';
        return;
    } else {
        emptyCartDiv.classList.add('d-none');
        totalSection.classList.remove('d-none');
    }

    let html = '';

    // Número máximo de caracteres para la descripción corta
    const cantidadCaracteresDescripcion = 50;

    // Generar el HTML para cada producto en el carrito
    carrito.items.forEach(item => {
        //const subtotal = item.precio * item.cantidad;
        const descripcionCorta = item.descripcion.length > cantidadCaracteresDescripcion
            ? item.descripcion.slice(0, cantidadCaracteresDescripcion) + '...'
            : item.descripcion;
        html += `<tr>
                    <td>
                        <div class="d-flex align-items-center" data-codigo="${item.codigo}">
                            <img src="${item.imgUrl}"
                                alt="${item.nombre}" class="me-3"
                                style="width: 60px; height: 60px; border-radius: 10px; object-fit: cover;">
                            <div>
                                <h6 class="mb-1">${item.nombre}</h6>
                                <small class="text-muted">${descripcionCorta}</small>
                            </div>
                        </div>
                    </td>
                    <td class="text-center">
                        <div class="quantity-control">
                            <button class="quantity-btn" data-codigo="${item.codigo}" data-action="restar">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-display">${item.cantidad}</span>
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


    function formatearMoneda(valor) {
        return valor.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    }

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
});
