const User=require('../models/user')

const isAuth= async(req,res,next)=>{
    try {
        const token=req.headers["authorization"];
    if(!token)
    return res.status(400).send({errors:[{msg:"Not authorized"}]})
    const decoded=jwt.verify(token,process.env.SEKRET_KEY)
    const findUser= await User.findOne({_id:decoded.id})
    if(!findUser) 
    return res.status(400).send({errors:[{msg:"Not authorized"}]})
    req.user=findUser;
    next()
    } catch (error) {
        return res.status(400).send({errors:[{msg:"Not authorized"}]})
        
    }

}
module.exports=isAuth