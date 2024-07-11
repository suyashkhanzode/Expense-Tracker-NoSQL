const express = require("express");

const helmet = require('helmet');

const morgan = require('morgan');

const mongoose = require('mongoose')

const path = require('path');
const fs = require('fs');
require('dotenv').config()

const app = express();

app.use(helmet())

app.use(express.json());

app.use((request, response, next)=>{
    response.setHeader('Access-Control-Allow-Origin',"*");
    response.setHeader('Access-Control-Allow-Headers',
    "*");
    response.setHeader('Access-Control-Allow-Methods',"*")
 
    next();
 });
 
 var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
 app.use(morgan('combined', { stream: accessLogStream }))

 const userRoute = require('./routes/user')
  const expenseRoute = require('./routes/expense')
 const orderRoute = require('./routes/order')
 const passwordRoute = require('./routes/password')
 const fileurlRoute = require('./routes/fileurl');
 
 app.use('/user',userRoute)
 app.use('/expenses',expenseRoute)
 app.use('/order',orderRoute)
 app.use('/password',passwordRoute)
 app.use('/files',fileurlRoute)
 


 mongoose.connect(process.env.CONNECTION_URL)
 .then(()=>{
 
     app.listen(3000,()=>{
         console.log("Server Started")
     })
 })
 .catch((err) =>{
     console.log(err)
 })
