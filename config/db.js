const mongoose=require("mongoose")
const colors=require('colors');
const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected To Database `.bgCyan.white)
    } catch (error) {
        console.log(`error in connection Db${error}`.bgRed.white)
    }
}
module.exports=connectDB;