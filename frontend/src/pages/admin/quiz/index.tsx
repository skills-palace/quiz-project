import React, { useState } from "react";
import Quiz from "@/dashboard/quiz";
import Layout from "@/layout/dashboard";

const Quizes = () => {
  return (
    <div>
      {/* <h1 className="text-2xl mb-2 text-gray-600 font-bold">Dashboard</h1> */}
      <Quiz />
    </div>
  );
};

Quizes.Layout = Layout;

export default Quizes;
