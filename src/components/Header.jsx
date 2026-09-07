import React from 'react';
import { Mic2 } from 'lucide-react';

const Header = ({ onHomeClick }) => {
  return (
    <header className="header">
      <div 
        className="header-logo" 
        onClick={onHomeClick} 
        style={{ cursor: 'pointer' }}
      >
        <Mic2 size={28} className="text-primary" />
        VaaniAccess
      </div>
      <nav className="nav-links">
        <a href="#" onClick={(e) => { e.preventDefault(); if(onHomeClick) onHomeClick(); }}>Home</a>
        <a href="#" onClick={(e) => e.preventDefault()}>How It Works</a>
        <a href="#" onClick={(e) => e.preventDefault()}>Schemes</a>
        <a href="#" onClick={(e) => e.preventDefault()}>Help</a>
      </nav>
    </header>
  );
};

export default Header;
