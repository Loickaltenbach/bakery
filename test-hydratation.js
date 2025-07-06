#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🔍 Test de compilation et d\'hydratation...\n');

// Fonction pour exécuter une commande et retourner une promesse
function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { 
      cwd, 
      stdio: 'pipe',
      shell: true 
    });
    
    let stdout = '';
    let stderr = '';
    
    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject({ code, stdout, stderr });
      }
    });
  });
}

async function testHydratation() {
  const webPath = path.join(__dirname, 'apps/web');
  
  try {
    console.log('📦 Installation des dépendances...');
    await runCommand('npm', ['install'], webPath);
    console.log('✅ Dépendances installées\n');
    
    console.log('🔧 Compilation TypeScript...');
    await runCommand('npx', ['tsc', '--noEmit'], webPath);
    console.log('✅ TypeScript OK\n');
    
    console.log('🏗️  Compilation Next.js...');
    const buildResult = await runCommand('npx', ['next', 'build'], webPath);
    
    if (buildResult.stderr.includes('Hydration')) {
      console.log('❌ Problème d\'hydratation détecté:');
      console.log(buildResult.stderr);
    } else {
      console.log('✅ Compilation Next.js réussie sans erreur d\'hydratation');
    }
    
    console.log('\n🎉 Tests terminés avec succès!');
    
  } catch (error) {
    console.log('\n❌ Erreur détectée:');
    console.log('Code:', error.code);
    console.log('STDERR:', error.stderr);
    console.log('STDOUT:', error.stdout);
    
    if (error.stderr.includes('Hydration')) {
      console.log('\n🚨 PROBLÈME D\'HYDRATATION DÉTECTÉ');
      console.log('Les composants suivants peuvent causer des problèmes:');
      console.log('- Navbar avec des contextes');
      console.log('- Composants utilisant localStorage');
      console.log('- Composants utilisant useTheme sans vérification mounted');
    }
    
    process.exit(1);
  }
}

testHydratation();
