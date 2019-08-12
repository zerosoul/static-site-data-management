import imageCompression from "browser-image-compression";

const UploadAPI = process.env.REACT_APP_IMG_UPLOAD_API;
export const compressImage = async (image, opts = {}) => {
  // gif图片不压缩
  if (image.type == "image/gif") {
    return image;
  }
  let options = {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 300,
    useWebWorker: true,
    maxIteration: 5,
    ...opts
  };
  try {
    const compressedFile = await imageCompression(image, options);
    console.log(
      "compressedFile instanceof Blob",
      compressedFile instanceof Blob
    ); // true
    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
    return compressedFile;
    // await uploadToServer(compressedFile); // write your own logic
  } catch (error) {
    console.log(error);
  }
};
export function uploadImage(img) {
  console.log("blob type", img.type, img.size);
  if (!UploadAPI) {
    alert("未配置图片上传API");
    return;
  }
  let [imgType] = (img.type || "image/png").split("/").slice(-1);
  const formData = new FormData();
  formData.append(
    "file",
    img,
    `${Math.random()
      .toString(36)
      .substring(4)}.${imgType}`
  );
  formData.append(
    "name",
    `${Math.random()
      .toString(36)
      .substring(4)}`
  );
  formData.append("compress", false);
  return new Promise((resolve, reject) => {
    fetch(`${UploadAPI}`, {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(resp => {
        console.log("data", resp);
        if (resp.code == 200) {
          resolve(resp.src.replace("http:", ""));
        } else {
          resolve("");
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}
