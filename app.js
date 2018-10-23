// import express from "express";
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');
const keys = require('./config/keys');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

//Logging handler error
app.use(morgan('dev'));

// body parser
// for handle req route /upload
app.use('/uploads',express.static('uploads'));
app.use(bodyParse.urlencoded({extended: false}));
app.use(bodyParse.json());

//connect database
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI,{
    useNewUrlParser:true
});

//Premission CORS
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization'
    );
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Method','GET,PUT,PATCH,POST,DELETE');
        return res.status(200).json({});
    }
    next();
});

// Routes
app.use('/api/products' , productRoutes);
app.use('/api/orders' , orderRoutes);
app.use('/api/users', userRoutes);

//handler routes if we pass and none of the routes
app.use((req,res,next)=>{
    const error = new Error ('Not Found');
    error.status= 404;
    //forward request to error
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status||500);
    res.json({
        message: error.message
    });
});



module.exports = app;