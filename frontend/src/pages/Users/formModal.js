import React from "react";
import { Mutation, Query } from "react-apollo";

import {
  Form,
  Input,
  Button,
  Modal,
  Row,
  Col,
  Divider,
  Spin,
  Select
} from "antd";
import { InsertUser, UpdateUser, GetUser, ListQuery } from "./actions.gql";
const ColLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};
const ThinColLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};

const { Item } = Form;
const { Option } = Select;
const EditForm = ({
  form,
  retriveValues,
  handleModalVisible,
  id = null,
  user
}) => {
  const uid = id;
  const submitHandler = (e, editUser) => {
    e.preventDefault();

    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        console.info("form values", values);
        let { name, email, mobile, role, password } = values;
        if (!password) {
          password = "123123";
        }
        role = Number(role);
        const data = {
          name,
          email,
          mobile,
          role,
          password
        };
        if (uid) {
          data.id = uid;
        }
        await editUser({
          variables: data
        });
      }
    });
  };
  const { getFieldDecorator } = form;
  return (
    <Mutation
      mutation={uid ? UpdateUser : InsertUser}
      refetchQueries={[{ query: ListQuery, variables: retriveValues }]}
      awaitRefetchQueries={true}
      fetchPolicy="no-cache"
    >
      {(editUser, { loading, data, error }) => {
        if (error) return "error";
        if (data) {
          handleModalVisible(false);
        }
        return (
          <Form
            onSubmit={evt => {
              submitHandler.apply(null, [evt, editUser]);
            }}
          >
            <Row>
              <Col span={12}>
                <Item label="用户名" {...ColLayout}>
                  {getFieldDecorator("name", {
                    rules: [
                      {
                        required: true,
                        message: "请输入用户名"
                      }
                    ],
                    initialValue: user.name
                  })(<Input placeholder="请输入用户名" />)}
                </Item>
              </Col>
              <Col span={12}>
                <Item label="手机号" {...ColLayout}>
                  {getFieldDecorator("mobile", {
                    rules: [
                      {
                        required: true,
                        message: "请输入手机号"
                      }
                    ],
                    initialValue: user.mobile
                  })(<Input placeholder="请输入手机号" />)}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Item label="邮箱" {...ColLayout}>
                  {getFieldDecorator("email", {
                    rules: [
                      {
                        required: true,
                        message: "请输入邮箱"
                      }
                    ],
                    initialValue: user.email
                  })(<Input placeholder="请输入邮箱" />)}
                </Item>
              </Col>
              <Col span={12}>
                <Item label="密码" {...ColLayout}>
                  {getFieldDecorator("password", {
                    rules: [],
                    initialValue: user.password
                  })(<Input placeholder="请输入密码" />)}
                </Item>
              </Col>
            </Row>

            <Row>
              <Col span={6}>
                <Item label="角色" {...ThinColLayout}>
                  {getFieldDecorator("role", {
                    rules: [],
                    initialValue: String(user.role || 2)
                  })(
                    <Select>
                      <Option value="1">管理员</Option>
                      <Option value="2">运营</Option>
                    </Select>
                  )}
                </Item>
              </Col>
            </Row>

            <Divider />
            <Row>
              <Col span={24} offset={18}>
                <Item>
                  <Button loading={loading} type="primary" htmlType="submit">
                    {id ? "更新" : "创建"}
                  </Button>
                </Item>
              </Col>
            </Row>
          </Form>
        );
      }}
    </Mutation>
  );
};
const HOCForm = Form.create({ name: "dduser" })(EditForm);
const FormModal = ({ handleModalVisible, id, retriveValues }) => (
  <Query
    query={GetUser}
    fetchPolicy="network-only"
    variables={{ uid: id }}
    skip={!id}
  >
    {({ data = {}, loading, error }) => {
      if (error) return "error";

      const { getUser = {} } = data;
      return (
        <Modal
          maskClosable={false}
          width={"50vw"}
          title={id ? "更新" : "创建"}
          visible={true}
          footer={false}
          onCancel={() => {
            handleModalVisible(false);
          }}
        >
          <Spin spinning={loading}>
            <HOCForm
              user={getUser}
              retriveValues={retriveValues}
              handleModalVisible={handleModalVisible}
              id={id}
            />
          </Spin>
        </Modal>
      );
    }}
  </Query>
);
export default FormModal;
