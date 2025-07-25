import { Area } from 'react-easy-crop';

const getCroppedImg = (imageSrc: string, pixelCrop: Area): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return reject(new Error("Couldn't get context"));

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toDataURL('image/jpeg');
      resolve(canvas.toDataURL('image/jpeg'));
    };
    image.onerror = () => reject(new Error("Failed to load image"));
  });
};

export default getCroppedImg;
