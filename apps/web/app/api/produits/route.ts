import { NextRequest, NextResponse } from 'next/server'

// Types pour les produits
interface Produit {
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

// Données de démonstration (à remplacer par une vraie base de données)
const produits: Produit[] = [
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
    stock: 24
  },
  {
    id: 2,
    nom: "Pain de Campagne au Levain",
    prix: 3.50,
    description: "Pain au levain naturel, croûte dorée, mie alvéolée",
    categorie: "pain",
    note: 4.9,
    temps_preparation: "24h",
    populaire: true,
    tags: ["levain", "artisanal", "bio", "tradition"],
    disponible: true,
    stock: 12
  },
  {
    id: 3,
    nom: "Kouglof Alsacien Traditionnel",
    prix: 8.90,
    description: "Spécialité alsacienne aux raisins secs et amandes, recette familiale",
    categorie: "special",
    note: 4.7,
    temps_preparation: "3h",
    tags: ["alsacien", "raisins", "amandes", "tradition", "familial"],
    disponible: true,
    stock: 8
  },
  {
    id: 4,
    nom: "Éclair au Chocolat",
    prix: 4.20,
    description: "Pâte à choux, crème pâtissière vanille, glaçage chocolat noir",
    categorie: "patisserie",
    note: 4.6,
    temps_preparation: "30min",
    tags: ["chocolat", "crème", "classique", "pâtisserie"],
    disponible: true,
    stock: 15
  },
  {
    id: 5,
    nom: "Bretzel Traditionnel",
    prix: 1.80,
    description: "Bretzel alsacien au gros sel, pâte traditionnelle",
    categorie: "special",
    note: 4.5,
    temps_preparation: "45min",
    tags: ["alsacien", "salé", "tradition", "apéritif"],
    disponible: true,
    stock: 20
  },
  {
    id: 6,
    nom: "Tarte aux Mirabelles",
    prix: 12.50,
    description: "Pâte sablée maison, mirabelles de Lorraine, crème vanille",
    categorie: "patisserie",
    note: 4.8,
    temps_preparation: "1h",
    tags: ["mirabelles", "saisonnier", "lorraine", "crème"],
    disponible: true,
    stock: 6
  },
  {
    id: 7,
    nom: "Pain aux Noix",
    prix: 4.20,
    description: "Pain de campagne aux cerneaux de noix, farine T80",
    categorie: "pain",
    note: 4.4,
    temps_preparation: "2h",
    tags: ["noix", "campagne", "bio", "T80"],
    disponible: true,
    stock: 10
  },
  {
    id: 8,
    nom: "Chausson aux Pommes",
    prix: 3.80,
    description: "Pâte feuilletée, compotée de pommes maison, cannelle",
    categorie: "viennoiserie",
    note: 4.3,
    temps_preparation: "20min",
    tags: ["pommes", "cannelle", "feuilletée", "compotée"],
    disponible: true,
    stock: 18
  }
]

// GET - Récupérer tous les produits ou filtrer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Paramètres de filtrage
    const categorie = searchParams.get('categorie')
    const recherche = searchParams.get('recherche')
    const prixMin = searchParams.get('prixMin')
    const prixMax = searchParams.get('prixMax')
    const noteMin = searchParams.get('noteMin')
    const disponibleOnly = searchParams.get('disponible')
    
    let produitsFiltres = [...produits]
    
    // Filtrer par catégorie
    if (categorie && categorie !== 'tous') {
      produitsFiltres = produitsFiltres.filter(p => p.categorie === categorie)
    }
    
    // Filtrer par recherche (nom, description, tags)
    if (recherche) {
      const rechercheLC = recherche.toLowerCase()
      produitsFiltres = produitsFiltres.filter(p => 
        p.nom.toLowerCase().includes(rechercheLC) ||
        p.description.toLowerCase().includes(rechercheLC) ||
        p.tags.some(tag => tag.toLowerCase().includes(rechercheLC))
      )
    }
    
    // Filtrer par prix
    if (prixMin) {
      produitsFiltres = produitsFiltres.filter(p => p.prix >= parseFloat(prixMin))
    }
    if (prixMax) {
      produitsFiltres = produitsFiltres.filter(p => p.prix <= parseFloat(prixMax))
    }
    
    // Filtrer par note
    if (noteMin) {
      produitsFiltres = produitsFiltres.filter(p => p.note >= parseFloat(noteMin))
    }
    
    // Filtrer par disponibilité
    if (disponibleOnly === 'true') {
      produitsFiltres = produitsFiltres.filter(p => p.disponible && (p.stock || 0) > 0)
    }
    
    return NextResponse.json({
      success: true,
      data: produitsFiltres,
      total: produitsFiltres.length
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau produit (admin seulement)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données
    const { nom, prix, description, categorie, tags } = body
    
    if (!nom || !prix || !description || !categorie) {
      return NextResponse.json(
        { success: false, error: 'Champs obligatoires manquants' },
        { status: 400 }
      )
    }
    
    // Créer le nouveau produit
    const nouveauProduit: Produit = {
      id: Math.max(...produits.map(p => p.id)) + 1,
      nom,
      prix: parseFloat(prix),
      description,
      categorie,
      note: 0,
      temps_preparation: body.temps_preparation || '30min',
      tags: tags || [],
      disponible: true,
      stock: body.stock || 0,
      nouveau: true
    }
    
    // Ajouter à la liste (en production, sauvegarder en BDD)
    produits.push(nouveauProduit)
    
    return NextResponse.json({
      success: true,
      data: nouveauProduit,
      message: 'Produit créé avec succès'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
