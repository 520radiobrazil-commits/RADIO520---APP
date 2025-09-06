import React, { useState, useEffect, useRef } from 'react';
import { useNotification } from '../context/NotificationContext';

const initialTickerItems = [
  "VIVA MELHOR COM LU SKYLARK, DICAS PARA VIVER MELHOR E COM MAIS SAÚDE. TODOS OS DIAS NA SUA RÁDIO!",
  "SELEÇÃO FEMININA DE VÔLEI É ELIMINADA PELA ITÁLIA NAS SEMIFINAIS DO MUNDIAL E VAI DISPUTAR O BRONZE COM O JAPÃO",
  "DOMINGO ESTRÉIA 'ORASOM 520', O PROGRAMA QUE VAI TE RECONECTAR E REENERGIZAR PARA A SEMANA QUE COMEÇA! DOMINGO 05:00 AM",
  "A RÁDIO 520 TAMBÉM ESTÁ NA ALEXA! ATIVE A NOSSO SKILL NO APP",
  "NFL NO BRASIL: CHARGERS SURPREENDEM E BATEM OS CHIEFS POR VINTE E SETE A VINTE E UM NA NEO QUÍMICA ARENA, EM SÃO PAULO",
  "DE SEGUNDA A SEXTA ÀS 18:00, TEM MIX 520 TOCANDO AS MELHORES DO PLANETA.",
  "Baixe nosso app e leve a Rádio 520 com você.",
  "Confira a cobertura completa dos eventos locais no nosso site.",
  "Messi brilha em possível despedida em casa",
];

// A pool of potential news items to simulate fetching new data
const potentialNews = [
    "RÁDIO 520 LANÇA NOVO PODCAST SOBRE MÚSICA E CULTURA POP!",
    "ENTREVISTA EXCLUSIVA COM A BANDA DO MOMENTO NESTA SEXTA-FEIRA",
    "AGENDA DE SHOWS ATUALIZADA: CONFIRA AS DATAS PARA ESTE MÊS",
    "PROMOÇÃO VALENDO INGRESSOS PARA O FESTIVAL DE VERÃO. PARTICIPE!",
    "NOVO SINGLE DE ARTISTA INTERNACIONAL TOCA PRIMEIRO AQUI NA 520",
];

// Simulates fetching a new item from an API
const fetchNews = async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const randomIndex = Math.floor(Math.random() * potentialNews.length);
    return potentialNews[randomIndex];
};

const NewsTicker: React.FC = () => {
    const { showNotification } = useNotification();
    const [items, setItems] = useState<string[]>(initialTickerItems);
    const prevItemsRef = useRef<string[]>(initialTickerItems);

    useEffect(() => {
        // Set up an interval to fetch news every 5 minutes
        const intervalId = setInterval(async () => {
            const newItem = await fetchNews();
            setItems(currentItems => {
                // Add the new item only if it's not already in the list
                if (!currentItems.includes(newItem)) {
                    return [...currentItems, newItem];
                }
                return currentItems;
            });
        }, 5 * 60 * 1000); // 5 minutes in milliseconds

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures this effect runs only once on mount

    useEffect(() => {
        // This effect detects when new items are added and shows a notification
        if (prevItemsRef.current.length < items.length) {
            showNotification("TEM NOTÍCIA NOVA NO SITE - www.radio520.com.br");
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