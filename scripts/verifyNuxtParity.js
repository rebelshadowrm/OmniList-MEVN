const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')

const requiredPages = [
  ['/', 'nuxt-app/app/pages/index.vue', 'Home'],
  ['/about', 'nuxt-app/app/pages/about.vue', 'About'],
  ['/login', 'nuxt-app/app/pages/login.vue', 'LoginRegister'],
  ['/profile/:username', 'nuxt-app/app/pages/profile/[username].vue', 'Profile'],
  ['/anime', 'nuxt-app/app/pages/anime/index.vue', 'AnimeBrowse'],
  ['/manga', 'nuxt-app/app/pages/manga/index.vue', 'MangaBrowse'],
  ['/movies', 'nuxt-app/app/pages/movies/index.vue', 'MovieBrowse'],
  ['/books', 'nuxt-app/app/pages/books/index.vue', 'BookBrowse'],
  ['/tv', 'nuxt-app/app/pages/tv/index.vue', 'TvBrowse'],
  ['/anime/:id', 'nuxt-app/app/pages/anime/[id].vue', 'Anime'],
  ['/manga/:id', 'nuxt-app/app/pages/manga/[id].vue', 'Manga'],
  ['/movies/:id', 'nuxt-app/app/pages/movies/[id].vue', 'Movie'],
  ['/books/:id', 'nuxt-app/app/pages/books/[id].vue', 'Book'],
  ['/tv/:id', 'nuxt-app/app/pages/tv/[id].vue', 'Tv'],
  ['/discussions', 'nuxt-app/app/pages/discussions/index.vue', 'Discussions'],
  ['/discussion/:id', 'nuxt-app/app/pages/discussion/[id].vue', 'Discussion'],
  ['/reviews', 'nuxt-app/app/pages/reviews/index.vue', 'Reviews'],
  ['/review/:id', 'nuxt-app/app/pages/review/[id].vue', 'Review'],
  ['/settings', 'nuxt-app/app/pages/settings.vue', 'Settings'],
  ['/inbox', 'nuxt-app/app/pages/inbox.vue', 'Inbox'],
  ['/admin', 'nuxt-app/app/pages/admin.vue', 'AdminPanel'],
]

const forbiddenNuxtRecreations = [
  'nuxt-app/app/components/SiteHeader.vue',
  'nuxt-app/app/components/catalog/CatalogBrowsePage.vue',
  'nuxt-app/app/components/catalog/CatalogDetailPage.vue',
  'nuxt-app/app/components/catalog/CatalogCard.vue',
  'nuxt-app/app/components/catalog/CatalogShelf.vue',
]

const failures = []

function read(relativeFile) {
  return fs.readFileSync(path.join(root, relativeFile), 'utf8')
}

function walkFiles(directory, predicate = () => true) {
  const absoluteDirectory = path.join(root, directory)
  if (!fs.existsSync(absoluteDirectory)) {
    return []
  }

  const entries = fs.readdirSync(absoluteDirectory, {withFileTypes: true})

  return entries.flatMap((entry) => {
    const absolutePath = path.join(absoluteDirectory, entry.name)
    const relativePath = path.relative(root, absolutePath).replaceAll(path.sep, '/')

    if (entry.isDirectory()) {
      return walkFiles(relativePath, predicate)
    }

    return predicate(relativePath) ? [relativePath] : []
  })
}

for (const [route, relativeFile, routeName] of requiredPages) {
  const file = path.join(root, relativeFile)
  if (!fs.existsSync(file)) {
    failures.push(`${route}: missing Nuxt page ${relativeFile}`)
    continue
  }

  const source = fs.readFileSync(file, 'utf8')
  if (!source.includes('@omni/shared/views/')) {
    failures.push(`${route}: page does not import a shared SPA view`)
  }
  if (!source.includes(`name: '${routeName}'`)) {
    failures.push(`${route}: page does not declare route name ${routeName}`)
  }
}

for (const relativeFile of forbiddenNuxtRecreations) {
  const file = path.join(root, relativeFile)
  if (fs.existsSync(file)) {
    failures.push(`forbidden Nuxt recreation still exists: ${relativeFile}`)
  }
}

const sharedVueFiles = walkFiles('client/src', file => file.endsWith('.vue') || file.endsWith('.js') || file.endsWith('.ts'))
for (const relativeFile of sharedVueFiles) {
  const source = read(relativeFile)
  if (source.includes('<VTable') || source.includes('</VTable') || source.includes('<VTh') || source.includes('</VTh')) {
    failures.push(`${relativeFile}: legacy SmartTable components remain; use shared OmniTable/OmniTh`)
  }
  if (source.includes('vuejs-smart-table')) {
    failures.push(`${relativeFile}: imports removed SmartTable dependency`)
  }
}

const clientPackage = JSON.parse(read('client/package.json'))
if (clientPackage.dependencies?.['vuejs-smart-table'] || clientPackage.devDependencies?.['vuejs-smart-table']) {
  failures.push('client/package.json: vuejs-smart-table dependency should not be present')
}

const nuxtConfig = read('nuxt-app/nuxt.config.ts')
if (!nuxtConfig.includes('kit.fontawesome.com/2261da91cd.js')) {
  failures.push('nuxt-app/nuxt.config.ts: missing Font Awesome kit parity script used by SPA icons')
}

const mediaTypes = read('client/src/config/mediaTypes.js')
if (
  !mediaTypes.includes('BOOK_BROWSE_SORT_OPTIONS') ||
  !mediaTypes.includes('BOOK_SEARCH_SORT_OPTIONS') ||
  !mediaTypes.includes('BOOK_SUBJECTS') ||
  !mediaTypes.includes("defaultSort: 'trending'")
) {
  failures.push('client/src/config/mediaTypes.js: books must expose sort and subject filter parity')
}

if (failures.length) {
  console.error('Nuxt parity verification failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

console.log(`Nuxt parity verification passed for ${requiredPages.length} route wrappers.`)
