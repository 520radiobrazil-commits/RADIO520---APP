import React, { useState, useEffect, useRef } from 'react';
import { useNotification } from '../context/NotificationContext';

const initialTickerItems = [
  "VIVA MELHOR COM LU SKYLARK, DICAS PARA VIVER MELHOR E COM MAIS SAÚDE. TODOS OS DIAS NA SUA RÁDIO!",
  "SELEÇÃO FEMININA DE VÔLEI CONQUISTA BRONZE NO MUNDIAL APÓS VITÓRIA POR 3X2 SOBRE O JAPÃO",
  "NESTA TERÇA-FEIRA O BUSINESS ROCK RECEBE KIKO ZAMBIANCHI",
  "A RÁDIO 520 TAMBÉM ESTÁ NA ALEXA! ATIVE A NOSSO SKILL NO APP",
  "MEL GIBSON FALA SOBRE FÉ E REVELA DETALHES DE A RESSURREIÇÃO DE CRISTO EM ENTREVISTA A JOE ROGAN",
  "DE SEGUNDA A SEXTA ÀS 18:00, TEM MIX 520 TOCANDO AS MELHORES DO PLANETA.",
  " TUDO SOBRE A NFL VOCÊ ENCONTRA NO LIGA 520, DIARIAMENTE, NA RÁDIO E NO SITE",
  "DATA 520 : GABI BRILHA NO MUNDIAL DE VÔLEI! CAPITÃ DO BRASIL SOMA 142 PONTOS, É ELEITA MELHOR PONTEIRA E ENTREGA VITÓRIA DO BRONZE CONTRA O JAPÃO!",
  "DE SEGUNDA A SEXTA ROLA O MIX 520 AO VIVO COM IMAGENS ",
];

// A pool of potential news items to simulate fetching new data
const potentialNews = [
    "HUGO CALDEIRANO ESTREIA COM VITÓRIA EMOCIONANTE NO WTT CHAMPIONS DE MACAU",
    "ANGE POSTECOGLOU ASSUME O NOTTINGHAM FOREST COM CONTRATO ATÉ 2027ANGE POSTECOGLOU ASSUME O NOTTINGHAM FOREST COM CONTRATO ATÉ 2027",
    ,
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