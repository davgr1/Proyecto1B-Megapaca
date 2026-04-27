const HTMLRecoveryEmail = (code)=>{
    return `
 <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f9; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: 0 auto;">
 <h1 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px;">Recuperación de contraseña</h1>
 <p style="font-size: 16px; color: #555; line-height: 1.5;">
 Hola, hemos recibido una solicitud para restablecer tu contraseña. Usa el código de verificación que aparece a continuación para continuar:
 </p>
 <div style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 18px; font-weight: bold; color: #fff; background-color: #ff7f50; border-radius: 5px; border: 1px solid #e67e22;">
          ${ code }
 </div>
 <p style="font-size: 14px; color: #777; line-height: 1.5;">
 Este código es válido durante los próximos <strong>15 minutos</strong>. Si no solicitaste este correo electrónico, puedes ignorarlo sin problema.
 </p>
 <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
 <footer style="font-size: 12px; color: #aaa;">
 Si necesita más ayuda, póngase en contacto con nuestro equipo de soporte en
 <a href="mailto: support@example.com " style="color: #3498db; text-decoration: none;"> support@example.com </a>.
 </footer>
 </div>
 ` ;
}

export default HTMLRecoveryEmail;