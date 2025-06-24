import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that scrolls the window to the top when the route changes
 * This component should be placed inside the Router component in App.tsx
 */
const ScrollToTop = () => {
  const location = useLocation();
  const { pathname, search } = location;

  useEffect(() => {
    // Scroll to top when the route changes (either pathname or search parameters)
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Use smooth scrolling for a better user experience
    });
  }, [pathname, search]); // Re-run the effect when either pathname or search parameters change

  return null; // This component doesn't render anything
};

export default ScrollToTop;
