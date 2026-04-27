import express from "express"
import recoverPasswordController from "../controllers/recoveryPasswordController.js"

const router = express.Router(); 

router.route("/requestCode").post( recoverPasswordController.requestCode);
router.route("/verifyCode").post( recoverPasswordController.verifyCode);
router.route("/newPassword").post( recoverPasswordController.newPassword);

export default router;