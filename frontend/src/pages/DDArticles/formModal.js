import React, { useState } from "react";
import { Mutation } from "react-apollo";
import { Form, Input, Button, Modal, Upload, Icon, message } from "antd";
import { InsertDdArticle } from "./actions.gql";

const { Item } = Form;
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
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
const EditForm = ({ form, handleModalVisible }) => {
  const [imgUrl, setImgUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const submitHandler = (e, createDdArticle) => {
    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const tmp = new Date().toLocaleDateString();
        // console.info("form values", values);
        // return;
        let { title, description, link, date = tmp, thumbnail } = values;
        thumbnail = imgUrl;
        const rep = await createDdArticle({
          variables: { title, description, link, date, thumbnail }
        });
        console.info("form values", title, description, link, thumbnail, rep);
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

  const handleChange = info => {
    console.log("info", info);
    const [file] = info.fileList;
    // return;
    // if (info.file.status === "uploading") {
    //   setUploading(true);
    //   return;
    // }
    if (file) {
      // Get this url from response in real world.
      getBase64(file.originFileObj, imageUrl => {
        setImgUrl(imageUrl);
        setUploading(false);
      });
    }
  };
  return (
    <Mutation mutation={InsertDdArticle}>
      {(createDdArticle, { loading, data, error }) => {
        if (error) return "error";
        if (data) {
          console.log(data);
          handleModalVisible(false);
        }
        return (
          <Form
            onSubmit={evt => {
              submitHandler.apply(null, [evt, createDdArticle]);
            }}
          >
            <Item label="标题">
              {getFieldDecorator("title", {
                rules: [
                  {
                    required: true,
                    message: "请输入标题"
                  }
                ]
              })(<Input placeholder="请输入标题" />)}
            </Item>
            <Item label="描述">
              {getFieldDecorator("description", {
                rules: [
                  {
                    required: true,
                    message: "请输入描述"
                  }
                ]
              })(
                <Input.TextArea
                  autosize={{ minRows: 3, maxRows: 6 }}
                  placeholder="请输入描述"
                />
              )}
            </Item>
            <Item label="外链接">
              {getFieldDecorator("link", {
                rules: [
                  {
                    required: true,
                    message: "请输入外链"
                  }
                ]
              })(<Input type="url" placeholder="请输入外链" />)}
            </Item>
            <Item label="上传缩略图">
              {getFieldDecorator("thumbnail", {
                rules: []
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
                  {imgUrl ? (
                    <img src={imgUrl} style={{ width: "100%" }} alt="avatar" />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              )}
            </Item>
            <Item>
              <Button loading={loading} type="primary" htmlType="submit">
                创建
              </Button>
            </Item>
          </Form>
        );
      }}
    </Mutation>
  );
};
const HOCForm = Form.create({ name: "ddarticle" })(EditForm);
const FormModal = ({ handleModalVisible }) => (
  <Modal
    title="创建文章"
    visible={true}
    footer={false}
    onCancel={() => {
      handleModalVisible(false);
    }}
  >
    <HOCForm handleModalVisible={handleModalVisible} />
  </Modal>
);
export default FormModal;
