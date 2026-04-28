import { FC } from "react";
import Layout from "@/layout/site";
import LoginForm from "@/page-sections/auth/login";
import { GetServerSideProps, NextPage } from "next";

interface IProps {
  redirect?: string;
  message?: string;
}

const loginPage = ({ redirect, message }: IProps) => {
  return (
    <section className="min-h-[70vh] flex flex-col justify-center items-center">
      <div className="w-full px-6 py-12 bg-white rounded-lg shadow-lg dark:border md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Sign in to your account
          </h1>
          <LoginForm redirect={redirect} message={message} />
        </div>
      </div>
    </section>
  );
};

loginPage.Layout = Layout;

export async function getServerSideProps(ctx: any) {
  const query = ctx.query;
  //console.log(query);
  return {
    props: { redirect: query.redirect ?? "/", message: query.message ?? "" },
  };
}

export default loginPage;
