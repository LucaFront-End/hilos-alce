import { useEffect } from 'react';

/**
 * usePageSEO — Dynamically sets <title> and <meta name="description">
 * for SPA pages. Falls back to index.html values on unmount.
 */
export function usePageSEO({ title, description }) {
  useEffect(() => {
    // Set title
    if (title) document.title = title;

    // Set meta description
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }
  }, [title, description]);
}
