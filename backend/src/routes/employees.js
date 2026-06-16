import express from "express";
import employeeController from "../controllers/employeesController.js";
import {validateAuthCookie} from "../middlewares/authMiddleware.js";

//Utilizo Router()
const router = express.Router();

router
  .route("/")
  .get(validateAuthCookie(["Employees", "Admin"]),employeeController.getEmployees)
  .post(validateAuthCookie(["Admin"]),employeeController.insertEmployee);

router
  .route("/:id")
  .put(employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

export default router;

