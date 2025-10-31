import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import CloseIcon from './icons/CloseIcon';
import SendIcon from './icons/SendIcon';
import SparklesIcon from './icons/SparklesIcon';

interface Message {
    role: 'user' | 'model';
    text: string;
}

interface AiAssistantWidgetProps {
    onClose: () => void;
}

const AiAssistantWidget: React.FC<AiAssistantWidgetProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: 'Olá! Sou a assistente de IA da Rádio 520. Posso te ajudar com informações sobre músicas, artistas ou sobre nossa programação. O que você gostaria de saber?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize the Gemini Chat model
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: 'You are a friendly and knowledgeable AI assistant for Rádio 520, an online radio station in Brazil. Your name is 520 AI. You are an expert in music, artists, and pop culture. Answer in Brazilian Portuguese. Keep your answers concise, fun, and engaging. When asked about Rádio 520, promote the station, its website (radio520.com.br), and its programs.'
                }
            });
        } catch (error) {
            console.error("Failed to initialize Gemini AI:", error);
            setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, estou com um problema para me conectar. Tente novamente mais tarde.' }]);
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async () => {
        const trimmedInput = inputValue.trim();
        if (!trimmedInput || isLoading || !chatRef.current) return;

        const newUserMessage: Message = { role: 'user', text: trimmedInput };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await chatRef.current.sendMessage({ message: trimmedInput });
            const aiResponse: Message = { role: 'model', text: response.text };
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error("Gemini API error:", error);
            const errorMessage: Message = { role: 'model', text: 'Oops! Algo deu errado. Por favor, tente novamente.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-end justify-end sm:p-4" onClick={onClose}>
            <div
                className="w-full h-[80vh] sm:h-full max-h-[600px] sm:max-w-sm flex flex-col bg-gray-900/80 backdrop-blur-md rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-700/50 animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-gray-700/50 flex-shrink-0">
                    <div className="flex items-center space-x-2">
                        <SparklesIcon className="w-6 h-6 text-purple-400" />
                        <h2 className="font-bold text-white">Assistente 520 AI</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                        aria-label="Fechar chat"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-grow p-4 overflow-y-auto scrollbar-hide space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] px-3 py-2 rounded-xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-[85%] px-3 py-2 rounded-xl bg-gray-700 text-gray-200 rounded-bl-none">
                                <div className="flex items-center space-x-1">
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-gray-700/50 flex-shrink-0">
                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Pergunte algo..."
                            className="flex-grow bg-gray-800 border border-gray-600 rounded-full py-2 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 text-white transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-purple-700"
                            aria-label="Enviar mensagem"
                        >
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AiAssistantWidget;
