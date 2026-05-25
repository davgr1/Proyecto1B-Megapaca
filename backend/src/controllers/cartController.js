import cartModel from "../models/cart.js"
import productsModel from "../models/products.js"

const cartController = {}

cartController.gatCarts = async (req, res) => {
    try {
        const carts = await cartModel.find()
        .populate("customerId", "name email")
        .populate("products.productId", "name price")

        return res.status(200).json(carts)
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

cartController.getCartById = async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.id)
        .populate("customerId", "name email")
        .populate("products.productId", "name")

        if(!cart){
            return res.status(404).json({message: "cart not found"})
        }

        return res.status(200).json(carts)
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

cartController.insertCart = async (req, res) => {
    try {
        const {customerId, products, status} = req.body;

        let total = 0

        let newProduct = []

        for (let i = 0; i < products.length; i ++){
            const productFound = await productsModel.findById(products[i].productId)

            const subtotal = productFound.price * products[i].quantity

            total  += subtotal

            newProduct.push({
                productId: products[i].productId,
                quantity: products[i].quantity,
                subtotal: subtotal          
            })
        }

        const newCart = new cartModel({
            customerId,
            products: newProduct,
            total,
            status
        })

        await newCart.save()

        res.status(200).json({message: "cart created"})
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

cartController.updateCart = async (req, res) => {
    try {
        const  {customerId, products, status} = req.body;

        let total = 0

        let newProduct = []

        for ( let i = 0; i < products.length; i++){
            const productFound = await productsModel.findById(products[i].productId);

            const subtotal = productFound.price * products[i].quantity;

            total += subtotal;

            newProduct.push({
                productId: products[i].productId,
                quantity: products[i].quantity,
                subtotal: subtotal
            })
        }

        const updatedCart = await cartModel.findByIdAndUpdate(
            req.params.id,
            {
                customerId,
                products: newProduct,
                total,
                status
            },
            {new: true}
        )

        return res.status(200).json({message: "cart updated"});

    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

cartController.daleteCart = async (req, res) => {
    try {
        const deleteCart = await cartModel.findByIdAndDelete(req.params.id)
        
        if(!deleteCart){
            return res.status(404).json({message: "cart not delete"})
        }

        return res.status(200).json({message: "Cart delete"})
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
}   

export default cartController;