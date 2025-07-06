/**
 * Index global des hooks - Architecture KISS
 * Point d'entrée unique pour tous les hooks de l'application
 */

// Hooks API de base
export { useApi } from './useApi';
export type { ApiState } from './useApi';

// Hooks métier (logique business)
export { useProduits } from './useProduits';
export { useCategories } from './useCategories';
export { useCategorieFilter } from './useCategorieFilter';
export { useProduitsPage } from './useProduitsPage';
export { useFiltres } from './useFiltres';
export { useCommandes } from './useCommandes';
export { useContact } from './useContact';
export { useCommandesRapidesLogic } from './useCommandesRapidesLogic';
export { useRecherche } from './useRecherche';
export { useRechercheSimple } from './useRechercheSimple';

// Hooks admin
export { useAdminAccess } from './useAdminAccess';
export { useAdminNavigation } from './useAdminNavigation';

// Hooks techniques/infrastructure
export { usePerformance } from './usePerformance';
export { useSecurity } from './useSecurity';
export { useIntegrations } from './useIntegrations';

// Hooks de test
export { useTestPaiement } from './useTestPaiement';

// Types et utilitaires
export type { CacheService, ImageOptimizationService } from '@/lib/performance/types';
export type { ValidationSchema, ValidationResult } from '@/lib/security/types';
export type { 
  DeliveryAddress, 
  CalendarEvent, 
  CRMContact, 
  AccountingInvoice 
} from '@/lib/integrations/types';

/**
 * Hook principal qui combine tous les hooks techniques
 * Usage : const { performance, security, integrations } = useApp();
 */
export function useApp() {
  // Import dynamique pour éviter les erreurs de circularité
  const { usePerformance } = require('./usePerformance');
  const { useSecurity } = require('./useSecurity');
  const { useIntegrations } = require('./useIntegrations');

  const performance = usePerformance();
  const security = useSecurity();
  const integrations = useIntegrations();

  return {
    performance,
    security,
    integrations
  };
}
