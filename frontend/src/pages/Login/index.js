import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Form, Input, message } from "antd";
import { Mutation } from "react-apollo";
import { Redirect } from "react-router-dom";
import { Login } from "./actions.gql";
import { isLogin, setLogin } from "../../auth";

const StyledForm = styled.section`
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(to left, #6a11cb, #2575fc);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
    margin-top: -2rem;
    color: #ddd;
    text-shadow: 4px 5px rgba(0, 0, 0, 0.2);
  }
  > form {
    background: #fff;
    max-width: 18rem;
    border: 1px solid #ccc;
    padding: 2rem 3rem;
    border-radius: 0.4rem;
    box-shadow: 0 3px 20px 0 rgba(0, 0, 0, 0.1);
  }
`;
const login = isLogin();
const LoginPage = ({ form, location: { state = {} }, history }) => {
  console.log("state", state);
  const [errMsg, setErrMsg] = useState("");
  const [isLogin, setIsLogin] = useState(login);

  const { from = "/" } = state;
  const submitHandler = (e, login) => {
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const { email, password } = values;
        const rep = await login({ variables: { email, password } });
        console.info(email, password, rep);
        setIsLogin(true);
      }
    });
  };
  useEffect(() => {
    if (errMsg) {
      message.warning(errMsg);
    }
  }, [errMsg]);

  const { getFieldDecorator } = form;
  return isLogin ? (
    <Redirect
      to={{
        pathname: from
      }}
    />
  ) : (
    <Mutation mutation={Login}>
      {(Login, { loading, data, error }) => {
        if (error) {
          console.log("error", error);

          setErrMsg(error.message);
        }
        if (data) {
          console.log("login data", data);
          const resp = data.login || {};
          setLogin(resp);

          history.push(from);
          location.reload();
        }
        return (
          <StyledForm>
            <h1>站点数据管理系统</h1>
            <form
              onSubmit={evt => {
                submitHandler.apply(null, [evt, Login]);
              }}
              autoComplete={"off"}
            >
              <Form.Item label="邮箱">
                {getFieldDecorator("email", {
                  validateTrigger: "onBlur",
                  rules: [
                    {
                      type: "email",
                      message: "邮箱格式有误"
                    },
                    {
                      required: true,
                      message: "请输入邮箱"
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="密码">
                {getFieldDecorator("password", {
                  rules: [
                    {
                      required: true,
                      message: "请输入密码"
                    }
                  ]
                })(<Input.Password />)}
              </Form.Item>

              <div className="form-actions">
                <Button loading={loading} type="primary" htmlType="submit">
                  登录
                </Button>
              </div>
            </form>
          </StyledForm>
        );
      }}
    </Mutation>
  );
};
export default Form.create({ name: "login" })(LoginPage);
