import { NextRequest, NextResponse } from 'next/server'

// GET - Récupérer un produit spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    // Simuler une requête BDD (à remplacer par une vraie requête)
    const produits = [
      {
        id: 1,
        nom: "Croissant Artisanal",
        prix: 1.20,
        description: "Croissant pur beurre, feuilletage traditionnel selon la méthode française",
        categorie: "viennoiserie",
        note: 4.8,
        temps_preparation: "15min",
        nouveau: true,
        tags: ["pur beurre", "traditionnel", "croustillant", "français"],
        disponible: true,
        stock: 24,
        ingredients: ["Farine de blé", "Beurre AOP", "Lait", "Œufs", "Sucre", "Sel", "Levure"],
        allergenes: ["Gluten", "Lait", "Œufs"],
        valeurs_nutritionnelles: {
          calories: 406,
          proteines: 8.2,
          glucides: 42.1,
          lipides: 22.4,
          fibres: 2.1
        }
      },
      // Ajouter d'autres produits...
    ]
    
    const produit = produits.find(p => p.id === id)
    
    if (!produit) {
      return NextResponse.json(
        { success: false, error: 'Produit non trouvé' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: produit
    })
    
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un produit
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    
    // Ici vous mettriez à jour le produit en base de données
    
    return NextResponse.json({
      success: true,
      data: { id, ...body },
      message: 'Produit mis à jour avec succès'
    })
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un produit
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    // Ici vous supprimeriez le produit de la base de données
    
    return NextResponse.json({
      success: true,
      message: 'Produit supprimé avec succès'
    })
    
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
