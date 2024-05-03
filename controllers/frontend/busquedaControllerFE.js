const Meeti = require("../../models/Meeti.js");
const Grupos = require("../../models/Grupos.js");
const Usuarios = require("../../models/Usuarios.js");

const Sequelize = require("sequelize");
const moment = require("moment");
const Op = Sequelize.Op;

exports.resultadosBusqueda = async (req, res) => {
  const { categoria, titulo, ciudad, pais } = req.query;

  let query;
  if(categoria === '') {
    query = ''
  } else {
    query = ` where: {
        categoriaId: { [Op.eq]: ${categoria} },
      },`
  }

  const meetis = await Meeti.findAll({
    where: {
      titulo: { [Op.iLike]: "%" + titulo + "%" },
      ciudad: { [Op.iLike]: "%" + ciudad + "%" },
      pais: { [Op.iLike]: "%" + pais + "%" },
    },
    include: [
      {
        model: Grupos,
        query
      },
      {
        model: Usuarios,
        attributes: ["id", "nombre", "imagen"],
      },
    ],
  });

  res.render("busqueda", {
    nombrePagina: "Resultado Busqueda",
    meetis,
    moment,
  });
};
