import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { useCommandes } from '../hooks/useCommandes';

describe('useCommandes', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([{ id: 1, statut: 'confirmee', date: '2024-01-01', articles: [], livraison: {}, paiement: {}, total: 10, client: {} }]) });
  });

  it('charge les commandes au montage', async () => {
    const { result } = renderHook(() => useCommandes());
    await waitFor(() => expect(result.current.commandes.length).toBeGreaterThan(0));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('gère les erreurs API', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, json: () => Promise.resolve({ error: 'Erreur test' }) });
    const { result } = renderHook(() => useCommandes());
    await waitFor(() => expect(result.current.error).toBe('Erreur test'));
  });
});
