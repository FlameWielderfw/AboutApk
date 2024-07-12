import jsQR from "jsqr";

// 二维码解析
const decodeQRCode = (image)=> {
  // 创建画布
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;
  //把二维码画上去
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const decodedResult = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'dontInvert',
  });
  if (decodedResult) {
    return decodedResult.data
  } else {
    return ""
  }
}

const ImageUtils = {
  decodeQRCode: decodeQRCode
}

export default ImageUtils