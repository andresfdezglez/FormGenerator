// Módulos
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Cookie = require('@hapi/cookie');
const routes = require("./controllers/routes.js");
const questionsRepository = require("./repositories/questionsRepository.js");
const answersRepository = require("./repositories/answersRepository.js");
const usersRepository = require("./repositories/usersRepository.js");
const formsRepository = require("./repositories/formsRepository.js");
const repository = require("./repositories/repository.js");

const port = process.env.PORT || 8080

// Server
const server = Hapi.server({
    port: port,
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
    name: 'getFormsRepository',
    method: () => {
        return formsRepository;
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
    name: 'getUsersRepository',
    method: () => {
        return usersRepository;
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
        await server.register(Inert);
        await server.register(Vision);
        await server.register(Cookie);
        await server.auth.strategy('auth-registrado', 'cookie', {
            cookie: {
                name: 'session-id',
                password: 'passwordcifracookie-passwordcifracookie-passwordcifracookie-passwordcifracookie',
                isSecure: false
            },
            redirectTo: '/',
            validateFunc: function (request, cookie){
                promise = new Promise((resolve, reject) => {

                    usuarioCriterio = {"usuario": cookie.usuario};
                    if ( cookie.usuario != null && cookie.usuario != "" &&
                        cookie.secreto == "secreto"){

                        resolve({valid: true,
                            credentials: cookie.usuario});

                    } else {
                        resolve({valid: false});
                    }
                });

                return promise;
            }
        });

        await server.register(routes);
        await server.views({
            engines: {
                html: require('handlebars')
            },
            relativeTo: __dirname,
            path: './views',
            layoutPath: './views/layout',
            context : {
                sitioWeb: "formGenerator"
            }
        });

        await server.start();
        console.log('Server running on localhost:8080');
    } catch (error) {
        console.log('Error '+error);
    }
};

startServer();

