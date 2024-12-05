const mongoose =require("mongoose")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add name'],
        trim:true,
    },
    email:{
        type:String,
        require:[true,"Please add email"],
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:[true,"Please add Password"],
        min:6,
        max:64,

    },
    role:{
        type:String,
        default:"user",
    }
},
{timestamps:true}
// when new user he created time all captured by using timestamps
)
module.exports=mongoose.model("User",userSchema);