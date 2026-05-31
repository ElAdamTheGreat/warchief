import React from 'react';
import { navigate } from './Router';

/**
 * Custom Link component to substitute standard anchor tags.
 * Uses the History API's navigate function under the hood to ensure SPA routing.
 */
export function Link({ to, children, className, ...props }) {
  const handleClick = (event) => {
    // If the click is a modified click (Ctrl+click, Meta+click) let browser handle it
    if (
      event.defaultPrevented ||
      event.button !== 0 || // only left clicks
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }

    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}
