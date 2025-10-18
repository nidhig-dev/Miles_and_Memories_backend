import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path"
// Collections/Models
import User from "../models/userSchema.mjs";
import Story from "../models/storySchema.mjs";

// Data
import userData from "./userData.mjs";
import storiesData from "./storiesData.mjs";

dotenv.config();

const connectionStr = process.env.mongoURI || "";

async function seedDatabase() {
    console.log("connection string is",connectionStr);
    console.log(`✅ Seeding Script Run`);
    try {
        await mongoose.connect(connectionStr);
        console.log(`✅ Connected to DB...`);

        await User.deleteMany();
        console.log(`✅ Cleared DB of prev users`);

        await User.create(userData);
        console.log(`✅ Seeded DB with new users`);

        let allUser = await User.find({});
        console.log(`✅ Retrieved New User Id's from the DB`);

        for (let story of storiesData) {
            for (let eachUser of allUser) {
                //match userid of story data to username of user database
                if (story.userId == eachUser.userName) {
                    //replace the name of user with object id of user
                    story.userId = eachUser._id;
                    // console.log("user id is",story.userId);
                    break;
                }
            }
        }
// console.log("all user is",storiesData);
        console.log(`✅ Mapped new stories with new userID`)

        await Story.deleteMany();
        console.log(`✅ Cleared DB of prev stories`);

        await Story.create(storiesData);
        console.log(`✅ Seeded DB with stories`);

        console.log(`🎉 Seed Complete`);
        process.exit(0);
    } catch (err) {
        console.error(`❌ Error seeding DB`, err.message);
        process.exit(1);
    }
}

seedDatabase();
