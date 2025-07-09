import { boulangerieAPI } from '../lib/boulangerie-api';

describe('boulangerieAPI.produits', () => {
  it('construit la bonne URL pour getAll sans filtres', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    await boulangerieAPI.produits.getAll();
    expect(global.fetch).toHaveBeenCalledWith('/api/produits', expect.any(Object));
  });

  it('construit la bonne URL pour getAll avec filtres', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    await boulangerieAPI.produits.getAll({ categorie: 'pain', recherche: 'baguette' });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/produits?categorie=pain&recherche=baguette'),
      expect.any(Object)
    );
  });

  it('gère les erreurs réseau', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, json: () => Promise.resolve({ error: 'Erreur test' }) });
    await expect(boulangerieAPI.produits.getAll()).rejects.toThrow('Erreur test');
  });
});
