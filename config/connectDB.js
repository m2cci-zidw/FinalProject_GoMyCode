const mongoose= require('mongoose')
const connectDB= async()=>{
    try {
        mongoose.connect(process.env.DB_URI,{ useNewUrlParser: true ,useUnifiedTopology: true ,useFindAndModify: false })
        await console.log('DataBase is connected')
        
    } catch (error) {
        console.error("Data base is not connected")
        
    }
}
module.exports= connectDB;