import imageCompression from "browser-image-compression";
export const compressImage = async (image, opts = {}) => {
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
  const formData = new FormData();
  formData.append("smfile", img);
  // formData.append(
  //   "filename",
  //   `${Math.random()
  //     .toString(36)
  //     .substring(4)}`
  // );
  console.log(formData);

  return new Promise((resolve, reject) => {
    fetch(`https://sm.ms/api/upload`, {
      method: "POST",
      // headers: { "Content-Type": "multipart/form-data" },
      body: formData
    })
      .then(response => response.json())
      .then(resp => {
        console.log("data", resp);
        if (resp.code == "success") {
          resolve(resp.data.url);
        } else {
          resolve("");
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}
