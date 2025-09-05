import React from 'react';

const tickerItems = [
  "BRASIL VENCE CHILE NO MARACANÃ POR 3X0 E AGORA ENFRENTA A BOLÍVIA NA ALTITUDE",
  "DOMINGO ESTRÉIA 'ORASOM 520', O PROGRAMA QUE VAI TE RECONECTAR E REENERGIZAR PARA A SEMANA QUE COMEÇA! DOMINGO 05:00 AM",
  "Fique por dentro das últimas notícias em radio520.com.br",
  "Peça sua música pelo nosso WhatsApp!",
  "Acompanhe nossa programação ao vivo em vídeo e áudio.",
  "Baixe nosso app e leve a Rádio 520 com você.",
  "Confira a cobertura completa dos eventos locais no nosso site.",
  "PROMOÇÃO: Concorra a ingressos para o show do ano!",
];

const NewsTicker: React.FC = () => {
    // Join items with a visual separator for a continuous stream
    const tickerContent = tickerItems.join('  •  ');
    // Adjust speed based on the total length of the content for consistency
    const animationDuration = `${tickerItems.join('').length / 5}s`; 

    return (
        <div className="bg-black bg-opacity-50 py-2 border-y border-gray-700">
            <div className="marquee-container h-6">
                <div
                    className="marquee-content"
                    style={{ animationDuration }}
                >
                    <span className="text-sm text-gray-300 font-medium tracking-wider">{tickerContent}</span>
                    {/* Duplicate content for a seamless loop */}
                    <span className="text-sm text-gray-300 font-medium tracking-wider pl-16">{tickerContent}</span>
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;