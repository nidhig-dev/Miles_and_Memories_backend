import mongoose from "mongoose";
import dotenv from "dotenv";

//set up-get connection string
dotenv.config();
const connectionString= process.env.mongoURI||"";

async function connectDB(){
    try{
        await mongoose.connect(connectionString);
        console.log("Database connected....")
    }
    catch(err){
        console.error(err.msessage);
        process.exit(1);
    }
    
}
export default connectDB;
