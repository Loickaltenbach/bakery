// Service API pour la boulangerie
class BoulangerieAPI {
  private baseURL = '/api'

  // Méthode utilitaire pour les requêtes
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur réseau' }))
        throw new Error(errorData.error || `Erreur ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error(`Erreur API ${endpoint}:`, error)
      throw error
    }
  }

  // API Produits
  produits = {
    // Récupérer tous les produits avec filtres
    getAll: (filters?: {
      categorie?: string
      recherche?: string
      prixMin?: number
      prixMax?: number
      noteMin?: number
      disponible?: boolean
    }) => {
      const params = new URLSearchParams()
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString())
          }
        })
      }
      
      const query = params.toString()
      return this.request(`/produits${query ? `?${query}` : ''}`)
    },

    // Récupérer un produit par ID
    getById: (id: number) => this.request(`/produits/${id}`),

    // Créer un nouveau produit
    create: (produit: any) => this.request('/produits', {
      method: 'POST',
      body: JSON.stringify(produit),
    }),

    // Mettre à jour un produit
    update: (id: number, produit: any) => this.request(`/produits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(produit),
    }),

    // Supprimer un produit
    delete: (id: number) => this.request(`/produits/${id}`, {
      method: 'DELETE',
    }),
  }

  // API Commandes
  commandes = {
    // Récupérer toutes les commandes
    getAll: (filters?: {
      statut?: string
      client?: string
      dateDebut?: string
      dateFin?: string
    }) => {
      const params = new URLSearchParams()
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString())
          }
        })
      }
      
      const query = params.toString()
      return this.request(`/commandes${query ? `?${query}` : ''}`)
    },

    // Récupérer une commande par ID
    getById: (id: string) => this.request(`/commandes/${id}`),

    // Créer une nouvelle commande
    create: (commande: any) => this.request('/commandes', {
      method: 'POST',
      body: JSON.stringify(commande),
    }),

    // Mettre à jour le statut d'une commande
    updateStatus: (id: string, statut: string, message?: string) => 
      this.request(`/commandes/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ statut, message }),
      }),

    // Annuler une commande
    cancel: (id: string) => this.request(`/commandes/${id}`, {
      method: 'DELETE',
    }),
  }

  // API Contact
  contact = {
    // Envoyer un message
    send: (message: {
      nom: string
      email: string
      sujet: string
      message: string
    }) => this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(message),
    }),

    // Récupérer tous les messages (admin)
    getAll: (filters?: {
      statut?: string
      sujet?: string
    }) => {
      const params = new URLSearchParams()
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString())
          }
        })
      }
      
      const query = params.toString()
      return this.request(`/contact${query ? `?${query}` : ''}`)
    },
  }

  // API Catégories
  categories = {
    // Récupérer toutes les catégories
    getAll: (actifOnly = true) => 
      this.request(`/categories${actifOnly ? '?actif=true' : ''}`),

    // Créer une catégorie
    create: (categorie: {
      nom: string
      description: string
      icon?: string
    }) => this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categorie),
    }),
  }

  // API Statistiques
  stats = {
    // Récupérer les statistiques générales
    getAll: (periode = '30j') => this.request(`/stats?periode=${periode}`),
  }
}

// Instance singleton
export const boulangerieAPI = new BoulangerieAPI()

// Types pour TypeScript
export interface Produit {
  id: number
  nom: string
  prix: number
  description: string
  categorie: string
  note: number
  temps_preparation: string
  image?: string
  nouveau?: boolean
  populaire?: boolean
  tags: string[]
  disponible: boolean
  stock?: number
}

export interface Commande {
  id: string
  date: string
  statut: 'confirmee' | 'en_preparation' | 'prete' | 'livree' | 'annulee'
  total: number
  articles: ArticleCommande[]
  client: {
    nom: string
    email: string
    telephone?: string
  }
  livraison: {
    type: 'retrait' | 'livraison'
    adresse: string
    creneau: string
    instructions?: string
  }
  paiement: {
    methode: 'carte' | 'especes' | 'cheque'
    statut: 'en_attente' | 'paye' | 'rembourse'
  }
}

export interface ArticleCommande {
  produitId: number
  nom: string
  prix: number
  quantite: number
  total: number
}

export interface MessageContact {
  id: string
  nom: string
  email: string
  sujet: string
  message: string
  date: string
  statut: 'nouveau' | 'lu' | 'repondu' | 'ferme'
  reponse?: string
  dateReponse?: string
}

export interface Categorie {
  id: string
  nom: string
  description: string
  icon: string
  produits_count: number
  actif: boolean
}

export default boulangerieAPI
