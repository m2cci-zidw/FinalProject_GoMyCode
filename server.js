//require 
const express= require('express')
const cors = require('cors');
require("dotenv").config()
const connectDB= require('./config/connectDB')

//instance express
const app= express()


const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }
  app.use(cors(corsOptions));

// connection DB
connectDB()

//Midelleware global
app.use(express.json())

// routes : Users & Post
app.use('/api/users',require('./routes/user.routes'))
app.use('/api/post' , require('./routes/post.routes'))




//Port
const PORT=process.env.PORT
//create server
app.listen(PORT,(err)=>{
    err? console.log('server is not running')
    :
    console.log(`Server is runnig in PORT ${PORT}` )
})
