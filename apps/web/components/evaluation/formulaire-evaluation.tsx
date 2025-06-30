'use client'

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useEvaluation } from '@/hooks/useAnalytics';

interface FormulaireEvaluationProps {
  commandeId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const FormulaireEvaluation: React.FC<FormulaireEvaluationProps> = ({
  commandeId,
  onSuccess,
  onCancel
}) => {
  const [note, setNote] = useState(0);
  const [noteHover, setNoteHover] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [recommandation, setRecommandation] = useState(false);
  const [criteres, setCriteres] = useState({
    qualite: 0,
    service: 0,
    delai: 0,
    presentation: 0
  });

  const { submitEvaluation, isSubmitting, error } = useEvaluation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (note === 0) {
      alert('Veuillez donner une note générale');
      return;
    }

    try {
      await submitEvaluation({
        commande: commandeId,
        note,
        commentaire: commentaire.trim() || undefined,
        criteres: Object.values(criteres).some(c => c > 0) ? criteres : undefined,
        recommandation
      });

      alert('Merci pour votre évaluation !');
      onSuccess?.();
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
    }
  };

  const renderStars = (
    value: number, 
    onChange: (value: number) => void, 
    hover?: number,
    onHover?: (value: number) => void
  ) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => onHover?.(star)}
            onMouseLeave={() => onHover?.(0)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                star <= (hover || value)
                  ? 'text-yellow-500 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Évaluer votre commande</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Note générale */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note générale *
          </label>
          {renderStars(note, setNote, noteHover, setNoteHover)}
          <p className="text-xs text-gray-500 mt-1">
            {note > 0 && (
              note === 1 ? 'Très décevant' :
              note === 2 ? 'Décevant' :
              note === 3 ? 'Correct' :
              note === 4 ? 'Bien' : 'Excellent'
            )}
          </p>
        </div>

        {/* Critères détaillés */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Évaluation détaillée (optionnel)</h3>
          
          {Object.entries({
            qualite: 'Qualité des produits',
            service: 'Qualité du service',
            delai: 'Respect des délais',
            presentation: 'Présentation'
          }).map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm text-gray-600 mb-1">{label}</label>
              {renderStars(
                criteres[key as keyof typeof criteres],
                (value) => setCriteres(prev => ({ ...prev, [key]: value }))
              )}
            </div>
          ))}
        </div>

        {/* Commentaire */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commentaire (optionnel)
          </label>
          <textarea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Partagez votre expérience..."
          />
        </div>

        {/* Recommandation */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="recommandation"
            checked={recommandation}
            onChange={(e) => setRecommandation(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="recommandation" className="ml-2 text-sm text-gray-700">
            Je recommanderais cette boulangerie
          </label>
        </div>

        {/* Boutons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting || note === 0}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Envoi...' : 'Envoyer l\'évaluation'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormulaireEvaluation;
