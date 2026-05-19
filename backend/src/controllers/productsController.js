//Creo un array de métodos
const productsController = {};

//Import el Schema de la colección que
//vamos a utilizar
import productsModel from "../models/products.js";

//SELECT
productsController.getProducts = async (req, res) => {
  const products = await productsModel.find();
  res.json(products);
};

//INSERT
productsController.insertProducts = async (req, res) => {
  //#1- Solicito los datos a guardar
  const { name, description, price, stock } = req.body;
  //#2- Lleno una instacia de mi Schema
  const newProduct = new productsModel({ name, description, price, stock });
  //#3- guardo en la base de datos
  await newProduct.save();

  res.json({ message: "Product saved" });
};

//ELIMINAR
productsController.deleteProducts = async (req, res) => {
  await productsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};

//ACTUALIZAR
productsController.updateProducts = async (req, res) => {
  //#1- pido los nuevos datos
  const { name, description, price, stock } = req.body;
  //#2- actualizo los datos
  await productsModel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      price,
      stock,
    },
    { new: true },
  );

  res.json({ message: "product updated" });
};

//select por id
productsController.getProductById = async (req, res) => {
  try {
    const producto = await productsModel.findById(req.params.id)
    if(!producto){
      return res.status(404).json({message: "product not found"})
    }
    return res.status(200).json(producto);
  } catch (error) {
    console.log("error" + error)
    return res.status(500).json({message: "internal server error"})
  }
};

//select de productos con stock bajos
productsController.getLowStock = async (req, res) => {
  try {
    const productos = await productsModel.find({stock: {$lt: 5}})

    if(!productos){
      return res.status(404).json({message: "there are not product whit low stock"})
    }

    return res.status(200).json(productos);
  } catch (error) {
    console.log("error" + error)
    return res.status(500).json({message: "internal server error"})
  }
};

//select con diltro
productsController.getProductsByPriceRange = async (req, res) => {
  try {
    //solicitar datos
    const {min, max} = req.body;

    const products = await productsModel.find({
      price: {$gte: min, $lte: max}
    })

    if(!products){
      return res.status(404).json({message: "not product with this price range"})
    }

    return res.status(200).json(products)
  } catch (error) {
    console.log("error" + error)
    return res.status(500).json({message: "internal server error"})
  }
};

//contar cuantos elementos hay en una colecion
productsController.countProduct = async (req, res) => {
  try {
    const count = await productsModel.countDocuments();

    return res.status(200).json(count)
  } catch (error) {
    console.log("error" + error)
    return res.status(500).json({message: "internal server error"})
  }
};

//buscar por nombre
productsController.searchByName = async (req, res) => {
  try {
    //nombre a buscar
    const { name } = req.body;

    const products = await productsModel.find({
      name: {$regex: name, $options: "i"}
    })

    if(!products){
      return res.status(404).json({message: "not product found"})
    }

    return res.status(200).json(products)
  } catch (error) {
    console.log("error" + error)
    return res.status(500).json({message: "internal server error"})
  }
};

export default productsController;
