const Usuarios = require("../models/Usuarios.js");
const enviarEmail = require("../handlers/emails.js");
const multer = require("multer");
const shortid = require("shortid");
const fs = require("fs");
const { check, validationResult } = require("express-validator");

exports.formCrearCuenta = (req, res) => {
  res.render("crear-cuenta", {
    nombrePagina: "Crear Cuenta",
  });
};

exports.crearNuevaCuenta = async (req, res) => {
  const usuario = req.body;

  await check("confirmar", "El Password Confirmado no puede ir vácio")
    .notEmpty()
    .run(req);
  await check("confirmar", "El Password es Diferente")
    .equals(req.body.password)
    .run(req);

  const erroresExpress = validationResult(req).array();

  try {
    await Usuarios.create(usuario);

    const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;

    await enviarEmail.enviarEmail({
      usuario,
      url,
      subject: "Confirma tu cuenta de Meeti",
      archivo: "confirmar-cuenta",
    });

    req.flash("exito", "Hemos Enviado un E-mail a tu cuenta");
    res.redirect("/iniciar-sesion");
  } catch (error) {
    // const errores = error.errors.map((err) => err.message);
    let listaErrores = [];

    if (error.name === "SequelizeUniqueConstraintError") {
      listaErrores.push("El correo electrónico ya está registrado.");
    } else if (error.errors && error.errors.length > 0) {
      listaErrores = error.errors.map((err) => err.message);
    } else if (erroresExpress && erroresExpress.length > 0) {
      listaErrores = erroresExpress.map((err) => err.msg);
    } else {
      listaErrores.push(error.message);
    }

    // const errExp = erroresExpress.map((err) => err.msg);
    // const listaErrores = [...errores, ...errExp];

    req.flash("error", listaErrores);
    res.redirect("/crear-cuenta");
  }
};

exports.confirmarCuenta = async (req, res, next) => {
  const usuario = await Usuarios.findOne({
    where: { email: req.params.correo },
  });

  if (!usuario) {
    req.flash("error", "No existe esa cuenta");
    res.redirect("/crear-cuenta");
    return next();
  }

  usuario.activo = 1;
  await usuario.save();

  req.flash("exito", "La cuenta se ha confirmado, ya puedes iniciar sesión");
  res.redirect("/iniciar-sesion");
};

exports.formIniciarSesion = (req, res) => {
  res.render("iniciar-sesion", {
    nombrePagina: "Iniciar Sesión",
  });
};

exports.formEditarPerfil = async (req, res) => {
  const usuario = Usuarios.findByPk(req.user.id);

  res.render("editar-perfil", {
    nombrePagina: `Editar Perfil: ${usuario.nombre}`,
    usuario,
  });
};

exports.editarPerfil = async (req, res) => {
  const usuario = await Usuarios.findByPk(req.user.id);

  const { nombre, descripcion, email } = req.body;

  usuario.nombre = nombre;
  usuario.descripcion = descripcion;
  usuario.email = email;

  await usuario.save();
  req.flash("exito", "Cambios Guardados Correctamente");
  res.redirect("/administracion");
};

exports.formCambiarPassword = async (req, res) => {
  res.render("cambiar-password", {
    nombrePagina: `Cambiar Password`,
  });
};

exports.cambiarPassword = async (req, res, next) => {
  const usuario = await Usuarios.findByPk(req.user.id);

  if (!usuario.validarPassword(req.body.anterior)) {
    req.flash("error", "El Password actual es incorrecto");
    res.redirect("/administracion");

    return next();
  }

  const hash = usuario.hashPassword(req.body.nuevo);
  usuario.password = hash;
  await usuario.save();

  req.logout();
  req.flash(
    "exito",
    "Password Modificado Correctamente. Inicia Sesión Nuevamente"
  );
  res.redirect("/iniciar-sesion");
};

exports.formSubirImagenPerfil = async (req, res) => {
  const usuario = await Usuarios.findByPk(req.user.id);

  res.render("imagen-perfil", {
    nombrePagina: "Subir Imagen Perfil",
    usuario,
  });
};

const configuracionMulter = {
  limits: { filesize: 100000 },
  storage: (fileStorage = multer.diskStorage({
    destination: (req, file, next) => {
      next(null, __dirname + "/../public/uploads/perfiles/");
    },
    filename: (req, file, next) => {
      const extension = file.mimetype.split("/")[1];
      next(null, `${shortid.generate()}.${extension}`);
    },
  })),
  fileFilter(req, file, next) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      next(null, true);
    } else {
      next(new Error("Formato No Válido"), false);
    }
  },
};

const upload = multer(configuracionMulter).single("imagen");

exports.subirImagen = async (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          req.flash("error", "El Archivo es muy grande");
        } else {
          req.flash("error", error.message);
        }
      } else if (error.hasOwnProperty("message")) {
        req.flash("error", error.message);
      }
      res.redirect("back");
      return;
    } else {
      next();
    }
  });
};

exports.guardarImagenPerfil = async (req, res) => {
  const usuario = await Usuarios.findByPk(req.user.id);

  if (req.file && usuario.imagen) {
    const imagenAnteriorPath =
      __dirname + `/../public/uploads/perfiles/${usuario.imagen}`;

    fs.unlink(imagenAnteriorPath, (error) => {
      if (error) {
        console.log(error);
      }
      return;
    });
  }
  
  if (req.file) {
    usuario.imagen = req.file.filename;
  }

  await usuario.save();
  req.flash("exito", "Cambios Almacenados Correctamente");
  res.redirect("/administracion");
};
