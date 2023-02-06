
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { resolvers } from "./resolvers.js";
import { readFileSync } from "fs";
const typeDefs = readFileSync("./src/schema.graphql", { encoding: "utf-8" });

const mongoURI = process.env.NODE_ENV === "production" ? process.env.DB_URI : "mongodb://127.0.0.1:27017/devops-test";
mongoose.set("strictQuery", true);
mongoose.connect(mongoURI).then(() => {
    console.log("🥭 Connected to MongoDB!")
}).catch((error) => {
    console.log("Error connection to MongoDB:", error.message)
});

const app = express();
const httpServer = http.createServer(app);

export interface MyContext {
    token?: string;
}
const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === "production") app.use(express.static("front"));

app.use("/graphql",
    expressMiddleware(server, {
        context: async ({ req }) => ({ token: req.headers.token }),
    }),
);

const PORT = 4000;
await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(`🚀 Listening on port ${PORT}`);