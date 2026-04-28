import { BiX } from "react-icons/bi";

const UploadItems = ({ file, removeFile }) => {
  const status = file.status === "complete" ? 100 : 0;
  return (
    <div className="w-full bg-gray-100 rounded shadow-md">
      <div className="px-2 py-4">
        <div className="relative">
          {file.status === "pending" && (
            <div
              onClick={() => removeFile(file.id)}
              className="absolute top-2 right-2 z-10 bg-gray-300 hover:bg-gray-400 transition-all rounded text-white cursor-pointer"
            >
              <BiX className="w-5 h-5" />
            </div>
          )}

          <div className="w-full h-50">
            <img src={file.url} className=" object-contain" />
          </div>

          <div className="absolute text-xs text-center w-full top-1/2 left-1/2 -translate-x-1/2  -translate-y-1/2">
            <p className="bg-gray-300/70 text-white">{file.status}</p>
            <p className="text-xs bg-gray-300/70 text-red-700">{file.error}</p>
          </div>
        </div>

        <p>{file.name}</p>
        <div className="flex justify-between mb-1">
          <p>size: {file.size}</p>
          <p>type: {file.type}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="w-full bg-gray-200 relative rounded">
            <div
              style={{ width: status + "%" }}
              className="h-1 bg-green-400 rounded absolute top-0 left-0 z-20"
            ></div>
            <div className="h-1 bg-gray-200 w-full rounded absolute top-0 left-0 z-10"></div>
          </div>
          <div className="text-sm mx-2 w-5"> {status}%</div>
        </div>
      </div>
    </div>
  );
};

export default UploadItems;
