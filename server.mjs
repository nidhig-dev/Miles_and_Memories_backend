import express from "express"
import dotenv from "dotenv"
import cors from "cors"


//set up
const app= express();
dotenv.config();

const PORT=process.env.PORT||3001;

//middleware
app.use(express.json());
app.use(cors());

//routes


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
