import React, { FC, ReactNode } from 'react';
import Nav from './Nav';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => (
  <React.Fragment key="layout">
    <Nav />
    {children}
  </React.Fragment>
);

export default Layout;
