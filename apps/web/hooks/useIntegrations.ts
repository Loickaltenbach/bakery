/**
 * Hook KISS pour la gestion des intégrations
 * Centralise Google Maps, Calendrier, CRM et Comptabilité
 */

import { useCallback, useState, useEffect } from 'react';
import {
  DeliveryAddress,
  DeliveryZone,
  TimeSlot,
  CalendarEvent,
  CRMContact,
  CRMActivity,
  AccountingInvoice,
  DeliveryService,
  CalendarService,
  CRMService,
  AccountingService
} from '@/lib/integrations/types';

// Services simples pour le développement
class MockDeliveryService implements DeliveryService {
  private zones: DeliveryZone[] = [
    {
      id: 'zone-1',
      name: 'Centre-ville',
      polygon: [], // À définir selon les besoins
      deliveryFee: 5.00,
      maxDistance: 5,
      estimatedTime: 30
    },
    {
      id: 'zone-2',
      name: 'Périphérie',
      polygon: [],
      deliveryFee: 8.00,
      maxDistance: 15,
      estimatedTime: 45
    }
  ];

  async calculateDeliveryFee(address: DeliveryAddress): Promise<number> {
    // Logique simple basée sur le code postal
    if (address.postalCode.startsWith('75')) return 5.00; // Paris
    if (address.postalCode.startsWith('92')) return 7.00; // Hauts-de-Seine
    return 10.00; // Autres zones
  }

  async getEstimatedTime(address: DeliveryAddress): Promise<number> {
    // Estimation simple
    if (address.postalCode.startsWith('75')) return 30;
    return 45;
  }

  async isInDeliveryZone(address: DeliveryAddress): Promise<boolean> {
    // Zone de livraison simple (codes postaux parisiens)
    return address.postalCode.startsWith('75') || 
           address.postalCode.startsWith('92') ||
           address.postalCode.startsWith('93') ||
           address.postalCode.startsWith('94');
  }

  async getDeliveryZones(): Promise<DeliveryZone[]> {
    return this.zones;
  }
}

class MockCalendarService implements CalendarService {
  private events: CalendarEvent[] = [];

  async getAvailableSlots(date: Date, duration: number): Promise<TimeSlot[]> {
    const slots: TimeSlot[] = [];
    const startHour = 8;
    const endHour = 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
      const start = new Date(date);
      start.setHours(hour, 0, 0, 0);
      
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + duration);

      // Vérifier si le créneau est disponible
      const isAvailable = !this.events.some(event => 
        (start >= event.start && start < event.end) ||
        (end > event.start && end <= event.end)
      );

      slots.push({
        start,
        end,
        available: isAvailable
      });
    }

    return slots;
  }

  async createEvent(event: CalendarEvent): Promise<string> {
    const id = `event-${Date.now()}`;
    this.events.push({ ...event, id });
    return id;
  }

  async updateEvent(eventId: string, eventUpdates: Partial<CalendarEvent>): Promise<boolean> {
    const index = this.events.findIndex(e => e.id === eventId);
    if (index >= 0 && this.events[index]) {
      const currentEvent = this.events[index];
      this.events[index] = { 
        ...currentEvent, 
        ...eventUpdates,
        // Préserver les champs requis
        title: eventUpdates.title || currentEvent.title,
        start: eventUpdates.start || currentEvent.start,
        end: eventUpdates.end || currentEvent.end
      };
      return true;
    }
    return false;
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    const index = this.events.findIndex(e => e.id === eventId);
    if (index >= 0) {
      this.events.splice(index, 1);
      return true;
    }
    return false;
  }

  async getEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    return this.events.filter(event => 
      event.start >= startDate && event.end <= endDate
    );
  }
}

class MockCRMService implements CRMService {
  private contacts: CRMContact[] = [];
  private activities: CRMActivity[] = [];

