// Utilitaires pour les fonctions de formatage et autres fonctions communes

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date));
}

export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

export function formatNumber(number: number, minimumFractionDigits: number = 0): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits,
    maximumFractionDigits: 2
  }).format(number);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}

export function calculerTempsEcoule(dateDebut: Date | string): string {
  const maintenant = new Date();
  const debut = new Date(dateDebut);
  const diffMs = maintenant.getTime() - debut.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const heures = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  if (heures > 0) {
    return `${heures}h ${minutes}min`;
  }
  return `${minutes}min`;
}

export function calculerTempsRestant(dateFin: Date | string): string {
  const maintenant = new Date();
  const fin = new Date(dateFin);
  const diffMs = fin.getTime() - maintenant.getTime();
  
  if (diffMs <= 0) return 'En retard';
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const heures = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  if (heures > 0) {
    return `${heures}h ${minutes}min`;
  }
  return `${minutes}min`;
}

export function obtenirSalutation(): string {
  const heure = new Date().getHours();
  
  if (heure < 12) {
    return 'Bonjour';
  } else if (heure < 18) {
    return 'Bon après-midi';
  } else {
    return 'Bonsoir';
  }
}

export function genererIdUnique(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function capitaliserMot(mot: string): string {
  return mot.charAt(0).toUpperCase() + mot.slice(1).toLowerCase();
}

export function capitaliserPhrase(phrase: string): string {
  return phrase
    .split(' ')
    .map(mot => capitaliserMot(mot))
    .join(' ');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
