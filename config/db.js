const Sequelize = require('sequelize')
require('dotenv').config()

module.exports = new Sequelize(process.env.BD_NOMBRE, process.env.USER_DB, process.env.PASS_DB, {
    host: process.env.BD_HOST,
    port: process.env.BD_PORT,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    // logging: false
})