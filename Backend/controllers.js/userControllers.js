const User = require('../models/User');
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
module.exports={getUsers,insertUsers};