'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';

interface OfflineData {
  produits: any[];
  categories: any[];
  panier: any[];
  favoris: string[];
  commandesEnAttente: any[];
  lastSync: string;
}

interface OfflineContextType {
  isOnline: boolean;
  offlineData: OfflineData;
  syncData: () => Promise<void>;
  addOfflineAction: (action: any) => void;
  isSyncing: boolean;
  lastSyncTime: string | null;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [offlineData, setOfflineData] = useState<OfflineData>({
    produits: [],
    categories: [],
    panier: [],
    favoris: [],
    commandesEnAttente: [],
    lastSync: new Date().toISOString()
  });

  // Écouter les changements de connexion
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync quand on revient en ligne
      syncData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Charger les données hors ligne au démarrage
  useEffect(() => {
    loadOfflineData();
  }, []);

  const loadOfflineData = () => {
    try {
      const saved = localStorage.getItem('offlineData');
      if (saved) {
        const data = JSON.parse(saved);
        setOfflineData(data);
        setLastSyncTime(data.lastSync);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données hors ligne:', error);
    }
  };

  const saveOfflineData = (data: OfflineData) => {
    try {
      localStorage.setItem('offlineData', JSON.stringify(data));
      setOfflineData(data);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données hors ligne:', error);
    }
  };

  const syncData = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    try {
      // Synchroniser les données avec le serveur
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commandesEnAttente: offlineData.commandesEnAttente,
          lastSync: offlineData.lastSync
        })
      });

      if (response.ok) {
        const newData = await response.json();
        
        const updatedData: OfflineData = {
          ...newData,
          commandesEnAttente: [], // Vider les commandes en attente après sync
          lastSync: new Date().toISOString()
        };

        saveOfflineData(updatedData);
        setLastSyncTime(updatedData.lastSync);
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const addOfflineAction = (action: any) => {
    const updatedData = {
      ...offlineData,
      commandesEnAttente: [...offlineData.commandesEnAttente, {
        ...action,
        timestamp: new Date().toISOString(),
        id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }]
    };
    
    saveOfflineData(updatedData);
  };

  return (
    <OfflineContext.Provider value={{
      isOnline,
      offlineData,
      syncData,
      addOfflineAction,
      isSyncing,
      lastSyncTime
    }}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}
