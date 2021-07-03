import { ApolloServer, gql } from "apollo-server";
import fs from "fs";
import path from "path";

import resolvers from "./graphql/resolvers";

const typeDefs = gql(
  fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8")
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    path: "/graphql",
  },
});

server.listen(4000, "0.0.0.0").then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
