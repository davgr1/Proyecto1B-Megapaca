const logoutController = {};

logoutController.logout = async (req, res) =>{
    //limpiar la cookue que tiene ña informacion
    //de quien inicio sesion
    res.clearCookie("authCookie");

    return res.status(200).json({message: "Sesion cerrada"});
};

export default logoutController;