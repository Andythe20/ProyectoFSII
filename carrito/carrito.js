class Producto {
    constructor(codigo, nombre, precio, descripcion, imgUrl, cantidad = 1) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.imgUrl = imgUrl;
        this.cantidad = cantidad;
    }

    // Métodos adicionales
    subTotal() {
        return this.precio * this.cantidad;
    }
}

class Carrito {
    constructor() {
        this.items = [];
        this.cargarDesdeLocalStorage();
    }

    agregarProducto(producto) {
        //Buscar si el producto ya existe en el carrito
        const productoExistente = this.items.find(item => item.codigo === producto.codigo)

        if (productoExistente) {
            // Si el producto ya existe, aumentar la cantidad
            productoExistente.cantidad += producto.cantidad;
        } else {
            // Si el producto no existe, agregarlo al carrito
            this.items.push(producto);
        }
    }

    removerProducto(codigo, cantidad = 1) {
        const producto = this.items.find(item => item.codigo === codigo);

        if (producto) {
            // Restamos la cantidad indicada
            producto.cantidad -= cantidad;

            // Si la cantidad llega a 0 o menos, eliminamos el producto del carrito
            if (producto.cantidad <= 0) {
                this.items = this.items.filter(item => item.codigo !== codigo);
            }
            
        }
    }

    calcularTotal() {
        return this.items.reduce((total, item) => total + item.subTotal(), 0);
    }

    guardarEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
    }

    cargarDesdeLocalStorage() {
        const data = localStorage.getItem("carrito");
        if (data) {
            const items = JSON.parse(data);
            // Reconstruir objetos Producto
            this.items = items.map(item => new Producto(
                item.codigo,
                item.nombre,
                item.precio,
                item.descripcion,
                item.imgUrl,
                item.cantidad
            ));
        }
    }

    contarProductos(){
        let total = 0;
        this.items.forEach(item => {
            total += item.cantidad
        });
        return total;
    }
}