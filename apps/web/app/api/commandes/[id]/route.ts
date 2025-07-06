import { NextRequest, NextResponse } from 'next/server'

// GET - Récupérer une commande spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commandeId = params.id
    
    // Simuler une requête BDD
    const commande = {
      id: commandeId,
      date: "2024-07-01T08:30:00Z",
      statut: "livree",
      total: 24.80,
      articles: [
        { produitId: 1, nom: "Croissants", prix: 1.20, quantite: 6, total: 7.20 },
        { produitId: 2, nom: "Pain de campagne", prix: 3.50, quantite: 1, total: 3.50 }
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
      },
      historique: [
        { date: "2024-07-01T08:00:00Z", statut: "confirmee", message: "Commande confirmée" },
        { date: "2024-07-01T08:15:00Z", statut: "en_preparation", message: "Commande en préparation" },
        { date: "2024-07-01T08:30:00Z", statut: "prete", message: "Commande prête pour retrait" },
        { date: "2024-07-01T08:35:00Z", statut: "livree", message: "Commande récupérée" }
      ]
    }
    
    return NextResponse.json({
      success: true,
      data: commande
    })
    
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour le statut d'une commande
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commandeId = params.id
    const body = await request.json()
    
    const { statut, message } = body
    
    if (!statut) {
      return NextResponse.json(
        { success: false, error: 'Statut requis' },
        { status: 400 }
      )
    }
    
    // Ici vous mettriez à jour la commande en base de données
    
    return NextResponse.json({
      success: true,
      data: { id: commandeId, statut, message },
      message: 'Commande mise à jour avec succès'
    })
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Annuler une commande
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commandeId = params.id
    
    // Ici vous mettriez à jour le statut à "annulee" en base de données
    
    return NextResponse.json({
      success: true,
      message: 'Commande annulée avec succès'
    })
    
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la commande:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
