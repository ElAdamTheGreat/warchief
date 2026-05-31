// REQUIREMENT: SVG/Canvas (2pt) – inline SVG stars with click listeners
import React from 'react';

export function StarRating({ rating = 0, maxStars = 3, size = 24, interactive = false, onRate }) {
  // SVG Star points definition
  const starPoints = "12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9";

  const starsArray = Array.from({ length: maxStars }, (_, index) => {
    const starIndex = index + 1;
    const isFilled = starIndex <= rating;

    const handleClick = () => {
      if (interactive && onRate) {
        onRate(starIndex);
      }
    };

    return (
      <svg
        key={index}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        onClick={handleClick}
        className={`inline-block transition-all duration-300 ${
          interactive ? 'cursor-pointer hover:scale-125' : ''
        }`}
      >
        <polygon
          points={starPoints}
          fill={isFilled ? '#f4a423' : '#334155'}
          stroke={isFilled ? '#ffd700' : 'none'}
          strokeWidth="1"
          strokeLinejoin="round"
          className="transition-colors duration-300"
        />
      </svg>
    );
  });

  return (
    <div className="flex gap-1 items-center justify-center">
      {starsArray}
    </div>
  );
}

export default StarRating;
