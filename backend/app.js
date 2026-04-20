import express from "express";
import productRoutes from "./src/routes/products.js";
import branchesRoutes from "./src/routes/branches.js";
import employeesRoutes from "./src/routes/employees.js";
import customerRoutes from "./src/routes/customer.js";
import registerCustomerRoutes from "./src/routes/registerCustomer.js";
import loginCustomerRoutes from "./src/routes/login.js";
import logoutRoutes from "./src/routes/logout.js";
import cookieParser from "cookie-parser";
import cors from "cors";
//Creo una constante que guarde Express
const app = express();

//Que acepte los json desde postman
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost5173", "localhost5174"],
    //permiri el envio de cookies y credenales
    credentials: true,
}),
);          

app.use("/api/products", productRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/registerCustomer", registerCustomerRoutes);
app.use("/api/loginCustomer", loginCustomerRoutes);
app.use("/api/logout", logoutRoutes);

export default app;
