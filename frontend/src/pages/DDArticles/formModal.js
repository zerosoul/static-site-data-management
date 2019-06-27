import React, { useState } from "react";
import { Mutation, Query } from "react-apollo";
import moment from "moment";
import {
  Form,
  Input,
  Button,
  Modal,
  Upload,
  Icon,
  message,
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
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};

const { Item } = Form;
const { Option } = Select;
function getBase64(img, callback) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
function beforeUpload(file) {
  const isLt50K = file.size / 1024 < 50;
  if (!isLt50K) {
    message.error("缩略图要小于50K");
  }
  return false;
}
const EditForm = ({ form, handleModalVisible, id = null, article }) => {
  const [imgUrl, setImgUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  console.log("form id", id);
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
          type,
          isTop
        } = values;
        thumbnail = imgUrl || thumbnail || "";
        type = Number(type);
        date = moment(date).format("YYYY-MM-DD HH:mm:ss");
        const data = { title, description, link, date, thumbnail, type, isTop };
        if (artId) {
          console.log("form submit id", artId);
          data.id = artId;
        }
        console.info("form values", title, description, link, date, thumbnail);
        const rep = await editArticle({
          variables: data
        });
      }
    });
  };
  const { getFieldDecorator } = form;
  console.log("handleModalVisible", handleModalVisible);
  const uploadButton = (
    <div>
      <Icon type={uploading ? "loading" : "plus"} />
      <div className="ant-upload-text">上传</div>
    </div>
  );

  const handleChange = async info => {
    console.log("info", info);
    const [file] = info.fileList;
    if (file) {
      // Get this url from response in real world.
      const imageUrl = await getBase64(file.originFileObj);
      setImgUrl(imageUrl);
      setUploading(false);
    }
  };
  return (
    <Mutation
      mutation={artId ? UpdateDdArticle : InsertDdArticle}
      refetchQueries={result => [{ query: ListQuery }]}
      fetchPolicy="no-cache"
    >
      {(editArticle, { loading, data, error }) => {
        if (error) return "error";
        if (data) {
          console.log(data);
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
                    rules: [
                      {
                        required: true,
                        message: "请输入外链"
                      }
                    ],
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
                <Item label="置顶" {...ColLayout}>
                  {getFieldDecorator("isTop", {
                    rules: [],
                    valuePropName: "checked",
                    initialValue: !!article.isTop
                  })(<Switch />)}
                </Item>
              </Col>
              <Col span={6}>
                <Item label="类型" {...ColLayout}>
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
                <Item label="上传缩略图" {...ColLayout}>
                  {getFieldDecorator("thumbnail", {
                    rules: [],
                    initialValue: article.thumbnail
                  })(
                    <Upload
                      accept="image/jpg,image/png"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action={handleChange}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                    >
                      {imgUrl || article.thumbnail ? (
                        <img
                          src={imgUrl || article.thumbnail}
                          style={{ width: "100%" }}
                          alt="avatar"
                        />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
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
const HOCForm = Form.create({ name: "ddarticle" })(EditForm);
const FormModal = ({ handleModalVisible, id }) => (
  <Query
    query={GetDdArticle}
    fetchPolicy="network-only"
    variables={{ artId: id }}
    skip={!id}
  >
    {({ data = {}, loading, error }) => {
      if (error) return "error";
      console.log("wtf", loading);

      const { getDdArticle = {} } = data;
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
              article={getDdArticle}
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
