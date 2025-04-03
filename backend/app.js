const express=require('express');
const dotenv=require('dotenv');
dotenv.config();
const app=express();
const db=require('./config/mongoose-connection');
const userRouter=require('./router/user-router');
const productRouter=require('./router/product-router')
const adminRouter=require('./router/admin-router');
const cors=require('cors');
const cookie=require('cookie-parser')
app.use(cors());
app.use(cookie());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/users',userRouter);
app.use('/products',productRouter);
app.use('/admin',adminRouter);
module.exports=app;