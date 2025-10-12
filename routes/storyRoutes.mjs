import express from "express";
import { check, validationResult } from "express-validator";


//import story schema
import Story from "../models/storySchema.mjs";
//import middleware
import userAuth from "../middleware/userAuth.mjs";

//setup
const router = express.Router();
//Create a new story for a user
//@route:/api/story
//@desc: Adds a new story
//@access:protected

router.route("/")
    .post(userAuth, [
        check("title", "Please include a title").not().isEmpty(),
        check("desc", "Please include a description").not().isEmpty(),
        check("visitedLocation", "Please include a location").not().isEmpty(),
        check("imageUrl", "Please include an Image").not().isEmpty(),
        check("visitedDate", "Please include a visitedDate").not().isEmpty(),

    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //get user Id from the payload
        console.log(req.user.id);
        const userId  = req.user.id;
        try {
            const { title, desc, visitedLocation, imageUrl, visitedDate } = req.body;

            // options:i makes case-insensitive exact match});
            let story = await Story.findOne({ title: { $regex: `^${title.trim()}$`, $options: 'i' } });
            if (story) {
                return res.status(400).json({ errors: [{ msg: "Story already exists." }] })
            }
            console.log(visitedDate);
            //convert visitedDate string to a number and then a Date Object
            const parsedVisitedDate = new Date(parseInt(visitedDate));           
            console.log(parsedVisitedDate);
            
            //add the story to database
            story = new Story({
                title,
                desc,
                visitedLocation,
                userId,
                imageUrl,
                visitedDate: parsedVisitedDate,
            })
            console.log(story);
            //save the story
            await story.save();
            res.status(201).json(story);
        }
        catch (err) {
            console.error(err.message);
            res.status(err.status || 500).json({ errors: [{ msg: "Server Error" }] })
        }

    })
//get all the user stories
//@route:/api/story
//@desc: get all the user stories
//@access:protected
.get(userAuth,async(req,res)=>{
    try{
        //get the user id from req.user and find all stories by id
        
        const story=await Story.find({userId:req.user.id});
        //if a story exists, send it to client.        
        res.json(story);
    }
    catch(err){
        console.error(err.message);
        res.status(err.status||500).json({errors:[{msg:"Server Error"}]})
    }
})

    //update a user's story
    //@route:/api/story
    //@desc: update a user's story
    //@access:protected
    .put(userAuth, [
        check("title", "Please include a title").not().isEmpty(),
        check("desc", "Please include a description").not().isEmpty(),
        check("visitedLocation", "Please include a location").not().isEmpty(),
        check("imageUrl", "Please include an Image").not().isEmpty(),
        check("visitedDate", "Please include a visitedDate").not().isEmpty(),

    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //get user Id from the payload
        console.log(req.user.id);
        const userId = req.user.id;
        try {
            const { title, desc, visitedLocation, imageUrl, visitedDate } = req.body;

    }
catch(err){
    console.error(err.message);
}})




export default router;