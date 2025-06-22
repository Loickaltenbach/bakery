'use client';

import React, { useState } from 'react';
import { FormulaireConnexion } from './FormulaireConnexion';
import { FormulaireInscription } from './FormulaireInscription';
import { X } from 'lucide-react';

interface ModalAuthProps {
  isOpen: boolean;
  onClose: () => void;
  modeInitial?: 'connexion' | 'inscription';
  onSucces?: () => void;
}

export const ModalAuth: React.FC<ModalAuthProps> = ({
  isOpen,
  onClose,
  modeInitial = 'connexion',
  onSucces
}) => {
  const [mode, setMode] = useState<'connexion' | 'inscription'>(modeInitial);

  if (!isOpen) return null;

  const handleSucces = () => {
    onSucces?.();
    onClose();
  };

  const basculerMode = () => {
    setMode(mode === 'connexion' ? 'inscription' : 'connexion');
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-boulangerie-bordeaux-light bg-opacity-60 z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-4 md:inset-8 lg:inset-16 xl:inset-24 z-50 flex items-center justify-center p-4">
        <div className="bg-boulangerie-cream rounded-2xl shadow-elevation border-4 border-boulangerie-or max-w-2xl w-full max-h-full overflow-y-auto">
          {/* Header */}
          <div className="bg-boulangerie-or p-4 relative">
            <div className="absolute inset-0 bg-pattern-alsacien opacity-20"></div>
            <div className="relative z-10 flex items-center justify-between">
              <h1 className="text-xl font-artisan font-bold text-white">
                {mode === 'connexion' ? 'Connexion' : 'Créer un compte'}
              </h1>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6">
            {mode === 'connexion' ? (
              <FormulaireConnexion
                onSucces={handleSucces}
                onBasculerInscription={basculerMode}
                afficherBasculer={true}
              />
            ) : (
              <FormulaireInscription
                onSucces={handleSucces}
                onBasculerConnexion={basculerMode}
                afficherBasculer={true}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
