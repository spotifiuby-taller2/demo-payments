const swaggerConfig = {
    definition: {
        info: {
            title: "Users API",
        },

        servers: [process.env.BASE_URL + process.env.NODE_DOCKER_PORT]
    },

    apis: ["./src/services/SignUpService.js"] //FIXME
}

module.exports = {
    swaggerConfig
};
