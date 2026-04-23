const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const getUsers=async (req,res)=>{
    try{
        const Users=await User.find().select("-password");
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
//         await Users.save();
//     res.json(Users);
 res.status(201).json({
      message: "User created",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
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
// const updateAvatar = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!req.body.image) {
//       return res.status(400).json({ message: "No image provided" });
//     }
//      const user = await User.findById(id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }


//     const upload = await cloudinary.uploader.upload(req.body.image, {
//       folder: "avatars"
//     });

//     const user = await User.findByIdAndUpdate(
//       id,
//       {
//         avatar: {
//           url: upload.secure_url,
//           public_id: upload.public_id
//         }
//       },
//       { new: true }
//     );

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Avatar upload failed" });
//   }
// };
const updateAvatar = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.body.image) {
      return res.status(400).json({ message: "No image provided" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔒 authorization check
    if (req.user._id.toString() !== id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 🧹 delete old avatar (important)
    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    // ☁️ upload new image
    const upload = await cloudinary.uploader.upload(req.body.image, {
      folder: "avatars"
    });

    // ✅ update user
    user.avatar = {
      url: upload.secure_url,
      public_id: upload.public_id
    };

    await user.save();

    res.json(user);

  } catch (error) {
    console.error(error);
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