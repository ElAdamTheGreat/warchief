// REQUIREMENT: Semantic tags (1pt) - header + nav
import React, { useState } from 'react';
import { Link } from '../router/Link';
import { useWar } from '../context/WarContext';

export function Header() {
  const { clanTag } = useWar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#1a1d28]/85 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
      {/* Brand logo */}
      <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2 group">
        <svg
          className="w-8 h-8 text-amber-500 fill-current transition-transform duration-300 group-hover:rotate-12"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L1 21h22L12 2zm0 4l7.5 13h-15L12 6zm-1 4h2v4h-2v-4zm0 5h2v2h-2v-2z" />
        </svg>
        <span className="logo-text font-headings font-extrabold text-xl text-amber-500 tracking-wider">
          WARCHIEF
        </span>
      </Link>

      {/* Semantic main navigation */}
      <nav className="nav-menu-container">
        {/* Hamburger toggle button for mobile */}
        <button
          className="nav-hamburger-btn text-slate-300 hover:text-amber-500 flex flex-col justify-between h-5 w-6 cursor-pointer"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`} />
          <span className={`block h-0.5 w-full bg-slate-300 rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
        </button>

        {/* Navigation list */}
        <ul className={`nav-links-list font-headings font-semibold text-slate-200 ${mobileMenuOpen ? 'is-open' : ''}`}>
          <li>
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block py-2 text-slate-300 hover:text-amber-500 transition-colors"
            >
              Home
            </Link>
          </li>
          
          {clanTag && (
            <>
              <li>
                <Link
                  to={`/war/${clanTag.replace('#', '')}`}
                  onClick={closeMobileMenu}
                  className="block py-2 text-slate-300 hover:text-amber-500 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </>
          )}

          <li>
            <Link
              to="/guide"
              onClick={closeMobileMenu}
              className="block py-2 text-slate-300 hover:text-amber-500 transition-colors"
            >
              Guide
            </Link>
          </li>
          
          <li>
            <Link
              to="/about"
              onClick={closeMobileMenu}
              className="block py-2 text-slate-300 hover:text-amber-500 transition-colors"
            >
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
