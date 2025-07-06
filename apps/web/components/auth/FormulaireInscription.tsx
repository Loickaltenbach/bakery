'use client';

import React, { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { useAuth } from '../../contexts/AuthContext';
import { InformationsInscription } from '../../lib/auth-types';
import { Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

interface FormulaireInscriptionProps {
  onSucces?: () => void;
  onBasculerConnexion?: () => void;
  afficherBasculer?: boolean;
}

export const FormulaireInscription: React.FC<FormulaireInscriptionProps> = ({
  onSucces,
  onBasculerConnexion,
  afficherBasculer = true
}) => {
  const { inscription, chargementAuth, erreurAuth, effacerErreur } = useAuth();
  
  const [formData, setFormData] = useState<InformationsInscription>({
    email: '',
    password: '',
    confirmationpassword: '',
    nom: '',
    prenom: '',
    telephone: '',
    accepteConditions: false,
    accepteNewsletter: false
  });
  
  const [afficherpassword, setAfficherpassword] = useState(false);
  const [afficherConfirmation, setAfficherConfirmation] = useState(false);
  const [erreurs, setErreurs] = useState<string[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (field: keyof InformationsInscription, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer les erreurs quand l'utilisateur tape
    if (erreurs.length > 0 || erreurAuth) {
      setErreurs([]);
      effacerErreur();
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validerChamp = (field: keyof InformationsInscription): string[] => {
    const erreursChamp: string[] = [];
    
    switch (field) {
      case 'email':
        if (!formData.email.trim()) {
          erreursChamp.push('L\'email est obligatoire');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          erreursChamp.push('Format d\'email invalide');
        }
        break;
        
      case 'password':
        if (!formData.password) {
          erreursChamp.push('Le mot de passe est obligatoire');
        } else {
          if (formData.password.length < 6) {
            erreursChamp.push('Le mot de passe doit contenir au moins 6 caractères');
          }
          if (!/[A-Z]/.test(formData.password)) {
            erreursChamp.push('Le mot de passe doit contenir au moins une majuscule');
          }
          if (!/[0-9]/.test(formData.password)) {
            erreursChamp.push('Le mot de passe doit contenir au moins un chiffre');
          }
        }
        break;
        
      case 'confirmationpassword':
        if (formData.password !== formData.confirmationpassword) {
          erreursChamp.push('Les mots de passe ne correspondent pas');
        }
        break;
        
      case 'nom':
        if (!formData.nom.trim()) {
          erreursChamp.push('Le nom est obligatoire');
        }
        break;
        
      case 'prenom':
        if (!formData.prenom.trim()) {
          erreursChamp.push('Le prénom est obligatoire');
        }
        break;
        
      case 'telephone':
        if (!formData.telephone.trim()) {
          erreursChamp.push('Le téléphone est obligatoire');
        } else if (!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(formData.telephone.replace(/\s/g, ''))) {
          erreursChamp.push('Format de téléphone invalide');
        }
        break;
    }
    
    return erreursChamp;
  };

  const validerFormulaire = (): boolean => {
    const nouvellesErreurs: string[] = [];
    
    // Valider tous les champs
    (Object.keys(formData) as Array<keyof InformationsInscription>).forEach(field => {
      if (field !== 'accepteNewsletter') {
        nouvellesErreurs.push(...validerChamp(field));
      }
    });
    
    // Vérifier l'acceptation des conditions
    if (!formData.accepteConditions) {
      nouvellesErreurs.push('Vous devez accepter les conditions d\'utilisation');
    }
    
    setErreurs(nouvellesErreurs);
    return nouvellesErreurs.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validerFormulaire()) return;
    
    try {
      await inscription(formData);
      onSucces?.();
    } catch (error) {
      // L'erreur est déjà gérée par le contexte
      console.error('Erreur d\'inscription:', error);
    }
  };

  // Vérifier la force du mot de passe
  const obtenirForcepassword = (): { force: number; label: string; couleur: string } => {
    const mdp = formData.password;
    let score = 0;
    
    if (mdp.length >= 6) score++;
    if (mdp.length >= 10) score++;
    if (/[A-Z]/.test(mdp)) score++;
    if (/[a-z]/.test(mdp)) score++;
    if (/[0-9]/.test(mdp)) score++;
    if (/[^A-Za-z0-9]/.test(mdp)) score++;
    
    if (score <= 2) return { force: score, label: 'Faible', couleur: 'bg-red-500' };
    if (score <= 4) return { force: score, label: 'Moyen', couleur: 'bg-yellow-500' };
    return { force: score, label: 'Fort', couleur: 'bg-green-500' };
  };

  const forcepassword = obtenirForcepassword();

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-artisan font-bold text-boulangerie-bordeaux mb-2">
            Créer un compte
          </h2>
          <p className="text-boulangerie-bordeaux-light font-alsacien">
            Rejoignez la communauté de la Boulangerie Alsacienne
          </p>
        </div>

        {/* Affichage des erreurs */}
        {(erreurs.length > 0 || erreurAuth) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">
                {erreurAuth && <div className="mb-1">{erreurAuth}</div>}
                {erreurs.map((erreur, index) => (
                  <div key={index}>• {erreur}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom et Prénom */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
                Nom *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-boulangerie-bordeaux-light" />
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  onBlur={() => handleBlur('nom')}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or focus:border-transparent ${
                    touched.nom && validerChamp('nom').length > 0 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-boulangerie-beige'
                  }`}
                  placeholder="Votre nom"
                  autoComplete="family-name"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
                Prénom *
              </label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => handleChange('prenom', e.target.value)}
                onBlur={() => handleBlur('prenom')}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or focus:border-transparent ${
                  touched.prenom && validerChamp('prenom').length > 0 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-boulangerie-beige'
                }`}
                placeholder="Votre prénom"
                autoComplete="given-name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-boulangerie-bordeaux-light" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or focus:border-transparent ${
                  touched.email && validerChamp('email').length > 0 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-boulangerie-beige'
                }`}
                placeholder="votre.email@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
              Téléphone *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-boulangerie-bordeaux-light" />
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => handleChange('telephone', e.target.value)}
                onBlur={() => handleBlur('telephone')}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or focus:border-transparent ${
                  touched.telephone && validerChamp('telephone').length > 0 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-boulangerie-beige'
                }`}
                placeholder="06 12 34 56 78"
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
              Mot de passe *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-boulangerie-bordeaux-light" />
              <input
                type={afficherpassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or focus:border-transparent ${
                  touched.password && validerChamp('password').length > 0 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-boulangerie-beige'
                }`}
                placeholder="Créez un mot de passe sécurisé"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setAfficherpassword(!afficherpassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-boulangerie-bordeaux-light hover:text-boulangerie-bordeaux"
              >
                {afficherpassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Indicateur de force du mot de passe */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${forcepassword.couleur}`}
                      style={{ width: `${(forcepassword.force / 6) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-boulangerie-bordeaux-light">
                    {forcepassword.label}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirmation mot de passe */}
          <div>
            <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
              Confirmer le mot de passe *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-boulangerie-bordeaux-light" />
              <input
                type={afficherConfirmation ? 'text' : 'password'}
                value={formData.confirmationpassword}
                onChange={(e) => handleChange('confirmationpassword', e.target.value)}
                onBlur={() => handleBlur('confirmationpassword')}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or focus:border-transparent ${
                  touched.confirmationpassword && validerChamp('confirmationpassword').length > 0 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-boulangerie-beige'
                }`}
                placeholder="Confirmez votre mot de passe"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setAfficherConfirmation(!afficherConfirmation)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-boulangerie-bordeaux-light hover:text-boulangerie-bordeaux"
              >
                {afficherConfirmation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Validation visuelle de la confirmation */}
            {formData.confirmationpassword && (
              <div className="mt-1 flex items-center gap-2">
                {formData.password === formData.confirmationpassword ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">Les mots de passe correspondent</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-xs text-red-600">Les mots de passe ne correspondent pas</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Conditions d'utilisation */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="accepteConditions"
                checked={formData.accepteConditions}
                onChange={(e) => handleChange('accepteConditions', e.target.checked)}
                className="w-4 h-4 text-boulangerie-or bg-gray-100 border-gray-300 rounded focus:ring-boulangerie-or focus:ring-2 mt-1"
              />
              <label htmlFor="accepteConditions" className="text-sm text-boulangerie-bordeaux">
                J'accepte les{' '}
                <a href="#" className="text-boulangerie-or hover:underline">
                  conditions d'utilisation
                </a>{' '}
                et la{' '}
                <a href="#" className="text-boulangerie-or hover:underline">
                  politique de confidentialité
                </a>
                {' '}<span className="text-red-500">*</span>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="accepteNewsletter"
                checked={formData.accepteNewsletter}
                onChange={(e) => handleChange('accepteNewsletter', e.target.checked)}
                className="w-4 h-4 text-boulangerie-or bg-gray-100 border-gray-300 rounded focus:ring-boulangerie-or focus:ring-2 mt-1"
              />
              <label htmlFor="accepteNewsletter" className="text-sm text-boulangerie-bordeaux">
                Je souhaite recevoir des informations sur les nouveautés et promotions
              </label>
            </div>
          </div>

          {/* Bouton d'inscription */}
          <Button
            type="submit"
            disabled={chargementAuth}
            className="w-full btn-boulangerie-primary py-3"
          >
            {chargementAuth ? 'Création du compte...' : 'Créer mon compte'}
          </Button>
        </form>

        {/* Lien vers connexion */}
        {afficherBasculer && onBasculerConnexion && (
          <div className="mt-6 text-center">
            <p className="text-sm text-boulangerie-bordeaux-light">
              Déjà un compte ?{' '}
              <button
                type="button"
                onClick={onBasculerConnexion}
                className="text-boulangerie-or font-medium hover:underline"
              >
                Se connecter
              </button>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
