import React from "react";
import Layout from "@/layout/dashboard";
import Media from "@/dashboard/media";

const Index = () => {
  return (
    <div>
      <h1 className="text-2xl mb-2 text-gray-600 font-bold">File Manager</h1>
      <Media />
    </div>
  );
};

Index.Layout = Layout;

export default Index;
