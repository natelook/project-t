import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import Nav from './Nav';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const [height, setHeight] = useState();
  const navRef = useRef(null);
  useEffect(() => {
    if (typeof navRef?.current?.clientHeight === 'number') {
      setHeight(navRef?.current?.clientHeight);
    }
  }, []);

  return (
    <React.Fragment key="layout">
      <div ref={navRef}>
        <Nav />
      </div>
      <div style={{ height: `calc(100vh - ${64}px)` }}>{children}</div>
    </React.Fragment>
  );
};

export default Layout;
