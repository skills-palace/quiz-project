import React from "react";
import Link from "next/link";
import Layout from "@/layout/site";

const sections = [
  {
    title: "Introduction",
    body:
      "Skills Palace (“we”, “our”, or “us”) respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and educational services. If you do not agree with this policy, please discontinue use of the service.",
  },
  {
    title: "Information we collect",
    body:
      "We may collect information you provide directly (for example, when you register, contact us, or complete lessons and quizzes), such as your name, email address, and account details. We may also collect usage data, device and browser information, and performance data related to your learning activities to operate and improve the platform.",
  },
  {
    title: "How we use your information",
    body:
      "We use the information to provide and personalize the service, process transactions, communicate with you, analyze usage to improve content and features, ensure security, and comply with legal obligations. We do not sell your personal information to third parties.",
  },
  {
    title: "Cookies and similar technologies",
    body:
      "We may use cookies and similar technologies to remember preferences, keep you signed in, and understand how the site is used. You can control cookies through your browser settings; some features may not work correctly if cookies are disabled.",
  },
  {
    title: "Data retention and security",
    body:
      "We retain information only as long as necessary for the purposes described in this policy, unless a longer period is required by law. We implement appropriate technical and organizational measures to protect your data; no method of transmission over the internet is completely secure.",
  },
  {
    title: "Children’s privacy",
    body:
      "Our services are designed for educational use, including by minors with appropriate supervision. If you are a parent or guardian and believe we have collected information from a child in a way that concerns you, please contact us and we will take reasonable steps to address the matter.",
  },
  {
    title: "Your rights and choices",
    body:
      "Depending on where you live, you may have rights to access, correct, delete, or export your personal data, or to object to certain processing. To exercise these rights, contact us using the information below.",
  },
  {
    title: "Changes to this policy",
    body:
      "We may update this Privacy Policy from time to time. The revised policy will be posted on this page with an updated “Last updated” date. Your continued use of the service after changes constitutes acceptance of the updated policy.",
  },
  { id: "contact", title: "Contact us" },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-4 text-blue-900 tracking-wide">
          Privacy Policy
        </h1>
        <p className="text-center text-gray-600 mb-10 text-sm">
          Last updated: April 24, 2026
        </p>
        <div className="space-y-8">
          {sections.map((section) => (
            <section
              key={section.title}
              className="bg-white shadow-md rounded-lg p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">{section.title}</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {section.id === "contact" ? (
                  <>
                    If you have questions about this Privacy Policy or our data practices, please
                    contact us through our{" "}
                    <Link href="/contact-us" className="text-blue-600 font-medium hover:underline">
                      Contact
                    </Link>{" "}
                    page.
                  </>
                ) : (
                  section.body
                )}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

PrivacyPolicy.Layout = Layout;
export default PrivacyPolicy;
