import { Button, Upload, Icon, message } from "antd";
import React, { useState, useEffect, forwardRef } from "react";
import styled from "styled-components";
import { compressImage, uploadImage } from "../utils";

const UploadBlock = styled.div`
  padding: 15px 20px;
  border: 1px dashed #ddd;
  cursor: pointer;
  text-align: center;
  &:hover {
    border-color: #007abc;
  }
`;
const UploadImageBlock = styled.div`
  position: relative;
  max-width: 150px;
  cursor: pointer;
  > img {
    width: 100%;
  }
  .loading {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666;
  }
`;

const UploadImage = (props, ref) => {
  const { imgUrl, setImgUrl, ...rest } = props;
  console.log("upload props", props, ref);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [fileList, setFileList] = useState([]);
  const beforeUpload = file => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      setUploadError("You can only upload JPG/PNG file!");
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      setUploadError("Image must smaller than 5MB!");
    }
    return false;
  };
  const handleChange = async info => {
    if (uploading) {
      return;
    }
    if (uploadError) {
      message.error(uploadError);
      return;
    }
    console.log("info", info.fileList);
    // 取最新的
    const [file] = info.fileList.slice(-1);
    console.log("file info", file);
    // return;
    setUploading(true);
    if (file) {
      // Get this url from response in real world.
      console.log("file origin ", file);

      const compressedFile = await compressImage(file.originFileObj);
      const imageUrl = await uploadImage(compressedFile);
      console.log("image url ", imageUrl);

      setImgUrl(imageUrl);

      setUploadError(null);
    }
    setFileList(info.fileList);
  };
  const handleImageLoad = ({ target }) => {
    console.log("image wtf", target);

    setUploading(false);
  };
  const uploadButton = (
    <UploadBlock>
      <Icon type={uploading ? "loading" : "plus"} />
      <div className="ant-upload-text">上传</div>
    </UploadBlock>
  );
  console.log("curr image:", imgUrl);

  return (
    <Upload
      ref={ref}
      accept="image/jpg,image/png"
      listType="picture"
      className="avatar-uploader"
      showUploadList={false}
      action={handleChange}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      fileList={fileList}
    >
      {imgUrl ? (
        <UploadImageBlock>
          <img onLoad={handleImageLoad} src={imgUrl} alt="image uploaded" />
          {uploading && <div className="loading">loading</div>}
        </UploadImageBlock>
      ) : (
        uploadButton
      )}
    </Upload>
  );
};
export default forwardRef(UploadImage);
