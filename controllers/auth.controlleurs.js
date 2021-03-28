const User = require('../models/User.model')
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken')




exports.signUp=async(req,res)=>{

  try {
         //req.body <= {name,email,password,phone}
      const {name,email,password,phone} =req.body
      //test unique email
       const findUser = await User.findOne({email}) 
       if(findUser){
          return res.status(400).send({errors :[{msg: "Email should be Unique !"}]})
       }
 /**************hash the  password ********************************************************************/
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hashSync(password, saltRounds);
 
        // create newUser ----------------------------------------
        const newUser = new User({...req.body})
        //change the password to the hashed Password
        newUser.password = hashedPassword;
         // save it------------------
        await newUser.save()
  
       // create Token--apres save()--------------------------------------------
         const token = jwt.sign( {id: newUser._id}, process.env.SECRET_KEY,  { expiresIn: 60 * 60 });
 
        res.status(200).send({msg: "User signUp successfully",user: newUser,token })
 
  } catch (error) {
      res.errors(400).send({errors: [{msg: "Can't not SignUp please try again !"}]})
     }
 }

exports.signIn=async(req,res)=>{
    try {
        // req.body<= {emaail,password}
        const newUser =new User({...req.body})
        const findUser= await User.findOne({email:newUser.email})
        if(!findUser){
            return res.status(400).send({errors:[{msg:"bad credential"}]})
        }
        // compare password

        let result= await bcrypt.compare(newUser.password, findUser.password);
        if (!result){
            return res.status(400).send({errors:[{msg:"bad credential"}]})
        }
        console.log(findUser._id)
        const token=jwt.sign(
            {
         id: findUser._id
             },
             process.env.SECRET_KEY,
         { expiresIn: 60 * 60 });

        res.status(200).send({msg:"signin succesfuly",user:findUser,token})
        console.log(token)
        
    } catch (error) {
        res.status(400).send({errors:[{msg:"Bad request cant get the current user"}]})
       
    }

}

