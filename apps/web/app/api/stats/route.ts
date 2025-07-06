import { NextRequest, NextResponse } from 'next/server'

// Types pour les statistiques
interface StatsProduits {
  total: number
  par_categorie: { [key: string]: number }
  nouveaux: number
  populaires: number
  rupture_stock: number
}

interface StatsCommandes {
  total: number
  ca_total: number
  ca_mois_actuel: number
  par_statut: { [key: string]: number }
  commandes_jour: number
  panier_moyen: number
}

interface StatsContact {
  messages_total: number
  messages_non_lus: number
  par_sujet: { [key: string]: number }
}

// GET - Récupérer les statistiques générales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const periode = searchParams.get('periode') || '30j' // 7j, 30j, 12m
    
    // Simuler des statistiques (à remplacer par de vraies requêtes BDD)
    const statsProduits: StatsProduits = {
      total: 24,
      par_categorie: {
        pain: 8,
        viennoiserie: 6,
        patisserie: 7,
        special: 3
      },
      nouveaux: 3,
      populaires: 5,
      rupture_stock: 2
    }
    
    const statsCommandes: StatsCommandes = {
      total: 156,
      ca_total: 3847.20,
      ca_mois_actuel: 1247.80,
      par_statut: {
        confirmee: 12,
        en_preparation: 8,
        prete: 3,
        livree: 128,
        annulee: 5
      },
      commandes_jour: 7,
      panier_moyen: 24.67
    }
    
    const statsContact: StatsContact = {
      messages_total: 23,
      messages_non_lus: 4,
      par_sujet: {
        commande: 8,
        produits: 6,
        livraison: 4,
        evenement: 3,
        autre: 2
      }
    }
    
    // Données pour les graphiques
    const ventesParJour = [
      { date: '2024-07-01', ventes: 347.20 },
      { date: '2024-07-02', ventes: 289.50 },
      { date: '2024-07-03', ventes: 412.80 },
      { date: '2024-07-04', ventes: 356.70 },
      { date: '2024-07-05', ventes: 398.90 },
      { date: '2024-07-06', ventes: 445.30 }
    ]
    
    const produitsPopulaires = [
      { nom: 'Croissant Artisanal', ventes: 124 },
      { nom: 'Pain de Campagne', ventes: 89 },
      { nom: 'Kouglof Alsacien', ventes: 67 },
      { nom: 'Éclair au Chocolat', ventes: 54 },
      { nom: 'Bretzel Traditionnel', ventes: 43 }
    ]
    
    return NextResponse.json({
      success: true,
      data: {
        produits: statsProduits,
        commandes: statsCommandes,
        contact: statsContact,
        graphiques: {
          ventes_par_jour: ventesParJour,
          produits_populaires: produitsPopulaires
        },
        periode
      }
    })
    
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
