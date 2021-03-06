import React, { FC, ReactNode } from 'react';
import Nav from './Nav';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => (
  <React.Fragment key="layout">
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

export default Layout;
