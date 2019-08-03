import { Upload, Icon, message } from "antd";
import React, { useState, forwardRef } from "react";
import { compressImage, uploadImage } from "../utils";

const UploadImage = (props, ref) => {
  const { imgUrl, setImgUrl } = props;
  console.log("upload props", props, ref);

  const [uploading, setUploading] = useState(false);
  const [erroring, setErroring] = useState(false);
  const [fileList, setFileList] = useState([]);
  const beforeUpload = file => {
    console.log("file type", file.type);

    const isAllowedType =
      file.type === "image/jpeg" || file.type === "image/png";
    const size = 5;
    if (!isAllowedType) {
      message.warning("图片类型不允许", () => {
        setErroring(false);
      });
    }
    const isLtSize = file.size / 1024 / 1024 < size;
    if (!isLtSize) {
      message.warning(`图片大小请小于 ${size}MB!`, () => {
        setErroring(false);
      });
    }
    setErroring(!(isAllowedType && isLtSize));
    return true;
  };
  const handleChange = async info => {
    if (uploading || erroring) {
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
    }
    setFileList(info.fileList);
  };
  const handleImageLoad = ({ target }) => {
    console.log("image wtf", target);

    setUploading(false);
  };
  const uploadButton = (
    <div>
      <Icon type={uploading ? "loading" : "plus"} />
      <div className="ant-upload-text">上传</div>
    </div>
  );
  console.log("curr image:", imgUrl);

  return (
    <Upload
      ref={ref}
      accept="image/jpg,image/png,image/gif"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action={handleChange}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      fileList={fileList}
    >
      {imgUrl ? (
        <img
          onLoad={handleImageLoad}
          style={{ width: "100%" }}
          src={imgUrl}
          alt="image uploaded"
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};
export default forwardRef(UploadImage);
