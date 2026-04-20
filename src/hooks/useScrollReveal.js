import { useEffect, useRef } from 'react';

export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const { threshold = 0.12, rootMargin = '0px 0px -50px 0px' } = options;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );
    const container = ref.current;
    if (container) {
      const els = container.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
      els.forEach((el) => observer.observe(el));
    }
    return () => observer.disconnect();
  }, []);
  return ref;
}
