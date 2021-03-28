const mongoose=require('mongoose')
const schema = mongoose.Schema;

const userSchema= new schema({
    name:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,  
    },
    password: {
      type: String,
      required: true,
      // minlength: 6
    },
    phone: Number,
    
        // pseudo: {
        //   type: String,
        //   required: true,
        // },

      
        picture: {
          type: String,
         // default: "./uploads/profil/random-user.png"
        },
        bio :{
          type: String,
          max: 1024,
        },
        followers: {
          type: [String]
        },
        following: {
          type: [String]
        },
        likes: {
          type: [String]
        }
      
})

module.exports= User =mongoose.model("user",userSchema)