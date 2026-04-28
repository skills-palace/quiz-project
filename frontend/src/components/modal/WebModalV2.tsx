import React from 'react';

interface WebModalV2Props {
  children: React.ReactNode;
  close: () => void;
}

const WebModalV2: React.FC<WebModalV2Props> = ({ children, close }) => {
  return (
    <div className="custom-modal web_modal_v2">
      <div className="custom-modal-body">
        <button className="order_close-btn" onClick={close}>
          &#215;
        </button>
        <div className="custom-modal-content">{children}</div>
      </div>
    </div>
  );
}

export default WebModalV2;
