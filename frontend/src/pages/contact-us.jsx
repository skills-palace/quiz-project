import React, { useState } from "react";
import Image from "next/image";
import axiosApi from "@/lib/axiosApi";
import Link from "next/link";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus({
        type: "error",
        message: "Please fill in name, email and message.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus({ type: "", message: "" });

      const response = await axiosApi.post("/app/contact-us", formData);

      setSubmitStatus({
        type: "success",
        message:
          response?.data?.message || "Your message has been sent successfully.",
      });
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 py-10">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        
        <h1 className="text-5xl font-extrabold text-center mb-8 text-blue-800">
          Contact Us
        </h1>
        <p className="text-center text-lg text-gray-600 mb-12">
          We value your feedback. Please feel free to reach out to us!
        </p>
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 transition duration-200"
          >
            Back to Homepage
          </Link>
        </div>

       

          {/* Contact Form */}
          <form
            className="bg-white shadow-lg rounded-lg p-8"
            onSubmit={handleSubmit}
          >
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Send Us a Message
            </h2>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Write your message"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  rows="5"
                ></textarea>
              </div>

              {submitStatus.message && (
                <p
                  className={`text-sm font-medium ${
                    submitStatus.type === "error" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {submitStatus.message}
                </p>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white font-semibold text-lg py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    
  );
};

export default ContactUs;
