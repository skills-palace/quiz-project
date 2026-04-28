import React from "react";
import Link from "next/link";
import Layout from "@/layout/site";

const plans = [
  {
    name: "Explorer",
    price: "Free",
    blurb: "Get started with core lessons and sample quizzes.",
    features: [
      "Browse featured lessons on the homepage",
      "Try selected quizzes with basic feedback",
      "Create a student account to save progress",
    ],
    cta: "Create free account",
    href: "/register",
    highlight: false,
  },
  {
    name: "Learner",
    price: "Contact us",
    blurb: "Full access to lessons, analysis, and extended quiz types.",
    features: [
      "Unlimited access to the lesson library",
      "Quiz results analysis and time tracking",
      "Personalized content by grade and subject",
    ],
    cta: "Get in touch",
    href: "/contact-us",
    highlight: true,
  },
  {
    name: "Schools & groups",
    price: "Custom",
    blurb: "For classrooms, teachers, and organizations.",
    features: [
      "Teacher tools: lessons, quizzes, and student groups",
      "Scalable seats and reporting",
      "Priority support for administrators",
    ],
    cta: "Contact sales",
    href: "/contact-us",
    highlight: false,
  },
];

const Membership = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-extrabold text-center mb-4 text-blue-900 tracking-wide">
          Membership
        </h1>
        <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-12">
          Choose how you want to learn on Skills Palace. Start free, then upgrade
          when you are ready for the full experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <section
              key={plan.name}
              id={plan.name === "Learner" ? "plan-learner" : undefined}
              className={`bg-white shadow-md rounded-2xl p-8 flex flex-col border-2 transition-shadow duration-300 hover:shadow-lg scroll-mt-24 ${
                plan.highlight
                  ? "border-blue-500 ring-2 ring-blue-200 scale-[1.02] md:scale-105"
                  : "border-transparent"
              }`}
            >
              {plan.highlight && (
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                  Popular
                </p>
              )}
              <h2 className="text-2xl font-semibold text-blue-800 mb-2">
                {plan.name}
              </h2>
              <p className="text-3xl font-bold text-gray-900 mb-3">
                {plan.price}
              </p>
              <p className="text-gray-600 mb-6 flex-grow">{plan.blurb}</p>
              <ul className="space-y-3 mb-8 text-gray-700">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 items-start">
                    <span className="text-blue-500 font-bold shrink-0" aria-hidden>
                      ✓
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-auto text-center font-semibold text-lg py-3 rounded-xl shadow-md transition duration-200 ${
                  plan.highlight
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-blue-800 border-2 border-blue-200 hover:bg-blue-50"
                }`}
              >
                {plan.cta}
              </Link>
            </section>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-12 max-w-xl mx-auto">
          Pricing and payment options for paid tiers may be finalized with our team.
          Use{" "}
          <Link href="/contact-us" className="text-blue-700 underline font-medium">
            Contact Us
          </Link>{" "}
          for schools, bundles, or questions about your current plan.
        </p>
      </div>
    </div>
  );
};

Membership.Layout = Layout;
export default Membership;
