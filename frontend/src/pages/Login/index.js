import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Form, Input, message } from "antd";
import { Mutation } from "react-apollo";
import { Login } from "./actions.gql";
import { isLogin } from "../../auth";

const StyledForm = styled.form`
  margin: 0 auto;
  max-width: 15rem;
  border: 1px solid #ccc;
  padding: 1rem 2rem;
`;
const LoginPage = ({ form, location: { state = {} }, history }) => {
  console.log("state", state);
  const [errMsg, setErrMsg] = useState("");

  const { from = "/" } = state;
  if (isLogin()) {
    history.push(from);
  }
  const submitHandler = (e, login) => {
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const { email, password } = values;
        const rep = await login({ variables: { email, password } });
        console.info(email, password, rep);
      }
    });
  };
  useEffect(() => {
    if (errMsg) {
      message.warning(errMsg);
    }
  }, [errMsg]);

  const { getFieldDecorator } = form;
  return (
    <Mutation mutation={Login}>
      {(Login, { loading, data, error }) => {
        if (error) {
          console.log("error", error);

          setErrMsg(error.message);
        }
        if (data) {
          console.log("login data", data);
          const { token, userId, tokenExpiration } = data.login || {};
          localStorage.setItem("TOKEN", token);
          localStorage.setItem("USER_ID", userId);
          localStorage.setItem("LOGIN_TS", new Date().getTime());

          history.push(from);
          return null;
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
