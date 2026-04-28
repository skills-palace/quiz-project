import React from "react";
import Modal from "@/ui/modal";
import Upload from "../upload";

const index = ({ isOpen, close }) => {
  return (
    <Modal title="File Upload" isOpen={isOpen} toggle={close}>
      <Upload />
    </Modal>
  );
};

export default index;
