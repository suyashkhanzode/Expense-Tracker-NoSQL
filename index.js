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


