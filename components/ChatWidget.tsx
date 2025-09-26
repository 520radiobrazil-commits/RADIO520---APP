import React, { useEffect } from 'react';
import { getVisitorInfo } from '../utils/visitor';
import { useNotification } from '../context/NotificationContext';

const ChatWidget: React.FC = () => {
  const { showNotification } = useNotification();

  useEffect(() => {
    // The Tawk.to script is now loaded directly from index.html.
    // This component is responsible for configuring the Tawk_API object once it's available.
    const Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_API = Tawk_API;

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
    setTimeout(() => pollForApi(30), 2000);

  }, [showNotification]);

  return null;
};

export default ChatWidget;