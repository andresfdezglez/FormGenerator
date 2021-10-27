module.exports = {
    name: 'Routes',
    register: async (server, options) => {
        questionsRepository = server.methods.getQuestionsRepository();
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
                        idForm : "sin usuario",
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
            }

        ])
    }
}
