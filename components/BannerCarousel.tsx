import React, { useState, useEffect } from 'react';

const banners = [
  {
    imageUrl: 'https://public-rf-upload.minhawebradio.net/249695/ad/9a12d0c1f1200dfdd0595d8d0ac85ced.jpg',
    linkUrl: 'https://radio520.webradiosite.com/pagina/3177862/popnews/',
    alt: 'Banner Promocional PopNews'
  },
  {
    imageUrl: 'https://public-rf-upload.minhawebradio.net/249695/ad/32dc318f7254d01a058188801d808ff5.png',
    linkUrl: 'https://radio520.webradiosite.com/contato/',
    alt: 'Banner Contato'
  },
  {
    imageUrl: 'https://public-rf-upload.minhawebradio.net/249695/slider/e8bf1632b5a8b307395370d345a3447e.jpg',
    linkUrl: 'https://instagram.com/radio520',
    alt: 'Siga no Instagram'
  }
];

const TRANSITION_INTERVAL = 5000; // 5 seconds

const BannerCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % banners.length);
    }, TRANSITION_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  if (!banners.length) {
    return null;
  }

  return (
    <div className="relative w-full shadow-lg">
      {/* This invisible image acts as a spacer to set the container's aspect ratio */}
      <img src={banners[0].imageUrl} alt="" aria-hidden="true" className="w-full rounded-md invisible" />

      {banners.map((banner, index) => (
        <a
          key={banner.imageUrl}
          href={banner.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          aria-hidden={index !== currentIndex}
        >
          <img
            src={banner.imageUrl}
            alt={banner.alt}
            className="w-full h-full object-cover rounded-md transition-transform duration-300 hover:scale-[1.02]"
          />
        </a>
      ))}
    </div>
  );
};

export default BannerCarousel;