import { Resolvers } from "./__generated__/resolvers-types";

const books = [
    {
        title: "The Awakening",
        author: "Kate Chopin",
    },
    {
        title: "City of Glass",
        author: "Paul Auster",
    },
];

/* const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`; */

const resolvers: Resolvers = {
    Query: {
        books: () => books,
    },
};


export { /* typeDefs, */ resolvers };