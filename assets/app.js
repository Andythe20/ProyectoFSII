// JS Base para todas las páginas
document.addEventListener('DOMContentLoaded', () => {
    let contadorProductos = document.getElementById('cart-count');

    const carrito = new Carrito();

    contadorProductos.innerText = carrito.contarProductos()
});