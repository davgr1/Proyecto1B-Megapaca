import  jsonwebtoken  from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

import HTMLRecoveryEmail from "../utils/sendMailRecovery.js";

import { config } from "../../config.js";

import customerModel from "../models/customers.js";

const recoveryPasswordController = {};

recoveryPasswordController.requestCode = async (req, res) => {
    try {
        //#1 solicitamos
        const {email} = req.body;

        //validar que correo si existe en la bd
        const userFound = await customerModel.findOne({email});
        if(!userFound){
            return res.status(404).json({message: "user not found"});
        }

        //generar el codigo aleatorio
        const randomCode = crypto.randomBytes(3).toString("hex")

        //guardamos todo en un tpken
        const token = jsonwebtoken.sign(
            //#1 que guardaremos
            {email, randomCode, userType: "customer", verified: false},
            //#2 clave secreta
            config.JWT.secret,
            //#3 cuabto espira
            {expiresIn: "15m"}
        );

        res.cookie("recoveryCookie", token, {maxAge: 15 *60 * 1000});

        //enviar por correo electronico 
        //el codigo que generamos

        //#1 quien lo envia
        const trasporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_password
            } 
        })

        //#2 mailOption -> quien lo reive y como
        const mailOption = {
            from: config.email.user_email,
            to: email,
            subject: "codigo de recuperacion",
            body: "el codigo expira en 15 minutos",
            html: HTMLRecoveryEmail(randomCode)
        }

        //#3 enviar el coreo
        trasporter.sendMail(mailOption, (error, info) => {
            if(error) {
                console.log("error"+error)
                return res.status(500).json({message: "error sending email"})
            }
                    return res.status(200).json({message: "email sent"})

        })

    } catch (error)
     {
        console.log("error"+error)
        return res.status(500).json({message: "internal server error"})
    }
};                                                      

recoveryPasswordController.verifyCode = async (req, res) => {
    try {
      const { code } = req.body;
      //obtenemos la informacion que esta dentro del token, accedemos a la cookie
      const token = req.cookies.recoveryCookie;
      const decoded = jsonwebtoken.verify(token, config.JWT.secret);
      //comparamos los codigos
      if (code !== decoded.randomCode) {
        return res.status(400).json({ message: "Invalid code" });
      }
      //si lo escribe bien, saldra omg si beba
      const newToken = jsonwebtoken.sign(
        { email: decoded.email, userType: "customer", verified: true },
        config.JWT.secret,
        { expiresIn: "15m" },
      );
 
      res.cookie("recoveryCookie", newToken, { maxAge: 15 * 60 * 1000 });
      return res.status(200).json({ message: "Code verified successfully" });
    } catch (error) {
      console.log("error" + error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

recoveryPasswordController.newPassword = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "password doesnt match" });
    }
    const token = req.cookies.recoveryCookie;
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    if (!decoded.verified) {
      return res.status(400).json({ message: "Code not verified" });
    }
    //Encriptar
    const passwordHash = await bcrypt.hash(newPassword, 10);
    //actualizar contraseña en la base de datos
    await customerModel.findOneAndUpdate(
      { email: decoded.email },
      { password: passwordHash },
      { new: true },
    );

        res.clearCookie("recoveryCookie");

        return res.status(200).json({message: "password updated"});
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "internal server error"});
    }
};

export default recoveryPasswordController;