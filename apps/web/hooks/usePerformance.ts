/**
 * Hook KISS pour la gestion des performances
 * Centralise la logique de cache, optimisation d'images et lazy loading
 */

import { useCallback, useEffect, useState } from 'react';
import { CacheService, ImageOptimizationService } from '@/lib/performance/types';

// Cache en mémoire simple pour le développement
class MemoryCache implements CacheService {
  private cache = new Map<string, { value: any; expires: number }>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    this.cache.set(key, {
      value,
      expires: Date.now() + (ttl * 1000)
    });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}

// Service d'optimisation d'images simple
class SimpleImageOptimizer implements ImageOptimizationService {
  optimize(url: string, options?: any): string {
    if (!url) return '';
    
    // Pour Next.js, utiliser le système d'optimisation intégré
    if (process.env.NODE_ENV === 'production') {
      const params = new URLSearchParams();
      if (options?.width) params.set('w', options.width.toString());
      if (options?.quality) params.set('q', options.quality.toString());
      
      return `/_next/image?url=${encodeURIComponent(url)}&${params.toString()}`;
    }
    
    return url;
  }

  generateSrcSet(url: string, sizes: number[]): string {
    return sizes
      .map(size => `${this.optimize(url, { width: size })} ${size}w`)
      .join(', ');
  }
}

// Instance globales (simples pour commencer)
const cache = new MemoryCache();
const imageOptimizer = new SimpleImageOptimizer();

export function usePerformance() {
  // Hook pour le cache
  const useCache = <T>(key: string, fetcher: () => Promise<T>, ttl?: number) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      let mounted = true;

      const loadData = async () => {
        try {
          setLoading(true);
          setError(null);

          // Essayer le cache d'abord
          const cached = await cache.get<T>(key);
          if (cached && mounted) {
            setData(cached);
            setLoading(false);
            return;
          }

          // Sinon, récupérer les données
          const fresh = await fetcher();
          if (mounted) {
            setData(fresh);
            await cache.set(key, fresh, ttl);
          }
        } catch (err) {
          if (mounted) {
            setError(err instanceof Error ? err : new Error('Erreur inconnue'));
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

      loadData();

      return () => {
        mounted = false;
      };
    }, [key, ttl]);

    const invalidate = useCallback(async () => {
      await cache.del(key);
    }, [key]);

    return { data, loading, error, invalidate };
  };

  // Hook pour l'optimisation d'images
  const useImageOptimization = () => {
    const optimizeImage = useCallback((url: string, options?: any) => {
      return imageOptimizer.optimize(url, options);
    }, []);

    const generateSrcSet = useCallback((url: string, sizes: number[]) => {
      return imageOptimizer.generateSrcSet(url, sizes);
    }, []);

    return { optimizeImage, generateSrcSet };
  };

  // Hook pour le lazy loading
  const useLazyLoading = (threshold: number = 200) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [element, setElement] = useState<Element | null>(null);

    useEffect(() => {
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting) {
            setIsIntersecting(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: `${threshold}px`
        }
      );

      observer.observe(element);

      return () => observer.disconnect();
    }, [element, threshold]);

    return { isIntersecting, setElement };
  };

  return {
    useCache,
    useImageOptimization,
    useLazyLoading,
    cache: {
      get: cache.get.bind(cache),
      set: cache.set.bind(cache),
      del: cache.del.bind(cache),
      clear: cache.clear.bind(cache)
    }
  };
}
