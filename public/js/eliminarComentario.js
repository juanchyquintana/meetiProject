import axios from "axios";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", () => {
  const formsEliminar = document.querySelectorAll(".eliminar-comentario");

  if (formsEliminar.length > 0) {
    formsEliminar.forEach((form) => {
      form.addEventListener("submit", eliminarComentario);
    });
  }
});

function eliminarComentario(e) {
  e.preventDefault();

  Swal.fire({
    title: "Eliminar Comentario",
    text: "Un comentario eliminado no se puede eliminar!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, Borrar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      const comentarioId = this.children[0].value;
      const datos = {
        comentarioId,
      };
      axios
        .post(this.action, datos)
        .then((respuesta) => {
          Swal.fire("Eliminado!", respuesta.data, "success");
          this.parentElement.parentElement.remove();
        })
        .catch((error) => {
          if(error.response.status === 403 || error.response.status === 404) {
            Swal.fire("Error!", error.response.data, "error");
          }
        });
    }
  });
}
