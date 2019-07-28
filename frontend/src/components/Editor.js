import React, { useState, useRef, useEffect } from "react";

import E from "wangeditor";
import { compressImage, uploadImage } from "../utils";

const Editor = ({ setEditorContent, currContent = "" }) => {
  const editor = useRef(null);

  useEffect(() => {
    const elem = editor.current;
    const EditorEle = new E(elem);
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    EditorEle.customConfig.onchange = html => {
      setEditorContent(html);
    };
    // Editor.customConfig.uploadImgShowBase64 = true;
    EditorEle.customConfig.uploadImgMaxSize = 5 * 1024 * 1024;
    EditorEle.customConfig.customUploadImg = async (files, insert) => {
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法
      console.log("image", files);
      const compressedFile = await compressImage(files[0], {
        maxSizeMB: 2,
        maxWidthOrHeight: 600
      });
      const imgUrl = await uploadImage(compressedFile);

      // return;
      // 上传代码返回结果之后，将图片插入到编辑器中
      insert(imgUrl);
    };
    EditorEle.create();
    EditorEle.txt.html(currContent);
  }, []);
  // useEffect(() => {
  //   if (Editor) {
  //     Editor.txt.html(article.content);
  //   }
  //   setEditorContent(article.content);
  // }, [currContent]);
  return <div ref={editor} />;
};
export default Editor;
