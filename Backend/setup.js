#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up ATS Backend...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  try {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created successfully');
    console.log('⚠️  Please update the .env file with your MongoDB password\n');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Dependencies installed successfully\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Check if MongoDB connection string is properly configured
console.log('🔍 Checking MongoDB configuration...');
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('YOUR_PASSWORD')) {
    console.log('⚠️  Please update your MongoDB password in the .env file');
    console.log('   Replace YOUR_PASSWORD with your actual MongoDB password\n');
  } else {
    console.log('✅ MongoDB configuration looks good\n');
  }
} catch (error) {
  console.error('❌ Error reading .env file:', error.message);
}

console.log('🎉 Setup completed!');
console.log('\nNext steps:');
console.log('1. Update the .env file with your MongoDB password');
console.log('2. Run "npm run dev" to start the development server');
console.log('3. The server will be available at http://localhost:5000');
console.log('4. Test the health endpoint: http://localhost:5000/health\n');

console.log('📚 For more information, check the README.md file');
