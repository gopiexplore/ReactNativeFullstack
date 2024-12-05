const express=require("express")
const { registerController, loginController, updateUserController, requireSignIn } = require("../controllers/userController")

//router object
const router=express.Router()

//routes
//Register Post
router.post('/register',registerController)
//Login Post
router.post('/login',loginController)

//Update || PUT
router.put("/update-user",requireSignIn,updateUserController)

//export
module.exports=router