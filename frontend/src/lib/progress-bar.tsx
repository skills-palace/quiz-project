import NProgress from "nprogress";
import Router from "next/router";

export default function ProgressBar() {
  NProgress.configure({ showSpinner: false });
  const handleStart = () => NProgress.start();
  const handleStop = () => NProgress.done();
  Router.events.on("routeChangeStart", handleStart);
  Router.events.on("routeChangeComplete", handleStop);
  Router.events.on("routeChangeError", handleStop);
  return null;
}
