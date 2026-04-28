import React from 'react';

interface ModalProps {
  children: React.ReactNode;
  close: () => void;
  isOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({ children, close, isOpen }) =>
  isOpen ? (
    <div className="custom-modal">
      <div className="custom-modal-body">
        <button className="close-btn" onClick={close}>
          &#215;
        </button>
        <div className="custom-modal-content">{children}</div>
      </div>
    </div>
  ) : null;

export default Modal;
