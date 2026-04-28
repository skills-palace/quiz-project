import React from 'react';

interface BtnWthLoaderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  isLoading: boolean;
  loadingText: string;
  className?: string;
}

const BtnWthLoader: React.FC<BtnWthLoaderProps> = ({
  text,
  isLoading,
  loadingText,
  className = "btn btn-primary",
  ...props
}) => {
  return (
    <button {...props} className={className}>
      {isLoading ? (
        <>
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden"></span>
          {loadingText}
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default BtnWthLoader;
