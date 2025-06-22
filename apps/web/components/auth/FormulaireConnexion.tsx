'use client';

import React, { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { useAuth } from '../../contexts/AuthContext';
import { InformationsConnexion } from '../../lib/auth-types';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface FormulaireConnexionProps {
  onSucces?: () => void;
  onBasculerInscription?: () => void;
  afficherBasculer?: boolean;
}

export const FormulaireConnexion: React.FC<FormulaireConnexionProps> = ({
  onSucces,
  onBasculerInscription,
  afficherBasculer = true
}) => {
  const { connexion, chargementAuth, erreurAuth, effacerErreur } = useAuth();
  
  const [formData, setFormData] = useState<InformationsConnexion>({
    email: '',
    motDePasse: '',
    seSouvenirDeMoi: false
  });
  
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);
  const [erreurs, setErreurs] = useState<string[]>([]);

  const handleChange = (field: keyof InformationsConnexion, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer les erreurs quand l'utilisateur tape
    if (erreurs.length > 0 || erreurAuth) {
      setErreurs([]);
      effacerErreur();
    }
  };

  const validerFormulaire = (): boolean => {
    const nouvellesErreurs: string[] = [];
    
    if (!formData.email.trim()) {
      nouvellesErreurs.push('L\'email est obligatoire');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nouvellesErreurs.push('Format d\'email invalide');
    }
    
    if (!formData.motDePasse) {
      nouvellesErreurs.push('Le mot de passe est obligatoire');
    }
    
    setErreurs(nouvellesErreurs);
    return nouvellesErreurs.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validerFormulaire()) return;
    
    try {
      await connexion(formData);
      onSucces?.();
    } catch (error) {
      // L'erreur est déjà gérée par le contexte
      console.error('Erreur de connexion:', error);
    }
  };

  // Données de test pour faciliter le développement
  const remplirDonneesTest = (type: 'admin' | 'employe' | 'client') => {
    const donnees = {
      admin: { email: 'admin@boulangerie-alsacienne.fr', motDePasse: 'admin123' },
      employe: { email: 'marie@boulangerie-alsacienne.fr', motDePasse: 'employe123' },
      client: { email: 'client@example.com', motDePasse: 'client123' }
    };
    
    setFormData(prev => ({
      ...prev,
      ...donnees[type]
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-artisan font-bold text-boulangerie-bordeaux mb-2">
            Connexion
          </h2>
          <p className="text-boulangerie-bordeaux-light font-alsacien">
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Affichage des erreurs */}
        {(erreurs.length > 0 || erreurAuth) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">
                {erreurAuth && <div>{erreurAuth}</div>}
                {erreurs.map((erreur, index) => (
                  <div key={index}>{erreur}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-boulangerie-bordeaux-light" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-boulangerie-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or focus:border-transparent"
                placeholder="votre.email@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-boulangerie-bordeaux-light" />
              <input
                type={afficherMotDePasse ? 'text' : 'password'}
                value={formData.motDePasse}
                onChange={(e) => handleChange('motDePasse', e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-boulangerie-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or focus:border-transparent"
                placeholder="Votre mot de passe"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-boulangerie-bordeaux-light hover:text-boulangerie-bordeaux"
              >
                {afficherMotDePasse ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Se souvenir de moi */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="seSouvenirDeMoi"
              checked={formData.seSouvenirDeMoi}
              onChange={(e) => handleChange('seSouvenirDeMoi', e.target.checked)}
              className="w-4 h-4 text-boulangerie-or bg-gray-100 border-gray-300 rounded focus:ring-boulangerie-or focus:ring-2"
            />
            <label htmlFor="seSouvenirDeMoi" className="ml-2 text-sm text-boulangerie-bordeaux">
              Se souvenir de moi
            </label>
          </div>

          {/* Bouton de connexion */}
          <Button
            type="submit"
            disabled={chargementAuth}
            className="w-full btn-boulangerie-primary py-3"
          >
            {chargementAuth ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        {/* Données de test (en développement uniquement) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">Comptes de test :</p>
            <div className="flex gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => remplirDonneesTest('admin')}
                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => remplirDonneesTest('employe')}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
              >
                Employé
              </button>
            </div>
          </div>
        )}

        {/* Lien vers inscription */}
        {afficherBasculer && onBasculerInscription && (
          <div className="mt-6 text-center">
            <p className="text-sm text-boulangerie-bordeaux-light">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={onBasculerInscription}
                className="text-boulangerie-or font-medium hover:underline"
              >
                Créer un compte
              </button>
            </p>
          </div>
        )}

        {/* Mot de passe oublié */}
        <div className="mt-2 text-center">
          <button
            type="button"
            className="text-xs text-boulangerie-bordeaux-light hover:text-boulangerie-bordeaux hover:underline"
          >
            Mot de passe oublié ?
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
