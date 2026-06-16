//este middeleware lo que hara será:
//1 accede a las cookie
//2 mira que valor hay dentro de esa cookie
//3 se el valor de la cookie coincide con la proteccion que
//escribimos en el enpoint o metodo http entonces lo dejamos pasar
//si no, no

import jsonwebtoken from "jsonwebtoken";
import { config } from "../../config.js";

export const validateAuthCookie = (allowedTypes =[] ) => {

    return (req, res, next) => {
        try {
            //1 extraer el token qeu esta en la cookie(authCookie)
            //tya que en esa cookie elt ipo de usuario guardado

            const {authCookie} = req.cookie;

            if(!authCookie){
                return res.status(403).json({message: "no cookie found, authorization require"})
            }

            //2 extraer toda la informacion de la cookie
            const decoded = jsonwebtoken.verify(authCookie, config.JWT.secret)

            //verificar si el rol de la cookie puede pasar o no
            if(!allowedTypes.includes(decoded.userType)){
                return res.status(401).json({message: "access denied"})
            }

            next()
        } catch (error) {
            console.log("error" + error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default validateAuthCookie;