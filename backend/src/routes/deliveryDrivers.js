import express from "express";
import deliveryDriversController from "../controllers/deliveryDriversController.js";
import upload  from "../utils/cloudinaryConfig.js";

const router = express.Router()

router.route("/")
.get(deliveryDriversController.getAllDrivers)
.post(upload.single("image"), deliveryDriversController.insertDrivers);

router.route("/:id")
.put(upload.single("image"), deliveryDriversController.updateDriver)
.delete(deliveryDriversController.updateDriver);

export default router;