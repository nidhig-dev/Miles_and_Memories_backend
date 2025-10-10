import mongoose from "mongoose";
import dotenv from "dotenv";

//set up-get connection string
dotenv.config();
const connectionString= process.env.mongoURI||"";

