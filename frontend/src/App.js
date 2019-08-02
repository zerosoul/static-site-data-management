import React, { Component, lazy, Suspense } from "react";
import { Route, Redirect, Switch, Link } from "react-router-dom";
import { withRouter } from "react-router";
import styled from "styled-components";

import { Layout, Menu, Skeleton, Button } from "antd";

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;
const Home = lazy(() => import("./pages/Home"));
const DDArticles = lazy(() => import("./pages/DDArticles"));
const DDPositions = lazy(() => import("./pages/DDPositions"));
const WeekReport = lazy(() => import("./pages/WeekReport"));
const Codes = lazy(() => import("./pages/Codes"));
const Users = lazy(() => import("./pages/Users"));
const Reg = lazy(() => import("./pages/Reg"));
const Page404 = lazy(() => import("./pages/404"));
import { updateExp, isLogin, isAdmin, logout } from "./auth";

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
      pathName: "/"
    };
  }
  handleLogout = () => {
    console.log("logout");
    logout();
    location.reload();
  };
  componentDidMount() {
    const { pathname } = this.props.location;

    this.setState({
      pathName: pathname
    });
    this.props.history.listen((location, action) => {
      // location is an object like window.location
      this.setState({
        pathName: location.pathname
      });
      console.log("path changed", action, location.pathname, location.state);
    });
  }
  render() {
    const { pathName } = this.state;
    console.log("isAdmin", this.props);

    return (
      <Layout>
        <StyledHeader>
          <Menu
            selectedKeys={[pathName]}
            mode="horizontal"
            theme="dark"
            style={{ lineHeight: "64px" }}
          >
            <Menu.Item key={"/"}>
              <Link to={"/"}>首页</Link>
            </Menu.Item>
            <SubMenu title={<span>站点数据</span>}>
              <Menu.Item key={"/ddarticles"}>
                <Link to={"/ddarticles"}>文章</Link>
              </Menu.Item>

              <Menu.Item key="/ddpositions">
                <Link to={"/ddpositions"}>职位</Link>
              </Menu.Item>
            </SubMenu>
            {isAdmin() && (
              <SubMenu title={<span>系统管理</span>}>
                <Menu.Item key={"/users"}>
                  <Link to={"/users"}>用户管理</Link>
                </Menu.Item>
              </SubMenu>
            )}
          </Menu>
          <div className="btns">
            <StyledBtn ghost icon="poweroff" onClick={this.handleLogout}>
              退出
            </StyledBtn>
          </div>
        </StyledHeader>
        <Content
          id="mainBlock"
          style={{
            margin: "24px 50px",
            padding: "20px",
            background: "#fff",
            minHeight: "82vh"
          }}
        >
          <Suspense fallback={<Skeleton active />}>
            <Switch>
              <Route path="/reg" component={Reg} />
              <AuthRoute path="/" exact component={Home} />
              <AuthRoute path="/codes" component={Codes} />
              <AuthRoute path="/users" component={Users} />
              <AuthRoute path="/weekreport" component={WeekReport} />
              <AuthRoute path="/ddarticles" component={DDArticles} />
              <AuthRoute path="/ddpositions" component={DDPositions} />
              <Route component={Page404} />
            </Switch>
          </Suspense>
        </Content>
        <Footer>网站数据录入平台 @ {new Date().getFullYear()}</Footer>
      </Layout>
    );
  }
}

export default withRouter(App);
