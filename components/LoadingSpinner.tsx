import React from 'react';

const LOGO_URL = "https://public-rf-upload.minhawebradio.net/249695/ad/e4afe65bc29bd449a81737943a4e4091.png";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-center p-4">
      <img 
        src={LOGO_URL} 
        alt="Carregando Rádio 520" 
        className="w-24 h-24 sm:w-28 sm:h-28 mb-6 animate-pulse"
        style={{ animationDuration: '1.5s' }}
      />
      <p className="text-lg sm:text-xl text-gray-200 font-semibold mb-3">
        prepare-se para a experiência 520!
      </p>
      <div className="flex items-center text-sm text-gray-400">
        <svg className="animate-spin h-4 w-4 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Sintonizando...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
