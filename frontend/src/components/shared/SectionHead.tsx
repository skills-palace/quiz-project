import React from 'react';

interface SectionHeadProps {
  children: React.ReactNode;
  title: string;
  subTitle?: string;
}

const SectionHead: React.FC<SectionHeadProps> = ({ children, title, subTitle }) => {
  return (
    <div className="flex items-center flex-wrap py-2">
      <div className="flex items-center flex-wrap justify-between w-full">
        <div className="flex items-center space-x-2">
          <h5 className="text-lg font-semibold">{title}</h5>
          {subTitle ? (
            <div className="text-gray-500">
              <p>{subTitle}</p>
            </div>
          ) : null}
        </div>
        <div className="flex items-center">
          {children}
        </div>
      </div>
    </div>
  );
}

export default SectionHead;
