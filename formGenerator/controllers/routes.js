module.exports = {
    name: 'Routes',
    register: async (server, options) => {
        server.route([
            {
                method: 'GET',
                path: '/',
                handler: async (req, h) => {
                    return 'Hola Mundo';
                }
            }
        ])
    }
}
