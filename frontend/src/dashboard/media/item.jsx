import React from "react";
import Image from "next/image";

const Item = ({ item, onChange, selectItem }) => {
  return (
    <div
      className="bg-white border rounded-lg relative shadow-md overflow-hidden p-2"
      onClick={onChange}
    >
      <div className="absolute top-1 left-2 z-30">
        <input type="checkbox" checked={selectItem.includes(item.name)} />
      </div>
      <div className="w-full h-60 relative">
        <Image
          className="object-contain"
          alt="gallery"
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/file/image/${item.name}`}
          fill
          // width="100%"
          // height="100%"
          placeholder="blur"
          blurDataURL="/icon.png"
        />
      </div>
      <span className="text-gray-600 break-words">{item.name}</span>
    </div>
  );
};

export default Item;
