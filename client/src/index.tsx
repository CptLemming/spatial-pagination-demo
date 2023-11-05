import React from "react";
import ReactDOM from "react-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";

import { GlobalStyle } from "./styled";
import App from "./App";

const httpLink = new HttpLink({
  uri: "http://172.26.57.252:4000/graphql",
});

const wsLink = new WebSocketLink({
  uri: "ws://172.26.57.252:4000/graphql",
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <>
        <GlobalStyle />
        <App />
      </>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
