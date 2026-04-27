import  JsonWebtoken  from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

import HTMLRecoveryEmail from "../utils/sendMailRecovery.js";

import { config } from "../../config.js";

import customerModel from "../models/customers.js";
import { json } from "stream/consumers";

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
        const token = JsonWebtoken.sign(
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

recoveryPasswordController.verifyCode = async (req,res) => {
    try {
        //#1 solicitad codigo
        const {code} = req.body;

        //obtenemos la info del token
        //accedenis a la cookie
        const token = reportError.cookie.recoveryCookie;

        const decoded = JsonWebtoken.verify(token, config.JWT.secret)

        //ahora comparamos el codigo que escribio el usuario
        //con el que esta dentro del token
        if(code !== decoded.randomCode){
            return res.status(400).json({message: "Invalid code"})
        }

        ///en cambio si escribe bien el codigo
        //vamos a colocar en el token esta verificado
        const newToken = JsonWebtoken.sign(
            //#1 que guardaremos
            {email: decoded.email, userType: "customer", verified: true},
            //#2 clave secret
            config.JWT.secret,
            //#3 cuando expora
            {expiresIn: "15m"},
        );

        res.cookies("recoveryCookie", newToken, {maxAge: 15 *60 * 1000});

        return res.status(200).json({message: "code verified successfully"});

    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "INTERNAL SERVER ERROR"})
    }
};

recoveryPasswordController.newPassword = async (req,res) => {
    try {
        //#1 solicitar datos
        const {newPassword, confirmNewPassword} = req.body;

        //comparolos dos contraseñas
        if(newPassword !== confirmNewPassword){
            return res.status(400).json({message: "pasword doesnt match"})
        }

        //vamos omprobar que este verificado
        //ya este en true o sea que haya paasdo el apso 2
        const token = req.cookie.recoveryCookie;
        const decoded = JsonWebtoken.verify(token, config.JWT.secret);

        if(!decoded.verified){
            return res.status(400).json({message: "code not verified"})
        }

        //actualiozar y encriptar
        const passwordHash = await bcrypt.hash(newPassword, 10)

        ///actualizar en la base de datos
        await customerModel.findByIdAndUpdate(
            {email: decoded.email},
            {password: passwordHash},
            {new: true},
        );

        res.clearCookie("recoveryCookie");

        return res.status(200).json({message: "password updated"});
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "internal server error"});
    }
};

export default recoveryPasswordController;