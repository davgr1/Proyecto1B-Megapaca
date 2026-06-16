import express from "express";
import branchesController from "../controllers/branchesController.js";
import {validateAuthCookie} from "../middlewares/authMiddleware.js";


//Utilizo Router() para definir los metodos (ger, post, put)
//para mi endpoint

const router = express.Router();

router
  .route("/")
  .get(validateAuthCookie(["Employees", "Admin"]),branchesController.getbranches)
  .post(validateAuthCookie(["Admin"]),branchesController.insertBranches);

router
  .route("/:id")
  .put(branchesController.updateBranches)
  .delete(branchesController.deleteBranches);

export default router;
