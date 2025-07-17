import { useState, useEffect } from 'react';

const useOnline = () => {
  const [isOnline, setNetwork] = useState(window.navigator.onLine);

  useEffect(() => {
    const updateNetwork = () => {
      setNetwork(window.navigator.onLine);
    };

    window.addEventListener('offline', updateNetwork);
    window.addEventListener('online', updateNetwork);

    return () => {
      window.removeEventListener('offline', updateNetwork);
      window.removeEventListener('online', updateNetwork);
    };
  }, []);

  return isOnline;
};

export default useOnline;
