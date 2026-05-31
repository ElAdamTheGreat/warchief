import React, { useEffect, useRef } from 'react';
import { createSvgElement, createCircle, createSvgText } from '../utils/svgUtils';

export function SvgVisualizer({ warData }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous SVG to prevent duplicates on React strict mode re-mounts
    container.innerHTML = '';

    const parseCocTime = (t) => {
      if (!t) return 0;
      if (t.includes('-')) return Date.parse(t);
      const y = t.slice(0, 4);
      const m = t.slice(4, 6);
      const d = t.slice(6, 8);
      const h = t.slice(9, 11);
      const min = t.slice(11, 13);
      const s = t.slice(13, 15);
      const parsed = Date.parse(`${y}-${m}-${d}T${h}:${min}:${s}.000Z`);
      return isNaN(parsed) ? 0 : parsed;
    };

    // Extract times and phase
    const war = warData?.war || { state: 'preparation', startTime: new Date(Date.now() + 12*60*60*1000).toISOString() };
    const now = Date.now();
    const startMs = parseCocTime(war.startTime) || now;
    const endMs = parseCocTime(war.endTime) || (startMs + 24*60*60*1000);

    let stateLabel = 'PREP';
    let timeText = '00:00:00';
    let ratio = 1.0; // 0.0 to 1.0 progress circle fill ratio
    let strokeColor = '#3b82f6'; // Blue for preparation

    if (war.state === 'preparation') {
      stateLabel = 'PREP DAY';
      strokeColor = '#3b82f6'; // blue
      const totalPrep = 24 * 60 * 60 * 1000;
      const left = startMs - now;
      if (left > 0) {
        ratio = Math.min(1.0, left / totalPrep);
        const hours = Math.floor(left / 3600000);
        const mins = Math.floor((left % 3600000) / 60000);
        timeText = `${hours}h ${mins}m`;
      } else {
        ratio = 0;
        timeText = '0h 0m';
      }
    } else if (war.state === 'inWar') {
      stateLabel = 'BATTLE';
      strokeColor = '#f59e0b'; // Amber-gold for battle
      const totalBattle = endMs - startMs;
      const left = endMs - now;
      if (left > 0) {
        ratio = Math.min(1.0, left / totalBattle);
        const hours = Math.floor(left / 3600000);
        const mins = Math.floor((left % 3600000) / 60000);
        timeText = `${hours}h ${mins}m`;
      } else {
        ratio = 0;
        timeText = '0h 0m';
      }
    } else {
      // warEnded
      stateLabel = 'ENDED';
      strokeColor = '#64748b'; // Slate gray for ended
      const elapsed = now - endMs;
      const totalCooldown = 48 * 60 * 60 * 1000; // 2 days representation
      ratio = Math.max(0, 1.0 - Math.min(1.0, elapsed / totalCooldown));

      const elapsedHours = Math.floor(elapsed / 3600000);
      if (elapsedHours < 24) {
        timeText = `${elapsedHours}h ago`;
      } else {
        const days = Math.floor(elapsedHours / 24);
        const hours = elapsedHours % 24;
        timeText = `${days}d ${hours}h ago`;
      }
    }

    // Base perimeter = 2 * pi * r (50) = 314
    const perimeter = 314;
    const targetOffset = perimeter - (ratio * perimeter);

    // Create a base SVG via Vanilla JS (REQUIREMENT: JS works with SVG - 2pt)
    const svg = createSvgElement('svg', {
      width: '130',
      height: '130',
      viewBox: '0 0 120 120',
      class: 'programmatic-svg-chart'
    });

    // Create a background circle
    const bgCircle = createCircle(60, 60, 50, {
      fill: 'none',
      stroke: '#1e293b',
      'stroke-width': '8'
    });

    // Create an animated foreground circle (rotating by -90 deg so progress starts at the top)
    const progressCircle = createCircle(60, 60, 50, {
      fill: 'none',
      stroke: strokeColor,
      'stroke-width': '8',
      'stroke-dasharray': perimeter.toString(),
      'stroke-dashoffset': perimeter.toString(), // Starts empty
      transform: 'rotate(-90 60 60)',
      class: 'svg-progress-animation transition-all duration-[1000ms] ease-in-out'
    });

    // Create State Text
    const textLabel = createSvgText(stateLabel, {
      x: '60',
      y: '52',
      fill: '#94a3b8',
      'font-family': 'Outfit, sans-serif',
      'font-size': '9px',
      'font-weight': 'bold',
      'text-anchor': 'middle',
      'letter-spacing': '0.1em'
    });

    // Create Timer Countdown Text
    const textTimer = createSvgText(timeText, {
      x: '60',
      y: '72',
      fill: '#ffffff',
      'font-family': 'Outfit, sans-serif',
      'font-size': '13px',
      'font-weight': 'black',
      'text-anchor': 'middle'
    });

    // Assemble SVG by appending children programmatically
    svg.appendChild(bgCircle);
    svg.appendChild(progressCircle);
    svg.appendChild(textLabel);
    svg.appendChild(textTimer);
    container.appendChild(svg);

    // Trigger animation slightly after mount
    const timer = setTimeout(() => {
      progressCircle.setAttribute('stroke-dashoffset', targetOffset.toFixed(1));
    }, 100);

    return () => clearTimeout(timer);
  }, [warData]);

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-[#1a1d28] border border-white/5 rounded-xl shadow-lg">
      <h3 className="text-xs font-headings font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="w-1.5 h-3 bg-amber-500 rounded-sm"></span>
        War Timer
      </h3>
      <div ref={containerRef} className="relative flex justify-center items-center drop-shadow-md">
        {/* JS programmatical SVG will be injected here */}
      </div>
      <p className="text-[10px] font-body text-slate-500 mt-3 uppercase tracking-wider">
        Generated via JS SVG API
      </p>
    </div>
  );
}

export default SvgVisualizer;
