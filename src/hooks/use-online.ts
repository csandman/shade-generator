import { useState, useEffect } from 'react';

const useOnline = () => {
  const [isOnline, setNetwork] = useState(globalThis.navigator.onLine);

  useEffect(() => {
    const updateNetwork = () => {
      setNetwork(globalThis.navigator.onLine);
    };

    globalThis.addEventListener('offline', updateNetwork);
    globalThis.addEventListener('online', updateNetwork);

    return () => {
      globalThis.removeEventListener('offline', updateNetwork);
      globalThis.removeEventListener('online', updateNetwork);
    };
  }, []);

  return isOnline;
};

export default useOnline;
