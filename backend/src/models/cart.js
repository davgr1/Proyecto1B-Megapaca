/**
 * customerId
 * product: 
 *      productId
 *      quantity
 *      subtotal
 * total
 * status
 */


import mongoose, {Schema, model} from 'mongoose'

const carShema = new Schema({
    customerId: {
        type: mongoose.Types.ObjectId,
        ref: "Customers"
    },
    products: [
        {
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "products"
            },
            quantity: {type: Number},
            subtotal: {type: Number}
        }
    ],

    total: {type: Number},
    status: {type: String}
}, {
    timestamps: true,
    strict: false,
})

export default model("cart", carShema)