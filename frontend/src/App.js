import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
// import { withRouter } from "react-router";
import styled from "styled-components";
import { Layout, Menu, Icon, Divider, Button } from "antd";

const { Header, Sider, Content, Footer } = Layout;

import DDArticles from "./pages/DDArticles";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Reg from "./pages/Reg";
import { updateExp, isLogin, logout } from "./auth";
import DDPositions from "./pages/DDPositions";
const AuthRoute = props => {
  if (isLogin()) {
    // update expire duration
    updateExp();
    return <Route {...props} />;
  } else {
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: props.path }
        }}
      />
    );
  }
};
const StyledHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false
    };
  }
  handleLogout = () => {
    console.log("logou");
    logout();
    this.setState({
      isLogin: false
    });
  };
  componentDidMount() {
    this.setState({
      isLogin: isLogin()
    });
    window.onstorage = evt => {
      console.log("storage", evt);
    };
  }
  render() {
    const { isLogin } = this.state;
    return (
      <Layout>
        <StyledHeader>
          {/* <div className="logo" /> */}
          {isLogin && (
            <Menu mode="horizontal" theme="dark" style={{ lineHeight: "64px" }}>
              <Menu.Item key="1">
                <a href="/ddarticles">录入文章</a>
              </Menu.Item>

              <Menu.Item key="2">
                <a href="/ddpositions">录入职位</a>
              </Menu.Item>
            </Menu>
          )}
          {/* <Divider type="vertical" /> */}
          <div className="btns">
            <Button
              type="link"
              ghost
              href={isLogin ? null : "/login"}
              icon="poweroff"
              onClick={this.handleLogout}
            >
              {isLogin ? `退出` : `登录`}
            </Button>
            {!isLogin && (
              <Button icon="user-add" ghost type="link" href="/reg">
                注册
              </Button>
            )}
          </div>
        </StyledHeader>
        <Content
          style={{
            margin: "24px 50px",
            padding: "20px",
            background: "#fff",
            minHeight: "80vh"
          }}
        >
          <BrowserRouter>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/reg" component={Reg} />
              <AuthRoute path="/" exact component={Home} />
              <AuthRoute path="/ddarticles" component={DDArticles} />
              <AuthRoute path="/ddpositions" component={DDPositions} />
            </Switch>
          </BrowserRouter>
        </Content>
        <Footer>footer</Footer>
      </Layout>
    );
  }
}

export default App;
