import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import { Reset } from "styled-reset";
import { createGlobalStyle } from "styled-components";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
import { LocaleProvider, Skeleton } from "antd";
import moment from "moment";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import "moment/locale/zh-cn";

moment.locale("zh-cn");

import "@babel/polyfill";
console.log(process.env.NODE_ENV);

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
const API =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8001/graphql"
    : "http://ssde.yangerxiao.com/graphql";
const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host

  link: authLink.concat(new HttpLink({ uri: API })),
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
const App = lazy(() => import("./App"));
// import App from "./App";

ReactDOM.render(
  <>
    <Reset />
    <GloableStyle />
    <ApolloProvider client={client}>
      <BrowserRouter>
        <LocaleProvider locale={zh_CN}>
          <Suspense
            fallback={
              <Skeleton
                paragraph={{
                  rows: 20
                }}
                title={false}
                active
              />
            }
          >
            <App />
          </Suspense>
        </LocaleProvider>
      </BrowserRouter>
    </ApolloProvider>
  </>,
  document.getElementById("root")
);
