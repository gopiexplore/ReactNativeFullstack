const JWT=require("jsonwebtoken")
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
var { expressjwt: jwt } = require("express-jwt");


//middleware
const requireSignIn=jwt({
    secret:process.env.JWT_SECRET,algorithms:["HS256"]
})
console.log(requireSignIn)
//Register
const registerController=async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        //validation
        if(!name){
            return res.status(400).send({
                success:false,
                message:'name is required'
            })
        }
        if(!email){
            return res.status(400).send({
                success:false,
                message:'email is required'
            })
        }
        if(!password){
            return res.status(400).send({
                success:false,
                message:'password is required'
            })
        }

        //exisiting user
        const exisitingUser=await userModel.findOne({email:email})
        if(exisitingUser){
            return res.status(500).send({
                success:false,
                message:"user already Register with This email"
            })
        }

        //hash password
        const hashedPassword=await hashPassword(password)
        //save user
        const user=await userModel({name,email,password:hashedPassword}).save()

        return res.status(201).send({
            success:true,
            message:"Registration Successful please Login"

        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error in Register API",
            error,
        })
        
    }
};
//login
const loginController=async (req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(500).send({
                success:false,
                message:"Please Provide Email or Password"
            })
        }
        //find user
        const user =await userModel.findOne({email})
        if(!user){
            return res.status(500).send({
                success:false,
                message:"User Not Found"
            })
        }

        //match password
        const match=await comparePassword(password,user.password)
        if(!match){
            return res.status(500).send({
                success:false,
                message:"Invalid username or Password"

            })
        }

        //Token JWt
        const token= await JWT.sign({ _id: user._id }, process.env.JWT_SECRET,{
            expiresIn:'1d'
        })

        //undefined password
        user.password=undefined;
        res.status(200).send({
            success:true,
            message:"login successfully",
            token,
            user,

        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"error in login api",
            error
        })
    }
}
//Update user
const updateUserController=async(req,res)=>{
    try {
        const {name,password,email}=req.body
        //password validate
        const user=await userModel.findOne({email})
        if(password && password.length<6){
            return res.status(400).send({
                success:false,
                message:"Password is required and should be 8 charatcer long"
            })
        }
        const hashedPassword=password?await hashPassword(password):undefined
        //updated user
        const updatedUser =await userModel.findOneAndUpdate({email},{
            name:name || user.name,
            password:hashedPassword || user.password
        },{new:true})
        updatedUser.password=undefined;
        res.status(200).send({
            success:true,
            message:"Profile Updated Please Login",
            updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in User Update Api",
            error
        })
    }

}
module.exports={requireSignIn,registerController,loginController,updateUserController}