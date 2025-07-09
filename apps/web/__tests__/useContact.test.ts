import { renderHook, act } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { useContact } from '../hooks/useContact';

describe('useContact', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
  });

  it('envoie un message et met success à true', async () => {
    const { result } = renderHook(() => useContact());
    await act(async () => {
      await result.current.envoyerMessage({ nom: 'Test', email: 'test@email.com', sujet: 'Sujet', message: 'Coucou' });
    });
    expect(result.current.success).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('gère les erreurs API', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, json: () => Promise.resolve({ error: 'Erreur test' }) });
    const { result } = renderHook(() => useContact());
    await act(async () => {
      await result.current.envoyerMessage({ nom: 'Test', email: 'test@email.com', sujet: 'Sujet', message: 'Coucou' });
    });
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe('Erreur test');
    expect(result.current.loading).toBe(false);
  });
});
