import { Router } from "express";
export const router = Router();
import productosJSON from "../json/productos.json" assert { type: "json" };
import mongoose from "mongoose";
import { productsModelo } from "../dao/models/products.model.js";
import { cartsModelo } from "../dao/models/carts.model.js";

router.get("/", (req, res) => {
  res.status(200).render("Home");
});

router.get("/realtimeproducts", async (req, res) => {
  let products;
  try {
    // products = await productsModelo.find({ deleted: false }).lean();
    products = await productsModelo.paginate({}, { lean: true });

    res.status(200).render("productos", { products: products.docs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/chat", (req, res) => {
  res.status(200).render("chat");
});

router.get("/carts", async (req, res) => {
  let carts;
  try {
    carts = await cartsModelo.paginate(
      {},
      { lean: true, populate: "products.product" }
    );
    console.log(carts);
    res.status(200).render("carts", { carts: carts.docs });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error al obtener carritos");
  }
});
