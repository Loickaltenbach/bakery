// apps/web/__tests__/validation-utils.test.ts
import { validerEmail, validerTelephone, validerPassword, validerNomPrenom } from '../lib/validation-utils';

describe('validation-utils (KISS)', () => {
  it('valide un email correct', () => {
    expect(validerEmail('test@email.com').valide).toBe(true);
    expect(validerEmail('test').valide).toBe(false);
  });

  it('valide un téléphone français', () => {
    expect(validerTelephone('0612345678').valide).toBe(true);
    expect(validerTelephone('1234').valide).toBe(false);
  });

  it('valide un mot de passe fort', () => {
    expect(validerPassword('Abcdef12').valide).toBe(true);
    expect(validerPassword('abc').valide).toBe(false);
  });

  it('valide nom et prénom', () => {
    expect(validerNomPrenom('Jean', 'Dupont').valide).toBe(true);
    expect(validerNomPrenom('', '').valide).toBe(false);
  });
});
