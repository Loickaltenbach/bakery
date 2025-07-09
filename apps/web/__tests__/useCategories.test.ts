import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { useCategories } from '../hooks/useCategories';

describe('useCategories', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([{ id: 'pain', nom: 'Pain', icon: '🍞', description: '', produits_count: 0, actif: true }]) });
  });

  it('charge les catégories au montage', async () => {
    const { result } = renderHook(() => useCategories());
    await waitFor(() => expect(result.current.categories.length).toBeGreaterThan(0));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('gère les erreurs API', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, json: () => Promise.resolve({ error: 'Erreur test' }) });
    const { result } = renderHook(() => useCategories());
    await waitFor(() => expect(result.current.error).toBe('Erreur test'));
  });
});
