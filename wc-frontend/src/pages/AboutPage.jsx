import React from 'react';
import '../webcomponents/CocBadge';

export function AboutPage() {
  return (
    <main className="page-fade-in flex-grow pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      
      {/* Page Header */}
      <header className="text-center mb-12">
        <h1 className="text-3xl font-headings font-extrabold text-white tracking-wide uppercase">
          About CoC War Planner
        </h1>
        <p className="text-sm text-amber-500 font-body font-semibold mt-1">
          Warchief Strategist Edition
        </p>
      </header>

      {/* Renders our Custom Shadow-DOM Web Component */}
      <section className="mb-12 text-center space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-body">
          Custom Web Component Badge
        </h2>
        
        {/* Render the Web Component Badge */}
        <coc-badge
          clan-tag="#2PP0V28Y"
          clan-name="Warchief Elite"
          level="18"
        ></coc-badge>
      </section>

      {/* Details layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 border-t border-white/5 pt-10">
        
        {/* Project description */}
        <div className="space-y-4 text-slate-300">
          <h2 className="text-sm font-bold font-headings text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-3 bg-amber-500 rounded-sm"></span>
            Mission & Architecture
          </h2>
          <p className="text-xs font-body leading-relaxed">
            CoC War Planner is designed to give Clash of Clans leaders and strategists absolute control over clan war allocations. By integrating live API feeds with custom local-storage builders, it removes all guesswork.
          </p>
          <p className="text-xs font-body leading-relaxed">
            The frontend is a React SPA built on Vite, powered by custom routing and state synchronization. It communicates with a secure Node.js proxy BFF (Backend-for-Frontend) server that translates complex Supercell response data and automatically parses army codes.
          </p>
        </div>

        {/* Tech Stack credits */}
        <div className="space-y-4 text-slate-300">
          <h2 className="text-sm font-bold font-headings text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-3 bg-amber-500 rounded-sm"></span>
            Technical Specifications
          </h2>
          <ul className="space-y-2 text-xs font-body">
            <li>
              <span className="font-bold text-amber-500 uppercase">Framework:</span> React 18 SPA with context-driven data models
            </li>
            <li>
              <span className="font-bold text-amber-500 uppercase">Interactive:</span> Drag and Drop target mapping with drop audios
            </li>
            <li>
              <span className="font-bold text-amber-500 uppercase">Encapsulation:</span> Shadow DOM custom elements and native CSS nesting
            </li>
            <li>
              <span className="font-bold text-amber-500 uppercase">Visuals:</span> Responsive HTML5 Canvas donuts and programmatical SVG rings
            </li>
            <li>
              <span className="font-bold text-amber-500 uppercase">Offline capability:</span> Progressive Service Worker appshell caching
            </li>
          </ul>
        </div>

      </div>

    </main>
  );
}

export default AboutPage;
