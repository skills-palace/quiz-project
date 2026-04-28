import Unautorize from "@/components/auth/unautorize";

const ErrorPage = ({ errorCode }) => {
  if (errorCode === "__unauthorized__") return <Unautorize />;
  return <p>{errorCode}</p>;
};

export async function getStaticProps({ params }) {
  return {
    props: { errorCode: params.status },
  };
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { status: "__unauthorized__" } },
      { params: { status: "2" } },
      { params: { status: "3" } },
    ],
    fallback: false,
  };
}

export default ErrorPage;
