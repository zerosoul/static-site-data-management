import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import styled from "styled-components";
import { Layout, Menu, Icon } from "antd";

const { Header, Sider, Content, Footer } = Layout;

import AuthPage from "./pages/Auth";
import DDArticles from "./pages/DDArticles";
import { authListener, isLogin } from "./auth";
const Wrapper = styled.main`
  margin: 4rem 2.5rem;
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    };
  }

  render() {
    const { token, userId } = this.state;
    return (
      <Layout>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            minHeight: 280
          }}
        >
          <BrowserRouter>
            <Switch>
              {!token && <Route path="/auth" component={AuthPage} />}
              <Route path="/ddarticles" component={DDArticles} />
              {!token && <Redirect to="/auth" exact />}
            </Switch>
          </BrowserRouter>
        </Content>
        <Footer>footer</Footer>
      </Layout>
    );
  }
}

export default App;
