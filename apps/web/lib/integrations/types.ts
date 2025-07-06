/**
 * Types et configuration pour les intégrations externes
 * Architecture KISS pour Google Maps, Calendrier, CRM et Comptabilité
 */

// Google Maps Integration
export interface GoogleMapsConfig {
  apiKey: string;
  defaultCenter: {
    lat: number;
    lng: number;
  };
  defaultZoom: number;
  restrictions?: {
    country: string;
    bounds?: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  };
}

export interface DeliveryZone {
  id: string;
  name: string;
  polygon: Array<{ lat: number; lng: number }>;
  deliveryFee: number;
  maxDistance: number;
  estimatedTime: number; // en minutes
}

export interface DeliveryAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Calendar Integration
export interface CalendarConfig {
  provider: 'google' | 'outlook' | 'ical';
  credentials?: {
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
  };
  defaultEventDuration: number; // en minutes
  workingHours: {
    start: string; // "08:00"
    end: string;   // "18:00"
  };
  closedDays: number[]; // 0 = dimanche, 1 = lundi, etc.
}

export interface CalendarEvent {
  id?: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  attendees?: string[];
  reminders?: {
    method: 'email' | 'popup';
    minutes: number;
  }[];
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
  eventId?: string;
}

// CRM Integration
export interface CRMConfig {
  provider: 'hubspot' | 'salesforce' | 'pipedrive' | 'custom';
  apiUrl?: string;
  apiKey?: string;
  webhookUrl?: string;
}

export interface CRMContact {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  address?: DeliveryAddress;
  tags?: string[];
  customFields?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CRMActivity {
  id?: string;
  contactId: string;
  type: 'call' | 'email' | 'meeting' | 'order' | 'note';
  title: string;
  description?: string;
  date: Date;
  outcome?: string;
  metadata?: Record<string, any>;
}

// Accounting Integration
export interface AccountingConfig {
  provider: 'sage' | 'quickbooks' | 'xero' | 'custom';
  apiUrl?: string;
  credentials?: {
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
    refreshToken?: string;
  };
  companyId?: string;
  defaultTaxRate: number;
  currency: string;
}

export interface AccountingInvoice {
  id?: string;
  number: string;
  customerId: string;
  date: Date;
  dueDate: Date;
  items: AccountingInvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  metadata?: Record<string, any>;
}

export interface AccountingInvoiceItem {
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

export interface AccountingCustomer {
  id?: string;
  name: string;
  email: string;
  address?: DeliveryAddress;
  taxId?: string;
  paymentTerms?: number; // jours
}

// Configuration globale des intégrations
export interface IntegrationsConfig {
  googleMaps: GoogleMapsConfig;
  calendar: CalendarConfig;
  crm: CRMConfig;
  accounting: AccountingConfig;
}

// Configuration par défaut
export const defaultIntegrationsConfig: IntegrationsConfig = {
  googleMaps: {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    defaultCenter: {
      lat: 48.8566, // Paris
      lng: 2.3522
    },
    defaultZoom: 12,
    restrictions: {
      country: 'FR'
    }
  },
  calendar: {
    provider: 'google',
    defaultEventDuration: 30,
    workingHours: {
      start: '08:00',
      end: '18:00'
    },
    closedDays: [0] // Fermé le dimanche
  },
  crm: {
    provider: 'custom',
    apiUrl: process.env.CRM_API_URL || ''
  },
  accounting: {
    provider: 'custom',
    apiUrl: process.env.ACCOUNTING_API_URL || '',
    defaultTaxRate: 0.20, // 20% TVA
    currency: 'EUR'
  }
};

// Interfaces de services (à implémenter)
export interface DeliveryService {
  calculateDeliveryFee(address: DeliveryAddress): Promise<number>;
  getEstimatedTime(address: DeliveryAddress): Promise<number>;
  isInDeliveryZone(address: DeliveryAddress): Promise<boolean>;
  getDeliveryZones(): Promise<DeliveryZone[]>;
}

export interface CalendarService {
  getAvailableSlots(date: Date, duration: number): Promise<TimeSlot[]>;
  createEvent(event: CalendarEvent): Promise<string>;
  updateEvent(eventId: string, event: Partial<CalendarEvent>): Promise<boolean>;
  deleteEvent(eventId: string): Promise<boolean>;
  getEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]>;
}

export interface CRMService {
  createContact(contact: CRMContact): Promise<string>;
  updateContact(contactId: string, contact: Partial<CRMContact>): Promise<boolean>;
  getContact(contactId: string): Promise<CRMContact | null>;
  searchContacts(query: string): Promise<CRMContact[]>;
  addActivity(activity: CRMActivity): Promise<string>;
  getActivities(contactId: string): Promise<CRMActivity[]>;
}

export interface AccountingService {
  createCustomer(customer: AccountingCustomer): Promise<string>;
  createInvoice(invoice: AccountingInvoice): Promise<string>;
  sendInvoice(invoiceId: string): Promise<boolean>;
  getInvoiceStatus(invoiceId: string): Promise<string>;
  exportData(startDate: Date, endDate: Date): Promise<Blob>;
}
