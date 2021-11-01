module.exports = {
    name: 'Routes',

    register: async (server, options) => {
        questionsRepository = server.methods.getQuestionsRepository();
        answersRepository = server.methods.getAnswersRepository();
        usersRepository = server.methods.getUsersRepository();
        formsRepository = server.methods.getFormsRepository();
        repository = server.methods.getRepository()
        server.route([
            {
                method: 'GET',
                path: '/',
                handler: async (req, h) => {
                    return 'Hola Mundo';
                }
            },
            {
                method: 'POST',
                path: '/question',
                handler: async (req, h) => {

                    question = {
                        idForm : "no form",
                        contenido: req.payload.content,


                    }
                    await repository.conexion()
                        .then((db) => questionsRepository.insertQuestion(db, question))
                        .then((id) => {
                            respuesta = "";

                            if (id == null) {
                                respuesta =  "Error al insertar"
                            } else {
                                respuesta = "Insertado id:  "+ id;
                            }
                        })

                    return respuesta;

                }
            },


            {
                method: 'POST',
                path: '/answer',
                handler: async (req, h) => {

                    answer = {
                        idQuestion : 1,
                        contenido: req.payload.content,


                    }
                    await repository.conexion()
                        .then((db) => answersRepository.insertAnswer(db, answer))
                        .then((id) => {
                            respuesta = "";
                            if (id == null) {
                                respuesta =  "Error al insertar"
                            } else {
                                respuesta = "Insertado id:  "+ id;
                            }
                        })

                    return respuesta;

                }
            },

            {
                method: 'POST',
                path: '/register',
                handler: async (req, h) => {
                    password = require('crypto').createHmac('sha256', 'secreto')
                        .update(req.payload.password).digest('hex');

                    user = {
                        user: req.payload.user,
                        password: password,
                    }

                    // await no continuar hasta acabar esto
                    // Da valor a respuesta
                    await repository.conexion()
                        .then((db) => usersRepository.insertUser(db, user))
                        .then((id) => {

                            respuesta = "";
                            if (id == null) {
                                respuesta =  "Error al insertar"
                            } else {
                                respuesta = "Insertado id:  "+ id;

                            }
                        })

                    return respuesta;
                }
            },

            {
                method: 'GET',
                path: '/register',
                handler: async (req, h) => {
                    return h.view('registro',
                        {},
                        { layout: 'base'});
                }
            },
            {
                method: 'GET',
                path: '/{param*}',
                handler: {
                    directory: {
                        path: './public'
                    }
                }
            },

            {
                method: 'POST',
                path: '/crear',
                handler: async (req, h) => {

                    var preguntas = req.payload.preguntas.split(";");

                    form = {
                        title: req.payload.title,
                        description: req.payload.description,
                        autor: "andres",
                        preguntas: preguntas,
                        respuestas:[]

                    }

                    // await no continuar hasta acabar esto
                    // Da valor a respuesta
                    await repository.conexion()
                        .then((db) => formsRepository.insertForm(db, form))
                        .then((id) => {

                            respuesta = "";
                            if (id == null) {
                                respuesta =  "Error al insertar"
                            } else {
                                respuesta = "Insertado id:  "+ id;

                            }
                        })

                    return respuesta;
                }
            },

            {
                method: 'GET',
                path: '/login',
                handler: async (req, h) => {
                    return h.view('login',
                        { },
                        { layout: 'base'});
                }
            },
            {
                method: 'GET',
                path: '/crear',
                handler: async (req, h) => {
                    return h.view('crear',
                        { },
                        { layout: 'base'});
                }
            },

            {
                method: 'POST',
                path: '/login',
                handler: async (req, h) => {
                    password = require('crypto').createHmac('sha256', 'secreto')
                        .update(req.payload.password).digest('hex');

                    usuarioBuscar = {
                        usuario: req.payload.usuario,
                        password: password,
                    }

                    // await no continuar hasta acabar esto
                    // Da valor a respuesta
                    await  repository.conexion()
                        .then((db) =>  usersRepository.obtenerUsuarios(db, usuarioBuscar))
                        .then((usuarios) => {
                            respuesta = "";
                            if (usuarios == null || usuarios.length == 0 ) {
                                respuesta =  "No identificado"
                            } else {
                                respuesta = "Identificado correctamente";
                            }
                        })

                    return respuesta;
                }
            },

            {
                method: 'GET',
                path: '/misformularios',
                handler: async (req, h) => {


                    var criterio = {};
                    if (req.query.criterio != null ){
                        criterio = { "title" : {$regex : ".*"+req.query.criterio+".*"}};
                    }


                    await repository.conexion()
                        .then((db) => formsRepository. obtenerFormularios(db, criterio))
                        .then((formularios) => {
                            listaformularios = formularios;
                        })

                    return h.view('formularios',
                        {
                            usuario: 'andresfpano',
                            formularios: listaformularios
                        },{ layout: 'base'});

                }
            },

            {
                method: 'GET',
                path: '/formulario/{id}',
                handler: async (req, h) => {

                    var id = req.params.id;

                    var criterio = {"_id" : id};

                    await repository.conexion()
                        .then((db) => formsRepository. obtenerFormularios(db, criterio))
                        .then((formularios) => {
                            formulario = formularios[0];
                        })

                    return h.view('formulario',
                        {
                            usuario: 'andresfpano',
                            formulario: formulario
                        },{ layout: 'base'});

                }
            },



        ])
    }
}
