import { useEffect, useRef, useState } from "react";
import axiosApi from "@/lib/axiosApi";

const UploadFile = ({ file, nextFile }) => {
  const statusRef = useRef();
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file.file);
    //setFile(file);
    try {
      const response = await axiosApi({
        //baseURL: process.env.NEXT_PUBLIC_BASE_URL + "/api",
        url: "/file-manager",
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progress) => {
          const { loaded, total } = progress;
          const percentageProgress = Math.floor((loaded / total) * 100);
          setProgress(percentageProgress);
          // if (statusRef.current) {
          //   statusRef.current.style.width = percentageProgress + "%";
          // }

          //dispatch(setProgress(percentageProgress));
        },
      });
      //dispatch(setStatus({ status: "success", progress: 100 }));
      console.log("response", response);
      //setFile(null);
      nextFile({ id: file.id, status: "complete" });
    } catch (error) {
      console.log(error.response);
      nextFile({
        id: file.id,
        status: "error",
        message: error.response?.data?.message ?? "something wrong",
      });
      //setFile(null);
    }
  };

  useEffect(() => {
    if (file) {
      console.log("use uploading");
      uploadFile(file);
    }
  }, [file.id]);

  console.log("statusRef", statusRef);

  return (
    <div className="w-full bg-gray-100 rounded shadow-md">
      <div className="px-2 py-4">
        <div className="relative">
          <div className="w-full h-50">
            <img
              src={file.url}
              width="100%"
              height="100%"
              className="w-full h-50 object-contain"
            />
          </div>

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
              ref={statusRef}
              style={{ width: progress + "%" }}
              className="h-1 bg-green-400 rounded absolute top-0 left-0 z-20"
            ></div>
            <div className="h-1 bg-gray-200 w-full rounded absolute top-0 left-0 z-10"></div>
          </div>
          <div className="text-sm mx-2 w-5">{progress}%</div>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
