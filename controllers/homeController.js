const Categorias = require("../models/Categorias.js");
const Usuarios = require("../models/Usuarios.js");
const Grupos = require("../models/Grupos.js");
const Meeti = require("../models/Meeti.js");
const Sequilize = require("sequelize");
const moment = require("moment");
const Op = Sequilize.Op;

exports.home = async (req, res) => {
  const consultas = [];
  consultas.push(Categorias.findAll({}));
  consultas.push(
    Meeti.findAll({
      attributes: ["slug", "titulo", "fecha", "hora"],
      where: {
        fecha: { [Op.gte]: moment(new Date()).format("YYYY-MM-DD") },
      },
      limit: 3,
      order: [["fecha", "ASC"]],
      include: [
        {
          model: Grupos,
          attributes: ["imagen"],
        },
        {
          model: Usuarios,
          attributes: ["nombre", "imagen"],
        },
      ],
    })
  );

  const [categoria, meetis] = await Promise.all(consultas);

  res.render("home", {
    nombrePagina: "Inicio",
    categoria,
    meetis,
    moment
  });
};
