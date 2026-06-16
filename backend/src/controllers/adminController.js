import adminModel from "../models/admin.js";

//Array de funciones
const adminController = {};

//SELECT
adminController.getAdmin = async (req, res) => {
  try {
    const admins = await adminModel.find();
    return res.status(200).json(admins);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//UPDATE
adminController.updateAdmin = async (req, res) => {
  try {
    //#1- solicitamos los nuevos datos
    let {
      name,
      email,
      password,
      isVerified,
      loginAttemps,
      timeOut,
    } = req.body;

    //Validaciones
    name = name?.trim();
    email = email?.trim();

    //valores requires
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Fields required" });
    }

    const adminUpdated = await adminModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        password,
        isVerified,
        loginAttemps,
        timeOut,
      },
      { new: true },
    );

    if (!adminUpdated) {
      return res.status(404).json({ message: "admin not found" });
    }

    return res.status(200).json({ message: "admin updated" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//ELIMINAR
adminController.deleteAdmin = async (req, res) => {
  try {
    const deleteAdmin = adminModel.findByIdAndDelete(req.params.id);

    //Si no se elimina es por que no encontró el id
    if (!deleteAdmin) {
      return res.status(404).json({ message: "admin not found" });
    }

    return res.status(200).json({ message: "admin deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default adminController;
