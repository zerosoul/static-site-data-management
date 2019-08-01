import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import { Route, Redirect, Switch } from "react-router-dom";
import { isLogin } from "./auth";
const Login = lazy(() => import("./pages/Login"));

import "core-js/stable";
import "regenerator-runtime/runtime";
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
    ? process.env.REACT_APP_GPL_API_DEV
    : process.env.REACT_APP_GPL_API_PROD;
const client = new ApolloClient({
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
            {isLogin() ? (
              <App />
            ) : (
              <Switch>
                <Route path="/login" exact component={Login} />
                <Redirect
                  to={{
                    pathname: "/login",
                    state: { from: location.pathname }
                  }}
                />
              </Switch>
            )}
          </Suspense>
        </LocaleProvider>
      </BrowserRouter>
    </ApolloProvider>
  </>,
  document.getElementById("root")
);
