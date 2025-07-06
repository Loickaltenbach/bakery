import { NextRequest, NextResponse } from 'next/server'

// Types pour les messages de contact
interface MessageContact {
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

// Stockage temporaire (à remplacer par une base de données)
const messages: MessageContact[] = [
  {
    id: "MSG-001",
    nom: "Sophie Martin",
    email: "sophie.martin@email.com", 
    sujet: "commande",
    message: "Bonjour, je souhaiterais commander un kouglof pour dimanche. Est-ce possible ?",
    date: "2024-07-05T10:30:00Z",
    statut: "repondu",
    reponse: "Bonjour Sophie, bien sûr ! Nous pouvons préparer un kouglof pour dimanche. Merci de passer commande avant samedi 16h.",
    dateReponse: "2024-07-05T14:15:00Z"
  }
]

// POST - Envoyer un message de contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données
    const { nom, email, sujet, message } = body
    
    if (!nom || !email || !sujet || !message) {
      return NextResponse.json(
        { success: false, error: 'Tous les champs sont obligatoires' },
        { status: 400 }
      )
    }
    
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }
    
    // Créer le message
    const nouveauMessage: MessageContact = {
      id: `MSG-${String(messages.length + 1).padStart(3, '0')}`,
      nom: nom.trim(),
      email: email.trim().toLowerCase(),
      sujet,
      message: message.trim(),
      date: new Date().toISOString(),
      statut: 'nouveau'
    }
    
    // Ajouter à la liste (en production, sauvegarder en BDD)
    messages.push(nouveauMessage)
    
    // Ici vous pourriez envoyer un email de notification aux administrateurs
    // await envoyerNotificationEmail(nouveauMessage)
    
    return NextResponse.json({
      success: true,
      data: {
        id: nouveauMessage.id,
        date: nouveauMessage.date
      },
      message: 'Message envoyé avec succès. Nous vous répondrons rapidement !'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// GET - Récupérer les messages (pour l'admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const statut = searchParams.get('statut')
    const sujet = searchParams.get('sujet')
    
    let messagesFiltres = [...messages]
    
    // Filtrer par statut
    if (statut && statut !== 'tous') {
      messagesFiltres = messagesFiltres.filter(m => m.statut === statut)
    }
    
    // Filtrer par sujet
    if (sujet && sujet !== 'tous') {
      messagesFiltres = messagesFiltres.filter(m => m.sujet === sujet)
    }
    
    // Trier par date (plus récent en premier)
    messagesFiltres.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    return NextResponse.json({
      success: true,
      data: messagesFiltres,
      total: messagesFiltres.length,
      stats: {
        nouveau: messages.filter(m => m.statut === 'nouveau').length,
        lu: messages.filter(m => m.statut === 'lu').length,
        repondu: messages.filter(m => m.statut === 'repondu').length,
        ferme: messages.filter(m => m.statut === 'ferme').length
      }
    })
    
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
