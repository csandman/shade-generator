import { useRef, useEffect } from 'react';

const useEventListener = (eventName, handler, element = global) => {
  const savedHandler = useRef();
  
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      console.log("useEventListener")
      const isSupported = element && element.addEventListener;
      if (!isSupported) {
        console.error(element, "addEventListener is not supported");
        return;
      } 
      const eventListener = event => savedHandler.current(event);
      element.addEventListener(eventName, eventListener);
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
};

export { useEventListener };