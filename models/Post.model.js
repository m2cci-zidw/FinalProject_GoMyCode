const mongoose =require('mongoose')

//post Schema

const PostSchema =new mongoose.Schema({

    posterId:{
        type:String,
        required:true,
    },

    message:{
        type:String,
        trim:true,
        maxLenght:240
    },
    
    picture:{
        type:String,
    },
    
    video:{
        type:String,
    },

    likers:{
        type:[String],
        required: true
    },
   
    comments:{
        type:[
            {
                commenterId:String,
                commenterName:String,
                text:String,
                timestamp:Number
            }
        ],
       required:true
    }, 
}, 
{
    timestamps:true,  
}
);

module.exports = postModel= mongoose.model('post',PostSchema)

