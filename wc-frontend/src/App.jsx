// REQUIREMENT: Semantic tags - nav + header + main + footer + sections
import React from 'react';
import { WarProvider } from './context/WarContext';
import { Router } from './router/Router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { OfflineBanner } from './components/OfflineBanner';

// Import Pages
import { HomePage } from './pages/HomePage';
import { WarDashboard } from './pages/WarDashboard';
import { WarPlanner } from './pages/WarPlanner';
import { EnemyDetail } from './pages/EnemyDetail';
import { GuidePage } from './pages/GuidePage';
import { AboutPage } from './pages/AboutPage';

// Define routing table
const routes = [
  { path: '/', component: HomePage },
  { path: '/war/:clanTag', component: WarDashboard },
  { path: '/war/:clanTag/plan', component: WarPlanner },
  { path: '/war/:clanTag/enemy/:pos', component: EnemyDetail },
  { path: '/guide', component: GuidePage },
  { path: '/about', component: AboutPage }
];

export function App() {
  return (
    <WarProvider>
      <div className="flex flex-col min-h-screen bg-[#0f1117] text-slate-100 font-body antialiased relative">
        {/* Global Offline State Indicator */}
        <OfflineBanner />

        {/* Semantic Header & Nav */}
        <Header />
        
        {/* Dynamic SPA Routing Main Workspace */}
        <Router routes={routes} fallback={HomePage} />
        
        {/* Semantic Footer */}
        <Footer />
      </div>
    </WarProvider>
  );
}

export default App;
