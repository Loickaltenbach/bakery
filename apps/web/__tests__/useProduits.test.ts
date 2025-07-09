import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { useProduits } from '../hooks/useProduits';

describe('useProduits', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([{ id: 1, nom: 'Test', description: '', categorie: 'pain', tags: [] }]) });
  });

  it('charge les produits au montage', async () => {
    const { result } = renderHook(() => useProduits());
    await waitFor(() => expect(result.current.produits.length).toBeGreaterThan(0));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('gère les erreurs API', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, json: () => Promise.resolve({ error: 'Erreur test' }) });
    const { result } = renderHook(() => useProduits());
    await waitFor(() => expect(result.current.error).toBe('Erreur test'));
  });
});
