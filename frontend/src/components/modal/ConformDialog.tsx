import React from 'react';

interface ConformDialogProps {
  confirm: () => void;
  close: () => void;
  isLoading: boolean;
}

const ConformDialog: React.FC<ConformDialogProps> = ({ confirm, close, isLoading }) => {
  return (
    <div className="confim-box">
      <div className="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="65"
          height="65"
          fill="currentColor"
          className="bi bi-exclamation-circle"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
        </svg>
      </div>
      <span className="title">
        Are you sure want to delete this permanently
      </span>
      <div className="btn-box">
        <button
          disabled={isLoading}
          className="btn btn-danger mr-2"
          onClick={confirm}
        >
          {isLoading ? "Deleting..." : "Yes,Delete"}
        </button>
        <button
          disabled={isLoading}
          className="btn btn-success ms-2"
          onClick={close}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ConformDialog;
