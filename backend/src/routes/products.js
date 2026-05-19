import express from "express";
import productsController from "../controllers/productsController.js";

//Router() nos ayuda a colocar los métodos
// que tendrá el endpoint
const router = express.Router();

router.route("/")
.get(productsController.getProducts)
.post(productsController.insertProducts);


//subEndPoints
router.route("/low-stock")
.get(productsController.getLowStock);

router.route("/price-range")
.post(productsController.getProductsByPriceRange);

router.route("/count")
.get(productsController.countProduct);

router.route("/search_name")
.post(productsController.searchByName);

router.route("/:id")
.put(productsController.updateProducts) 
.delete(productsController.deleteProducts)
.get(productsController.getProductById);


export default router;
