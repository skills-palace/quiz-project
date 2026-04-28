import { useState, useEffect } from "react";
import Uploader from "./uploader";
import { cacheClean } from "@/redux/api/file-manager-api";

function FileUpload() {
  const [showUpload, setShowUpload] = useState(false);
  const [files, setFiles] = useState([]);

  const modifier = (file, i) => {
    const getSize = (size) => {
      if (size >= 1073741824) {
        // 1024 * 1024 * 1024
        size = (size / 1073741824).toFixed(2) + " GB";
      } else if (size >= 1048576) {
        // 1024 * 1024
        size = (size / 1048576).toFixed(2) + " MB";
      } else if (size >= 1024) {
        // 1024 * 1
        size = (size / 1024).toFixed(2) + " KB";
      } else if (size > 1) {
        size = size.toFixed(2) + " bytes";
      }
      return size;
    };

    return {
      url: URL.createObjectURL(file),
      id: i + 1,
      file: file,
      name: file.name.slice(0, 20),
      type: file.type.split("/").pop().substring(0, 10),
      size: getSize(file.size),
      progress: 0,
      status: "pending",
      error: null,
    };
  };

  const fileDrag = (e) => {
    e.preventDefault();
  };

  const dragLeave = (e) => {
    e.preventDefault();
  };

  const uploadFiles = (mainFile) => {
    const filesDetails = [];
    for (let i = 0; i < mainFile.length; i++) {
      filesDetails.push(modifier(mainFile[i], i));
    }
    if (!filesDetails.length > 0) return;

    setFiles([...filesDetails]);
    setShowUpload(true);
  };

  const getFiles = (e) => {
    e.preventDefault();
    let dt = e.dataTransfer;
    uploadFiles(dt.files);
  };

  useEffect(() => {
    return () => {
      cacheClean(["files"]);
    };
  }, []);

  return showUpload ? (
    <Uploader files={files} setFiles={setFiles} />
  ) : (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 overflow-auto">
      <div
        className="border-indigo-500 flex flex-col items-center py-12 px-6 rounded-md border-2 border-dashed"
        onDragOver={fileDrag}
        onDragLeave={dragLeave}
        onDrop={getFiles}
      >
        <svg
          className="w-12 h-12 text-gray-500"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>

        <p className="text-xl text-gray-700">Drop files to upload</p>

        <p className="mb-2 text-gray-700">or</p>

        <label className="bg-white px-4 h-9 inline-flex items-center rounded border border-gray-300 shadow-sm text-sm font-medium text-gray-700 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
          Select files
          <input
            type="file"
            name="file"
            multiple
            className="sr-only"
            onChange={(e) => {
              uploadFiles(e.target.files);
            }}
          />
        </label>

        <p className="text-xs text-gray-600 mt-4">
          Maximum upload file size: 5MB.
        </p>
      </div>
    </div>
  );
}

export default FileUpload;
