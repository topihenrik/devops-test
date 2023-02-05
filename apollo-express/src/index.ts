import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from "morgan";
import mongoose from 'mongoose';
import { resolvers } from './resolvers.js';
import { readFileSync } from 'fs';
const typeDefs = readFileSync('./src/schema.graphql', { encoding: 'utf-8' });

const mongoURI = "mongodb://127.0.0.1:27017/devops-test";
mongoose.set("strictQuery", true);
mongoose.connect(mongoURI).then(() => {
  console.log("🥭 Connected to MongoDB!")
}).catch((error) => {
  console.log("Error connection to MongoDB:", error.message)
});


export interface MyContext {
  token?: String;
};

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(cors(), morgan("dev"));
//if (process.env.NODE_ENV === "production") 
app.use(express.static("front"));
app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  //json(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);

await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);