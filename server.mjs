import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';


//import database
import connectDB from "./db/conn.mjs";

//import routes
import userRoutes from "./routes/userRoutes.mjs";
import storyRoutes from "./routes/storyRoutes.mjs";
import imageRoutes from "./routes/imageRoutes.mjs";
//set up
const app= express();
dotenv.config();

//This is to serve static files from backend dir
// gives the path to server.mjs
const __filename = fileURLToPath(import.meta.url);
//gives the path up till dir name where server.mjs is saved.
const __dirname = dirname(__filename);
console.log("File:", __filename);
console.log("Dir:", __dirname);

//Connect to database
connectDB();

const PORT=process.env.PORT||3001;

//middleware
app.use(express.json());
app.use(cors());

//routes

//user route -for registration
app.use("/api/user",userRoutes);

//story route
app.use("/api/story",storyRoutes);

//image route
app.use("/api/image",imageRoutes);

//route to serve static files
//get method to get the image from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((_req,res)=>{
    res.status(404).json({ msg: "Incorrect Path" });
})
//Global error handling
app.use((error,_req,res,next)=>{
    res.status(error.status||500).json({msg:error.message});
})

//listen
app.listen(PORT,()=>{
    console.log(`server listening in at ${PORT}`)
})
