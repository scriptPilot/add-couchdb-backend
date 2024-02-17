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
let viteConfigFile = null

// Ensure app folder (especially for development)
fs.ensureDirSync(appFolder)

// Copy template structure
shell.exec(`cp -Rn "${templateFolder}/" "${appFolder}/"`)

// Search for vite config file
viteConfigFile =
  fs.readdirSync(appFolder)
  .filter(f => f.startsWith('vite.config.'))
  .map(f => path.resolve(appFolder, f))[0]

// Create vite.config.js file if not exists
if (!viteConfigFile) {
  viteConfigFile = path.resolve(appFolder, 'vite.config.js')
  fs.writeFileSync(viteConfigFile, 'export default {}')
}

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

// Add define global setting to the vite config file
let viteConfigFileContent = fs.readFileSync(viteConfigFile, { encoding: 'utf8' })
const regexStartOfConfig = /(export(.*)(\{))/
const regexStartOfDefine = /(define:( )*\{)/
const regexStartOfGlobal = /(global:( )*\{)/
const defineStr = `
  define: {
  },`
const globalStr = `
    global: {},`
if (!viteConfigFileContent.match(regexStartOfDefine)) {
  viteConfigFileContent = viteConfigFileContent.replace(regexStartOfConfig, `$1${defineStr}`)
}
if (!viteConfigFileContent.match(regexStartOfGlobal)) {
  viteConfigFileContent = viteConfigFileContent.replace(regexStartOfDefine, `$1${globalStr}`)
}
fs.writeFileSync(viteConfigFile, viteConfigFileContent)

// Log success
console.log('✅ You can start your backend with "npm run backend"')