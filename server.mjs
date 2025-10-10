import express from "express"
import dotenv from "dotenv"
import cors from "cors"

//import database
import connectDB from "./db/conn.mjs";

//import routes
import userRoutes from "./routes/userRoutes.mjs";
import storiesRoutes from "./routes/storiesRoutes.mjs";

//set up
const app= express();
dotenv.config();

//Connect to database
connectDB();

const PORT=process.env.PORT||3001;

//middleware
app.use(express.json());
app.use(cors());
//basic login auth middleware


//routes
//user route -for registration
app.use("/api/user",userRoutes);
//user route for users to log in and get user info
//app.use("/api/authUser",)
//stories route
app.use("/api/stories",storiesRoutes);



app.use((req,res)=>{
    res.status(404).json({ msg: "Incorrect Path" });
})
//Global error handling
app.use((error,req,res,next)=>{
    res.status(error.status||500).json({msg:error.message});
})

//listen
app.listen(PORT,()=>{
    console.log(`server listening in at ${PORT}`)
})
