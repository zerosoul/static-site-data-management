import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Form, Input, message } from "antd";
import { Mutation } from "react-apollo";
import { Redirect } from "react-router-dom";
import { Login } from "./actions.gql";
import { isLogin, setLogin } from "../../auth";

const StyledForm = styled.form`
  margin: 100px auto;
  max-width: 15rem;
  border: 1px solid #ccc;
  padding: 1rem 2rem;
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
          <StyledForm
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
          </StyledForm>
        );
      }}
    </Mutation>
  );
};
export default Form.create({ name: "login" })(LoginPage);
