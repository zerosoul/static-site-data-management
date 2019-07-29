import React, { useState } from "react";
import { Mutation, Query } from "react-apollo";
import moment from "moment";
import Editor from "../../components/Editor";
import UploadImage from "../../components/UploadImage";

import {
  Form,
  Input,
  Button,
  Modal,
  DatePicker,
  Row,
  Col,
  Divider,
  Spin,
  Select,
  Switch
} from "antd";
import {
  InsertDdArticle,
  UpdateDdArticle,
  GetDdArticle,
  ListQuery
} from "./actions.gql";
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
  article
}) => {
  const [imgUrl, setImgUrl] = useState(null);
  // const [editorContent, setEditorContent] = useState("");
  // console.log("form id", id);
  const artId = id;
  const submitHandler = (e, editArticle) => {
    e.preventDefault();

    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const tmp = new Date().toLocaleDateString();
        console.info("form values", values);
        // return;
        let {
          title,
          description,
          link,
          date = tmp,
          thumbnail,
          content = "",
          type,
          isTop
        } = values;
        thumbnail = imgUrl || thumbnail || "";
        type = Number(type);
        date = moment(date).format("YYYY-MM-DD HH:mm:ss");
        const data = {
          title,
          description,
          content,
          link,
          date,
          thumbnail,
          type,
          isTop
        };
        if (artId) {
          // console.log("form submit id", artId);
          data.id = artId;
        }
        // console.info("form values", data);
        // return;
        await editArticle({
          variables: data
        });
      }
    });
  };
  const { getFieldDecorator } = form;
  // console.log("handleModalVisible", handleModalVisible);

  return (
    <Mutation
      mutation={artId ? UpdateDdArticle : InsertDdArticle}
      refetchQueries={[{ query: ListQuery, variables: retriveValues }]}
      awaitRefetchQueries={true}
      fetchPolicy="no-cache"
    >
      {(editArticle, { loading, data, error }) => {
        if (error) return "error";
        if (data) {
          handleModalVisible(false);
        }
        return (
          <Form
            onSubmit={evt => {
              submitHandler.apply(null, [evt, editArticle]);
            }}
          >
            <Row>
              <Col span={12}>
                <Item label="标题" {...ColLayout}>
                  {getFieldDecorator("title", {
                    rules: [
                      {
                        required: true,
                        message: "请输入标题"
                      }
                    ],
                    initialValue: article.title
                  })(<Input placeholder="请输入标题" />)}
                </Item>
              </Col>
              <Col span={12}>
                <Item label="描述" {...ColLayout}>
                  {getFieldDecorator("description", {
                    rules: [
                      {
                        required: true,
                        message: "请输入描述"
                      }
                    ],
                    initialValue: article.description
                  })(
                    <Input.TextArea
                      autosize={{ minRows: 3, maxRows: 6 }}
                      placeholder="请输入描述"
                    />
                  )}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Item label="外链接" {...ColLayout}>
                  {getFieldDecorator("link", {
                    rules: [],
                    initialValue: article.link
                  })(<Input type="url" placeholder="请输入外链" />)}
                </Item>
              </Col>
              <Col span={12}>
                <Item label="发表时间" {...ColLayout}>
                  {getFieldDecorator("date", {
                    rules: [
                      {
                        required: true,
                        message: "请录入发表时间"
                      }
                    ],
                    initialValue:
                      article.date && moment(new Date(+article.date))
                  })(<DatePicker showTime placeholder="发表时间" />)}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Item label="缩略图" {...ThinColLayout}>
                  {getFieldDecorator("thumbnail", {
                    rules: [],
                    initialValue: article.thumbnail
                  })(
                    <UploadImage
                      imgUrl={imgUrl || article.thumbnail}
                      setImgUrl={setImgUrl}
                    />
                  )}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="类型" {...ThinColLayout}>
                  {getFieldDecorator("type", {
                    rules: [],
                    initialValue: String(article.type || 1)
                  })(
                    <Select>
                      <Option value="1">新闻稿</Option>
                      <Option value="2">点滴人物</Option>
                    </Select>
                  )}
                </Item>
              </Col>
              <Col span={12}>
                <Item label="置顶" {...ThinColLayout}>
                  {getFieldDecorator("isTop", {
                    rules: [],
                    valuePropName: "checked",
                    initialValue: !!article.isTop
                  })(<Switch />)}
                </Item>
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col span={24}>
                {getFieldDecorator("content", {
                  rules: [],
                  initialValue: article.content
                })(<Editor />)}
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
const HOCForm = Form.create({ name: "ddarticle" })(EditForm);
const FormModal = ({ handleModalVisible, id, retriveValues }) => (
  <Query
    query={GetDdArticle}
    fetchPolicy="network-only"
    variables={{ artId: id }}
    skip={!id}
  >
    {({ data = {}, loading, error }) => {
      if (error) return "error";

      const { getDdArticle = {} } = data;
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
              article={getDdArticle}
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
