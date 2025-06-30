'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';

interface CommandeRapide {
  id: string;
  nom: string;
  produits: Array<{
    id: string;
    nom: string;
    quantite: number;
    prix: number;
  }>;
  total: number;
  createdAt: string;
  utilisations: number;
  dernierAcces: string;
}

interface CommandesRapidesContextType {
  commandesRapides: CommandeRapide[];
  ajouterCommandeRapide: (nom: string, produits: any[], total: number) => void;
  supprimerCommandeRapide: (id: string) => void;
  utiliserCommandeRapide: (id: string) => CommandeRapide | null;
  renommerCommandeRapide: (id: string, nouveauNom: string) => void;
  getCommandesPopulaires: (limite?: number) => CommandeRapide[];
}

const CommandesRapidesContext = createContext<CommandesRapidesContextType | undefined>(undefined);

export function CommandesRapidesProvider({ children }: { children: React.ReactNode }) {
  const [commandesRapides, setCommandesRapides] = useState<CommandeRapide[]>([]);

  // Charger les commandes rapides depuis localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('commandesRapides');
      if (saved) {
        setCommandesRapides(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes rapides:', error);
    }
  }, []);

  // Sauvegarder automatiquement
  useEffect(() => {
    try {
      localStorage.setItem('commandesRapides', JSON.stringify(commandesRapides));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des commandes rapides:', error);
    }
  }, [commandesRapides]);

  const ajouterCommandeRapide = (nom: string, produits: any[], total: number) => {
    const nouvelleCommande: CommandeRapide = {
      id: `cr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nom,
      produits: produits.map(p => ({
        id: p.id,
        nom: p.nom,
        quantite: p.quantite,
        prix: p.prix
      })),
      total,
      createdAt: new Date().toISOString(),
      utilisations: 0,
      dernierAcces: new Date().toISOString()
    };

    setCommandesRapides(prev => [nouvelleCommande, ...prev]);
  };

  const supprimerCommandeRapide = (id: string) => {
    setCommandesRapides(prev => prev.filter(cmd => cmd.id !== id));
  };

  const utiliserCommandeRapide = (id: string) => {
    let commandeUtilisee: CommandeRapide | null = null;

    setCommandesRapides(prev => prev.map(cmd => {
      if (cmd.id === id) {
        commandeUtilisee = {
          ...cmd,
          utilisations: cmd.utilisations + 1,
          dernierAcces: new Date().toISOString()
        };
        return commandeUtilisee;
      }
      return cmd;
    }));

    return commandeUtilisee;
  };

  const renommerCommandeRapide = (id: string, nouveauNom: string) => {
    setCommandesRapides(prev => prev.map(cmd => 
      cmd.id === id ? { ...cmd, nom: nouveauNom } : cmd
    ));
  };

  const getCommandesPopulaires = (limite: number = 5) => {
    return [...commandesRapides]
      .sort((a, b) => b.utilisations - a.utilisations)
      .slice(0, limite);
  };

  return (
    <CommandesRapidesContext.Provider value={{
      commandesRapides,
      ajouterCommandeRapide,
      supprimerCommandeRapide,
      utiliserCommandeRapide,
      renommerCommandeRapide,
      getCommandesPopulaires
    }}>
      {children}
    </CommandesRapidesContext.Provider>
  );
}

export function useCommandesRapides() {
  const context = useContext(CommandesRapidesContext);
  if (!context) {
    throw new Error('useCommandesRapides must be used within a CommandesRapidesProvider');
  }
  return context;
}
