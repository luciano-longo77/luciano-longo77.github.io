# Luciano Longo | Portfolio

Personal portfolio dedicated to research in Digital Humanities, TEI/XML and genetic criticism.

## Structure

The site is bilingual, with English at the root and Italian in a subfolder:

- `index.html`: main portfolio page (English).
- `it/index.html`: Italian version of the portfolio.
- `styles.css`: global styles.
- `script.js`: frontend logic and accessibility.
- `tailwind.css`: pre-compiled Tailwind stylesheet (see *CSS build* below).
- `favicon.svg`, `site.webmanifest`: icons and web app manifest.
- `sitemap.xml`, `robots.txt`: SEO and crawling.

The two language versions are linked through `hreflang` alternates, a canonical
URL and an in-page language switcher.

## Local preview

Open `index.html` in a browser, or serve the folder with a static server.

## CSS build (Tailwind)

The `tailwind.css` file is **pre-compiled** and committed: the site no longer
depends on the Tailwind runtime CDN (no risk of an unstyled page, and no JS
compiler blocking rendering).

When new Tailwind classes are added to `index.html` or `it/index.html`,
regenerate the CSS with:

```
npx tailwindcss@3 -c tailwind.config.js -i tailwind.input.css -o tailwind.css --minify
```

Classes applied via JavaScript are listed in the `safelist` of
`tailwind.config.js`.

## Deploy

Designed for static hosting (e.g. GitHub Pages).
