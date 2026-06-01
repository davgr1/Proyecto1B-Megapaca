/**
 * campos
 * name
 * phone
 * image
 * cars: {
 *  MODELO
 *  MARCA
 *  PLACA
 * }
 * isActive
 */

import { Schema, model } from "mongoose";

const deliveryDriversSchema = new Schema({
    name: {type: String},
    phone : {type: String},
    image: {type: String},
    public_id: {type: String},
    cars: [
        {
            modelo: {type: String},
            marca: {type: String},
            placa: {type: String}
        }
    ],
    isActive: {type: Boolean}
}, {
    timestamps: true,
    strict: false
})

export default model("deliveryDrivers", deliveryDriversSchema);