
require('dotenv/config');
const express = require('express');
const app = express();


const api = process.env.API_URL;

app.get(api+'/products', (req, res) =>{
    res.send('hello API');
})

app.listen(3000, ()=>{
    console.log(api);
    console.log('Server is running http://localhost:3000');
})