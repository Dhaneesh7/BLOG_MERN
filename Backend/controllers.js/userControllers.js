const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const getUsers=async (req,res)=>{
    try{
        const Users=await User.find();
        console.log("got user");
    res.json(Users);
}catch(err){
    res.status(500).json({message:"failed to fetch",err})
}
};
const insertUsers=async (req,res)=>{
    try{
        
//  const Users= new User.create(req.body);
const { name,email,password}=req.body;
 const Users =await User.create({name,email,password});
        await Users.save();
    res.json(Users);
}catch(err){
    console.error("error creating user",err)
    res.status(500).json({message:"failed to fetch",err})
}
};
const getUserById=async (req,res)=>{
    try{
        const {id}=req.params;
        const user=await User.findById(id).select("-password");
        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        res.json(user);
    }catch(err){
        console.error("error fetching user by id",err);
        res.status(500).json({message:"failed to fetch user",err})
    }
};
const updateAvatar = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.body.image) {
      return res.status(400).json({ message: "No image provided" });
    }

    const upload = await cloudinary.uploader.upload(req.body.image, {
      folder: "avatars"
    });

    const user = await User.findByIdAndUpdate(
      id,
      {
        avatar: {
          url: upload.secure_url,
          public_id: upload.public_id
        }
      },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Avatar upload failed" });
  }
};
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { bio } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { bio },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("error updating user", err);
    res.status(500).json({ message: "failed to update user" });
  }
};
module.exports={getUsers,insertUsers,getUserById,updateAvatar,updateUser};