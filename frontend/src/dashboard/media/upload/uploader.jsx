import { useState, useEffect, useRef } from "react";
import UploadItem from "./upload-item";
import Uploading from "./upload-file";
import { BtnBlue } from "@/dashboard/shared/btn";

const Uploader = ({ files, setFiles }) => {
  const statusRef = useRef();

  const uplaodNow = () => {
    const current = files[0];
    current.status = "uploading";
    console.log("current", current);
    setFiles([...files]);
  };

  const nextFile = ({ id, status, message }) => {
    const item = files.find((ele) => ele.id === id);

    item.status = status;
    item.error = message;
    const readyToUp = files.filter((ele) => ele.status === "pending");
    if (readyToUp.length) {
      const current = readyToUp[0];
      current.status = "uploading";
      setFiles([...files]);
    } else {
      setFiles([...files]);
    }
  };

  const removeFile = (id) => {
    const idx = files.findIndex((ele) => ele.id === id);
    files.splice(idx, 1);
    setFiles([...files]);
  };

  console.log("statusRef", statusRef);

  return (
    <>
      <div className="flex justify-end">
        <BtnBlue onClick={uplaodNow}>Upload</BtnBlue>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
        {/* {uploading && ( */}

        {/* )} */}
        {files.map((file) =>
          file.status === "uploading" ? (
            <Uploading key={file.id} file={file} nextFile={nextFile} />
          ) : (
            <UploadItem key={file.id} file={file} removeFile={removeFile} />
          )
        )}
      </div>
    </>
  );
};

export default Uploader;
