const Sequilize = require('sequelize')
const db = require('../config/db.js')
const { v4: uuid } = require('uuid');
const Categorias = require('./Categorias.js');
const Usuarios = require('./Usuarios.js')

const Grupos = db.define('grupos', {
    id: {
        type: Sequilize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: () => uuid()
    },
    nombre: {
        type: Sequilize.TEXT(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El grupo debe tener un nombre'
            }
        }
    },
    descripcion: {
        type: Sequilize.TEXT,
        allowNull: false, 
        validate: {
            notEmpty: {
                msg: 'Coloca una descripcion'
            }
        }
    },
    url: Sequilize.TEXT,
    imagen: Sequilize.TEXT
});

Grupos.belongsTo(Categorias);
Grupos.belongsTo(Usuarios)

module.exports = Grupos;