  async createContact(contact: CRMContact): Promise<string> {
    const id = `contact-${Date.now()}`;
    this.contacts.push({ 
      ...contact, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return id;
  }

  async updateContact(contactId: string, contactUpdates: Partial<CRMContact>): Promise<boolean> {
    const index = this.contacts.findIndex(c => c.id === contactId);
    if (index >= 0 && this.contacts[index]) {
      const currentContact = this.contacts[index];
      this.contacts[index] = { 
        ...currentContact, 
        ...contactUpdates,
        // Préserver les champs requis
        firstName: contactUpdates.firstName || currentContact.firstName,
        lastName: contactUpdates.lastName || currentContact.lastName,
        email: contactUpdates.email || currentContact.email,
        updatedAt: new Date() 
      };
      return true;
    }
    return false;
  }

  async getContact(contactId: string): Promise<CRMContact | null> {
    return this.contacts.find(c => c.id === contactId) || null;
  }

  async searchContacts(query: string): Promise<CRMContact[]> {
    const lowerQuery = query.toLowerCase();
    return this.contacts.filter(contact =>
      contact.firstName.toLowerCase().includes(lowerQuery) ||
      contact.lastName.toLowerCase().includes(lowerQuery) ||
      contact.email.toLowerCase().includes(lowerQuery)
    );
  }

  async addActivity(activity: CRMActivity): Promise<string> {
    const id = `activity-${Date.now()}`;
    this.activities.push({ ...activity, id });
    return id;
  }

  async getActivities(contactId: string): Promise<CRMActivity[]> {
    return this.activities.filter(a => a.contactId === contactId);
  }
}

class MockAccountingService implements AccountingService {
  private customers: any[] = [];
  private invoices: AccountingInvoice[] = [];

  async createCustomer(customer: any): Promise<string> {
    const id = `customer-${Date.now()}`;
    this.customers.push({ ...customer, id });
    return id;
  }

  async createInvoice(invoice: AccountingInvoice): Promise<string> {
    const id = `invoice-${Date.now()}`;
    this.invoices.push({ ...invoice, id, status: 'draft' });
    return id;
  }

  async sendInvoice(invoiceId: string): Promise<boolean> {
    const invoice = this.invoices.find(i => i.id === invoiceId);
    if (invoice) {
      invoice.status = 'sent';
      return true;
    }
    return false;
  }

  async getInvoiceStatus(invoiceId: string): Promise<string> {
    const invoice = this.invoices.find(i => i.id === invoiceId);
    return invoice?.status || 'not_found';
  }

  async exportData(startDate: Date, endDate: Date): Promise<Blob> {
    const filteredInvoices = this.invoices.filter(i =>
      i.date >= startDate && i.date <= endDate
    );
    
    const csvContent = [
      'Date,Numéro,Client,Montant,Statut',
      ...filteredInvoices.map(i => 
        `${i.date.toISOString()},${i.number},${i.customerId},${i.total},${i.status}`
      )
    ].join('\n');
    
    return new Blob([csvContent], { type: 'text/csv' });
  }
}

// Instances globales
const deliveryService = new MockDeliveryService();
const calendarService = new MockCalendarService();
const crmService = new MockCRMService();
const accountingService = new MockAccountingService();

export function useIntegrations() {
  // Hook pour la livraison
  const useDelivery = () => {
    const [deliveryFee, setDeliveryFee] = useState<number>(0);
    const [estimatedTime, setEstimatedTime] = useState<number>(0);
    const [isInZone, setIsInZone] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const calculateDelivery = useCallback(async (address: DeliveryAddress) => {
      setLoading(true);
      try {
        const [fee, time, inZone] = await Promise.all([
          deliveryService.calculateDeliveryFee(address),
          deliveryService.getEstimatedTime(address),
          deliveryService.isInDeliveryZone(address)
        ]);

        setDeliveryFee(fee);
        setEstimatedTime(time);
        setIsInZone(inZone);
      } catch (error) {
        console.error('Erreur calcul livraison:', error);
      } finally {
        setLoading(false);
      }
    }, []);

    return {
      deliveryFee,
      estimatedTime,
      isInZone,
      loading,
      calculateDelivery
    };
  };

  // Hook pour le calendrier
  const useCalendar = () => {
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(false);

    const getAvailableSlots = useCallback(async (date: Date, duration: number) => {
      setLoading(true);
      try {
        const slots = await calendarService.getAvailableSlots(date, duration);
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Erreur récupération créneaux:', error);
      } finally {
        setLoading(false);
      }
    }, []);

    const createEvent = useCallback(async (event: CalendarEvent) => {
      try {
        return await calendarService.createEvent(event);
      } catch (error) {
        console.error('Erreur création événement:', error);
        return null;
      }
    }, []);

    return {
      availableSlots,
      events,
      loading,
      getAvailableSlots,
      createEvent,
      updateEvent: calendarService.updateEvent,
      deleteEvent: calendarService.deleteEvent
    };
  };

  // Hook pour le CRM
  const useCRM = () => {
    const [contacts, setContacts] = useState<CRMContact[]>([]);
    const [activities, setActivities] = useState<CRMActivity[]>([]);
    const [loading, setLoading] = useState(false);

    const searchContacts = useCallback(async (query: string) => {
      setLoading(true);
      try {
        const results = await crmService.searchContacts(query);
        setContacts(results);
      } catch (error) {
        console.error('Erreur recherche contacts:', error);
      } finally {
        setLoading(false);
      }
    }, []);

    const createContact = useCallback(async (contact: CRMContact) => {
      try {
        return await crmService.createContact(contact);
      } catch (error) {
        console.error('Erreur création contact:', error);
        return null;
      }
    }, []);

    return {
      contacts,
      activities,
      loading,
      searchContacts,
      createContact,
      updateContact: crmService.updateContact,
      addActivity: crmService.addActivity
    };
  };

  // Hook pour la comptabilité
  const useAccounting = () => {
    const [invoices, setInvoices] = useState<AccountingInvoice[]>([]);
    const [loading, setLoading] = useState(false);

    const createInvoice = useCallback(async (invoice: AccountingInvoice) => {
      try {
        return await accountingService.createInvoice(invoice);
      } catch (error) {
        console.error('Erreur création facture:', error);
        return null;
      }
    }, []);

    const exportData = useCallback(async (startDate: Date, endDate: Date) => {
      try {
        return await accountingService.exportData(startDate, endDate);
      } catch (error) {
        console.error('Erreur export données:', error);
        return null;
      }
    }, []);

    return {
      invoices,
      loading,
      createInvoice,
      sendInvoice: accountingService.sendInvoice,
      exportData
    };
  };

  return {
    useDelivery,
    useCalendar,
    useCRM,
    useAccounting,
    services: {
      delivery: deliveryService,
      calendar: calendarService,
      crm: crmService,
      accounting: accountingService
    }
  };
}
