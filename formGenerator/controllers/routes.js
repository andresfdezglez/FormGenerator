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
                method: 'POST',
                path: '/answer',
                options: {
                    auth: 'auth-registrado'
                },

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

                    var criterio = {user: req.payload.user}

                    var url = "";
                    await  repository.conexion()
                        .then((db) =>  usersRepository.obtenerUsuarios(db, criterio))
                        .then((usuarios) => {
                            respuesta = "";
                            if (usuarios == null || usuarios.length == 0 ) {
                                repository.conexion()
                                    .then((db) => usersRepository.insertUser(db, user))
                                    .then((id) => {

                                        respuesta = "";
                                        if (id == null) {
                                            respuesta =  "Error al insertar"
                                        } else {
                                            respuesta = "Insertado id:  "+ id;

                                        }
                                    });

                              url = "/misformularios"
                            } else {
                                url = "/register";
                            }
                        })



                    return h.redirect(url);


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
                options: {
                    auth: 'auth-registrado'
                },

                handler: async (req, h) => {

                    var preguntas = req.payload.preguntas.split(";");

                    preguntas.splice(preguntas.length-1,1);

                    form = {
                        title: req.payload.title,
                        description: req.payload.description,
                        autor: req.state["session-id"].usuario,
                        preguntas: preguntas,
                        activado:true

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

                    return h.redirect("/misformularios");
                }
            },

            {
                method: 'GET',
                path: '/',
                handler: async (req, h) => {
                    return h.view('login',
                        { },
                        { layout: 'base'});
                }
            },
            {
                method: 'GET',
                path: '/crear',
                options: {
                    auth: 'auth-registrado'
                },

                handler: async (req, h) => {
                    return h.view('crear',
                        { },
                        { layout: 'base'});
                }
            },

            {
                method: 'POST',
                path: '/',
                handler: async (req, h) => {
                    password = require('crypto').createHmac('sha256', 'secreto')
                        .update(req.payload.password).digest('hex');

                    usuarioBuscar = {
                        user: req.payload.usuario,
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
                                req.cookieAuth.set({
                                    usuario: usuarios[0].user,
                                    secreto : "secreto"
                                });

                                respuesta = "Identificado correctamente";
                            }
                        })

                    return h.redirect("/misformularios");
                }
            },

            {
                method: 'GET',
                path: '/misformularios',
                options: {
                    auth: 'auth-registrado'
                },

                handler: async (req, h) => {


                    var criterio = { "autor" : req.state["session-id"].usuario};

                    if (req.query.criterio != null )
                        criterio = {$and: [{ "title" : {$regex : ".*"+req.query.criterio+".*"}},{"autor": req.state["session-id"].usuario}]};





                    await repository.conexion()
                        .then((db) => formsRepository. obtenerFormularios(db, criterio))
                        .then((formularios) => {
                            listaformularios = formularios;
                        })

                    return h.view('formularios',
                        {
                            usuario: req.state["session-id"].usuario,
                            formularios: listaformularios
                        },{ layout: 'base'});

                }
            },

            {
                method: 'GET',
                path: '/formulario/{id}',
                handler: async (req, h) => {

                    var mongo = require("mongodb");

                    var id = mongo.ObjectId(req.params.id);

                    var criterio = {"_id" : id};

                    await repository.conexion()
                        .then((db) => formsRepository. obtenerFormularios(db, criterio))
                        .then((formularios) => {
                            formulario = formularios[0];
                        })

                    return h.view('formulario',
                        {

                            formulario: formulario,
                            questions:formulario.preguntas,
                            id:id
                        },{ layout: 'base'});

                }
            },


            {
                method: 'POST',
                path: '/formulario/{id}',
                handler: async (req, h) => {

                    var mongo = require("mongodb");

                    var id = mongo.ObjectId(req.params.id);

                    var respuestas = req.payload.respuestas.split(";");

                    respuestas.splice(respuestas.length-2,2);

                    var answer = {

                        idForm: id,
                        contenido: respuestas
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





                  return h.redirect("/");
                }
            },
            {
                method: 'GET',
                path: '/desconectarse',
                handler: async (req, h) => {
                    req.cookieAuth.set({ usuario: "", secreto: "" });
                    return h.view('login',
                        { },
                        { layout: 'base'});
                }
            },


            {
                method: 'GET',
                path: '/modificar/{id}',
                options : {
                    auth: 'auth-registrado',

                },
                handler: async (req, h) => {


                    var criterio = { "_id" : require("mongodb").ObjectID(req.params.id) };

                    await repository.conexion()
                        .then((db) => formsRepository. obtenerFormularios(db, criterio))
                        .then((formularios) => {

                            formulario = formularios[0]

                        })

                    if(formulario.activado === true)
                        formulario.activado = false
                    else
                        formulario.activado = true;


                    await repository.conexion()
                        .then((db) => formsRepository.modificarFormulario(db,criterio,formulario))
                        .then((id) => {
                            respuesta = "";
                            if (id == null) {
                                respuesta =  "Error al modificar"
                            } else {
                                return h.redirect("/misformularios");
                            }
                        })

                    return h.redirect("/misformularios");
                }
            },

            {
                method: 'GET',
                path: '/respuestas/{id}',
                handler: async (req, h) => {

                    var mongo = require("mongodb");

                    var id = mongo.ObjectId(req.params.id);

                    var criterio = {"idForm" : id};


                    await repository.conexion()
                        .then((db) =>answersRepository. obtenerRespuestas(db, criterio))
                        .then((respuestas) => {
                            listarespuestas = respuestas;
                        })

                    return h.view('respuestas',
                        {
                             respuestas:listarespuestas,

                        },{ layout: 'base'});

                }
            },




        ])
    }
}
