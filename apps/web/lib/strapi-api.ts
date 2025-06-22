// Client API pour l'authentification avec Strapi
const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

// Types pour les réponses d'authentification
export interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    email: string;
    confirmed: boolean;
    blocked: boolean;
    role: any;
    profile?: any;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
}

export interface LoginData {
  identifier: string; // email pour Strapi
  password: string;
}

// Fonction pour récupérer le token JWT stocké
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

// Headers par défaut avec authentification
function getHeaders(includeAuth = true): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

// API d'authentification
export const authApi = {
  // Inscription
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erreur lors de l\'inscription');
    }

    const result = await response.json();
    
    // Stocker le token
    if (typeof window !== 'undefined' && result.jwt) {
      localStorage.setItem('auth_token', result.jwt);
    }

    return result;
  },

  // Connexion
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/local`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Email ou mot de passe incorrect');
    }

    const result = await response.json();
    
    // Stocker le token
    if (typeof window !== 'undefined' && result.jwt) {
      localStorage.setItem('auth_token', result.jwt);
    }

    return result;
  },

  // Déconnexion
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  // Récupérer le profil utilisateur
  async getProfile(): Promise<any> {
    const response = await fetch(`${API_URL}/api/utilisateurs/me`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du profil');
    }

    return response.json();
  },

  // Mettre à jour le profil utilisateur
  async updateProfile(data: any): Promise<any> {
    const response = await fetch(`${API_URL}/api/utilisateurs/me`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du profil');
    }

    return response.json();
  },

  // Récupérer l'historique des commandes
  async getHistorique(): Promise<any[]> {
    const response = await fetch(`${API_URL}/api/utilisateurs/historique`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de l\'historique');
    }

    return response.json();
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return getAuthToken() !== null;
  },

  // Récupérer le token
  getToken(): string | null {
    return getAuthToken();
  }
};

// API pour les commandes
export const commandeApi = {
  // Créer une commande
  async create(commandeData: any): Promise<any> {
    const response = await fetch(`${API_URL}/api/commandes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ data: commandeData }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création de la commande');
    }

    return response.json();
  },

  // Récupérer les commandes
  async findMany(filters?: any): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined) {
          params.append(key, filters[key]);
        }
      });
    }

    const url = `${API_URL}/api/commandes${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commandes');
    }

    const result = await response.json();
    return result.data || result;
  },

  // Mettre à jour le statut d'une commande
  async updateStatut(commandeId: string, statut: string): Promise<any> {
    const response = await fetch(`${API_URL}/api/commandes/${commandeId}/statut`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ statut }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du statut');
    }

    return response.json();
  },

  // Récupérer les statistiques
  async getStats(filters?: any): Promise<any> {
    const params = new URLSearchParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined) {
          params.append(key, filters[key]);
        }
      });
    }

    const url = `${API_URL}/api/commandes/stats${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des statistiques');
    }

    return response.json();
  }
};

// API pour les produits
export const produitApi = {
  // Récupérer tous les produits
  async findMany(filters?: any): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.categorie) {
      params.append('filters[categorie][id][$eq]', filters.categorie);
    }
    if (filters?.disponible !== undefined) {
      params.append('filters[disponible][$eq]', filters.disponible);
    }
    
    params.append('populate', 'categorie,image');

    const response = await fetch(`${API_URL}/api/produits?${params.toString()}`, {
      headers: getHeaders(false),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des produits');
    }

    const result = await response.json();
    return result.data || result;
  },

  // Récupérer un produit par ID
  async findOne(id: string): Promise<any> {
    const response = await fetch(`${API_URL}/api/produits/${id}?populate=categorie,image`, {
      headers: getHeaders(false),
    });

    if (!response.ok) {
      throw new Error('Produit non trouvé');
    }

    const result = await response.json();
    return result.data || result;
  },

  // Mettre à jour le stock d'un produit (admin seulement)
  async updateStock(id: string, stock: number): Promise<any> {
    const response = await fetch(`${API_URL}/api/produits/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ data: { stock } }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du stock');
    }

    return response.json();
  }
};

// API pour les catégories
export const categorieApi = {
  // Récupérer toutes les catégories
  async findMany(): Promise<any[]> {
    const response = await fetch(`${API_URL}/api/categories?populate=image&sort=ordre:asc`, {
      headers: getHeaders(false),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des catégories');
    }

    const result = await response.json();
    return result.data || result;
  }
};

// API générale pour toutes les entités Strapi
export const strapiApi = {
  // GET générique
  async get(endpoint: string): Promise<any> {
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la requête GET ${endpoint}`);
    }

    return response.json();
  },

  // POST générique
  async post(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la requête POST ${endpoint}`);
    }

    return response.json();
  },

  // PUT générique
  async put(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la requête PUT ${endpoint}`);
    }

    return response.json();
  },

  // DELETE générique
  async delete(endpoint: string): Promise<any> {
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la requête DELETE ${endpoint}`);
    }

    return response.json();
  }
};
