// Módulos
const Hapi = require('@hapi/hapi');
const routes = require("./controllers/routes.js");
const questionsRepository = require("./repositories/questionsRepository.js");
const answersRepository = require("./repositories/answersRepository.js");
const repository = require("./repositories/repository.js");

// Server
const server = Hapi.server({
    port: 8080,
    host: 'localhost',
});

server.method({
    name: 'getQuestionsRepository',
    method: () => {
        return questionsRepository;
    },
    options: {}
});

server.method({
    name: 'getAnswersRepository',
    method: () => {
        return answersRepository;
    },
    options: {}
});

server.method({
    name: 'getRepository',
    method: () => {
        return repository;
    },
    options: {}
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

