'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { usePaiement } from '../../contexts/PaiementContext';
import { Facture, StatutFacture } from '../../lib/paiement-types';
import { formaterPrix } from '../../lib/panier-utils';
import { 
  FileText, 
  Download, 
  Mail, 
  CheckCircle, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

interface FactureComponentProps {
  commandeId: string;
  emailClient: string;
  onFactureGenerated?: (facture: Facture) => void;
}

export function FactureComponent({ 
  commandeId, 
  emailClient, 
  onFactureGenerated 
}: FactureComponentProps) {
  const { genererFacture, envoyerFacture } = usePaiement();
  const [facture, setFacture] = useState<Facture | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (commandeId) {
      handleGenererFacture();
    }
  }, [commandeId]);

  const handleGenererFacture = async () => {
    setIsGenerating(true);
    setErreur(null);

    try {
      const nouvelleFacture = await genererFacture(commandeId);
      setFacture(nouvelleFacture);
      onFactureGenerated?.(nouvelleFacture);
    } catch (error) {
      setErreur('Erreur lors de la génération de la facture');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnvoyerFacture = async () => {
    if (!facture) return;

    setIsSending(true);
    setErreur(null);

    try {
      const succes = await envoyerFacture(facture.id, emailClient);
      if (succes) {
        setEmailSent(true);
        setFacture(prev => prev ? {
          ...prev,
          emailEnvoye: true,
          dateEnvoi: new Date(),
          statut: StatutFacture.ENVOYEE
        } : null);
      } else {
        setErreur('Erreur lors de l\'envoi de la facture');
      }
    } catch (error) {
      setErreur('Erreur lors de l\'envoi de la facture');
    } finally {
      setIsSending(false);
    }
  };

  const simulerTelechargement = () => {
    if (!facture) return;
    
    // Simulation du téléchargement d'une facture PDF
    const contenuFacture = `
FACTURE ${facture.numero}

Date d'émission: ${facture.dateEmission.toLocaleDateString('fr-FR')}
Commande: ${facture.commandeId}

Montant HT: ${formaterPrix(facture.montantHT)}
TVA (${(facture.tauxTVA * 100).toFixed(1)}%): ${formaterPrix(facture.montantTTC - facture.montantHT)}
Montant TTC: ${formaterPrix(facture.montantTTC)}

Boulangerie Artisanale
123 Rue de la Boulangerie
67000 Strasbourg
    `.trim();

    const blob = new Blob([contenuFacture], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facture-${facture.numero}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isGenerating) {
    return (
      <Card className="card-boulangerie">
        <CardContent className="p-6 text-center">
          <Clock className="w-12 h-12 text-boulangerie-or mx-auto mb-4 animate-spin" />
          <p className="text-boulangerie-bordeaux">
            Génération de la facture en cours...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!facture) {
    return (
      <Card className="card-boulangerie">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-boulangerie-bordeaux-light mx-auto mb-4" />
          <p className="text-boulangerie-bordeaux mb-4">
            Erreur lors de la génération de la facture
          </p>
          <Button 
            onClick={handleGenererFacture}
            className="btn-boulangerie-primary"
          >
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-boulangerie">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-boulangerie-bordeaux">
          <FileText className="w-5 h-5 text-boulangerie-or" />
          Facture générée
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Informations de la facture */}
          <div className="bg-boulangerie-beige p-4 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-boulangerie-bordeaux-light">Numéro de facture</p>
                <p className="font-medium text-boulangerie-bordeaux">{facture.numero}</p>
              </div>
              <div>
                <p className="text-boulangerie-bordeaux-light">Date d'émission</p>
                <p className="font-medium text-boulangerie-bordeaux">
                  {facture.dateEmission.toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-boulangerie-bordeaux-light">Montant HT</p>
                <p className="font-medium text-boulangerie-bordeaux">
                  {formaterPrix(facture.montantHT)}
                </p>
              </div>
              <div>
                <p className="text-boulangerie-bordeaux-light">Montant TTC</p>
                <p className="font-bold text-boulangerie-or text-lg">
                  {formaterPrix(facture.montantTTC)}
                </p>
              </div>
            </div>
          </div>

          {/* Statut */}
          <div className="flex items-center gap-2">
            {facture.statut === StatutFacture.EMISE && (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-600 font-medium">Facture émise</span>
              </>
            )}
            {facture.statut === StatutFacture.ENVOYEE && (
              <>
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span className="text-blue-600 font-medium">Facture envoyée par email</span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={simulerTelechargement}
              variant="secondary"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger la facture
            </Button>

            <div className="relative">
              <Button
                onClick={handleEnvoyerFacture}
                disabled={isSending || emailSent}
                className="w-full btn-boulangerie-primary"
              >
                {isSending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : emailSent ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Facture envoyée à {emailClient}
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Envoyer par email à {emailClient}
                  </>
                )}
              </Button>
            </div>

            {emailSent && facture.dateEnvoi && (
              <div className="text-center text-sm text-green-600">
                Envoyée le {facture.dateEnvoi.toLocaleDateString('fr-FR')} à {facture.dateEnvoi.toLocaleTimeString('fr-FR')}
              </div>
            )}
          </div>

          {/* Message d'erreur */}
          {erreur && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-600">{erreur}</span>
            </div>
          )}

          {/* Informations légales */}
          <div className="text-xs text-boulangerie-bordeaux-light bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">Boulangerie Artisanale</p>
            <p>123 Rue de la Boulangerie, 67000 Strasbourg</p>
            <p>SIRET: 12345678901234 - TVA: FR12345678901</p>
            <p>Dispensé d'immatriculation au RCS et au RM</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
