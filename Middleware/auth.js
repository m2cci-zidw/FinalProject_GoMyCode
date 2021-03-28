const jwt= require('jsonwebtoken')
const User=require('../models/User.model')

const isAuth = async(req,res,next)=> {
    try {
        const token = req.headers ['authorization']

    if(!token){
     return  res.status(401).send({errors:[ {msg : "Not authorized 1"}] })
    }

    const decoded = jwt.verify(token,process.env.SECRET_KEY)


    const findUser = await User.findOne({_id: decoded.id})
    if(!findUser){
       return res.status(401).send({errors: [{msg : "Not authorized 2"}] })
    }

    req.user =findUser
    next()

    } catch (error) {
        return res.status(401).send({errors: [{msg : "Not authorized 3 "}] })
    }

};
module.exports=isAuth