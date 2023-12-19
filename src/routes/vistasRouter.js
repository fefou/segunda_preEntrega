import { Router } from "express";
export const router = Router();
import productosJSON from "../json/productos.json" assert { type: "json" };
import mongoose from "mongoose";
import { productsModelo } from "../dao/models/products.model.js";
import { cartsModelo } from "../dao/models/carts.model.js";

router.get("/", (req, res) => {
  res.status(200).render("Home");
});


// ------------ PRODUCTOS ------------
router.get("/realtimeproducts", async (req, res) => {

  let pagina = 1
  if (req.query.pagina) {
    pagina = Number(req.query.pagina)
  }

  let limite
  if (!req.query.limit) {
    limite = 10
  }else{
    limite = Number(req.query.limit)
  }

  let category = req.query.category || null;
  let sort = req.query.sort || 'asc';

  let filter = {};
  if (category) {
    filter.category = category;
  }

  let products;
  try {
    products = await productsModelo.paginate(filter, { lean: true, page: pagina, limit: limite, sort: {price: sort} });

    let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = products;

    console.log(products)

    res.status(200).render("productos", { products: products.docs, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, limit: limite, category, sort });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/realtimeproducts/:pid', async (req, res) => {
  const { pid } = req.params;

  try {
    const product = await productsModelo.findById(pid).lean();

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).render('product', { product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ------------ PRODUCTOS ------------



//  ------------ CHAT ------------

router.get("/chat", (req, res) => {
  res.status(200).render("chat");
});
//  ------------ CHAT ------------


// ------------ CARRITOS ------------
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

router.get('/carts/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartsModelo.findById(cid).populate('products.product').lean();

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    res.status(200).render('cart', { cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------ CARRITO ------------


//  ------------ AGREGAR AL CARRITO ------------
router.post('/carts/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await cartsModelo.findById(cid);
    const product = await productsModelo.findById(pid);

    if (!cart || !product) {
      return res.status(404).json({ message: 'Carrito o producto no encontrado' });
    }

    cart.products.push({
      product: pid,
      quantity: quantity
    });

    await cart.save();

    res.redirect('/carts/' + cid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------ AGREGAR AL CARRITO ------------