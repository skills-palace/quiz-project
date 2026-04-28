import Head from "next/head";
import Layout from "@/layout/site";
import Lessons from "@/page-sections/home/lessons";

const HomePage = () => {
  return (
    <div className="mx-2 md:mx-0">
      <Lessons />
    </div>
  );
};

HomePage.Layout = Layout;
export default HomePage;
