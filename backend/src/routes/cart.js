import express from "express";
import cartController from "../controllers/cartController.js";
 
const router = express.Router()
 
router.route("/")
.get(cartController.gatCarts)
.post(cartController.insertCart)
 
router.route("/:id")
.put(cartController.updateCart)
.delete(cartController.daleteCart)
.get(cartController.getCartById)
 
export default router; 