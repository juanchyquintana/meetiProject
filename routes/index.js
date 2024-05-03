const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController.js");
const usuariosController = require("../controllers/usuariosController.js");
const authController = require("../controllers/authController.js");
const adminController = require("../controllers/adminController.js");
const gruposController = require("../controllers/gruposController.js");
const meetiController = require("../controllers/meetiController.js");

const meetiControllerFE = require("../controllers/frontend/meetiControllerFE.js");
const usuariosControllerFE = require("../controllers/frontend/usuariosControllerFE.js");
const gruposControllerFE = require("../controllers/frontend/gruposControllerFE.js");
const comentariosControllerFE = require("../controllers/frontend/comentariosControllerFE.js");
const busquedaControllerFE = require("../controllers/frontend/busquedaControllerFE.js");

module.exports = function () {
  router.get("/", homeController.home);
  router.get("/meeti/:slug", meetiControllerFE.mostrarMeeti);

  router.post(
    "/confirmar-asistencia/:slug",
    meetiControllerFE.confirmarAsistencia
  );

  router.get("/asistentes/:slug", meetiControllerFE.mostrarAsistentes);

  router.post("/meeti/:id", comentariosControllerFE.agregarComentario);

  router.post("eliminar-comentario", comentariosControllerFE.eliminarComentario)

  router.get("/usuarios/:id", usuariosControllerFE.mostrarUsuario);

  router.get("/grupos/:id", gruposControllerFE.mostrarGrupo);

  router.get("/categoria/:categoria", meetiControllerFE.mostrarCategoria);

  router.get('/busqueda', busquedaControllerFE.resultadosBusqueda)

  router.get("/crear-cuenta", usuariosController.formCrearCuenta);
  router.post("/crear-cuenta", usuariosController.crearNuevaCuenta);
  router.get("/confirmar-cuenta/:correo", usuariosController.confirmarCuenta);

  router.get("/iniciar-sesion", usuariosController.formIniciarSesion);
  router.post("/iniciar-sesion", authController.autenticarUsuario);

  router.get(
    "/cerrar-sesion",
    authController.usuarioAutenticado,
    authController.cerrarSesion
  );

  router.get(
    "/administracion",
    authController.usuarioAutenticado,
    adminController.panelAdministracion
  );

  router.get(
    "/nuevo-grupo",
    authController.usuarioAutenticado,
    gruposController.formNuevoGrupo
  );
  router.post(
    "/nuevo-grupo",
    authController.usuarioAutenticado,
    gruposController.subirImagen,
    gruposController.crearGrupo
  );

  router.get(
    "/editar-grupo/:grupoId",
    authController.usuarioAutenticado,
    gruposController.formEditarGrupo
  );

  router.post(
    "/editar-grupo/:grupoId",
    authController.usuarioAutenticado,
    gruposController.editarGrupo
  );

  router.get(
    "/imagen-grupo/:grupoId",
    authController.usuarioAutenticado,
    gruposController.formEditarImagen
  );

  router.post(
    "/imagen-grupo/:grupoId",
    authController.usuarioAutenticado,
    gruposController.subirImagen,
    gruposController.editarImagen
  );

  router.get(
    "/eliminar-grupo/:grupoId",
    authController.usuarioAutenticado,
    gruposController.formEliminarGrupo
  );

  router.post(
    "/eliminar-grupo/:grupoId",
    authController.usuarioAutenticado,
    gruposController.eliminarGrupo
  );

  router.get(
    "/nuevo-meeti",
    authController.usuarioAutenticado,
    meetiController.formNuevoMeeti
  );

  router.post(
    "/nuevo-meeti",
    authController.usuarioAutenticado,
    meetiController.crearMeeti
  );

  router.get(
    "/editar-meeti/:id",
    authController.usuarioAutenticado,
    meetiController.formEditarMeeti
  );

  router.post(
    "/editar-meeti/:id",
    authController.usuarioAutenticado,
    meetiController.editarMeeti
  );

  router.get(
    "/eliminar-meeti/:id",
    authController.usuarioAutenticado,
    meetiController.formEliminarMeeti
  );

  router.post(
    "/eliminar-meeti/:id",
    authController.usuarioAutenticado,
    meetiController.eliminarMeeti
  );

  router.get(
    "/editar-perfil",
    authController.usuarioAutenticado,
    usuariosController.formEditarPerfil
  );

  router.post(
    "/editar-perfil",
    authController.usuarioAutenticado,
    usuariosController.editarPerfil
  );

  router.get(
    "/cambiar-password",
    authController.usuarioAutenticado,
    usuariosController.formCambiarPassword
  );

  router.post(
    "/cambiar-password",
    authController.usuarioAutenticado,
    usuariosController.cambiarPassword
  );

  router.get(
    "/imagen-perfil",
    authController.usuarioAutenticado,
    usuariosController.formSubirImagenPerfil
  );

  router.post(
    "/imagen-perfil",
    authController.usuarioAutenticado,
    usuariosController.subirImagen,
    usuariosController.guardarImagenPerfil
  );

  return router;
};
