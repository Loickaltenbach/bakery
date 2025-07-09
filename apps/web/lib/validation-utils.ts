// apps/web/lib/validation-utils.ts
// Centralisation des fonctions de validation KISS

export function validerEmail(email: string): { valide: boolean; erreur?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return { valide: false, erreur: "L'email est obligatoire" };
  if (!emailRegex.test(email)) return { valide: false, erreur: "L'email n'est pas valide" };
  return { valide: true };
}

export function validerTelephone(telephone: string): { valide: boolean; erreur?: string } {
  const telRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  if (!telephone.trim()) return { valide: false, erreur: "Le téléphone est obligatoire" };
  if (!telRegex.test(telephone.replace(/\s/g, ''))) return { valide: false, erreur: "Le numéro de téléphone n'est pas valide" };
  return { valide: true };
}

export function validerPassword(password: string): { valide: boolean; erreurs: string[] } {
  const erreurs: string[] = [];
  if (!password || password.length < 8) erreurs.push('Le mot de passe doit contenir au moins 8 caractères');
  if (!/[A-Z]/.test(password)) erreurs.push('Le mot de passe doit contenir une majuscule');
  if (!/[a-z]/.test(password)) erreurs.push('Le mot de passe doit contenir une minuscule');
  if (!/[0-9]/.test(password)) erreurs.push('Le mot de passe doit contenir un chiffre');
  return { valide: erreurs.length === 0, erreurs };
}

export function validerNomPrenom(nom: string, prenom: string): { valide: boolean; erreurs: string[] } {
  const erreurs: string[] = [];
  if (!nom.trim()) erreurs.push('Le nom est obligatoire');
  if (!prenom.trim()) erreurs.push('Le prénom est obligatoire');
  return { valide: erreurs.length === 0, erreurs };
}
