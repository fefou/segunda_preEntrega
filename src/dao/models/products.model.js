import mongoose from "mongoose";
const productsEsquema = new mongoose.Schema({

    title: {
        type: String,
        require: true,
        max: 100,
    },
    description: String,
    price: {
        type: Number,
        require: true,
        min: 0
    },
    thumbnail: String,
    code: {
        type: Number,
        require: true,
        min: 0,
        unique: true
    },
    stock: {
        type: Number,
        require: true,
        min: 0
    },
    category: {
        type: String,
        require: true,
        max: 100,
    },
    deleted: {
        type: Boolean,
        default: false
    }
})
export const productsModelo = mongoose.model("products", productsEsquema)