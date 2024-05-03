const Sequilize = require('sequelize')
const db = require('../config/db.js')

const Categorias = db.define('categorias', {
    id: {
        type: Sequilize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: Sequilize.TEXT,
    slug: Sequilize.TEXT
}, {
    timestamps: false
});

module.exports = Categorias;