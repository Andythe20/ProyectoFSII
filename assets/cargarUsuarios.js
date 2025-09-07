// Puedes poner este código en un archivo como seedUsers.js y cargarlo antes del login
const demoUsers = [
    {
        firstName: "Juan",
        lastName: "Pérez",
        rut: "12345678K",
        birthDate: "1990-05-10",
        email: "juan.perez@email.com",
        password: "Juan1234"
    },
    {
        firstName: "Ana",
        lastName: "Gómez",
        rut: "87654321K",
        birthDate: "1985-11-22",
        email: "ana.gomez@email.com",
        password: "Ana1234"
    },
    {
        firstName: "Carlos",
        lastName: "Soto",
        rut: "19283746K",
        birthDate: "2000-01-15",
        email: "carlos.soto@email.com",
        password: "Carlos1234"
    }
];

// Solo guarda si no existen usuarios en localStorage
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(demoUsers));
}