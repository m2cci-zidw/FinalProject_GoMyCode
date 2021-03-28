const postModel =require('../models/Post.model')
const User = require('../models/User.model')
const ObjectID = require("mongoose").Types.ObjectId;


exports.getPost =async(req,res)=>{
    
try {
    const post = await postModel.find().select()
    res.status(200).send({ msg: 'Post getted successfully ...', post })
} catch (error) {
    res.status(400).send({ errors:[{ msg: "Can not get the post !", error }] })
    
}
}

exports.createPost =async(req,res)=>{

    const newPost = new postModel({
        posterId: req.body.posterId,
        message : req.body.message,
        video   : req.body.video,
        likers  : [],
        comments: []
    })

    try {
        const post = await newPost.save()
        res.status(200).send({ msg: 'Post added successfully ...', post })
    } catch (error) {
        res.status(400).send({ errors:[{ msg: "Can not create  the post !", error }] })

    }
}

//update-Post
exports.updatePost =async(req,res)=>{
    if ( !ObjectID.isValid(req.params.id)){
        return res.status(400).send({ errors:[{ msg:"ID unknown : " + req.params.id}] })
       }
       //recupere post mil req.body.message
    const updatedPost = {
         message: req.body.message }
    //updatepost
try {

     const isUpdated = await postModel.findByIdAndUpdate(
        {_id:req.params.id},    //nb: id posterId ET NN Id user
        {$set: updatedPost}, //update message
        {new: true},
        (err,docs)=>{
            if(!err){
              return res.status(200).send({ msg: 'Post updated successfully ...', docs })
        }
            console.log(isUpdated)
        })
} catch (error) {
    res.status(400).send({ errors:[{ msg: "Can not update the post !!", error }] })
}
}




/*************************************************************************plmmmmmmmmmmmmmmm with delete post */
// delete post
exports.deletePost = async(req, res) => {

    if (!ObjectID.isValid(req.params.id)){
         return res.status(400).send("ID unknown : " + req.params.id);
        }
  try {
      
      await postModel.findByIdAndRemove(req.params.id,(err,docs) =>{
           if(!err){
           return res.status(200).send({ msg: "post is deleted ..",docs })
           }
       }
    )
  } catch (error) {
    res.status(400).send({ errors:[{ msg: "Can not delete the post !", error }] })

  }

  };
  





















exports.deletePost =async(req,res)=>{
    if ( !ObjectID.isValid(req.params.id)){
        return res.status(400).send({ errors:[{ msg:"ID unknown : " + req.params.id}] })
       }
}