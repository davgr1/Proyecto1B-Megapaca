import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 5*60*1000, //5 minutos
    max: 5, //maximo de solicitudes HTTP
    message: {
        status: 429,
        error: "Too many request"
    }
})

export default limiter;