#!/bin/bash

# Script pour démarrer PostgreSQL, Strapi et Next.js

echo "🚀 Démarrage du système boulangerie avec base de données..."

# Vérifier si PostgreSQL est installé et démarré
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé. Installation nécessaire:"
    echo "   brew install postgresql"
    echo "   brew services start postgresql"
    exit 1
fi

# Vérifier si PostgreSQL est démarré
if ! pg_isready &> /dev/null; then
    echo "🔄 Démarrage de PostgreSQL..."
    brew services start postgresql
    sleep 2
fi

# Créer la base de données si elle n'existe pas
echo "🗄️  Création de la base de données 'boulangerie'..."
psql postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'boulangerie'" | grep -q 1 || psql postgres -c "CREATE DATABASE boulangerie;"

# Démarrer Strapi en arrière-plan
echo "🍞 Démarrage de Strapi (API Backend)..."
cd apps/strapi
pnpm dev &
STRAPI_PID=$!

# Attendre que Strapi soit prêt
echo "⏳ Attente du démarrage de Strapi..."
sleep 10

# Démarrer Next.js
echo "🌐 Démarrage de Next.js (Frontend)..."
cd ../web
pnpm dev &
NEXTJS_PID=$!

echo ""
echo "✅ Système démarré avec succès !"
echo ""
echo "📋 Services disponibles :"
echo "   - Frontend Next.js : http://localhost:3000"
echo "   - API Strapi       : http://localhost:1337"
echo "   - Admin Strapi     : http://localhost:1337/admin"
echo "   - PostgreSQL       : localhost:5432"
echo ""
echo "🛑 Pour arrêter le système : Ctrl+C"
echo ""

# Attendre l'interruption
trap "echo '🛑 Arrêt du système...'; kill $STRAPI_PID $NEXTJS_PID; exit" INT
wait
