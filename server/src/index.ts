import express from "express";
import compression from "compression";
import { createServer } from "http";
import { gql, makeExecutableSchema } from "apollo-server";
import { execute, subscribe } from "graphql";
import { ApolloServer } from "apollo-server-express";
import { SubscriptionServer } from "subscriptions-transport-ws";
import fs from "fs";
import path from "path";

import resolvers from "./graphql/resolvers";

const typeDefs = gql(
  fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8")
);

const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers,
});

async function startApolloServer() {
  const app = express();
  app.use(compression());
  const apolloServer = new ApolloServer({
    schema,
  });

  apolloServer.applyMiddleware({ app });

  const server = createServer(app);

  server.listen(4000, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`
    );
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
      },
      {
        server: server,
        path: "/graphql",
      }
    );
  });
}

startApolloServer();
