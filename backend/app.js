

const bodyParser = require('body-parser'); //npm install body-parser
const express = require('express'); //npm install express
const app = express();
const cors = require('cors') //npm install cors
const morgan = require('morgan'); //npm install morgan
const mongoose = require('mongoose');
const productsRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
const userRouter = require('./routes/users');
const orderRouter = require('./routes/order');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
app.use(cors());
app.options('*', cors());

//Environment Variable
require('dotenv/config'); //npm install dotenv
const api = process.env.API_URL;

//Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler)
app.use('/public/uploads', express.static(__dirname + '/public/uploads' ))


//Routes
app.use(`${api}/users`, userRouter);
app.use(`${api}/products`, productsRouter);
app.use(`${api}/category`, categoryRouter);
app.use(`${api}/orders`, orderRouter);

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


app.listen(3000, ()=>{
    console.log('Server is running http://localhost:3000');
})
