#!/usr/bin/env node

// Import modules
import path from 'path'
import url from 'url'
import shell from 'shelljs'
import fs from 'fs-extra'

// Define folders
const scriptFolder = path.dirname(url.fileURLToPath(import.meta.url))
const processFolder = process.cwd()
const isDevMode = processFolder === path.resolve(scriptFolder, '..')
const appFolder = isDevMode ? path.resolve(scriptFolder, '../temp') : processFolder
const templateFolder = path.resolve(scriptFolder, 'templates')

// Define files
const packageFile = path.resolve(appFolder, 'package.json')

// Copy template structure
shell.exec(`cp -Rn "${templateFolder}/" "${appFolder}/"`)

// Create package.json file if not exists
if (!fs.existsSync(packageFile)) fs.writeFileSync(packageFile, '{}')

// Add backend script to the package.json file
const packageFileJson = fs.readJsonSync(packageFile)
const nextPackageFileJson = {
  ...packageFileJson,
  scripts: {
    ...packageFileJson.scripts,
    backend: '(docker stop $(docker ps -a -q) || true) && (docker rm -f $(docker ps -a -q) || true) && (docker volume rm $(docker volume ls -q) || true) && docker compose up -d --build',    
  }
}
fs.writeJsonSync(packageFile, nextPackageFileJson, { spaces: 2 })

// Log success
console.log('✅ You can start your backend with "npm run backend"')