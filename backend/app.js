
require('dotenv/config'); //npm install dotenv

const bodyParser = require('body-parser'); //npm install body-parser
const express = require('express'); //npm install express
const app = express();
const morgan = require('morgan'); //npm install morgan
const mongoose = require('mongoose');

//Environment Variable
const api = process.env.API_URL;


//#region Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
//#endregion

const productSchema = new mongoose.Schema ({
    name : String,
    image: String,
    countInStock: {
        type : Number,
        required: true
    }
})

const Product = mongoose.model('Product', productSchema);

//DB CONNECT
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    dbName: 'ShopIT'
})
.then(()=>{
    console.log('Database Connected Successfully');
})
.catch((err) =>{
    console.log(err);
})

//#region REST API

//CREATE API SAMPLE
app.post(`${api}/products`, (req, res) =>{
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
app.get(`${api}/products`, async (req, res) =>{
    const productList = await Product.find();

    if(!productList){
        res.status(500).json({
            success : false
        })
    }
    
    res.send(productList);
})

app.listen(3000, ()=>{
    console.log('Server is running http://localhost:3000');
})
//#endregion