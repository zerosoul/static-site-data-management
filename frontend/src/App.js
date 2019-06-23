import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import styled from "styled-components";
import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import MainNavigation from "./components/Navigation/MainNavigation";
import { authListener, isLogin } from "./auth";
const Wrapper = styled.main`
  margin: 4rem 2.5rem;
`;

class App extends Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem("TOKEN");
    const userId = localStorage.getItem("USER_ID");
    this.state = {
      token,
      userId
    };
  }
  componentDidMount() {
    authListener();
  }
  render() {
    const { token, userId } = this.state;
    return (
      <BrowserRouter>
        <>
          <MainNavigation />
          <Wrapper>
            <Switch>
              {token && <Redirect from="/" to="/events" exact />}
              {token && <Redirect from="/auth" to="/events" exact />}
              {!token && <Route path="/auth" component={AuthPage} />}
              <Route path="/events" component={EventsPage} />
              {token && <Route path="/bookings" component={BookingsPage} />}
              {!token && <Redirect to="/auth" exact />}
            </Switch>
          </Wrapper>
        </>
      </BrowserRouter>
    );
  }
}

export default App;
