import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface FiltresAvancesProps {
  afficherFiltres: boolean;
  filtresPrix: { min: number; max: number };
  setFiltresPrix: (filtres: { min: number; max: number }) => void;
  filtresNote: number;
  setFiltresNote: (note: number) => void;
  reinitialiserFiltres: () => void;
}

export function FiltresAvances({
  afficherFiltres,
  filtresPrix,
  setFiltresPrix,
  filtresNote,
  setFiltresNote,
  reinitialiserFiltres
}: FiltresAvancesProps) {
  if (!afficherFiltres) return null;

  return (
    <motion.div 
      className="bg-boulangerie-beige rounded-2xl p-6 mb-8"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
    >
      <h3 className="text-lg font-semibold text-boulangerie-bordeaux mb-6">Filtres avancés</h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Filtre prix */}
        <div>
          <label className="block text-sm font-medium text-boulangerie-bordeaux mb-3">
            Prix (€)
          </label>
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Min"
                value={filtresPrix.min}
                onChange={(e) => setFiltresPrix({ ...filtresPrix, min: Number(e.target.value) })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={filtresPrix.max}
                onChange={(e) => setFiltresPrix({ ...filtresPrix, max: Number(e.target.value) })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Filtre note */}
        <div>
          <label className="block text-sm font-medium text-boulangerie-bordeaux mb-3">
            Note minimum
          </label>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((note) => (
              <button
                key={note}
                onClick={() => setFiltresNote(note)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                  filtresNote === note
                    ? "bg-boulangerie-bordeaux text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Star className="w-3 h-3" />
                {note === 0 ? "Toutes" : `${note}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Réinitialiser */}
        <div className="flex items-end">
          <button
            onClick={reinitialiserFiltres}
            className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </motion.div>
  );
}
