const mongoose=require("mongoose");
const connecttodb=()=>{
    
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

}
module.exports=connecttodb;