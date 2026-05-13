import { useEffect } from 'react';
import Lenis from 'lenis';

let lenisInstance = null;

const useLenis = () => {
  useEffect(() => {
    if (lenisInstance) return;

    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    const raf = (time) => {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
      lenisInstance = null;
    };
  }, []);

  return lenisInstance;
};

export default useLenis;
