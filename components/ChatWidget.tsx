
import React, { useEffect } from 'react';

// IDs de propriedade e widget de placeholder para o Tawk.to
const TAWK_PROPERTY_ID = '66a03271becc2fed69260e33';
const TAWK_WIDGET_ID = '1i3gqrpne';

const ChatWidget: React.FC = () => {
  useEffect(() => {
    // Evita que o script seja adicionado várias vezes em re-renderizações (ex: em modo estrito)
    if (document.getElementById('tawk-to-script')) {
        return;
    }

    // Configuração da API do Tawk.to antes de carregar o script
    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];

    s1.id = 'tawk-to-script';
    s1.async = true;
    s1.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    // Insere o script no DOM
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    } else {
      // Fallback para o <head> se nenhum script for encontrado
      document.head.appendChild(s1);
    }

  }, []); // O array de dependências vazio garante que o efeito seja executado apenas uma vez

  // Este componente não renderiza nenhum elemento visível por si só
  return null;
};

export default ChatWidget;
