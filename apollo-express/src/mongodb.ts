import mongoose from "mongoose";

const mongoURI = process.env.NODE_ENV === "production" ? process.env.DB_URI : "mongodb://127.0.0.1:27017/devops-test";

mongoose.set("strictQuery", true);
mongoose.connect(mongoURI).then(() => {
    console.log("🥭 Connected to MongoDB!")
}).catch((error) => {
    console.log("Error connection to MongoDB:", error.message)
});