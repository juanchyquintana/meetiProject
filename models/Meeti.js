const Sequelize = require("sequelize");
const db = require("../config/db.js");
const slug = require("slug");
const shortid = require("shortid");

const Usuarios = require('../models/Usuarios.js')
const Grupos = require('../models/Grupos.js')

const Meeti = db.define("meeti", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
  },
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Agrega un Título",
      },
    },
  },
  slug: {
    type: Sequelize.STRING
  },
  invitado: Sequelize.STRING,
  cupo: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  descripcion: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Agrega una Descripcion",
      },
    },
  },
  fecha: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Agrega una Fecha",
      },
    },
  },
  hora: {
    type: Sequelize.TIME,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Agrega una hora",
      },
    },
  },
  direccion: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Agrega una Direccion",
      },
    },
  },
  ciudad: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Agrega una Ciudad",
      },
    },
  },
  estado: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Agrega una Estado",
      },
    },
  },
  pais: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Agrega una Pais",
      },
    },
  },
  ubicacion: {
    type: Sequelize.GEOMETRY("POINT"),
  },
  interesados: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    defaultValue: [],
  },
}, {
    hooks: {
        async beforeCreate(meeti) {
            const url = slug(meeti.titulo).toLocaleLowerCase()
            meeti.slug = `${url}-${shortid.generate()}`
        },
    }
});

Meeti.belongsTo(Usuarios)
Meeti.belongsTo(Grupos)

module.exports = Meeti;
