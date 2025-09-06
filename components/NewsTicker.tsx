import React, { useState, useEffect, useRef } from 'react';
import { useNotification } from '../context/NotificationContext';

const initialTickerItems = [
  "SELEÇÃO FEMININA DE VÔLEI É ELIMINADA PELA ITÁLIA NAS SEMIFINAIS DO MUNDIAL E VAI DISPUTAR O BRONZE COM O JAPÃO",
  "DOMINGO ESTRÉIA 'ORASOM 520', O PROGRAMA QUE VAI TE RECONECTAR E REENERGIZAR PARA A SEMANA QUE COMEÇA! DOMINGO 05:00 AM",
  "A RÁDIO 520 TEMBÉM ESTÁ NA ALEXA! ATIVE A NOSSO SKILL NO APP",
  "NFL NO BRASIL: CHARGERS SURPREENDEM E BATEM OS CHIEFS POR VINTE E SETE A VINTE E UM NA NEO QUÍMICA ARENA, EM SÃO PAULO",
  "Acompanhe nossa programação ao vivo em vídeo e áudio.",
  "Baixe nosso app e leve a Rádio 520 com você.",
  "Confira a cobertura completa dos eventos locais no nosso site.",
  "Messi brilha em possível despedida em casa",
];

const NewsTicker: React.FC = () => {
    const { showNotification } = useNotification();
    const [items, setItems] = useState<string[]>(initialTickerItems);
    const prevItemsRef = useRef<string[]>(initialTickerItems);

    useEffect(() => {
        // This effect runs only on mount to simulate a new item arriving from a server
        const timer = setTimeout(() => {
          setItems(currentItems => [
              ...currentItems, 
              "RÁDIO 520 LANÇA NOVO PODCAST SOBRE MÚSICA E CULTURA POP!"
          ]);
        }, 10000); // Add a new item after 10 seconds

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // This effect detects when new items are added and shows a notification
        if (prevItemsRef.current.length < items.length) {
            const newItems = items.slice(prevItemsRef.current.length);
            newItems.forEach(item => {
                showNotification(`${item} - Leia mais em www.radio520.com.br`);
            });
        }
        prevItemsRef.current = items;
    }, [items, showNotification]);

    // Join items with a visual separator for a continuous stream
    const tickerContent = items.join('  •  ');
    // Adjust speed based on the total length of the content for consistency
    const animationDuration = `${items.join('').length / 5}s`; 

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
