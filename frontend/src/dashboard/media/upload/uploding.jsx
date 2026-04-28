import React, { forwardRef, useEffect, useRef, useState } from "react";

const Uploding = (props) => {
  console.log("props", props);
  return (
    <div className="w-full bg-gray-100 rounded shadow-md">
      <div className="px-2 py-4">
        <div className="relative">
          <img
            src={file.url}
            width="100%"
            height="100%"
            className="w-32 h-32"
          />
          <div className="absolute text-xs leading-10 text-center w-full top-1/2 left-1/2 -translate-x-1/2  -translate-y-1/2">
            <p className="bg-gray-300">{file?.status}</p>
            <p className="text-xs bg-gray-400/90 text-red-700">{file?.error}</p>
          </div>
        </div>

        <p>{file.name}</p>
        <p>{"up file"}</p>
        <div className="flex justify-between mb-1">
          <p>size: {file.size}</p>
          <p>type: {file.type}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="w-full bg-gray-200 relative rounded">
            <div
              ref={props.statusRef}
              // style={{ width: file.progress + "%" }}
              className="h-1 bg-green-400 rounded absolute top-0 left-0 z-20"
            ></div>
            <div className="h-1 bg-gray-200 w-full rounded absolute top-0 left-0 z-10"></div>
          </div>
          <div className="text-sm mx-2 w-5">{file.progress}%</div>
        </div>
      </div>
    </div>
  );
};

export default Uploding;
