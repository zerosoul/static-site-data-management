import imageCompression from "browser-image-compression";
export const compressImage = async (image, opts = {}) => {
  // gif图片不压缩
  if (image.type == "image/gif") {
    return image;
  }
  let options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 300,
    useWebWorker: true,
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
  let [imgType] = (img.type || "image/png").split("/").slice(-1);
  // return;
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
  console.log(formData);

  return new Promise((resolve, reject) => {
    fetch(`https://wechat.1d1d100.com/base/uploadimg`, {
      method: "POST",
      // headers: { "Content-Type": "multipart/form-data" },
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
