import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

// GitHub Pages sunucu tarafında SPA rewrite sunmaz. Bilinen her rota için
// gerçek bir HTML giriş dosyası üretip doğrudan açılan bağlantıları destekliyoruz.
const dist = new URL('../dist/', import.meta.url)
const routeDefinitions = await readFile(new URL('../src/data/labs.ts', import.meta.url), 'utf8')
const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8')

const routes = [...new Set(
  [...routeDefinitions.matchAll(/\bpath:\s*'\/(.*?)'/g)].map((match) => match[1]),
)]

if (routes.length === 0) {
  throw new Error('Yayın için alan/laboratuvar rotası bulunamadı.')
}

for (const route of routes) {
  const directory = join(dist.pathname, ...route.split('/'))
  await mkdir(directory, { recursive: true })
  await writeFile(join(directory, 'index.html'), html, 'utf8')
}

// Gelecekte eklenen veya henüz oluşturulmamış yollar için SPA yedeği.
await writeFile(new URL('../dist/404.html', import.meta.url), html, 'utf8')
console.log(`GitHub Pages: ${routes.length} temiz URL sayfası ve 404 yedeği hazır.`)
