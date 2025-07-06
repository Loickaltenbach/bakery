import { NextRequest, NextResponse } from 'next/server'

// Types pour les commandes
interface ArticleCommande {
  produitId: number
  nom: string
  prix: number
  quantite: number
  total: number
}

interface Commande {
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

// Données de démonstration
const commandes: Commande[] = [
  {
    id: "CMD-2024-001",
    date: "2024-07-01T08:30:00Z",
    statut: "livree",
    total: 24.80,
    articles: [
      { produitId: 1, nom: "Croissants", prix: 1.20, quantite: 6, total: 7.20 },
      { produitId: 2, nom: "Pain de campagne", prix: 3.50, quantite: 1, total: 3.50 },
      { produitId: 3, nom: "Kouglof alsacien", prix: 8.90, quantite: 1, total: 8.90 },
      { produitId: 6, nom: "Tarte aux pommes", prix: 5.20, quantite: 1, total: 5.20 }
    ],
    client: {
      nom: "Marie Dupont",
      email: "marie.dupont@email.com",
      telephone: "06 12 34 56 78"
    },
    livraison: {
      type: "retrait",
      adresse: "Boulangerie - 123 Rue de la Boulangerie",
      creneau: "8h30 - 9h00"
    },
    paiement: {
      methode: "carte",
      statut: "paye"
    }
  },
  {
    id: "CMD-2024-002",
    date: "2024-07-02T14:15:00Z",
    statut: "en_preparation",
    total: 18.40,
    articles: [
      { produitId: 7, nom: "Pain aux noix", prix: 4.20, quantite: 1, total: 4.20 },
      { produitId: 5, nom: "Bretzels", prix: 1.80, quantite: 4, total: 7.20 },
      { produitId: 4, nom: "Éclair au chocolat", prix: 3.50, quantite: 2, total: 7.00 }
    ],
    client: {
      nom: "Pierre Martin", 
      email: "pierre.martin@email.com"
    },
    livraison: {
      type: "livraison",
      adresse: "15 Avenue des Vosges, 67000 Strasbourg",
      creneau: "14h00 - 16h00"
    },
    paiement: {
      methode: "carte",
      statut: "paye"
    }
  }
]

// GET - Récupérer toutes les commandes avec filtres
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const statut = searchParams.get('statut')
    const clientEmail = searchParams.get('client')
    const dateDebut = searchParams.get('dateDebut')
    const dateFin = searchParams.get('dateFin')
    
    let commandesFiltrees = [...commandes]
    
    // Filtrer par statut
    if (statut && statut !== 'tous') {
      commandesFiltrees = commandesFiltrees.filter(c => c.statut === statut)
    }
    
    // Filtrer par client
    if (clientEmail) {
      commandesFiltrees = commandesFiltrees.filter(c => 
        c.client.email.toLowerCase().includes(clientEmail.toLowerCase())
      )
    }
    
    // Filtrer par date
    if (dateDebut) {
      commandesFiltrees = commandesFiltrees.filter(c => 
        new Date(c.date) >= new Date(dateDebut)
      )
    }
    if (dateFin) {
      commandesFiltrees = commandesFiltrees.filter(c => 
        new Date(c.date) <= new Date(dateFin)
      )
    }
    
    // Trier par date (plus récent en premier)
    commandesFiltrees.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    return NextResponse.json({
      success: true,
      data: commandesFiltrees,
      total: commandesFiltrees.length
    })
    
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle commande
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données
    const { articles, client, livraison, paiement } = body
    
    if (!articles || !client || !livraison) {
      return NextResponse.json(
        { success: false, error: 'Données manquantes' },
        { status: 400 }
      )
    }
    
    // Calculer le total
    const total = articles.reduce((sum: number, article: ArticleCommande) => 
      sum + (article.prix * article.quantite), 0
    )
    
    // Générer un ID unique
    const now = new Date()
    const commandeId = `CMD-${now.getFullYear()}-${String(commandes.length + 1).padStart(3, '0')}`
    
    // Créer la commande
    const nouvelleCommande: Commande = {
      id: commandeId,
      date: now.toISOString(),
      statut: 'confirmee',
      total: Math.round(total * 100) / 100, // Arrondir à 2 décimales
      articles: articles.map((article: ArticleCommande) => ({
        ...article,
        total: Math.round(article.prix * article.quantite * 100) / 100
      })),
      client,
      livraison,
      paiement: paiement || { methode: 'carte', statut: 'en_attente' }
    }
    
    // Ajouter à la liste (en production, sauvegarder en BDD)
    commandes.push(nouvelleCommande)
    
    return NextResponse.json({
      success: true,
      data: nouvelleCommande,
      message: 'Commande créée avec succès'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
