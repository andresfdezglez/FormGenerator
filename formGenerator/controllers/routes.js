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
            }



        ])
    }
}
