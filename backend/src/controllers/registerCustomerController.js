import nodemailer from "nodemailer"; //Enviar correo
import crypto from "crypto"; //Generar codigo aleatorio
import jsonwebtoken from "jsonwebtoken"; // Token
import bcryptjs from "bcryptjs"; //Encriptar

import customerModel from "../models/customers.js";

import { config } from "../../config.js";

//array de funciones
const registerCustomerController = {};

registerCustomerController.register = async (req, res) => {
  //#1- Solicitar los datos
  const { name, lastName, birthdate, email, password, isVerified } = req.body;

  try {
    //Validar que el correo no exista en la base de datos
    const existsCustomer = await customerModel.findOne({ email });
    if (existsCustomer) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    //Encriptar la contraseña
    const passwordHashed = await bcryptjs.hash(password, 10);

    //generar un código aleatorio
    const randomNumber = crypto.randomBytes(3).toString("hex");

    //Guardamos en un token la información
    const token = jsonwebtoken.sign(
      //#1- ¿Qué vamos a guardar?
      {
        randomNumber,
        name,
        lastName,
        birthdate,
        email,
        password: passwordHashed,
        isVerified,
      },
      //#2- Secret Key
      config.JWT.secret,
      //#3- cuando expira
      {expiresIn: "15m"}
    );

    res.cookie("resgistrationCookie", token, {maxAge: 15 * 60 * 1000})

    //ENVIAMOS EL CÓDIGO ALEATORIO POR CORREO ELECTRÓNICO
    //#1- Transporter -> ¿Quién envía el correo?
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth:{
        user: config.email.user_email,
        pass: config.email.user_password
      }
    })

    //#2- mailOption -> ¿Quién lo recibe y como?
    const mailOptions ={
      from: config.email.user_email,
      to: email,
      subject: "Verificación de cuenta",
      text: "Para verificar tu cuenta, utiliza este código: "
    + randomNumber + " expira en 15 minutos"
    }

    //#3- Enviar el correo
    transporter.sendMail(mailOptions, (error, info)=>{
      if(error){
        console.log("error "+error)
        return res.status(500).json({message:"Error sending email"})
      }
      return res.status(200).json({message: "Email sent"})
    })
  } catch (error) {
    console.log("error"+error)
    return res.status(500).json({message: "Internal server error"})
  }
};

