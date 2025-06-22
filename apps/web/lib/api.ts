// Configuration de base pour l'API Strapi
const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

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

// Types pour les catégories (Strapi 5)
export interface Categorie {
  id: number;
  documentId: string;
  nom: string;
  description?: string;
  slug: string;
  couleur: string;
  icone: string;
  ordre: number;
  image?: {
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: any;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    provider_metadata?: any;
    createdAt: string;
    updatedAt: string;
  }[];
  produits?: Produit[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Types pour les produits (Strapi 5)
export interface Produit {
  id: number;
  documentId: string;
  nom: string;
  description: string;
  prix: number;
  image?: {
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats?: any;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    provider_metadata?: any;
    createdAt: string;
    updatedAt: string;
  }[];
  categorie?: Categorie;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Services API avec fetch natif
export const produitsAPI = {
  // Récupérer tous les produits
  async getAll(): Promise<StrapiResponse<Produit[]>> {
    const url = `${API_URL}/api/produits?populate=*`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  },

  // Récupérer un produit par ID
  async getById(id: number): Promise<StrapiResponse<Produit>> {
    const response = await fetch(`${API_URL}/api/produits/${id}?populate[image]=*&populate[categorie][populate][image]=*`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return response.json();
  },

  // Récupérer les produits par catégorie
  async getByCategory(categoryId: number): Promise<StrapiResponse<Produit[]>> {
    const response = await fetch(`${API_URL}/api/produits?filters[categorie][id][$eq]=${categoryId}&populate[image]=*&populate[categorie][populate][image]=*`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return response.json();
  },
};

export const categoriesAPI = {
  // Récupérer toutes les catégories
  async getAll(): Promise<StrapiResponse<Categorie[]>> {
    const url = `${API_URL}/api/categories?populate=*&sort=ordre:asc,nom:asc`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  },

  // Récupérer une catégorie par ID
  async getById(id: number): Promise<StrapiResponse<Categorie>> {
    const response = await fetch(`${API_URL}/api/categories/${id}?populate=image&populate=produits.image`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return response.json();
  },

  // Récupérer une catégorie par slug
  async getBySlug(slug: string): Promise<StrapiResponse<Categorie[]>> {
    const response = await fetch(`${API_URL}/api/categories?filters[slug][$eq]=${slug}&populate=image&populate=produits.image`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return response.json();
  },
};
