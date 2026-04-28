import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";

const footerLinks = [
  { label: "Company", href: "/about" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

const Footer = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-400 mt-10 px-4">
      <div className="container mx-auto py-12 px-6">
        {/* Social Media Icons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-x-4">
            <FaFacebook className="text-white w-8 h-8 cursor-pointer hover:text-blue-300 transition duration-300" />
            <FaInstagram className="text-white w-8 h-8 cursor-pointer hover:text-pink-400 transition duration-300" />
            <FaYoutube className="text-white w-8 h-8 cursor-pointer hover:text-red-500 transition duration-300" />
            <FaTwitter className="text-white w-8 h-8 cursor-pointer hover:text-blue-300 transition duration-300" />
          </div>
          <div>
            <Image
              src="/icons/skills_footer_2.png"
              alt="Skills Footer"
              width={150}
              height={150}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="flex justify-center flex-wrap gap-6 mb-6">
          {footerLinks.map(({ label, href }) => (
            <li key={label} className="relative group">
              {href ? (
                <Link
                  href={href}
                  className="font-semibold text-sm text-white cursor-pointer transition duration-300 hover:text-blue-200 inline-block"
                >
                  {label}
                </Link>
              ) : (
                <p className="font-semibold text-sm text-white cursor-default">{label}</p>
              )}
              <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
            </li>
          ))}
        </ul>

        {/* Footer Text */}
        <p className="text-white text-center text-sm font-medium">
          <span className="font-bold">SKILLSPALACE © 2024</span> All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
