const User = require('../models/user')
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken')
const ObjectID = require("mongoose").Types.ObjectId;



exports.signUp=async(req,res)=>{
   try {
       // req.body=>name, email,phone,password
       const {name, email,password,phone}= req.body
       const findUser= await User.findOne({email});
       if(findUser){
           return res.status(400).send({errors:[{msg:"Email should be unique"}]})
       }
       // create new user
       const saltRounds=10;
       const hashedPassword= bcrypt.hashSync(password, saltRounds);
       const newUser = new User({...req.body})
       newUser.password=hashedPassword
       await newUser.save()
       //create TOken

       const token=jwt.sign(
           {
        id: newUser._id
            },
       process.env.SEKRET_KEY,
        { expiresIn: 60 * 60 });

       res.status(200).send({msg:"sign up succesfully",user:newUser,token})

    
   } catch (error) {
       return res.status(400).send({errors:[{msg:"Bad request cant save the user"}]})
       
   }

}

exports.signIn=async(req,res)=>{
    try {
        // req.body
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
        process.env.SEKRET_KEY,
         { expiresIn: 60 * 60 });

        res.status(200).send({msg:"signin succesfuly",user:findUser,token})
        console.log(token)
        
    } catch (error) {
        res.status(400).send({errors:[{msg:"Bad request cant get the current user"}]})
       
    }

}

// get all users Db
exports.getAllUsers=async(req,res)=>{
    try {
        const users= await User.find().select('-password')
    res.status(200).send(users)
    } catch (error) {
        return res.status(400).send({errors:[{msg:"users not found"}]})
        
    }
    
}

// get one user
exports.userInfo=async(req,res)=>{
    if (
        !ObjectID.isValid(req.params.id)
      )
        return res.status(400).send( {errors:[{msg:"ID unknown : " + req.params.id}]} );
    try {
        const getUser= await User.findOne({_id:req.params.id}).select('-password')
   
    res.status(200).send(getUser)
        
    } catch (error) {
        return res.status(400).send({errors:[{msg:"user not found"}]})
    }
    
}

//updateUser
exports.updateUser=async(req,res)=>{
    if (
        !ObjectID.isValid(req.params.id) 
      )
        return res.status(400).send( {errors:[{msg:"ID unknown : " + req.params.id}]} );
    try {
        
        

        await User.findOneAndUpdate(
            { _id: req.params.id },
            {
              $set: {
                bio:req.body.bio
              },
            },
            // { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, docs) => {
              if (!err) return res.send(docs);
              if (err) return res.status(500).send({ message: err });
            }
          );
        
        
    } catch (error) {
        return res.status(400).send({errors:[{msg:"we can't update this user!! User not found"}]})
        
    }
}


/// delete user
exports.deleteUser=async(req,res)=>{
    if (
        !ObjectID.isValid(req.params.id) 
      )
        return res.status(400).send( {errors:[{msg:"ID unknown : " + req.params.id}]} );
        try {
            const contactToDelete= await User.findOneAndDelete({_id:req.params.id})
            if (!contactToDelete){
                res.status(400).send({errors:[{msg:"Contact already deleted"}]})
                return
            } 
                res.status(200).send({msg:"Contact deleted",contactToDelete})
    
           
        } catch (error) {
            return res.status(400).send({errors:[{msg:"contact is not deleted!!!"}]})
            
        }
    
    }

    // folowUser
    exports.follow = async (req, res) => {
        if (
          !ObjectID.isValid(req.params.id) ||
          !ObjectID.isValid(req.body.idToFollow)
        )
          return res.status(400).send( {errors:[{msg:"ID unknown : " + req.params.id}]} );
      
        try {
          // add to the follower list
          await User.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow } },
            { new: true, upsert: true },
            (err, docs) => {
              if (!err) res.status(201).send(docs);
              else return res.status(400).send(err);
            }
          );
          // add to following list
          await User.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers: req.params.id } },
            { new: true, upsert: true },
            (err, docs) => {
              // if (!err) res.status(201).json(docs);
              if (err) return res.status(400).send(err);
            }
          );
        } catch (err) {
            return res.status(400).send({errors:[{msg:"we can't follow this user!!!"}]})
        }
      };


      exports.unfollow = async (req, res) => {
        if (
          !ObjectID.isValid(req.params.id) ||
          !ObjectID.isValid(req.body.idToUnfollow)
        )
        return res.status(400).send( {errors:[{msg:"ID unknown : " + req.params.id}]} );
      
        try {
          await User.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idToUnfollow } },
            { new: true, upsert: true },
            (err, docs) => {
              if (!err) res.status(200).send(docs);
              else return res.status(400).send(err);
            }
          );
          // remove to following list
          await User.findByIdAndUpdate(
            req.body.idToUnfollow,
            { $pull: { followers: req.params.id } },
            { new: true, upsert: true },
            (err, docs) => {
              // if (!err) res.status(201).send(docs);
              if (err) return res.status(400).send(err);
            }
          );
        } catch (err) {
         return res.status(400).send({errors:[{msg:"we can't follow this user!!!"}]})
        }
      };