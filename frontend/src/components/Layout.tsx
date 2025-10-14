import React from 'react';
import Header from './Header';

function Layout({ children }) {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 mt-4">
        {children}
      </main>
    </div>
  );
}

export default Layout;
