import express from "express";
import productRoutes from "./src/routes/products.js";
import branchesRoutes from "./src/routes/branches.js";
import employeesRoutes from "./src/routes/employees.js";
import customerRoutes from "./src/routes/customer.js";
import registerCustomerRoutes from "./src/routes/registerCustomer.js";
import loginCustomerRoutes from "./src/routes/login.js";
import cookieParser from "cookie-parser";
//Creo una constante que guarde Express
const app = express();

//Que acepte los json desde postman
app.use(express.json());
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/registerCustomer", registerCustomerRoutes);
app.use("/api/loginCustomer", loginCustomerRoutes);

export default app;
