import React from "react";
import ReactDOM from "react-dom";
import { Reset } from "styled-reset";
import { createGlobalStyle } from "styled-components";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import "@babel/polyfill";
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("AUTH_TOKEN");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ""
    }
  };
});
const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  link: authLink.concat(new HttpLink({ uri: "http://localhost:8001/graphql" })),
  // link: new HttpLink({ uri: "http://ssde.yangerxiao.com/graphql" }),
  cache: new InMemoryCache()
});

const GloableStyle = createGlobalStyle`
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}

.form-control label,
.form-control input,
.form-control textarea {
  width: 100%;
  display: block;
}

.form-control {
  margin-bottom: 1rem;
    label {
    margin-bottom: 0.5rem;
  }
}

.btn {
  background: #5101d1;
  font: inherit;
  border: 1px solid #5101d1;
  border-radius: 3px;
  padding: 0.25rem 1rem;
  margin-right: 1rem;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.26);
  color: white;
  cursor: pointer;
}

.btn:hover,
.btn:active {
  background: #6219d6;
  border-color: #6219d6;
}

`;
import App from "./App";

ReactDOM.render(
  <>
    <Reset />
    <GloableStyle />
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </>,
  document.getElementById("root")
);
