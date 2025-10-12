import express from "express";

//import middleware
import upload from "../middleware/imageAuth.mjs";

//set up
const router =express.Router();

//route

//Upload/Add a image to story
//@route:/api/image
//@desc: Upload/Add a image to story
//@access:protected

router.route("/")
    //image_story is the name of the form field in jsx.
    .post(upload.single("image_story"), async (req, res) => {
        try {
            //check for req.file
            if (!req.file) {
                return res.status(404).json({ errors: [{ msg: "Please upload image" }] })
            }
            //create image url to store in database
            //This is also for front end to pick image from to display to user
            const imageUrl = `http://localhost:3000/api/uploads/${req.file.filename}`;
            res.status(201).json(imageUrl);
        }
        catch (err) {
            console.error(err.message);
            res.status(err.status || 500).json({ errors: [{ msg: "Server Error" }] })
        }
    })

//export
export default router

