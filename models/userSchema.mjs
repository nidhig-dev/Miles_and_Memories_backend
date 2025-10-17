import mongoose from "mongoose";
//set up

const userSchema=new mongoose.Schema({
    userName:{
        type:"String",
        required:true,
        trim:true,
        minlength:4,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true,
    },
    password: {
        type: String,
        required: true,       
    },

}, 
{
    timestamps: true // Adds `createdAt` and `updatedAt` fields
})
export default mongoose.model("User", userSchema)