
 
    const User = require("../models/User.model");
    const fs = require("fs");
    const { promisify } = require("util");
    const pipeline = promisify(require("stream").pipeline);
   
exports.uploadProfil= async(req,res)=>{
   
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
  const fileName= req.body.name + ".jpg";

  await pipeline(
    req.file.stream,
    fs.createWriteStream(
      `${__dirname}/../client/public/uploads/profil/${fileName}`
    )
  );

  try {
    await User.findByIdAndUpdate(
      req.body.userId,
      { $set : {picture: "./uploads/profil/" + fileName}},
      { new: true, upsert: true, setDefaultsOnInsert: true},
      (err, docs) => {
        if (!err) return res.status(200).send({ msg: "image is added ..", docs });
        else return res.status(400).send({errors:[{msg:"we can't add the picture!!!!"}]});
      }
    );
  } catch (err) {
      console.log(err)
    return res.status(400).send({errors:[{msg:"we can't add the picture!!!!"}]});
  }
};
