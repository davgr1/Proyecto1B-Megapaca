import express from "express";
import adminController from "../controllers/adminController.js";

//usamos Router() de la libreria express para
//definir los métodos HTTP a utilizar
const router = express.Router();

router.route("/")
    .get(adminController.getAdmin);

router.route("/:id")
  .put(adminController.updateAdmin)
  .delete(adminController.deleteAdmin);

export default router;
