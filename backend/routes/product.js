const express = require('express'); //npm install express
const router = express.Router();
const {Product} = require('../models/product');


router.post(`/`, (req, res) =>{
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    })
    product.save().then((createdProduct => {
        res.status(201).json(createdProduct)
    })).catch((err) => {
        res.status(500).json({
            error : err,
            success: false,
        })
    })
})

//READ API 
router.get(`/`, async (req, res) =>{
    const productList = await Product.find();

    if(!productList){
        res.status(500).json({
            success : false
        })
    }
    
    res.send(productList);
})

module.exports = router;