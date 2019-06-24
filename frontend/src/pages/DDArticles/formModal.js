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
  Divider
} from "antd";
import { InsertDdArticle, UpdateDdArticle, GetDdArticle } from "./actions.gql";
const ColLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};

const { Item } = Form;
function getBase64(img, callback) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
function beforeUpload(file) {
  // const isJPG = file.type === "image/jpeg" || file.type === "image/jpg";
  // if (!isJPG) {
  //   message.error("You can only upload JPG file!");
  // }
  const isLt50K = file.size / 1024 < 50;
  if (!isLt50K) {
    message.error("缩略图要小于50K");
  }
  return false;
}
const EditForm = ({ form, handleModalVisible, id = null }) => {
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
        let { title, description, link, date = tmp, thumbnail } = values;
        thumbnail = imgUrl || thumbnail;
        date = moment(date).format("YYYY-MM-DD HH:mm:ss");
        const data = { title, description, link, date, thumbnail };
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
    // return;
    // if (info.file.status === "uploading") {
    //   setUploading(true);
    //   return;
    // }
    if (file) {
      // Get this url from response in real world.
      const imageUrl = await getBase64(file.originFileObj);
      setImgUrl(imageUrl);
      setUploading(false);
    }
  };
  return (
    <Mutation mutation={artId ? UpdateDdArticle : InsertDdArticle}>
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
            <Query query={GetDdArticle} variables={{ artId }} skip={!artId}>
              {({ data = {}, loading, error }) => {
                if (error) return "error";
                console.log("query data", data, artId);
                const { getDdArticle = {} } = data;
                return (
                  <>
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
                            initialValue: getDdArticle.title
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
                            initialValue: getDdArticle.description
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
                            initialValue: getDdArticle.link
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
                              getDdArticle.date &&
                              moment(new Date(+getDdArticle.date))
                          })(<DatePicker showTime placeholder="发表时间" />)}
                        </Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Item label="上传缩略图" {...ColLayout}>
                          {getFieldDecorator("thumbnail", {
                            rules: [],
                            initialValue: getDdArticle.thumbnail
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
                              {imgUrl || getDdArticle.thumbnail ? (
                                <img
                                  src={imgUrl || getDdArticle.thumbnail}
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
                  </>
                );
              }}
            </Query>
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
  <Modal
    width={800}
    title={id ? "更新" : "创建"}
    visible={true}
    footer={false}
    onCancel={() => {
      handleModalVisible(false);
    }}
  >
    <HOCForm handleModalVisible={handleModalVisible} id={id} />
  </Modal>
);
export default FormModal;
