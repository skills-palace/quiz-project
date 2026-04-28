import { useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import ExplorerTrialBanner from "@/layout/site/explorer-trial-banner";

const Layout = ({ children }) => {
  const [sidebar, setSidebar] = useState(false);
  const toggleSidebar = () => setSidebar((prev) => !prev);

  return (
    <div className="font-inter flex h-screen overflow-hidden bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebar}
        toggleSidebar={toggleSidebar}
        className="transition-transform duration-300 ease-in-out shadow-xl"
      />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header 
          toggleSidebar={toggleSidebar} 
          className="bg-white shadow-md sticky top-0 z-10" 
        />
        <ExplorerTrialBanner />

        {/* Main content */}
        <main className="px-4 sm:px-6 lg:px-4 py-4 w-full max-w-7xl mx-auto bg-white shadow-lg rounded-md mt-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="text-center py-4 text-sm text-gray-500 bg-gray-100 mt-auto">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Layout;
