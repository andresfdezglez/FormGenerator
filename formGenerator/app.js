// Módulos
const Hapi = require('@hapi/hapi');
const routes = require("./controllers/routes.js");

// Server
const server = Hapi.server({
    port: 8080,
    host: 'localhost',
});

const startServer = async () => {
    try {
        await server.register(routes);
        await server.start();
        console.log('Server running on localhost:8080');
    } catch (error) {
        console.log('Error '+error);
    }
};

startServer();

