/**
 * Types et configuration pour la sécurité
 * Architecture KISS pour JWT, validation, rate limiting et logs
 */

// Types pour l'authentification JWT
export interface JWTConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
  issuer: string;
  audience: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

// Types pour la validation
export interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'email' | 'phone' | 'date';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

// Types pour le rate limiting
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface RateLimitStore {
  get(key: string): Promise<number>;
  increment(key: string, windowMs: number): Promise<number>;
  reset(key: string): Promise<void>;
}

// Types pour les logs
export interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

export interface LogEntry {
  level: keyof LogLevel;
  message: string;
  timestamp: Date;
  userId?: number;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
  url?: string;
  method?: string;
  statusCode?: number;
  responseTime?: number;
  metadata?: Record<string, any>;
}

export interface SecurityConfig {
  jwt: JWTConfig;
  rateLimit: {
    api: RateLimitConfig;
    auth: RateLimitConfig;
    search: RateLimitConfig;
  };
  validation: {
    strictMode: boolean;
    sanitizeInput: boolean;
  };
  logging: {
    level: keyof LogLevel;
    retentionDays: number;
    sensitive: string[]; // Champs à masquer dans les logs
  };
}

// Configuration par défaut
export const defaultSecurityConfig: SecurityConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    expiresIn: '15m',
    refreshExpiresIn: '7d',
    issuer: 'boulangerie-app',
    audience: 'boulangerie-users'
  },
  rateLimit: {
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100,
      message: 'Trop de requêtes, essayez plus tard'
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5,
      message: 'Trop de tentatives de connexion'
    },
    search: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 30,
      message: 'Trop de recherches, ralentissez'
    }
  },
  validation: {
    strictMode: true,
    sanitizeInput: true
  },
  logging: {
    level: 'INFO',
    retentionDays: 30,
    sensitive: ['password', 'token', 'secret', 'key']
  }
};

// Interfaces de services (à implémenter)
export interface AuthService {
  generateToken(payload: JWTPayload): Promise<string>;
  verifyToken(token: string): Promise<JWTPayload | null>;
  refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string } | null>;
}

export interface ValidationService {
  validate(data: any, schema: ValidationSchema): ValidationResult;
  sanitize(data: any): any;
}

export interface RateLimitService {
  checkLimit(key: string, config: RateLimitConfig): Promise<boolean>;
  getRemainingRequests(key: string, config: RateLimitConfig): Promise<number>;
}

export interface LoggingService {
  log(entry: LogEntry): Promise<void>;
  query(filters: Partial<LogEntry>, limit?: number): Promise<LogEntry[]>;
  cleanup(olderThanDays: number): Promise<void>;
}
