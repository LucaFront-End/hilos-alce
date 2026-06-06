// src/context/LandingContext.jsx
// Global provider for dynamic CMS page data.
// Lives at the App level so ALL components (including FloatingWhatsApp) can read it.
import { createContext, useContext, useState, useEffect } from 'react';

const LandingContext = createContext({ landing: null, setLanding: () => {} });

/**
 * Top-level provider — mount once in App.jsx.
 * Pages call setLanding(data) on mount and setLanding(null) on unmount.
 */
export function LandingProvider({ children }) {
  const [landing, setLanding] = useState(null);

  return (
    <LandingContext.Provider value={{ landing, setLanding }}>
      {children}
    </LandingContext.Provider>
  );
}

/**
 * Hook to read the current landing data.
 * Returns the landing object if inside a dynamic page, or null on static pages.
 */
export function useLanding() {
  const { landing } = useContext(LandingContext);
  return landing;
}

/**
 * Hook for dynamic pages to register/unregister their CMS data.
 * Automatically clears on unmount so static pages get null.
 */
export function useSetLanding(data) {
  const { setLanding } = useContext(LandingContext);

  useEffect(() => {
    if (data) setLanding(data);
    return () => setLanding(null);
  }, [data, setLanding]);
}
