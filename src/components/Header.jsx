import React from 'react';

const Header = ({ title, subtitle }) => {
  return (
    <div className="bg-charcoal-gray border-b border-neon-red px-8 py-6">
      <h1 className="text-3xl font-poppins text-neon-red neon-text mb-1">
        {title}
      </h1>
      {subtitle && (
        <p className="text-ice-gray font-inter text-sm">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Header;
