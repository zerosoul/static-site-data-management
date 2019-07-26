import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";

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
import GloableStyle from "./GloableStyle";
console.log("env", process.env);

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
    : "https://ssde.yangerxiao.com/graphql";
const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host

  link: authLink.concat(new HttpLink({ uri: API })),
  cache: new InMemoryCache()
});

const App = lazy(() => import("./App"));

ReactDOM.render(
  <>
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
