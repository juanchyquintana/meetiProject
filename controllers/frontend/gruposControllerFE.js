const Grupos = require("../../models/Grupos.js");
const Meeti = require("../../models/Meeti.js");
const moment = require('moment')

exports.mostrarGrupo = async (req, res, next) => {
  const consultas = [];

  consultas.push(Grupos.findOne({ where: { id: req.params.id } }));
  consultas.push(
    Meeti.findAll({
      where: { grupoId: req.params.id },
      order: [["fehca", "ASC"]],
    })
  );

  const [grupo, meetis] = await Promise.all(consultas)

  if(!grupo) {
    res.redirect('/')
    return next()
  }

  res.render('mostrar-grupo', {
    nombrePagina: `Información Grupo: ${grupo.nombre}`,
    grupo,
    meetis,
    moment
  })
};
