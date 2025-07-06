import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export function AucunResultat() {
  return (
    <motion.div 
      className="text-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 text-lg mb-2">
        Aucun produit trouvé
      </p>
      <p className="text-gray-400">
        Essayez de modifier vos critères de recherche ou vos filtres
      </p>
    </motion.div>
  );
}
