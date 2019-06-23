import React, { Component } from "react";
import styled from "styled-components";
import { Button, Form, Input } from "antd";
import gql from "graphql-tag";
import { Mutation, Query } from "react-apollo";

const MUTAITION_REG = gql`
  mutation CreateUser($email: String!, $password: String!) {
    createUser(userInput: { email: $email, password: $password }) {
      _id
      email
    }
  }
`;
const MUTATION_LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      userId
      token
      tokenExpiration
    }
  }
`;
const StyledForm = styled(Form)`
  width: 25rem;
  max-width: 80%;
  margin: 5rem auto;
`;
class AuthPage extends Component {
  state = {
    isLogin: true
  };

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    });
  };
  submitHandler = (e, login) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const { email, password } = values;
        const rep = await login({ variables: { email, password } });
        console.info(email, password, rep);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Mutation mutation={MUTATION_LOGIN}>
        {(Login, { loading, data, error }) => {
          {
            /* if (loading) return "loading"; */
          }
          if (error) return "error";
          if (data) {
            console.log("login data", data);
            const { token, userId, tokenExpiration } = data.login || {};
            localStorage.setItem("TOKEN", token);
            localStorage.setItem("USER_ID", userId);
            localStorage.setItem("TOKEN_EXPI", tokenExpiration);
          }
          return (
            <StyledForm
              onSubmit={evt => {
                this.submitHandler.apply(null, [evt, Login]);
              }}
            >
              <Form.Item label="E-mail">
                {getFieldDecorator("email", {
                  rules: [
                    {
                      type: "email",
                      message: "The input is not valid E-mail!"
                    },
                    {
                      required: true,
                      message: "Please input your E-mail!"
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Password">
                {getFieldDecorator("password", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your Password!"
                    }
                  ]
                })(<Input.Password />)}
              </Form.Item>

              <div className="form-actions">
                {/* {this.state.isLogin ? (
            <Query query={MUTATION_LOGIN}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Query>
          ) : (
            <Mutation mutation={MUTAITION_REG}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Mutation>
          )} */}

                <Button loading={loading} type="primary" htmlType="submit">
                  Submit
                </Button>

                <Button onClick={this.switchModeHandler}>
                  Switch to {this.state.isLogin ? "Signup" : "Login"}
                </Button>
              </div>
            </StyledForm>
          );
        }}
      </Mutation>
    );
  }
}

export default Form.create({ name: "auth" })(AuthPage);
