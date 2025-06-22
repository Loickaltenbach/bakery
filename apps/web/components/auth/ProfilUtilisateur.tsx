'use client';

import React, { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { useAuth } from '../../contexts/AuthContext';
import { Utilisateur, PreferencesUtilisateur, AdresseUtilisateur, RegimeAlimentaire } from '../../lib/auth-types';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Bell, 
  Shield, 
  Heart,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  AlertCircle
} from 'lucide-react';

export const ProfilUtilisateur: React.FC = () => {
  const { utilisateurActuel, mettreAJourProfil, obtenirHistorique } = useAuth();
  const [modeEdition, setModeEdition] = useState(false);
  const [erreurs, setErreurs] = useState<string[]>([]);
  const [chargement, setChargement] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Utilisateur>>(
    utilisateurActuel || {}
  );

  if (!utilisateurActuel) {
    return (
      <div className="text-center py-8">
        <p className="text-boulangerie-bordeaux-light">Aucun utilisateur connecté</p>
      </div>
    );
  }

  const historique = obtenirHistorique();

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Effacer les erreurs
    if (erreurs.length > 0) {
      setErreurs([]);
    }
  };

  const handlePreferenceChange = (field: keyof PreferencesUtilisateur, value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      } as PreferencesUtilisateur
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        preferencesNotification: {
          ...prev.preferences?.preferencesNotification,
          [field]: value
        }
      } as PreferencesUtilisateur
    }));
  };

  const validerFormulaire = (): boolean => {
    const nouvellesErreurs: string[] = [];
    
    if (!formData.nom?.trim()) nouvellesErreurs.push('Le nom est obligatoire');
    if (!formData.prenom?.trim()) nouvellesErreurs.push('Le prénom est obligatoire');
    if (!formData.email?.trim()) nouvellesErreurs.push('L\'email est obligatoire');
    if (!formData.telephone?.trim()) nouvellesErreurs.push('Le téléphone est obligatoire');
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      nouvellesErreurs.push('Format d\'email invalide');
    }
    
    setErreurs(nouvellesErreurs);
    return nouvellesErreurs.length === 0;
  };

  const handleSauvegarder = async () => {
    if (!validerFormulaire()) return;
    
    setChargement(true);
    try {
      await mettreAJourProfil(formData);
      setModeEdition(false);
    } catch (error) {
      setErreurs(['Erreur lors de la sauvegarde']);
    } finally {
      setChargement(false);
    }
  };

  const handleAnnuler = () => {
    setFormData(utilisateurActuel);
    setModeEdition(false);
    setErreurs([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="bg-boulangerie-or p-6 rounded-2xl text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-alsacien opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-artisan font-bold">
                  {utilisateurActuel.prenom} {utilisateurActuel.nom}
                </h1>
                <p className="text-white/80">
                  Membre depuis {utilisateurActuel.dateCreation.toLocaleDateString('fr-FR', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            {!modeEdition ? (
              <Button
                onClick={() => setModeEdition(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSauvegarder}
                  disabled={chargement}
                  className="bg-white text-boulangerie-or hover:bg-white/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button
                  onClick={handleAnnuler}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Affichage des erreurs */}
      {erreurs.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-artisan font-bold text-boulangerie-bordeaux mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informations personnelles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
                    Prénom
                  </label>
                  {modeEdition ? (
                    <input
                      type="text"
                      value={formData.prenom || ''}
                      onChange={(e) => handleChange('prenom', e.target.value)}
                      className="w-full px-4 py-2 border border-boulangerie-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or"
                    />
                  ) : (
                    <p className="text-boulangerie-bordeaux-light">{utilisateurActuel.prenom}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
                    Nom
                  </label>
                  {modeEdition ? (
                    <input
                      type="text"
                      value={formData.nom || ''}
                      onChange={(e) => handleChange('nom', e.target.value)}
                      className="w-full px-4 py-2 border border-boulangerie-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or"
                    />
                  ) : (
                    <p className="text-boulangerie-bordeaux-light">{utilisateurActuel.nom}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  {modeEdition ? (
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-boulangerie-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or"
                    />
                  ) : (
                    <p className="text-boulangerie-bordeaux-light">{utilisateurActuel.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </label>
                  {modeEdition ? (
                    <input
                      type="tel"
                      value={formData.telephone || ''}
                      onChange={(e) => handleChange('telephone', e.target.value)}
                      className="w-full px-4 py-2 border border-boulangerie-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or"
                    />
                  ) : (
                    <p className="text-boulangerie-bordeaux-light">{utilisateurActuel.telephone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Préférences alimentaires */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-artisan font-bold text-boulangerie-bordeaux mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Préférences alimentaires
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
                    Régime alimentaire
                  </label>
                  {modeEdition ? (
                    <select
                      value={formData.preferences?.regimeAlimentaire || RegimeAlimentaire.OMNIVORE}
                      onChange={(e) => handlePreferenceChange('regimeAlimentaire', e.target.value as RegimeAlimentaire)}
                      className="w-full px-4 py-2 border border-boulangerie-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or"
                    >
                      <option value={RegimeAlimentaire.OMNIVORE}>Omnivore</option>
                      <option value={RegimeAlimentaire.VEGETARIEN}>Végétarien</option>
                      <option value={RegimeAlimentaire.VEGAN}>Vegan</option>
                      <option value={RegimeAlimentaire.SANS_GLUTEN}>Sans gluten</option>
                      <option value={RegimeAlimentaire.HALAL}>Halal</option>
                      <option value={RegimeAlimentaire.CASHER}>Casher</option>
                    </select>
                  ) : (
                    <p className="text-boulangerie-bordeaux-light">
                      {utilisateurActuel.preferences?.regimeAlimentaire || 'Non spécifié'}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
                    Allergies
                  </label>
                  {modeEdition ? (
                    <textarea
                      value={formData.preferences?.allergies?.join(', ') || ''}
                      onChange={(e) => handlePreferenceChange('allergies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      placeholder="Ex: Noix, Lactose, Gluten..."
                      className="w-full px-4 py-2 border border-boulangerie-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or"
                      rows={2}
                    />
                  ) : (
                    <p className="text-boulangerie-bordeaux-light">
                      {utilisateurActuel.preferences?.allergies?.length 
                        ? utilisateurActuel.preferences.allergies.join(', ')
                        : 'Aucune allergie déclarée'
                      }
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Préférences de notification */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-artisan font-bold text-boulangerie-bordeaux mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Préférences de notification
              </h2>
              
              <div className="space-y-3">
                {[
                  { key: 'commandeReady', label: 'Commande prête' },
                  { key: 'promotions', label: 'Promotions et offres spéciales' },
                  { key: 'nouveauxProduits', label: 'Nouveaux produits' },
                  { key: 'email', label: 'Notifications par email' },
                  { key: 'sms', label: 'Notifications par SMS' }
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-boulangerie-bordeaux">{label}</span>
                    {modeEdition ? (
                      <input
                        type="checkbox"
                        checked={formData.preferences?.preferencesNotification?.[key as keyof typeof formData.preferences.preferencesNotification] || false}
                        onChange={(e) => handleNotificationChange(key, e.target.checked)}
                        className="w-4 h-4 text-boulangerie-or bg-gray-100 border-gray-300 rounded focus:ring-boulangerie-or focus:ring-2"
                      />
                    ) : (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        utilisateurActuel.preferences?.preferencesNotification?.[key as keyof typeof utilisateurActuel.preferences.preferencesNotification]
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {utilisateurActuel.preferences?.preferencesNotification?.[key as keyof typeof utilisateurActuel.preferences.preferencesNotification] ? 'Activé' : 'Désactivé'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar avec statistiques */}
        <div className="space-y-6">
          {/* Statistiques */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-artisan font-bold text-boulangerie-bordeaux mb-4">
                Mes statistiques
              </h2>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-boulangerie-or/10 rounded-lg">
                  <div className="text-2xl font-bold text-boulangerie-or">
                    {historique.statistiques.nombreCommandesTotales}
                  </div>
                  <div className="text-sm text-boulangerie-bordeaux-light">
                    Commandes passées
                  </div>
                </div>
                
                <div className="text-center p-4 bg-boulangerie-beige rounded-lg">
                  <div className="text-2xl font-bold text-boulangerie-bordeaux">
                    {historique.statistiques.montantTotalDepense.toFixed(2)}€
                  </div>
                  <div className="text-sm text-boulangerie-bordeaux-light">
                    Montant total dépensé
                  </div>
                </div>
                
                {historique.statistiques.derniere_commande && (
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-green-800">
                      Dernière commande
                    </div>
                    <div className="text-xs text-green-600">
                      {historique.statistiques.derniere_commande.toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Badge de fidélité */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-artisan font-bold text-boulangerie-bordeaux mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Statut de fidélité
              </h2>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-boulangerie-or rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-medium text-boulangerie-bordeaux">
                  {historique.statistiques.nombreCommandesTotales >= 10 
                    ? 'Client Fidèle' 
                    : historique.statistiques.nombreCommandesTotales >= 5 
                      ? 'Client Régulier' 
                      : 'Nouveau Client'
                  }
                </div>
                <div className="text-xs text-boulangerie-bordeaux-light mt-1">
                  {historique.statistiques.nombreCommandesTotales < 10 && (
                    `Plus que ${10 - historique.statistiques.nombreCommandesTotales} commandes pour devenir Client Fidèle`
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
