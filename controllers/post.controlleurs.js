const postModel =require('../models/Post.model')
const User = require('../models/User.model')
const ObjectID = require("mongoose").Types.ObjectId;

const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

//***************************get post*********************************** */
exports.getPost =async(req,res)=>{
    
try {
    const post = await postModel.find().select()
    res.status(200).send({ msg: 'Post getted successfully ...', post })
} catch (error) {
    res.status(400).send({ errors:[{ msg: "Can not get the post !", error }] })
    
}
}
//*******************create post************************************ */
exports.createPost =async(req,res)=>{
    let fileName;
    if(req.file!=null){
        try {
      
            if (
              req.file.detectedMimeType != "image/jpg" &&
              req.file.detectedMimeType != "image/png" &&
              req.file.detectedMimeType != "image/jpeg"
            )
            
            { return res.status(400).send({errors:[{msg:"invalid file"}]})}
        
            if (req.file.size > 500000)
            
            { return res.status(400).send({errors:[{msg:"we can't use this picture, max size"}]})} 
          } catch (err) {
              
            return res.status(400).send({errors:[{msg:"we can't add the picture!!!!"}]},err)
        
          }
           fileName= req.body.posterId +Date.now()+'.jpg';
           await pipeline(
            req.file.stream,
            fs.createWriteStream(
              `${__dirname}/../client/public/uploads/posts/${fileName}`
            )
          );
    }





    const newPost = new postModel({
        posterId: req.body.posterId,
        message : req.body.message,
        picture: req.file !== null ? "./uploads/posts/" + fileName : "",
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

//********************************update-Post********************************************
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
            
        })
} catch (error) {
    res.status(400).send({ errors:[{ msg: "Can not update the post !!", error }] })
}
}
















/*************************************************************************plmmmmmmmmmmmmmmm with delete post */
// // ****************************************delete post*********************************************

exports.deletePost=async(req,res)=>{
    if (!ObjectID.isValid(req.params.id)){
        return res.status(400).send("ID unknown : " + req.params.id);}

        try {

           const x= await postModel.findByIdAndRemove(req.params.id,(err,docs) =>{
                          if(!err){
                           return res.status(200).send({ msg: "post is deleted ..", docs })
                           } else{
                            return res.status(400).send({ msg: "post not deleted ..", err })
                           }

        }) }
        catch (error) {
            return res.status(400).send({ errors:[{ msg: "Can not delete the post !"}] })
            
        }

}
/****************************************like post ******************************************/


exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      await postModel.findByIdAndUpdate(
        {_id:req.params.id},
        {
          $addToSet: { likers: req.body.id },
        },
        { new: true },
        (err, docs) => {
          if (err) return res.status(400).send({ errors:[{ msg: "Can not like this post 1!!!"}] })
        }
      );
      await User.findByIdAndUpdate(
        {_id:req.body.id},
        {
          $addToSet: { likes: req.params.id },
        },
        { new: true },
        (err, docs) => {
          if (!err) res.status(200).send({ msg: "post is liked ..", docs })
          else return res.status(400).send({ errors:[{ msg: "Can not like this post 2!!!"}] })
        }
      );
    } catch (err) {
      return res.status(400).send({ errors:[{ msg: "Can not like this post 3!!!"}] })
    }
  };
  

/****************************************unlike post ************************/


exports.unlikePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      await postModel.findByIdAndUpdate(
        {_id:req.params.id},
        {
          $pull: { likers: req.body.id },
        },
        { new: true },
        (err, docs) => {
          if (err) return res.status(400).send({ errors:[{ msg: "Can not like this post 1!!!"}] })
        }
      );
      await User.findByIdAndUpdate(
        {_id:req.body.id},
        {
          $pull: { likes: req.params.id },
        },
        { new: true },
        (err, docs) => {
          if (!err) res.status(200).send({ msg: "post is liked ..", docs })
          else return res.status(400).send({ errors:[{ msg: "Can not like this post 2!!!"}] })
        }
      );
    } catch (err) {
      return res.status(400).send({ errors:[{ msg: "Can not like this post 3!!!"}] })
    }
  };


//   ************************************* Add comment*****************************************
exports.commentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      return  postModel.findByIdAndUpdate(
        {_id:req.params.id},
        {
          $push: {
            comments: {
              commenterId: req.body.commenterId,
              commenterName: req.body.commenterName,
              text: req.body.text,
              timestamp: new Date().getTime(),
            },
          },
        },
        { new: true },
        (err, docs) => {
          if (!err) return res.status(200).send({ msg: "Comment is added ..", docs })
          else return res.status(400).send({ errors:[{ msg: "Can not comment this post!!!"}] })
        }
      );
    } catch (err) {
      return res.status(400).send({ errors:[{ msg: "Can not comment this post, try again!!!"}] })
    }
  };
//   ************************************* Edit comment*****************************************

  exports.editCommentPost = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      return await postModel.findById(req.params.id, (err, docs) => {
        const theComment = docs.comments.find((comment) =>
          comment._id.equals(req.body.commentId)
        );
  
        if (!theComment) return res.status(404).send({ errors:[{ msg: "Can not edit this comment , try again!!!"}] });
        theComment.text = req.body.text;
  
        return docs.save((err) => {
          if (!err) return res.status(200).send({ msg: "Comment is updated..", docs });
          return res.status(400).send({ errors:[{ msg: "Can not edit this comment , try again!!!"}] });
        });
      });
    } catch (err) {
      return res.status(400).send({ errors:[{ msg: "Can not edit this comment, try again!!!"}] });
    }
  };
  
  exports.deleteCommentPost =async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      return await postModel.findByIdAndUpdate(
        req.params.id,
        {
          $pull: {
            comments: {
              _id: req.body.commentId,
            },
          },
        },
        { new: true },
        (err, docs) => {
          if (!err) return res.status(200).send({ msg: "Comment is deleted ...", docs });
          else return res.status(404).send({ errors:[{ msg: "Can not delete this comment , try again!!!"}] });
        }
      );
    } catch (err) {
      return res.status(404).send({ errors:[{ msg: "Can not delete this comment , try again!!!"}] });
    }
  };
  
  



















