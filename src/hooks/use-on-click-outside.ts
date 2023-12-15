import { RefObject, useEffect } from 'react';

// Defining the type of events to handle
type Event = MouseEvent | TouchEvent;

// Defining a custom hook to handle clicks outside of a given element
export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>, // The reference to the element to monitor
  handler: (event: Event) => void // The function to call when a click outside is detected
) => {
  // Using the useEffect hook to add event listeners when the component mounts
  useEffect(() => {
    // Defining the listener function
    const listener = (event: Event) => {
      // Getting the current element from the ref
      const el = ref?.current;

      // If there's no element, or the click was inside the element, do nothing
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }

      // If the click was outside the element, call the handler function
      handler(event);
    };

    // Adding the listener to the 'mousedown' and 'touchstart' events
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // Returning a cleanup function to remove the listeners when the component unmounts
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]); // Only re-run the effect if the ref or handler changes
};
