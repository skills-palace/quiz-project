import Link from "next/link";

const Page404 = () => {
  return (
    <section className="flex h-screen w-screen flex-col items-center justify-center bg-white">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-blue-600 lg:text-9xl">
            404
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            <span className="text-red-500">Oops!</span> Page not found.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500">
            The page you’re looking for doesn’t exist.
          </p>
          <Link
            href="/"
            className="my-4 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Page404;
