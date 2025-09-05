
import React from 'react';

const HeadphoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 3a9 9 0 00-9 9v6a3 3 0 003 3h1.5a3 3 0 003-3v-3a3 3 0 00-3-3H6V12a6 6 0 1112 0v3h-1.5a3 3 0 00-3 3v3a3 3 0 003 3H18a3 3 0 003-3v-6a9 9 0 00-9-9z" />
  </svg>
);

export default HeadphoneIcon;