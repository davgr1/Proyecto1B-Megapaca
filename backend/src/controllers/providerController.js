import providerModel from "../models/providers.js";

import { v2 as cloudinary } from "cloudinary";

//Array de funciones
const providerController = {};

//SELECT
providerController.getAllProviders = async (req, res) => {
  try {
    const providers = await providerModel.find();
    return res.status(200).json(providers);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//INSERT
providerController.insertProvider = async (req, res) => {
  try {
    //Solicito los datos
    const { name, phone } = req.body;

    const newProvider = new providerModel({
      name,
      phone,
      image: req.file.path,
      public_id: req.file.filename,
    });

    await newProvider.save();

    return res.status(200).json({ message: "Provider saved" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

//UPDATE
providerController.updateProvider = async (req, res) => {
  try {
    //Solicitamos los datos
    const { name, phone } = req.body;

    const providerFound = await providerModel.findById(req.params.id);

    const updatedData = {
      name,
      phone,
    };

    //Si viene alguna imagen nueva
    if (req.file) {
      //Eliminar la imagen anterior
      await cloudinary.uploader.destroy(providerFound.public_id);

      //Guardo la nueva imagen
      updatedData.image = req.file.path;
      updatedData.public_id = req.file.filename;
    }

    await providerModel.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    return res.status(200).json({ message: "Provider updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

providerController.deleteProvider = async (req, res) => {
  try {
    const providerFound = await providerModel.findById(req.params.id);

    //Elimino la imagen de Cloudinary
    await cloudinary.uploader.destroy(providerFound.public_id);

    //Elimino al usuario de la base de datos
    await providerModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Provider deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default providerController;
