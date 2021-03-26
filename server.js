//require 
const express= require('express')
require("dotenv").config()
const connectDB= require('./config/connectDB')

//instance express
const app= express()

// connection DB
connectDB()
//Port
const PORT=process.env.PORT

//Midelleware global
app.use(express.json())

// routes

app.use('/api/users',require('./routes/user'))




app.listen(PORT,(err)=>{
    err? console.log('server is not running')
    :
    console.log(`Server is runnig in PORT ${PORT}` )
})
