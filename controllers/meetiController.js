const Grupos = require("../models/Grupos.js");
const Meeti = require("../models/Meeti.js");
const { v4: uuidv4 } = require('uuid');

exports.formNuevoMeeti = async (req, res) => {
  const grupos = await Grupos.findAll({ where: { usuarioId: req.user.id } });

  res.render("nuevo-meeti", {
    nombrePagina: "Crear un Nuevo Meeti",
    grupos,
  });
};

exports.crearMeeti = async (req, res) => {
  const meeti = req.body;
  meeti.usuarioId = req.user.id;

  const point = {
    type: "Point",
    coordinates: [parseFloat(req.body.lat), parseFloat(req.body.lng)],
  };
  meeti.ubicacion = point;

  if (req.body.cupo === "") {
    meeti.cupo = 0;
  }

  meeti.id = uuidv4()

  try {
    await Meeti.create(meeti);
    req.flash("exito", "Se ha creado el Meeti Correctamente");
    req.redirect("/administracion");
  } catch (error) {
    const errores = error.errors.map((err) => err.message);
    req.flash("error", errores);
    req.redirect("/nuevo-meeti");
  }
};

exports.formEditarMeeti = async (req, res, next) => {
  const consultas = [];
  consultas.push(Grupos.findAll({ where: { usuarioId: req.user.ud } }));
  consultas.push(Meeti.findByPk(req.params.id));

  const [grupos, meeti] = await Promise.all(consultas);

  if (!grupos || !meeti) {
    req.flash("error", "Operacion no valida");
    req.redirect("/administracion");
    return next();
  }

  res.render("editar-meeti", {
    nombrePagina: `Editar Meeti: ${meeti.titulo}`,
    grupos,
    meeti,
  });
};

exports.editarMeeti = async (req, res, next) => {
  const meeti = await Meeti.findOne({
    where: { id: req.params.id, usuarioId: req.user.id },
  });

  if (!meeti) {
    req.flash("error", "Operacion no valida");
    req.redirect("/administracion");
    return next();
  }

  const {
    grupoId,
    titulo,
    invitado,
    fecha,
    hora,
    cupo,
    descripcion,
    direccion,
    ciudad,
    estado,
    pais,
    lat,
    lng,
  } = req.body;

  meeti.grupoId = grupoId;
  meeti.titulo = titulo;
  meeti.invitado = invitado;
  meeti.fecha = fecha;
  meeti.hora = hora;
  meeti.cupo = cupo;
  meeti.descripcion = descripcion;
  meeti.direccion = direccion;
  meeti.ciudad = ciudad;
  meeti.estado = estado;
  meeti.pais = pais;

  const point = {
    type: "Point",
    coordinates: [parseFloat(lat), parseFloat(lng)],
  };
  meeti.ubicacion = point;

  await meeti.save();
  req.flash("exito", "Cambios Guardados Correctamente");
  res.redirect("/administracion");
};

exports.formEliminarMeeti = async (req, res) => {
  const meeti = Meeti.findOne({
    where: { id: req.params.id, usuarioId: req.user.id },
  });

  if (!meeti) {
    req.flash("error", "Operacion no valida");
    req.redirect("/administracion");
    return next();
  }

  res.render("eliminar-meeti", {
    nombrePagina: `Eliminar Meeti: ${meeti.titulo}`,
    meeti,
  });
};

exports.eliminarMeeti = async (req, res, next) => {
  await Meeti.destroy({ where: { id: req.params.id } });

  req.flash("exito", "Meeti Eliminado");
  res.redirect("/administracion");
};
