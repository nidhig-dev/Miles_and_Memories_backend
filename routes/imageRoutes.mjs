import express from "express";
import path, { dirname } from "path";
import fs from "fs";

//import middleware
import upload from "../middleware/imageAuth.mjs";
import { fileURLToPath } from "url";

//set up
const router = express.Router();

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
    .delete(async (req, res) => {
        try {
            //get image url
            const {imageUrl}=req.query;
            console.log(imageUrl);
            if(!imageUrl){
                return res.status(400).json({errors:[{msg:"imageUrl parameter is required"}]})
            }
            //get file name from imageUrl- basename returns last portion of the path
            const fileName = path.basename(imageUrl);
            // gives the path to imageRoutes.mjs
            const __filename = fileURLToPath(import.meta.url);
            //gives the path up till dir name(routes) where imageRoutes.mjs is saved.
            const __dirname = dirname(__filename);
            //relative path of uploads from routes folder.
            const filePath = path.join(__dirname , "../uploads" , fileName);
            //check if file exists at this file path
            if(fs.existsSync(filePath)){
                //delete the file
                fs.unlinkSync(filePath);
                res.status(200).json({msg:"Image deleted successfully"})
            }
            else{
                
                return res.status(404).json({errors:[{msg:"Image not found"}]})
            }
        }
        catch (err) {
            console.error(err.message);
            res.status(err.status||500).json({errors:[{msg:"Server Errror"}]})
        }

    })

//export
export default router

