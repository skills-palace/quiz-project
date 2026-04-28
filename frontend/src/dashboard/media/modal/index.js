import { Tab, TabItem } from "@/ui/tab";
import AccordinGallery from "./AccordinGallery";
import FileUpload from "./FileUpload";
import Modal from "@/ui/modal";
import { useState } from "react";

const Index = ({ type, onChange, toggle, isOpen, values }) => {
  const [title, setTitle] = useState("Manage Media");
  return (
    <Modal isOpen={isOpen} toggle={toggle} title={title}>
      <Tab
        bodyClass="mt-2"
        activeTab="gallery"
        render={(active, setActive) => (
          <div className="flex">
            <button
              className={`p-2  text-white rounded transition-all mr-1 ${
                active === "gallery"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-500 hover:bg-gray-600"
              }`}
              type="button"
              onClick={() => {
                setTitle("Manage Media");
                setActive("gallery");
              }}
            >
              Gallery
            </button>
            <button
              className={`p-2  text-white rounded transition-all mr-1 ${
                active === "upload"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-500 hover:bg-gray-600"
              }`}
              type="button"
              onClick={() => {
                setTitle("Upload File");
                setActive("upload");
              }}
            >
              Upload file
            </button>
          </div>
        )}
      >
        <TabItem tabKey="gallery">
          <AccordinGallery type={type} onChange={onChange} values={values} />
        </TabItem>
        <TabItem tabKey="upload">
          <FileUpload />
        </TabItem>
      </Tab>
    </Modal>
  );
};

export default Index;
