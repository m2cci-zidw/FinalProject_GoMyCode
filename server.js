//require 
const express= require('express')
require("dotenv").config()
const connectDB= require('./config/connectDB')

//instance express
const app= express()

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
