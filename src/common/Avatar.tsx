import React, { useState, useEffect } from "react";

interface AvatarProps {
  name: string;
  image?: string;
  className?: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ name, image, className, size = 40 }) => {
  const [isValidImage, setIsValidImage] = useState(true);

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => setIsValidImage(true);
      img.onerror = () => setIsValidImage(false);
    } else {
      setIsValidImage(false);
    }
  }, [image]);

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div
      className={`rounded-full bg-[#d2e2f0] text-[#73737D] font-medium uppercase flex items-center justify-center ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size / 2}px`,
      }}
    >
      {image && isValidImage ? (
        <img src={image} alt={name} className="w-full h-full rounded-full" />
      ) : (
        <span className={`text-[#3F4354] text-2xl ${className}`}>{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;
