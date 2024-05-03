const Grupos = require("../models/Grupos.js");
const Meeti = require("../models/Meeti.js");
const moment = require("moment");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.panelAdministracion = async (req, res) => {
  const consultas = [];
  consultas.push(Grupos.findAll({ where: { usuarioId: req.user.id } }));
  consultas.push(
    Meeti.findAll({
      where: {
        usuarioId: req.user.id,
        fecha: { [Op.gte]: moment(new Date()).format("YYYY-MM-DD") },
      },
      order: [
        ['fecha', 'DESC']
      ]
    })
  );
  consultas.push(
    Meeti.findAll({
      where: {
        usuarioId: req.user.id,
        fecha: { [Op.lt]: moment(new Date()).format("YYYY-MM-DD") },
      },
    })
  );

  const [grupos, meeti, anteriores] = await Promise.all(consultas);

  res.render("administracion", {
    nombrePagina: "Panel de Administración",
    grupos,
    meeti,
    moment,
    anteriores
  });
};
