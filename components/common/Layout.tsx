import React, { ReactNode } from 'react';
import Head from 'next/head';
import Nav from './Nav';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <React.Fragment key="layout">
      <Head>
        <meta charSet="utf-8" />
        <title>tournaments.wtf</title>

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Nav />
      <div
        className="max-w-7xl container px-2 lg:px-8 mt-12 flex"
        style={{ minHeight: `calc(100vh - ${64 + 232 + 48}px)` }}
      >
        <div className="w-full flex-1">{children}</div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
