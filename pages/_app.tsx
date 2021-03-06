import React, { FC, ReactNode, useEffect } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const Noop: FC<{ children: ReactNode }> = ({ children }) => (
  <React.Fragment key="noop">{children}</React.Fragment>
);

const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const Layout = (Component as any).Layout || Noop;

  useEffect(() => {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (localStorage.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Whenever the user explicitly chooses light mode
    // localStorage.theme = 'light';
    // Whenever the user explicitly chooses dark mode
    // localStorage.theme = 'dark';
    // Whenever the user explicitly chooses to respect the OS preference
    // localStorage.removeItem('theme');
  }, []);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {/* eslint-disable react/jsx-props-no-spreading */}
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
