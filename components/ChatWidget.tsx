import React, { useEffect } from 'react';
import { getVisitorInfo } from '../utils/visitor';
import { useNotification } from '../context/NotificationContext';

const TAWK_PROPERTY_ID = '68d6ca858b3ee61953e1bdbf';
const TAWK_WIDGET_ID = '1j63ge6g8';

const ChatWidget: React.FC = () => {
  const { showNotification } = useNotification();

  useEffect(() => {
    // Prevent script from being injected multiple times
    if (document.getElementById('tawk-to-script')) {
      return;
    }

    const Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    const initializeChat = () => {
      // Guard to ensure initialization only runs once
      if ((window as any).R520_Chat._isInitialized) {
        return;
      }
      console.log('Initializing R520 Chat...');

      const visitor = getVisitorInfo();
      Tawk_API.setAttributes({
        name: visitor.name,
        id: visitor.id,
      }, (error: any) => {
        if (error) {
          console.error('Tawk.to setAttributes error:', error);
        }
      });
      
      // Replace the placeholder `show` function with the real one
      (window as any).R520_Chat.show = function() {
        Tawk_API.showWidget();
        Tawk_API.maximize();
      };
      
      // Mark as initialized
      (window as any).R520_Chat._isInitialized = true;
      
      // If a show was requested before initialization, execute it now
      if ((window as any).R520_Chat._showRequested) {
        console.log('Executing queued show request.');
        (window as any).R520_Chat.show();
        (window as any).R520_Chat._showRequested = false; // Reset flag
      }
    };

    // Primary initialization method: onLoad callback
    Tawk_API.onLoad = () => {
        console.log('Tawk.to onLoad event fired.');
        initializeChat();
    };
    
    // Hide widget as soon as possible
    Tawk_API.onBeforeLoad = () => {
        Tawk_API.hideWidget();
    };

    // Show a welcome notification when the chat window opens
    Tawk_API.onChatWindowOpened = () => {
      showNotification('Diga seu nome e cidade para a gente te conhecer e identificar seu pedido!');
    };

    (window as any).Tawk_API = Tawk_API;

    // Inject the Tawk.to script
    const script = document.createElement("script");
    script.id = 'tawk-to-script';
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
    
    // Fallback polling mechanism in case onLoad doesn't fire
    const pollForApi = (retries: number) => {
        if (retries <= 0) {
            console.error("Tawk.to API failed to load after several retries.");
            return;
        }

        // Check if API functions exist AND if it has NOT been initialized by onLoad
        if (Tawk_API.maximize && !(window as any).R520_Chat._isInitialized) {
            console.warn('Tawk.to onLoad event did not fire, initializing via polling fallback.');
            initializeChat();
        } else if (!(window as any).R520_Chat._isInitialized) {
            setTimeout(() => pollForApi(retries - 1), 500);
        }
    };
    
    // Start polling after 2 seconds, giving onLoad a chance to fire first.
    // Poll for up to 15 seconds (30 retries * 500ms).
    setTimeout(() => pollForApi(30), 2000);

  }, [showNotification]);

  return null;
};

export default ChatWidget;