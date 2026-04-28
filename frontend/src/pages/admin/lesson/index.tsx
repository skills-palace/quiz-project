import React, { useState } from "react";
import Lessons from "@/dashboard/lesson";
import Layout from "@/layout/dashboard";

const Index = () => {
  return (
    <div>
      {/* <h1 className="text-2xl mb-2 text-gray-600 font-bold">Dashboard</h1> */}
      <Lessons />
    </div>
  );
};

Index.Layout = Layout;

export default Index;
