import React, { forwardRef, useRef, useEffect } from "react";

import E from "wangeditor";

import { compressImage, uploadImage } from "../utils";
let EditorEle = null;
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
const Editor = ({ onChange, value = "" }, ref) => {
  // const { onChange, value } = this.props;
  const editor = useRef(null);
  console.log("curr content", value);
  const prevValue = usePrevious(value);
  useEffect(() => {
    if (!value) {
      const elem = editor.current;
      EditorEle = new E(elem);
      // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
      EditorEle.customConfig.onchange = html => {
        onChange(html);
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
    } else if (prevValue == "") {
      EditorEle.txt.html(value);
    }
  }, [value]);

  return (
    <div ref={ref}>
      <div className="editor" ref={editor} />
    </div>
  );
};
export default forwardRef(Editor);
