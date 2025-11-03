import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const resolvePath = (dir: string) => path.resolve(__dirname, dir)

const toFrontMatter = (data: Record<string, string>) =>
  `---\n${Object.entries(data)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
  }\n---\n`

const normalizeAssetLinks = (html: string) =>
  html.replace(
    /(href|src)="\/assets\/react\/assets\/([^"]+)"/g,
    (_, attr, file) => `${attr}="{{ '/assets/react/${file}' | relative_url }}"`
  )

function moveToJekyll(): Plugin {
  return {
    name: 'move-to-jekyll',
    apply: 'build',
    async closeBundle() {
      const html_files = fs.readdirSync(resolvePath('dist/pages'))

      for (const file of html_files) {
        const htmlPath = path.join(resolvePath('dist/pages'), file)
        const rawHtml = fs.readFileSync(htmlPath, 'utf8')

        const titleMatch = rawHtml.match(/<title>(.*?)<\/title>/i)
        const basename = path.parse(file).name
        const title = titleMatch?.[1] || basename

        const frontMatter = toFrontMatter({
          layout: 'page',
          title,
          permalink: `/${basename}/`
        })
        const targetPath = path.join(resolvePath('../_pages'), file)
        fs.writeFileSync(targetPath, frontMatter + normalizeAssetLinks(rawHtml), 'utf8')
      }

      const assetsDest = path.resolve(__dirname, '../assets/react')
      fs.rmSync(assetsDest, { recursive: true, force: true })
      fs.cpSync(resolvePath('dist/assets'), assetsDest, { recursive: true })
    }
  }
}

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/assets/react/' : '/',
  define: {
    __DEV__: command !== 'build',
  },
  plugins: [react(), moveToJekyll()],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: fs.readdirSync(path.resolve(__dirname, 'pages'), { withFileTypes: true })
        .filter(dirent => dirent.isFile() && dirent.name.endsWith('.html'))
        .map(dirent => path.resolve(__dirname, 'pages', dirent.name))
    }
  }
}))
