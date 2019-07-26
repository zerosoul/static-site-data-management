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
  Select,
  Switch
} from "antd";
import { InsertCode, UpdateCode, GetCode, ListQuery } from "./actions.gql";
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
const EditForm = ({ form, handleModalVisible, id = null, code }) => {
  console.log("form id", id);
  const codeId = id;
  const submitHandler = (e, editCode) => {
    e.preventDefault();

    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        console.info("form values", values);
        // return;
        let { value, used, role } = values;
        role = Number(role);
        const data = {
          value,
          used,
          role
        };

        if (codeId) {
          console.log("form submit id", codeId);
          data.id = codeId;
        }
        console.info("form values", data);
        await editCode({
          variables: data
        });
      }
    });
  };
  const { getFieldDecorator } = form;
  console.log("handleModalVisible", handleModalVisible);

  return (
    <Mutation
      mutation={codeId ? UpdateCode : InsertCode}
      refetchQueries={result => [{ query: ListQuery }]}
      fetchPolicy="no-cache"
    >
      {(editCode, { loading, data, error }) => {
        if (error) return "error";
        if (data) {
          console.log(data);
          handleModalVisible(false);
        }
        return (
          <Form
            onSubmit={evt => {
              submitHandler.apply(null, [evt, editCode]);
            }}
          >
            <Row>
              <Col span={6}>
                <Item label="Code码" {...ColLayout}>
                  {getFieldDecorator("value", {
                    rules: [
                      {
                        required: true,
                        message: "请输入Code码"
                      }
                    ],
                    initialValue: code.value
                  })(<Input placeholder="请输入Code码" />)}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Item label="角色" {...ThinColLayout}>
                  {getFieldDecorator("role", {
                    rules: [],
                    initialValue: String(code.role || 2)
                  })(
                    <Select>
                      <Option value="1">管理员</Option>
                      <Option value="2">运营人员</Option>
                    </Select>
                  )}
                </Item>
              </Col>
              <Col span={12}>
                <Item label="是否使用" {...ThinColLayout}>
                  {getFieldDecorator("used", {
                    rules: [],
                    valuePropName: "checked",
                    initialValue: !!code.used
                  })(<Switch />)}
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
const HOCForm = Form.create({ name: "inviteCode" })(EditForm);
const FormModal = ({ handleModalVisible, id }) => (
  <Query
    query={GetCode}
    fetchPolicy="network-only"
    variables={{ codeId: id }}
    skip={!id}
  >
    {({ data = {}, loading, error }) => {
      if (error) return "error";
      console.log("wtf", loading);

      const { getCode = {} } = data;
      return (
        <Modal
          maskClosable={false}
          width={"90vw"}
          title={id ? "更新" : "创建"}
          visible={true}
          footer={false}
          onCancel={() => {
            handleModalVisible(false);
          }}
        >
          <Spin spinning={loading}>
            <HOCForm
              code={getCode}
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
