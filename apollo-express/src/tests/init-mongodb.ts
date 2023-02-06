import mongoose from "mongoose";
import Book from "../models/book.js";

const initBooks = [
    {
        _id: "63deda73b6dfd7ffcc0ea3d2",
        title: "The Awakening",
        author: "Kate Chopin"
    },
    {
        _id: "63deda800d9d23e402328f08",
        title: "City of Glass",
        author: "Paul Auster"
    },
    {
        _id: "63dedb2369d18f95e81f8790",
        title: "One Thousand Cthulhu Attacks",
        author: "James McMillan"
    }
]

const initialize = async () => {
    try {
        const mongoURI = "mongodb://127.0.0.1:27017/devops-test";
        mongoose.set("strictQuery", true);
        const db = await mongoose.connect(mongoURI);
        console.log("🥭 Connected to MongoDB!");
        await Book.insertMany(initBooks);
        await db.disconnect()
    } catch(err) {
        console.error(err);
    }
}

initialize();
