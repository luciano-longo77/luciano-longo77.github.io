# Luciano Longo | Portfolio

Portfolio statico personale dedicato a ricerca in Digital Humanities, TEI/XML e critica genetica.

## Struttura

- `index.html`: pagina principale del portfolio.
- `styles.css`: stili globali.
- `script.js`: logica frontend e accessibilita.
- `entry/`: landing/entry page.
- `sitemap.xml` e `robots.txt`: SEO crawling.

## Avvio locale

Apri `index.html` in browser oppure servi la cartella con un server statico.

## Build CSS (Tailwind)

Il file `tailwind.css` è **pre-compilato** e versionato: il sito non dipende più
dalla CDN runtime di Tailwind (nessun rischio di pagina senza stile, nessun
compilatore JS che blocca il rendering).

Se si aggiungono nuove classi Tailwind in `index.html`, rigenerare il CSS con:

```
npx tailwindcss@3 -c tailwind.config.js -i tailwind.input.css -o tailwind.css --minify
```

Le classi applicate via JavaScript sono elencate nella `safelist` di
`tailwind.config.js`.

## Deploy

Progetto pensato per hosting statico (es. GitHub Pages).
