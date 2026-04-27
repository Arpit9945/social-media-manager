'use client';

import { useEffect, useState } from 'react';
import { loadLogo } from '@/lib/reel/canvasEngine';

// Preloads a logo image so the canvas renderer can use it synchronously.
// Returns { ready: boolean, error: boolean, url: string | null }
export function useLogoPreload(logoUrl) {
  const [state, setState] = useState({
    ready: !logoUrl,
    error: false,
    url: logoUrl || null,
  });

  useEffect(() => {
    // No URL — instantly ready (no logo to load)
    if (!logoUrl) {
      setState({ ready: true, error: false, url: null });
      return;
    }

    // Mark loading
    setState({ ready: false, error: false, url: logoUrl });

    let cancelled = false;

    // Wrap in try/catch — if loadLogo throws synchronously, we don't crash the effect
    Promise.resolve()
      .then(() => loadLogo(logoUrl))
      .then((img) => {
        if (cancelled) return;
        setState({
          ready: true,
          error: !img,
          url: logoUrl,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        // Surface error in state, don't crash
        // eslint-disable-next-line no-console
        console.warn('Logo preload failed:', err);
        setState({
          ready: true,
          error: true,
          url: logoUrl,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [logoUrl]);

  return state;
}
