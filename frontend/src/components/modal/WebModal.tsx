import React from 'react';

interface WebModalProps {
  children: React.ReactNode;
  close: () => void;
}

const WebModal: React.FC<WebModalProps> = ({ children, close }) => {
  return (
    <div className="custom-modal web_modal">
      <div className="custom-modal-body">
        <button className="order_close-btn" onClick={close}>
          &#215;
        </button>
        <div className="custom-modal-content">{children}</div>
      </div>
    </div>
  );
}

export default WebModal;
