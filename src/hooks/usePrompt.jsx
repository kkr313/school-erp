// src/hooks/usePrompt.js
import { useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

export function usePrompt(message, when) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) return;

    const unblock = navigator.block(tx => {
      const confirmed = window.confirm(message);
      if (confirmed) {
        unblock();
        tx.retry();
      }
    });

    return unblock;
  }, [navigator, message, when]);
}
