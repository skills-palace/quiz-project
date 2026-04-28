import Layout from "@/layout/site";
import Link from "next/link";
import RegisterForm from "@/page-sections/auth/register";

const RegisterPage = () => {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center mt-4 mx-4">
      <div className="px-6 py-12 w-full max-w-2xl bg-white rounded-lg shadow md:mt-0 xl:p-0">
        <div className="p-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl mb-4">
            Register to your account!
          </h1>

          <div className="mb-6 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 text-gray-800 shadow-sm">
            <p className="text-sm font-semibold text-blue-900">
              New sign-up: one week free
            </p>
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">
              When you create an account, you get{" "}
              <strong>one week of free access</strong>. After the trial ends,{" "}
              <strong>continuing with full access</strong> requires{" "}
              <strong>upgrading</strong> to our most popular plan,{" "}
              <span className="whitespace-nowrap">Learner</span> (via
              &quot;Contact us&quot;).
            </p>

            <div className="mt-4 border-t border-blue-100 pt-4">
              <p className="text-sm font-semibold text-blue-800">
                Learner — Contact us
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Full access to lessons, analysis, and extended quiz types.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                {[
                  "Unlimited access to the lesson library",
                  "Quiz results analysis and time tracking",
                  "Personalized content by grade and subject",
                ].map((line) => (
                  <li key={line} className="flex gap-2 items-start">
                    <span
                      className="text-blue-500 font-bold shrink-0"
                      aria-hidden
                    >
                      ✓
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link
                href="/membership"
                className="font-medium text-blue-800 underline decoration-blue-300 underline-offset-2 hover:text-blue-900"
              >
                Compare plans
              </Link>
              <span className="text-gray-300" aria-hidden>
                |
              </span>
              <Link
                href="/contact-us"
                className="font-medium text-blue-800 underline decoration-blue-300 underline-offset-2 hover:text-blue-900"
              >
                Upgrade — Contact us
              </Link>
            </div>
          </div>

          <RegisterForm />
        </div>
      </div>
    </section>
  );
};

RegisterPage.Layout = Layout;
export default RegisterPage;
