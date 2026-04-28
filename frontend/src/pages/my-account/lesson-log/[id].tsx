import Head from "next/head";
import Layout from "@/layout/site";
import LessonLog from "@/page-sections/lesson/log";

const LessonLogPage = ({ id }: { id: string }) => {
  return (
    <div className="bg-gray-100">
      <div className="container mx-auto">
        <LessonLog id={id} />
      </div>
    </div>
  );
};

LessonLogPage.Layout = Layout;

export const getServerSideProps = async (ctx: any) => {
  const id = ctx.query.id;
  return {
    props: { id },
  };
};

export default LessonLogPage;
