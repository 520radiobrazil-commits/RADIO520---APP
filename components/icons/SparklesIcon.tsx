import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-7.19c0-.478.36-1.01.768-1.284A7.453 7.453 0 009.315 7.584zM12 15a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
      clipRule="evenodd"
    />
    <path d="M12 2.25a.75.75 0 01.75.75v6.94l-2.002-2.002a.75.75 0 01.34-1.283A7.49 7.49 0 0012 2.25zM2.25 12a.75.75 0 01.75-.75h6.94l-2.002 2.002a.75.75 0 01-1.283-.34A7.49 7.49 0 002.25 12z" />
  </svg>
);

export default SparklesIcon;
