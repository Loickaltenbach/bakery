/**
 * Configuration et utilities pour l'optimisation des performances
 * Architecture KISS pour les futurs systèmes de cache, CDN et optimisation
 */

// Types pour la configuration de performance
export interface CacheConfig {
  redis?: {
    url: string;
    ttl: number;
    maxMemory: string;
  };
  memory?: {
    maxSize: number;
    ttl: number;
  };
}

export interface CDNConfig {
  provider: 'cloudinary' | 'aws' | 'vercel';
  baseUrl: string;
  transformations: {
    formats: string[];
    qualities: number[];
    sizes: number[];
  };
}

export interface PerformanceConfig {
  cache: CacheConfig;
  cdn: CDNConfig;
  compression: {
    images: boolean;
    gzip: boolean;
    brotli: boolean;
  };
  lazyLoading: {
    enabled: boolean;
    threshold: number;
  };
}

// Configuration par défaut (à personnaliser selon l'environnement)
export const defaultPerformanceConfig: PerformanceConfig = {
  cache: {
    memory: {
      maxSize: 100, // MB
      ttl: 3600 // 1 heure
    }
  },
  cdn: {
    provider: 'vercel',
    baseUrl: process.env.NEXT_PUBLIC_CDN_URL || '',
    transformations: {
      formats: ['webp', 'avif', 'jpg'],
      qualities: [75, 85, 95],
      sizes: [320, 640, 1024, 1920]
    }
  },
  compression: {
    images: true,
    gzip: true,
    brotli: true
  },
  lazyLoading: {
    enabled: true,
    threshold: 200
  }
};

// Interface pour le cache service (à implémenter)
export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Interface pour l'optimisation d'images (à implémenter)
export interface ImageOptimizationService {
  optimize(url: string, options?: ImageOptimizationOptions): string;
  generateSrcSet(url: string, sizes: number[]): string;
}

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
}
