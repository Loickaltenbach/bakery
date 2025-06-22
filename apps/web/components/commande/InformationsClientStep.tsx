'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { useCommande } from '../../contexts/CommandeContext';
import { InformationsClient } from '../../lib/commande-types';
import { validerInformationsClient } from '../../lib/commande-utils';
import { User, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';

export const InformationsClientStep: React.FC = () => {
  const { processus, definirInformationsClient } = useCommande();
  
  const [formData, setFormData] = useState<Partial<InformationsClient>>({
    nom: '',
    prenom: '',
    telephone: '',
    email: ''
  });
  
  const [erreurs, setErreurs] = useState<string[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Charger les informations existantes si disponibles
  useEffect(() => {
    if (processus.informationsClient) {
      setFormData(processus.informationsClient);
    }
  }, [processus.informationsClient]);

  // Valider en temps réel
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const validation = validerInformationsClient(formData);
      setErreurs(validation.erreurs);
      
      if (validation.valide) {
        definirInformationsClient(formData as InformationsClient);
      }
    }
  }, [formData, touched, definirInformationsClient]);

  const handleInputChange = (field: string, value: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-artisan font-bold text-boulangerie-bordeaux mb-3">
          Vos informations
        </h3>
        <p className="text-boulangerie-bordeaux-light font-alsacien">
          Renseignez vos coordonnées pour finaliser la commande
        </p>
      </div>

      {/* Affichage des erreurs */}
      {erreurs.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800 mb-2">
                Veuillez corriger les erreurs suivantes :
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                {erreurs.map((erreur, index) => (
                  <li key={index}>• {erreur}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Informations personnelles */}
        <Card className="card-boulangerie">
          <CardContent className="p-6">
            <h4 className="text-lg font-artisan font-bold text-boulangerie-bordeaux mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-boulangerie-or" />
              Informations personnelles
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.nom || ''}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  onBlur={() => handleBlur('nom')}
                  className="w-full p-3 border border-boulangerie-beige rounded-xl focus:border-boulangerie-or focus:ring-4 focus:ring-boulangerie-or/20 outline-none transition-all"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={formData.prenom || ''}
                  onChange={(e) => handleInputChange('prenom', e.target.value)}
                  onBlur={() => handleBlur('prenom')}
                  className="w-full p-3 border border-boulangerie-beige rounded-xl focus:border-boulangerie-or focus:ring-4 focus:ring-boulangerie-or/20 outline-none transition-all"
                  placeholder="Votre prénom"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations de contact */}
        <Card className="card-boulangerie">
          <CardContent className="p-6">
            <h4 className="text-lg font-artisan font-bold text-boulangerie-bordeaux mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-boulangerie-or" />
              Contact
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className="w-full p-3 border border-boulangerie-beige rounded-xl focus:border-boulangerie-or focus:ring-4 focus:ring-boulangerie-or/20 outline-none transition-all"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={formData.telephone || ''}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  onBlur={() => handleBlur('telephone')}
                  className="w-full p-3 border border-boulangerie-beige rounded-xl focus:border-boulangerie-or focus:ring-4 focus:ring-boulangerie-or/20 outline-none transition-all"
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information sur l'utilisation des données */}
        <div className="p-4 bg-boulangerie-beige rounded-xl border-l-4 border-boulangerie-or">
          <h5 className="font-medium text-boulangerie-bordeaux mb-2">
            Protection de vos données
          </h5>
          <p className="text-sm text-boulangerie-bordeaux-light">
            Vos informations personnelles sont utilisées uniquement pour traiter votre commande 
            et vous contacter si nécessaire. Elles ne sont pas partagées avec des tiers.
          </p>
        </div>
      </div>
    </div>
  );
};
