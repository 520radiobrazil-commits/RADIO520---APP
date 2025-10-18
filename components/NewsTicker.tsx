import React, { useState, useEffect, useRef } from 'react';
import { useNotification } from '../context/NotificationContext';

const initialTickerItems = [
  "PEÇA SUA MÚSICA AGORA!",
  "DOMINGO, AS OITO DA NOITE TEM ZONA MISTA. A RESENHA MAIS LEGAL E ORDINÁRIA DO RÁDIO MUNDIAL.",
  "FIQUE POR DENTRO DE TODAS AS NOTÍCIAS, BASTIDORES E CURIOSIDADES DA COPA DO MUNDO DA FIFA 2026 NO MINUTO DA COPA, TODOS OS DIAS AQUI NA SUA RÁDIO!"
];

// A pool of potential news items to simulate fetching new data
const potentialNews = [
  
];

// Simulates fetching a new item from an API
const fetchNews = async (): Promise<string | null> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    if (potentialNews.length === 0) return null;
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
            if (newItem) {
                setItems(currentItems => {
                    // Add the new item only if it's not already in the list
                    if (!currentItems.includes(newItem)) {
                        return [...currentItems, newItem];
                    }
                    return currentItems;
                });
            }
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
        <div className="w-full bg-black/30 backdrop-blur-sm py-1 overflow-hidden">
            <div className="marquee-container h-4 flex items-center">
                <div
                    className="marquee-content"
                    style={{ animationDuration }}
                >
                    <span className="text-xs text-cyan-300 font-mono font-medium tracking-wider text-glow-cyan">{tickerContent}</span>
                    {/* Duplicate content for a seamless loop */}
                    <span className="text-xs text-cyan-300 font-mono font-medium tracking-wider text-glow-cyan pl-16">{tickerContent}</span>
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;