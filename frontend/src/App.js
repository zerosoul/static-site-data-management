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

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  render() {
    const { token, userId } = this.state;
    return (
      <Layout>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <Icon type="user" />
              <a href="/ddarticles">点点未来官网文章</a>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
              onClick={this.toggle}
            />
          </Header>
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
      </Layout>
    );
  }
}

export default App;
