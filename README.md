# Luciano Longo | Portfolio

Personal portfolio dedicated to research in Digital Humanities, TEI/XML and genetic criticism.

## Structure

The site is bilingual. The root hosts a shared entry page (language selector);
the two language versions live in dedicated subfolders:

- `index.html`: bilingual entry page (language selector), with `entry.css` and `entry.js`.
- `en/index.html`: English version of the portfolio.
- `it/index.html`: Italian version of the portfolio.
- `styles.css`: shared global styles for the language pages.
- `script.js`: shared frontend logic and accessibility.
- `tailwind.css`: pre-compiled Tailwind stylesheet (see *CSS build* below).
- `favicon.svg`, `site.webmanifest`: icons and web app manifest.
- `sitemap.xml`, `robots.txt`, `llms.txt`: SEO and crawling.
- `.nojekyll`: serves files verbatim (no Jekyll processing).

The two language versions are linked through `hreflang` alternates, a canonical
URL and an in-page language switcher, with the root as `x-default`.

## Local preview

Open `index.html` in a browser, or serve the folder with a static server.

## CSS build (Tailwind)

The `tailwind.css` file is **pre-compiled** and committed: the site no longer
depends on the Tailwind runtime CDN (no risk of an unstyled page, and no JS
compiler blocking rendering).

When new Tailwind classes are added to `en/index.html` or `it/index.html`,
regenerate the CSS with:

```
npx tailwindcss@3 -c tailwind.config.js -i tailwind.input.css -o tailwind.css --minify
```

Classes applied via JavaScript are listed in the `safelist` of
`tailwind.config.js`, and the pages scanned for classes are set in its
`content` array.

## Deploy

Designed for static hosting (e.g. GitHub Pages).
