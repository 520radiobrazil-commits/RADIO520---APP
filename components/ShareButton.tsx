
import React, { useState } from 'react';
import ShareIcon from './icons/ShareIcon';
import { useNotification } from '../context/NotificationContext';
import CheckIcon from './icons/CheckIcon';

interface ShareButtonProps {
    programName: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ programName }) => {
    const { showNotification } = useNotification();
    const [isCopied, setIsCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: 'Rádio 520 - Ao Vivo',
            text: `Estou ouvindo "${programName}" na Rádio 520! A sua playlist toca aqui! Ouça você também.`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                showNotification('Conteúdo compartilhado com sucesso!');
            } else {
                throw new Error('Web Share API not supported');
            }
        } catch (err) {
            // Fallback to copying to clipboard
            try {
                await navigator.clipboard.writeText(shareData.url);
                showNotification('Link copiado para a área de transferência!');
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
            } catch (copyErr) {
                showNotification('Falha ao compartilhar ou copiar.');
                console.error('Fallback copy error:', copyErr);
            }
        }
    };
    
    // Disable button if programName is not loaded yet
    const isDisabled = !programName || programName === 'Carregando...';

    return (
        <button
            onClick={handleShare}
            disabled={isDisabled}
            className={`p-1 rounded-full transition-colors duration-200 
                ${isDisabled 
                    ? 'text-gray-600 cursor-not-allowed' 
                    : isCopied 
                    ? 'text-green-500' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`
            }
            title={isCopied ? "Link copiado!" : "Compartilhar"}
            aria-label="Compartilhar a transmissão atual"
        >
            {isCopied ? <CheckIcon className="w-5 h-5" /> : <ShareIcon className="w-5 h-5" />}
        </button>
    );
};

export default ShareButton;
