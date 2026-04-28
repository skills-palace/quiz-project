import React from "react";

import AddLesson from "@/dashboard/lesson/add";
import Layout from "@/layout/dashboard";

const Index = () => {
  return (
    <div>
      <AddLesson />
    </div>
  );
};

Index.Layout = Layout;

export default Index;
