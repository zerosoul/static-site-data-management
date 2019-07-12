import React, { useState } from "react";
import { Mutation, Query } from "react-apollo";
import moment from "moment";
import {
  Form,
  Input,
  Button,
  Modal,
  DatePicker,
  Row,
  Col,
  Divider,
  Spin
} from "antd";
import {
  InsertDdPosition,
  UpdateDdPosition,
  GetDdPosition,
  ListQuery
} from "./actions.gql";
const ColLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};

const { Item } = Form;
const EditForm = ({ form, handleModalVisible, id = null, Position }) => {
  console.log("form id", id);
  const posId = id;
  const submitHandler = (e, editPosition) => {
    e.preventDefault();

    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const tmp = new Date().toLocaleDateString();
        console.info("form values", values);
        // return;
        let { title, cate, link, updateTime = tmp, depart, location } = values;
        updateTime = moment(updateTime).format("YYYY-MM-DD HH:mm:ss");
        const data = { title, cate, link, updateTime, depart, location };
        if (posId) {
          console.log("form submit id", posId);
          data.id = posId;
        }
        console.info("form values", title, cate, link, updateTime, depart);
        const rep = await editPosition({
          variables: data
        });
      }
    });
  };
  const { getFieldDecorator } = form;
  console.log("handleModalVisible", handleModalVisible);

  return (
    <Mutation
      mutation={posId ? UpdateDdPosition : InsertDdPosition}
      refetchQueries={result => [{ query: ListQuery }]}
    >
      {(editPosition, { loading, data, error }) => {
        if (error) return "error";
        if (data) {
          console.log(data);
          handleModalVisible(false);
        }
        return (
          <Form
            onSubmit={evt => {
              submitHandler.apply(null, [evt, editPosition]);
            }}
          >
            <Row>
              <Col span={12}>
                <Item label="职位名称" {...ColLayout}>
                  {getFieldDecorator("title", {
                    rules: [
                      {
                        required: true,
                        message: "请输入职位名称"
                      }
                    ],
                    initialValue: Position.title
                  })(<Input placeholder="请输入名称" />)}
                </Item>
              </Col>
              <Col span={12}>
                <Item label="职位类别" {...ColLayout}>
                  {getFieldDecorator("cate", {
                    rules: [
                      {
                        required: true,
                        message: "请输入职位类别"
                      }
                    ],
                    initialValue: Position.cate
                  })(<Input placeholder="请输入职位类别" />)}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Item label="工作地点" {...ColLayout}>
                  {getFieldDecorator("location", {
                    rules: [
                      {
                        required: true,
                        message: "请输入工作地点"
                      }
                    ],
                    initialValue: Position.location
                  })(<Input placeholder="请输入工作地点" />)}
                </Item>
              </Col>
              <Col span={12}>
                <Item label="部门" {...ColLayout}>
                  {getFieldDecorator("depart", {
                    rules: [
                      {
                        required: true,
                        message: "请输入部门"
                      }
                    ],
                    initialValue: Position.depart
                  })(<Input placeholder="请输入部门" />)}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Item label="外链" {...ColLayout}>
                  {getFieldDecorator("link", {
                    rules: [
                      {
                        required: true,
                        message: "请输入外链"
                      }
                    ],
                    initialValue: Position.link
                  })(<Input type="url" placeholder="请输入外链" />)}
                </Item>
              </Col>
              <Col span={12}>
                <Item label="更新时间" {...ColLayout}>
                  {getFieldDecorator("updateTime", {
                    rules: [
                      {
                        required: true,
                        message: "请录入更新时间"
                      }
                    ],
                    initialValue:
                      Position.updateTime &&
                      moment(new Date(+Position.updateTime))
                  })(<DatePicker showTime placeholder="更新时间" />)}
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
const HOCForm = Form.create({ name: "DdPosition" })(EditForm);
const FormModal = ({ handleModalVisible, id }) => (
  <Query query={GetDdPosition} variables={{ posId: id }} skip={!id}>
    {({ data = {}, loading, error }) => {
      if (error) return "error";
      console.log("wtf", loading);

      const { getDdPosition = {} } = data;
      return (
        <Modal
          width={800}
          title={id ? "更新" : "创建"}
          visible={true}
          footer={false}
          onCancel={() => {
            handleModalVisible(false);
          }}
        >
          <Spin spinning={loading}>
            <HOCForm
              Position={getDdPosition}
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
