
import React from 'react';

const LOGO_URL = "https://public-rf-upload.minhawebradio.net/249695/ad/e4afe65bc29bd449a81737943a4e4091.png";

const Header: React.FC = () => {
  return (
    <header className="p-3 sm:p-4 lg:p-6 flex flex-row items-center justify-center gap-4 sm:gap-6 bg-black bg-opacity-30">
      <img src={LOGO_URL} alt="Rádio 520 Logo" className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto" />
      <div className="text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider text-red-500">
        RÁDIO 520
        </h1>
        <p className="text-sm text-gray-300">a sua playlist toca aqui!</p>
      </div>
    </header>
  );
};

export default Header;
