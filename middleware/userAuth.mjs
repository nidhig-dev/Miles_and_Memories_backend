//imports
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
//set up
dotenv.config();
//function
export default function(req,req,next){
    //get token from header
    const token=req.headers("x-auth-token");
    //throw error if no token
    if (!token){
        return resizeBy.status(401).json({errors:[{msg:"No Token, permission denied"}]});
    }
    try{
        //verify the token and get the payload
        const decoded=jwt.verify(token,process.env.jwtSecret);
        //set the payload (user) in req.user
        req.user=decoded.user

    }
    catch(err){
        console.error(err.message);
        res.json(401).json({errors:[{msg:"Authentication failed"}]})
    }
}

