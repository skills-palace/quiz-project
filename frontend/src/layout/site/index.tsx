import React from "react";
import Header from "./header";
import Footer from "./footer";
import ExplorerTrialBanner from "./explorer-trial-banner";

interface IProps {
  children: JSX.Element | JSX.Element[];
}

const Layout: React.FC<IProps> = ({ children, ...rest }) => {
  return (
    <div className="site-layout min-h-screen min-h-[100dvh] bg-gradient-to-b from-sky-100 to-sky-50">
      <Header />
      <ExplorerTrialBanner />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;


