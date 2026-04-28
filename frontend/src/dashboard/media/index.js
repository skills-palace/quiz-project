import React, { useState } from "react";
import Upload from "./upload";
import Modal from "@/ui/modal";
import Items from "./items";

const Index = () => {
  const [modal, setModal] = useState(false);

  const close = () => {
    setModal(false);
  };

  return (
    <>
      <Modal title="File Upload" isOpen={modal} toggle={close}>
        <Upload />
      </Modal>
      <Items setModal={setModal} />
    </>
  );
};

export default Index;
