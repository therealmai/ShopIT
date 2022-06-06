const express = require('express'); //npm install express
const { Category } = require('../models/category');
const router = express.Router();
const {Product} = require('../models/product');
const mongoose = require('mongoose');



//READ API 
router.get(`/`, async (req, res) =>{
    let filter = {};
    if(req.query.categories){
        //http://localhost:3000/api/v1/products?categories=123123111,1231332
        filter = {category : req.query.categories.split(',')}
    }

    // const productList = await Product.find().select('name image price -_id'); Chuy way to limpyo
    const productList = await Product.find(filter).populate('category');

    if(!productList){
        res.status(500).json({
            success : false
        })
    }
    res.send(productList);
})

router.get(`/:id`, async (req, res) =>{
    const product = await Product.findById(req.params.id).populate('category');

    if(!product){
        res.status(500).json({
            success : false
        })
    }
    res.send(product);
})

router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments();

    if(!productCount){
        res.status(500).json({
            success : false
        })
    }
    res.send({
        count : productCount
    });
})

router.get('/get/featured/:count', async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({isFeatured : true}).limit(+count);

    if(!products){
        res.status(500).json({
            success : false
        })
    }
    res.send(products);
})

//Create Product
router.post(`/`, async (req, res) =>{
    const category = await Category.findById(req.body.category);
    if(!category) 
    return res.status(400).send('Invalid Category');

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand : req.body.brand,
        price : req.body.price,
        category : req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
    })

    product = await product.save();
   
    if(!product)
    return res.status(500).send('Cannot create product');

    return res.send(product);
})



router.put('/:id', async (req, res) => {
    
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid Product Id');
    }

    const category = await Category.findById(req.body.category);
    if(!category) 
    return res.status(400).send('Invalid Category');

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand : req.body.brand,
            price : req.body.price,
            category : req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured,
        },
        {new: true}
    );

    if(!product)
    return res.status(404).send('the product cannot be updated');

    res.send(product);
})

router.delete('/:id', (req, res) =>{
    Product.findByIdAndRemove(req.params.id).then(product => {
        if(product){
            return res.status(200).json({success: true, message: 'the product is deleted'});
        }else{
            return res.status(404).json({success : false, message: 'product not deleted'});
        }
    }).catch(err =>{
        return res.status(400).json({success: false, error: err})
    })
})


module.exports = router;