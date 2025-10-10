import express from "express";
import {check,validationResult} from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

//import user schema
import User from "../models/userSchema.mjs";

//setup
const router=express.Router();
dotenv.config();

router.route("/")
//signup/register user route
    //@route:/api/user
    //@desc: Registers a new user
    //@access:public
.post([
    check("userName", "Please include a valid user name").isLength({min:4}),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be atleast 6 characters long").isLength({ min: 6 }),
],async(req,res)=>{
    const errors=validationResult(req);
    //check if there are any errors
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        //get user registration data from req.body
        const{userName,email,password}=req.body;
        
        //check for req.body object
        if(!userName||!email||!password){
            res.status(400).json({errors:[{msg:"All fields are required!"}]})
        }

        let user=User.findOne({email});
        //throw error if user is found
        if(user){
            return res.json(400).json({errors:[{msg:"User Exists.Please log in."}]})
        }
        //save user in User database
        user=new User({
            userName,
            email,
            password,
        });

        //generate salt of 10 rounds using bcrypt
        const salt = await bcrypt.genSalt(10);
        //hash the password
        user.password=await bcrypt.hash(user.password,salt);

        //save the user 
        await user.save();

        //create a payload with user id
        const payload ={
            user:{
                id:user._id,
            },
        };
        //create a token with _id, secret and options
        jwt.sign(
            payload,
            process.env.jwtSecret,
            {expiresIn: "72h"},
            (err,token)=>{
                if (err){
                    throw err;
                }
                //send token to http.This will be available in req.headers
                res.status(201).json({token});
            }

        );

    }
    catch(err){
        console.log(err.message);
        res.status(err.status||500).json({errors:{msg:"Server Error"}})
    }

})
//login route

//get user info route
//@route:/api/user/:id
//@desc: get user info by id of a registered user or logged in user
//@access:public
export default router;