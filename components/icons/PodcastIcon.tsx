import React from 'react';

const PodcastIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 14a4 4 0 0 1-4-4V6a4 4 0 1 1 8 0v4a4 4 0 0 1-4 4zm5-4V6a5 5 0 0 0-10 0v4a5 5 0 0 0 3 4.58V17h-2v2h6v-2h-2v-2.42A5 5 0 0 0 17 10z" />
  </svg>
);

export default PodcastIcon;
