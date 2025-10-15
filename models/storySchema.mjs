import mongoose from "mongoose";
//set up

const storySchema=new mongoose.Schema({
    title:{
        type:String,
        unique:true,
        required:true,        
    },
    desc:{
        type:String,
        required:true,
    },
    visitedLocation:{
        type:[String],
        default:[],
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    imageUrl:{
        type:String,
        required:true,
    },
    visitedDate:{
        type:Date,
        required:true,
    }
    

}, { 
    timestamps: true // Adds `createdAt` and `updatedAt` fields
})
export default mongoose.model("Story",storySchema)
