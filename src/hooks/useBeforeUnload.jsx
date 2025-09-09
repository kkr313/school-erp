import { useEffect } from 'react';

/**
 * Hook to warn the user when attempting to close/refresh the tab with unsaved changes.
 * @param {boolean} shouldWarn - When true, enables the browser confirmation dialog.
 */
export const useBeforeUnload = (shouldWarn) => {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!shouldWarn) return;
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [shouldWarn]);
};
