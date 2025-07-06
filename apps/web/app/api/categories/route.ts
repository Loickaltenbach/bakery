import { NextRequest, NextResponse } from 'next/server'

// Types pour les catégories
interface Categorie {
  id: string
  nom: string
  description: string
  icon: string
  produits_count: number
  actif: boolean
}

// Données des catégories
const categories: Categorie[] = [
  {
    id: "pain",
    nom: "Pains",
    description: "Pains artisanaux au levain et traditions françaises",
    icon: "🍞",
    produits_count: 8,
    actif: true
  },
  {
    id: "viennoiserie", 
    nom: "Viennoiseries",
    description: "Croissants, pains au chocolat et autres délices feuilletés",
    icon: "🥐",
    produits_count: 12,
    actif: true
  },
  {
    id: "patisserie",
    nom: "Pâtisseries", 
    description: "Gâteaux, tartes et créations sucrées de notre chef pâtissier",
    icon: "🧁",
    produits_count: 15,
    actif: true
  },
  {
    id: "special",
    nom: "Spécialités Alsaciennes",
    description: "Kouglof, bretzels et autres traditions alsaciennes",
    icon: "🥨",
    produits_count: 6,
    actif: true
  },
  {
    id: "saisonnier",
    nom: "Produits Saisonniers",
    description: "Créations selon les saisons et les fêtes",
    icon: "🌟",
    produits_count: 4,
    actif: true
  }
]

// GET - Récupérer toutes les catégories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const actifOnly = searchParams.get('actif')
    
    let categoriesFiltrees = [...categories]
    
    // Filtrer par statut actif si demandé
    if (actifOnly === 'true') {
      categoriesFiltrees = categoriesFiltrees.filter(c => c.actif)
    }
    
    return NextResponse.json({
      success: true,
      data: categoriesFiltrees,
      total: categoriesFiltrees.length
    })
    
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle catégorie (admin seulement)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { nom, description, icon } = body
    
    if (!nom || !description) {
      return NextResponse.json(
        { success: false, error: 'Nom et description obligatoires' },
        { status: 400 }
      )
    }
    
    // Générer un ID basé sur le nom
    const id = nom.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Enlever les accents
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
    
    // Vérifier si l'ID existe déjà
    if (categories.find(c => c.id === id)) {
      return NextResponse.json(
        { success: false, error: 'Une catégorie avec ce nom existe déjà' },
        { status: 400 }
      )
    }
    
    const nouvelleCategorie: Categorie = {
      id,
      nom,
      description,
      icon: icon || "📦",
      produits_count: 0,
      actif: true
    }
    
    categories.push(nouvelleCategorie)
    
    return NextResponse.json({
      success: true,
      data: nouvelleCategorie,
      message: 'Catégorie créée avec succès'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
