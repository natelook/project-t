import React, { FC, ReactNode } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

const Noop: FC<{ children: ReactNode }> = ({ children }) => (
  <React.Fragment key="noop">{children}</React.Fragment>
);

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const Layout = (Component as any).Layout || Noop;

  return (
    <SessionProvider session={session}>
      {/* eslint-disable react/jsx-props-no-spreading */}
      <Layout pageProps={pageProps}>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
