// REQUIREMENT: Semantic tags - footer
import React from 'react';
import { Link } from '../router/Link';

export function Footer() {
  return (
    <footer className="bg-[#0b0c10] border-t border-white/5 py-8 px-6 text-center text-slate-500 font-body text-sm mt-auto">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p>© 2026 CoC War Planner. Built by the Warchief Team.</p>
          <p className="text-[11px] text-slate-600 mt-1">
            This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell.
          </p>
        </div>
        <div className="flex gap-6 font-headings">
          <Link to="/" className="hover:text-amber-500 transition-colors">
            Home
          </Link>
          <Link to="/guide" className="hover:text-amber-500 transition-colors">
            Guide
          </Link>
          <Link to="/about" className="hover:text-amber-500 transition-colors">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
