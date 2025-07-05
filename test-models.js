#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Change to strapi directory
process.chdir(path.join(__dirname, 'apps', 'strapi'));

console.log('Testing Strapi model loading...');

// Try to start strapi and capture output
const strapi = spawn('npm', ['run', 'develop'], {
  stdio: 'pipe',
  env: process.env
});

let output = '';
let errorOutput = '';

strapi.stdout.on('data', (data) => {
  output += data.toString();
  console.log('STDOUT:', data.toString());
});

strapi.stderr.on('data', (data) => {
  errorOutput += data.toString();
  console.log('STDERR:', data.toString());
});

// Kill after 30 seconds
setTimeout(() => {
  strapi.kill('SIGTERM');
  console.log('\nTest completed after 30 seconds');
  
  if (errorOutput.includes('Error on attribute')) {
    console.log('\n❌ Model relation error detected');
    console.log('Error details:', errorOutput);
    process.exit(1);
  } else if (output.includes('Server started')) {
    console.log('\n✅ Strapi started successfully');
    process.exit(0);
  } else {
    console.log('\n⚠️  Unclear result, check output above');
    process.exit(0);
  }
}, 30000);

strapi.on('close', (code) => {
  console.log(`\nStrapi process exited with code ${code}`);
});
