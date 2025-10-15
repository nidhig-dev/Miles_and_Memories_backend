import express from "express";
import { check, validationResult } from "express-validator";
import { fileURLToPath } from "url";
import fs from "fs";
import path, { dirname } from "path";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

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

router.route("/:id")
    //update a user's story based on story id
    //@route:/api/story/:id
    //@desc: update a user's story
    //@access:protected
    .put(userAuth, async (req, res) => {
        try {
            //get user Id from the payload
            const userId = req.user.id;
            //get story id from params
            const storyId = req.params.id;
            
            //check if visited date is in the req.body
            if (req.body.visitedDate) {
                //const isoDate = dayjs(req.body.visitedDate, "Do MMMM YYYY").toISOString();
                const isoDate = dayjs(req.body.visitedDate).toISOString(); 
                console.log(isoDate); // 2019-12-31T00:00:00.000Z

                //convert visitedDate string to a number and then a Date Object
                //console.log(req.body.visitedDate);
                //const parsedVisitedDate = new Date(req.body.visitedDate);
                //update visited data with date object
                req.body.visitedDate = isoDate;
            }
            //find the story by story id and user id
            let updatedStory = await Story.findOneAndUpdate({ _id: storyId, userId: userId }, req.body, { new: true, runValidator: true });
            if (!updatedStory) {
                return res.status(404).json({ errors: [{ msg: "Story not found." }] })
            }
            res.status(201).json(updatedStory);

        }
        catch (err) {
            console.error(err.message);
            res.status(err.status || 500).json({ errors: [{ msg: err.message }] });
        }
    })
    //delete a user's story based on story id
    //@route:/api/story/:id
    //@desc: delete a user's story
    //@access:protected
    .delete(userAuth, async (req, res) => {
        try {
            //get user Id from the payload
            const userId = req.user.id;
            //get story id from params
            const storyId = req.params.id;

            //delete the story by story id and user id
            let story = await Story.findOneAndDelete({ _id: storyId, userId: userId });
            if (!story) {
                return res.status(404).json({ errors: [{ msg: "Story not found." }] })
            }

            //delete the image from the uploads folder as well
            const imageUrl = story.imageUrl;

            //get file name from imageUrl- basename returns last portion of the path
            const fileName = path.basename(imageUrl);
            // gives the path to storyRoutes.mjs
            const __filename = fileURLToPath(import.meta.url);
            //gives the path up till dir name(routes) where storyRoutes.mjs is saved.
            const __dirname = dirname(__filename);
            //relative path of uploads from routes folder.
            const filePath = path.join(__dirname, "../uploads", fileName);
            //check if file exists at this file path
            if (fs.existsSync(filePath)) {
                //delete the file
                fs.unlinkSync(filePath);
            }
            else {
                console.error("Failed to delete image file");
            }
            res.status(201).json(story);
        }
        catch (err) {
            console.error(err.message);
            res.status(err.status || 500).json({ errors: [{ msg: "Server Error" }] })
        }
    })
    //get a story by story id
    //@route:/api/story/:id
    //@desc: get a story by story id
    //@access:protected
    .get(userAuth, async (req, res) => {
        try {
            //get user Id from the payload
            const userId = req.user.id;
            //get story id from params
            const storyId = req.params.id;            
            //find the story by story id and user id
            let story = await Story.findOne({ _id: storyId, userId: userId });
            if (!story) {
                return res.status(404).json({ errors: [{ msg: "Story not found." }] })
            }
            //if a story exists, send it to client.        
            res.json(story);
        }
        catch (err) {
            console.error(err.message);
            res.status(err.status || 500).json({ errors: [{ msg: "Server Error" }] })
        }
    })
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
        const userId = req.user.id;
        try {
            const { title, desc, visitedLocation, imageUrl, visitedDate } = req.body;
            //The imgUrl is coming from post method of imageRoutes
            //check if a story title already exists
            // options:i makes case-insensitive exact match});
            let story = await Story.findOne({ title: { $regex: `^${title.trim()}$`, $options: 'i' } });
            if (story) {
                return res.status(400).json({ errors: [{ msg: "Story already exists." }] })
            }
            console.log(visitedDate);
            //convert visitedDate string to a Date Object
            const isoDate = dayjs(req.body.visitedDate).toISOString(); 

            //const isoDate = dayjs(req.body.visitedDate, "Do MMMM YYYY").toISOString();
            console.log(isoDate); // 2019-12-31T00:00:00.000Z

            //add the story to database
            story = new Story({
                title,
                desc,
                visitedLocation,
                userId,
                imageUrl,
                visitedDate: isoDate,
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
    .get(userAuth, async (req, res) => {
        try {
            //get the user id from req.user and find all stories by id

            const story = await Story.find({ userId: req.user.id });
            if (story.length > 0) {
                //if a story exists, send it to client.        
                res.json(story);
            }
            else {
                res.status(404).json({ errors: [{ msg: "No story found." }] })
            }
        }
        catch (err) {
            console.error(err.message);
            res.status(err.status || 500).json({ errors: [{ msg: "Server Error" }] })
        }
    })

export default router;