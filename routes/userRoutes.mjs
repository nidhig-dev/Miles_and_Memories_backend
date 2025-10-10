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

router.route("/register")
//signup/register user route
    //@route:/api/user/register
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
                
        let user= await User.findOne({email});
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
//Login user route
//@route:/api/user/login
//@desc: get user info by id of a registered user or logged in user
//@access:public

router.route("/login")
    .post([check("email", "Please include an email").not().isEmpty(),
        check("password", "Please include a password").not().isEmpty(),
    ], async (req,res)=>{
        const errors=validationResult(req);
        //check if there are errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //get email and password from req.body
        try {
            const { email, password } = req.body;
            //find a user based on email
            let user = await User.findOne({ email });
            //if no user is found-throw error
            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "Invalid Credentials" }] });
            }
            //if user is found, match the password user entered with the database
            const isMatch = await bcrypt.compare(password, user.password);
            //throw error if match is not found
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "Invalid Credentials" }] });
            }
            //create a payload with object id
            const payload = {
                user: {
                    id: user._id,
                },
            };
            //create a token with payload,secret and options
            jwt.sign(
                payload,
                process.env.jwtSecret,
                { expiresIn: "6h" },
                (err, token) => {
                    if (err) throw err;

                    res.status(201).json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: "Server Error" }] });
        }
})
//get user info route
//@route:/api/user/
//@desc: get user info by id of a registered user or logged in user
//@access:protected
export default router;