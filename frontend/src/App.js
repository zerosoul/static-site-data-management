import React, { Component } from "react";
import { Route, Redirect, Switch, Link } from "react-router-dom";
import { withRouter } from "react-router";
import styled from "styled-components";

import { Layout, Menu, Icon, Divider, Button } from "antd";

const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;
import DDArticles from "./pages/DDArticles";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Reg from "./pages/Reg";
import { updateExp, isLogin, logout } from "./auth";
import DDPositions from "./pages/DDPositions";

const StyledBtn = styled(Button)`
  margin-right: 1rem;
  > a {
    color: #fff;
    padding-left: 5px;
  }
`;
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
      isLogin: false,
      pathName: "/"
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
    const { pathname } = this.props.location;

    this.setState({
      isLogin: isLogin(),
      pathName: pathname
    });
    this.props.history.listen((location, action) => {
      // location is an object like window.location
      this.setState({
        pathName: location.pathname,
        isLogin: isLogin()
      });
      console.log("path changed", action, location.pathname, location.state);
    });
  }
  render() {
    const { isLogin, pathName } = this.state;
    console.log("path name", this.props);

    return (
      <Layout>
        <StyledHeader>
          {/* <div className="logo" /> */}
          {isLogin && (
            <Menu
              selectedKeys={[pathName]}
              mode="horizontal"
              theme="dark"
              style={{ lineHeight: "64px" }}
            >
              <Menu.Item key={"/"}>
                <Link to={"/"}>首页</Link>
              </Menu.Item>
              <SubMenu title={<span>{"官网数据管理"}</span>}>
                <Menu.Item key={"/ddarticles"}>
                  <Link to={"/ddarticles"}>录入文章</Link>
                </Menu.Item>

                <Menu.Item key="/ddpositions">
                  <Link to={"/ddpositions"}>录入职位</Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          )}
          <div className="btns">
            <StyledBtn
              ghost
              href={isLogin ? null : "/login"}
              icon="poweroff"
              onClick={isLogin ? this.handleLogout : null}
            >
              {isLogin ? `退出` : <Link to="/login">登录</Link>}
            </StyledBtn>

            {!isLogin && (
              <StyledBtn icon="user-add" ghost>
                <Link to="/reg">注册</Link>
              </StyledBtn>
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
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/reg" component={Reg} />
            <AuthRoute path="/" exact component={Home} />
            <AuthRoute path="/ddarticles" component={DDArticles} />
            <AuthRoute path="/ddpositions" component={DDPositions} />
          </Switch>
        </Content>
        <Footer>footer</Footer>
      </Layout>
    );
  }
}

export default withRouter(App);
// export default App;
