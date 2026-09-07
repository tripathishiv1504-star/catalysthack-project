import React from 'react';
import { Mic2 } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <Mic2 size={28} className="text-primary" />
        VaaniAccess
      </div>
      <nav className="nav-links">
        <a href="#">Home</a>
        <a href="#">How It Works</a>
        <a href="#">Schemes</a>
        <a href="#">Help</a>
      </nav>
    </header>
  );
};

export default Header;
