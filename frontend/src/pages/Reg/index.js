import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Form, Input, message } from "antd";
import { Mutation } from "react-apollo";
import { Reg } from "./actions.gql";
import { isLogin } from "../../auth";
const StyledForm = styled.form`
  margin: 0 auto;
  max-width: 18rem;
  border: 1px solid #ccc;
  padding: 1rem 2rem;
`;
const RegPage = ({ form, history }) => {
  const [errMsg, setErrMsg] = useState("");
  if (isLogin()) {
    history.push("/login");
  }
  const submitHandler = (e, reg) => {
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const { name, email, password } = values;
        const rep = await reg({ variables: { name, email, password } });
        console.info(email, password, rep);
      }
    });
  };
  useEffect(() => {
    console.log("err msg", errMsg);

    if (!!errMsg) {
      console.log("err msg warn", errMsg);
      message.warning(errMsg);
      // .then(() => {
      //   setErrMsg("");
      // });
    }
  }, [errMsg]);

  const { getFieldDecorator } = form;
  return (
    <Mutation mutation={Reg}>
      {(Reg, { loading, data, error, called }) => {
        console.log("err msg fetch", called);
        if (error) {
          {
            /* 这里有问题，会循环render */
          }
          setErrMsg(`${error.message}`);
        }
        if (data && data.reg) {
          console.log("reg data", data);
          const { email } = data.reg || {};
          history.push("/login");
        }
        return (
          <StyledForm
            onSubmit={evt => {
              submitHandler.apply(null, [evt, Reg]);
            }}
            autoComplete={"off"}
          >
            <Form.Item label="用户名">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "请输入用户名"
                  }
                ]
              })(<Input placeholder="用户名" />)}
            </Form.Item>
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
              })(<Input placeholder="邮箱" />)}
            </Form.Item>
            <Form.Item label="密码">
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: true,
                    message: "请输入密码"
                  }
                ]
              })(<Input.Password placeholder="密码" />)}
            </Form.Item>

            <div className="form-actions">
              <Button loading={loading} type="primary" htmlType="submit">
                注册
              </Button>
            </div>
          </StyledForm>
        );
      }}
    </Mutation>
  );
};
export default Form.create({ name: "reg" })(RegPage);
