import { useState } from 'react';

export function useCategorieFilter() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const selectCategorie = (id: number | null) => {
    setSelectedCategoryId(id);
  };

  const clearSelection = () => {
    setSelectedCategoryId(null);
  };

  return {
    selectedCategoryId,
    selectCategorie,
    clearSelection,
  };
}
