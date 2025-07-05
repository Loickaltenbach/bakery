#!/bin/bash

# Script de démarrage et test du système de paiement
# Usage: ./start-payment-system.sh

set -e

echo "🏗️  Démarrage du système de paiement de la boulangerie"
echo "=================================================="

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis la racine du projet"
    exit 1
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    pnpm install
fi

# Fonction pour vérifier si un port est utilisé
check_port() {
    if lsof -ti:$1 > /dev/null; then
        return 0
    else
        return 1
    fi
}

# Démarrer Strapi en arrière-plan
echo "🚀 Démarrage de Strapi..."
if check_port 1337; then
    echo "⚠️  Strapi semble déjà en cours d'exécution sur le port 1337"
else
    cd apps/strapi
    pnpm run develop &
    STRAPI_PID=$!
    cd ../..
    echo "✅ Strapi démarré avec PID: $STRAPI_PID"
fi

# Attendre que Strapi soit prêt
echo "⏳ Attente que Strapi soit prêt..."
while ! curl -s http://localhost:1337/admin > /dev/null; do
    sleep 2
    echo "   ... attente ..."
done
echo "✅ Strapi est prêt!"

# Démarrer Next.js en arrière-plan
echo "🚀 Démarrage de Next.js..."
if check_port 3000; then
    echo "⚠️  Next.js semble déjà en cours d'exécution sur le port 3000"
else
    cd apps/web
    pnpm run dev &
    NEXTJS_PID=$!
    cd ../..
    echo "✅ Next.js démarré avec PID: $NEXTJS_PID"
fi

# Attendre que Next.js soit prêt
echo "⏳ Attente que Next.js soit prêt..."
while ! curl -s http://localhost:3000 > /dev/null; do
    sleep 2
    echo "   ... attente ..."
done
echo "✅ Next.js est prêt!"

echo ""
echo "🎉 Système de paiement démarré avec succès!"
echo "=================================================="
echo ""
echo "📱 Interface web:        http://localhost:3000"
echo "🧪 Page de test:         http://localhost:3000/test-paiement"
echo "⚙️  Admin Strapi:        http://localhost:1337/admin"
echo ""
echo "📋 Codes promo de test disponibles:"
echo "   - BIENVENUE10  (10% de réduction)"
echo "   - WEEK5        (5€ de réduction)"
echo "   - NOEL20       (20% de réduction)"
echo "   - LIVRAISONOFF (Livraison gratuite)"
echo ""
echo "🔧 Endpoints API principaux:"
echo "   - GET  /api/codes-promo/valider/:code"
echo "   - POST /api/paiements/initier"
echo "   - POST /api/paiements/traiter"
echo "   - POST /api/paiements/generer-facture"
echo ""
echo "Pour arrêter les services:"
echo "   Ctrl+C puis './stop-payment-system.sh'"
echo ""

# Sauvegarder les PIDs pour pouvoir les arrêter plus tard
echo "$STRAPI_PID" > .strapi.pid 2>/dev/null || true
echo "$NEXTJS_PID" > .nextjs.pid 2>/dev/null || true

# Attendre l'interruption
trap 'echo "🛑 Arrêt des services..."; kill $STRAPI_PID $NEXTJS_PID 2>/dev/null || true; exit 0' INT

echo "✨ Système prêt! Appuyez sur Ctrl+C pour arrêter."
wait
