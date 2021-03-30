const User = require('../models/User.model')
const ObjectID = require("mongoose").Types.ObjectId;





/*****get all users Db ***users*/ 
exports.getAllUsers = async(req,res)=>{
    try {
        const users = await User.find().select('-password')
    res.status(200).send({msg: "get all users successfully.. ",users})
    } catch (error) {
        return res.status(400).send({errors:[{msg:"users not found"}]})
        
    }
  
}

// get one user
exports.userInfo=async(req,res)=>{

    if ( !ObjectID.isValid(req.params.id) ){
      return res.status(400).send({ errors:[{ msg:"ID unknown : " + req.params.id }] });
    }
        
    try {
        const getUser= await User.findOne({_id:req.params.id}).select('-password')
       
        res.status(200).send({ msg: 'I find the user ..', getUser })
        
    } catch (error) {
        return res.status(400).send({errors:[{cmsg:"user not found !!"}] })
    }
    
}


// update-User
exports.updateUser = async(req,res)=>{

    if ( !ObjectID.isValid(req.params.id)){
       return res.status(400).send({ errors:[{ msg:"ID unknown : " + req.params.id}] })
      }

    try {
         await User.findOneAndUpdate(
          { _id: req.params.id },
          { $set: {bio:req.body.bio}
          },
            { new: true, upsert: true, setDefaultsOnInsert: true },  //evit bug 
            
            (err, docs) => {
              if (!err) return res.send(docs);
              if (err) return res.status(400).send({errors:[{msg:"Can not update this user!!"}]})
            } 
          );
          
    } catch (error) {
        return res.status(400).send({errors:[{msg:"Can not update this user!!"}]})
        
    }
}


/// delete user
exports.deleteUser=async(req,res)=>{

    if (!ObjectID.isValid(req.params.id) ){
      return res.status(400).send( {errors:[{msg:"ID unknown : " + req.params.id}]} );
    }
        try {
            const userToDelete= await User.findOneAndDelete({_id:req.params.id})
            if (!userToDelete){
                res.status(400).send({errors:[{msg:"Contact already deleted"}]})
                return
            } 
                res.status(200).send({msg:"Contact deleted",userToDelete})
    
           
        } catch (error) {
            return res.status(400).send({ errors:[{ msg:"contact is not deleted!!!" }] })
            
        }
    
    }

// follow-User
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
              if (!err) res.status(201).send({msg:'ID to following',docs});
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

// Unfollow-User

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
              if (!err) res.status(200).send({msg:'ID to unfollowing',docs});
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