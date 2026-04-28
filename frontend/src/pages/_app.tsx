import '@/assets/css/globals.css';
// import "@/assets/css/style.css";
import 'rc-pagination/assets/index.css';
import 'nprogress/nprogress.css';
import '../page-sections/home/pagination.css';
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
// redux toolkit
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { authenticate } from '@/redux/authenticate';

import ProgressBar from '@/lib/progress-bar';
import { SessionProvider } from 'next-auth/react';
import SessionAccessTokenSync from '@/components/SessionAccessTokenSync';

interface CustomAppProps extends Omit<AppProps, 'Component'> {
  Component: AppProps['Component'] & { Layout: any };
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  const Layout = Component.Layout || (({ children }: any) => children);

  useEffect(() => {
    authenticate();
  }, []);

  return (
    <SessionProvider session={session}>
      <SessionAccessTokenSync />
      <Provider store={store}>
        <ProgressBar />
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
        <Toaster position="top-right" />
      </Provider>
    </SessionProvider>
  );
}
