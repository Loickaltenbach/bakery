/**
 * Hook KISS pour la gestion de la sécurité
 * Centralise JWT, validation, rate limiting et logging
 */

import { useCallback, useState } from 'react';
import { 
  ValidationSchema, 
  ValidationResult, 
  ValidationService, 
  LogEntry,
  LoggingService 
} from '@/lib/security/types';

// Service de validation simple
class SimpleValidationService implements ValidationService {
  validate(data: any, schema: ValidationSchema): ValidationResult {
    const errors: { [key: string]: string } = {};

    for (const [field, rule] of Object.entries(schema)) {
      const value = data[field];

      // Required check
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors[field] = `${field} est requis`;
        continue;
      }

      // Skip other validations if not required and empty
      if (!rule.required && (value === undefined || value === null || value === '')) {
        continue;
      }

      // Type validation
      if (rule.type) {
        switch (rule.type) {
          case 'email':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              errors[field] = `${field} doit être un email valide`;
            }
            break;
          case 'phone':
            if (!/^[+]?[\d\s-()]+$/.test(value)) {
              errors[field] = `${field} doit être un numéro de téléphone valide`;
            }
            break;
          case 'number':
            if (isNaN(Number(value))) {
              errors[field] = `${field} doit être un nombre`;
            }
            break;
        }
      }

      // Length validation for strings
      if (typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors[field] = `${field} doit contenir au moins ${rule.minLength} caractères`;
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors[field] = `${field} ne peut pas dépasser ${rule.maxLength} caractères`;
        }
      }

      // Numeric range validation
      if (typeof value === 'number') {
        if (rule.min !== undefined && value < rule.min) {
          errors[field] = `${field} doit être supérieur ou égal à ${rule.min}`;
        }
        if (rule.max !== undefined && value > rule.max) {
          errors[field] = `${field} doit être inférieur ou égal à ${rule.max}`;
        }
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(String(value))) {
        errors[field] = `${field} ne respecte pas le format requis`;
      }

      // Custom validation
      if (rule.custom) {
        const customResult = rule.custom(value);
        if (customResult !== true) {
          errors[field] = typeof customResult === 'string' ? customResult : `${field} n'est pas valide`;
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  sanitize(data: any): any {
    if (typeof data === 'string') {
      // Supprimer les scripts et autres contenus dangereux
      return data
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .trim();
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitize(item));
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitize(value);
      }
      return sanitized;
    }

    return data;
  }
}

// Service de logging simple (en mémoire pour le développement)
class SimpleLoggingService implements LoggingService {
  private logs: LogEntry[] = [];

  async log(entry: LogEntry): Promise<void> {
    // En développement, aussi logger dans la console
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${entry.level.toUpperCase()}] ${entry.message}`, entry.metadata);
    }

    this.logs.push(entry);

    // Garder seulement les 1000 derniers logs en mémoire
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
  }

  async query(filters: Partial<LogEntry>, limit: number = 100): Promise<LogEntry[]> {
    let filtered = this.logs;

    if (filters.level) {
      filtered = filtered.filter(log => log.level === filters.level);
    }
    if (filters.userId) {
      filtered = filtered.filter(log => log.userId === filters.userId);
    }
    if (filters.url) {
      filtered = filtered.filter(log => log.url?.includes(filters.url!));
    }

    return filtered.slice(-limit);
  }

  async cleanup(olderThanDays: number): Promise<void> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - olderThanDays);
    
    this.logs = this.logs.filter(log => log.timestamp > cutoff);
  }
}

// Instances globales
const validation = new SimpleValidationService();
const logging = new SimpleLoggingService();

export function useSecurity() {
  // Hook pour la validation de formulaires
  const useValidation = (schema: ValidationSchema) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = useCallback((data: any) => {
      const result = validation.validate(data, schema);
      setErrors(result.errors);
      return result.isValid;
    }, [schema]);

    const clearErrors = useCallback(() => {
      setErrors({});
    }, []);

    const hasError = useCallback((field: string) => {
      return !!errors[field];
    }, [errors]);

    const getError = useCallback((field: string) => {
      return errors[field];
    }, [errors]);

    return {
      validate,
      clearErrors,
      hasError,
      getError,
      errors,
      isValid: Object.keys(errors).length === 0
    };
  };

  // Hook pour le logging
  const useLogging = () => {
    const log = useCallback(async (level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG', message: string, metadata?: any) => {
      await logging.log({
        level,
        message,
        timestamp: new Date(),
        metadata
      });
    }, []);

    const logError = useCallback((error: Error, context?: any) => {
      log('ERROR', error.message, { 
        stack: error.stack,
        context 
      });
    }, [log]);

    const logUserAction = useCallback((action: string, userId?: number, details?: any) => {
      log('INFO', `User action: ${action}`, {
        userId,
        details
      });
    }, [log]);

    return {
      log,
      logError,
      logUserAction
    };
  };

  // Hook pour la sanitisation
  const useSanitization = () => {
    const sanitize = useCallback((data: any) => {
      return validation.sanitize(data);
    }, []);

    return { sanitize };
  };

  return {
    useValidation,
    useLogging,
    useSanitization,
    services: {
      validation,
      logging
    }
  };
}
