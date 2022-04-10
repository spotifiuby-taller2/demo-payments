const swaggerConfig = {
    definition: {
        info: {
            title: "Payments API",
        },
        servers: [
            {
                url: 'http://localhost:4483',
                description: 'Local server'
            },
            {
                url: 'https://HEROKU',
                description: 'Prod server'
            }
        ]
    },
    apis: ["./src/main/routes.js"]
}

module.exports = {
    swaggerConfig
};
