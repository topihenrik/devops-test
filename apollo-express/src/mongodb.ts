import mongoose from "mongoose";
import { initializeForTests } from "./tests/init-mongodb.js";

const mongoURI = process.env.NODE_ENV === "production" 
    ? process.env.DB_URI                            // production
    : process.env.NODE_ENV === "development"
        ? "mongodb://127.0.0.1:27017/devops-dev"    // development
        : "mongodb://127.0.0.1:27017/devops-test";  // testing

try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongoURI);
    console.log("🥭 Connected to MongoDB!")
    if (process.env.NODE_ENV === "test") await initializeForTests();
} catch (error) {
    console.log("Error connection to MongoDB:", error.message)
}
