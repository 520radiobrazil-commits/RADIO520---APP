import React from 'react';

const RainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M10.435 7.037a6 6 0 019.268 4.39.75.75 0 001.498-.076 7.5 7.5 0 00-11.822-5.42.75.75 0 00.56 1.343l.001-.001.002-.001a6.002 6.002 0 01.493-.235zM12 12.75a.75.75 0 00-1.5 0v3.66l-1.22-1.22a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.06 0l2.5-2.5a.75.75 0 10-1.06-1.06l-1.22 1.22v-3.66z" />
    <path fillRule="evenodd" d="M3.75 12a.75.75 0 01.75-.75h.21a6.012 6.012 0 015.655-4.773.75.75 0 11.27 1.48A4.512 4.512 0 005.21 12.75H15a.75.75 0 010 1.5H5.21A4.512 4.512 0 009.68 15.72a.75.75 0 11-.27 1.48A6.012 6.012 0 014.71 12.75h-.21a.75.75 0 01-.75-.75z" clipRule="evenodd" />
  </svg>
);

export default RainIcon;
