import { Router } from 'express';
export const router=Router()
import productosJSON from '../json/productos.json' assert { type: "json" }
import mongoose from 'mongoose';
import { productsModelo } from '../dao/models/products.model.js'


router.get('/',(req,res)=>{ 

    res.status(200).render('Home')
})


router.get('/realtimeproducts', async(req,res)=>{ 
   
    try {
        let products= await productsModelo.find({deleted:false}).lean()
        
        res.status(200).render('productos', {products})
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

router.get('/chat',(req,res)=>{ 

    res.status(200).render('chat')
})
