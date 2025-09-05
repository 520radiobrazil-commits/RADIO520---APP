
import React from 'react';

const VideoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        {...props}
    >
        <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-2.25a.75.75 0 00-1.5 0v2.25a1.5 1.5 0 01-1.5 1.5h-8.25a1.5 1.5 0 01-1.5-1.5v-9a1.5 1.5 0 011.5-1.5h8.25a1.5 1.5 0 011.5 1.5v2.25a.75.75 0 001.5 0v-2.25a3 3 0 00-3-3h-8.25z" />
        <path d="M19.5 7.5a.75.75 0 00-1.06 0l-3 3a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-2.47-2.47 2.47-2.47a.75.75 0 000-1.06z" />
    </svg>
);

export default VideoIcon;
