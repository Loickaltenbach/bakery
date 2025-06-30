#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Démarrage du système boulangerie...\n');

// Fonction pour démarrer un processus
function startProcess(name, command, args, cwd, color = '\x1b[36m') {
  console.log(`${color}[${name}]\x1b[0m Démarrage: ${command} ${args.join(' ')}`);
  
  const process = spawn(command, args, {
    cwd: cwd,
    stdio: 'pipe',
    shell: true
  });

  // Préfixer chaque ligne de sortie avec le nom du service
  process.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
      console.log(`${color}[${name}]\x1b[0m ${line}`);
    });
  });

  process.stderr.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
      console.log(`${color}[${name}]\x1b[31m ERROR:\x1b[0m ${line}`);
    });
  });

  process.on('exit', (code) => {
    if (code !== 0) {
      console.log(`${color}[${name}]\x1b[31m Process exited with code ${code}\x1b[0m`);
    } else {
      console.log(`${color}[${name}]\x1b[32m Process exited successfully\x1b[0m`);
    }
  });

  return process;
}

// Vérifier que nous sommes dans le bon répertoire
const currentDir = process.cwd();
const packageJsonPath = path.join(currentDir, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Erreur: package.json non trouvé. Assurez-vous d\'être dans le répertoire racine du projet.');
  process.exit(1);
}

console.log('📂 Répertoire du projet:', currentDir);
console.log('📦 Installation des dépendances...\n');

// Installer les dépendances
const installProcess = spawn('pnpm', ['install'], {
  cwd: currentDir,
  stdio: 'inherit',
  shell: true
});

installProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error('❌ Erreur lors de l\'installation des dépendances');
    process.exit(1);
  }

  console.log('\n✅ Dépendances installées avec succès\n');
  console.log('🔧 Démarrage des services...\n');

  // Démarrer Strapi (backend)
  const strapiProcess = startProcess(
    'STRAPI', 
    'pnpm', 
    ['dev'], 
    path.join(currentDir, 'apps/strapi'),
    '\x1b[35m' // Magenta
  );

  // Attendre un peu avant de démarrer Next.js
  setTimeout(() => {
    // Démarrer Next.js (frontend)
    const nextProcess = startProcess(
      'NEXT.JS', 
      'pnpm', 
      ['dev'], 
      path.join(currentDir, 'apps/web'),
      '\x1b[34m' // Blue
    );

    // Gérer l'arrêt propre
    process.on('SIGINT', () => {
      console.log('\n🛑 Arrêt des services...');
      strapiProcess.kill('SIGTERM');
      nextProcess.kill('SIGTERM');
      
      setTimeout(() => {
        console.log('👋 Services arrêtés. Au revoir !');
        process.exit(0);
      }, 2000);
    });

    // Afficher les informations de connexion après 10 secondes
    setTimeout(() => {
      console.log('\n' + '='.repeat(60));
      console.log('🍞 SYSTÈME BOULANGERIE PRÊT');
      console.log('='.repeat(60));
      console.log('🌐 Frontend (Next.js): http://localhost:3000');
      console.log('🔧 Backend (Strapi):   http://localhost:1337');
      console.log('📚 Admin Strapi:       http://localhost:1337/admin');
      console.log('='.repeat(60));
      console.log('💡 Appuyez sur Ctrl+C pour arrêter tous les services');
      console.log('');
    }, 10000);

  }, 3000);
});
