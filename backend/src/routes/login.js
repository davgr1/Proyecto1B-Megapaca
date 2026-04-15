import express from "express";
import loginCustomersController from "../controllers/loginCustomerControtroller.js";

const router = express.Router();

router.route("/").post(loginCustomersController.login);

export default router;