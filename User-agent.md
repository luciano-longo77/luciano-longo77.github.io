# Luciano Longo | Portfolio

Portfolio statico personale dedicato a ricerca in Digital Humanities, TEI/XML e critica genetica.

## Struttura

Il sito è bilingue. La root ospita una pagina di ingresso condivisa (selettore
di lingua); le due versioni linguistiche stanno in sottocartelle dedicate:

- `index.html`: pagina di ingresso bilingue (selettore di lingua), con `entry.css` ed `entry.js`.
- `en/index.html`: versione inglese del portfolio.
- `it/index.html`: versione italiana del portfolio.
- `styles.css`: stili globali condivisi dalle pagine linguistiche.
- `script.js`: logica frontend e accessibilità condivise.
- `tailwind.css`: foglio di stile Tailwind pre-compilato.
- `favicon.svg`, `site.webmanifest`: icone e manifest web app.
- `sitemap.xml`, `robots.txt`, `llms.txt`: SEO e crawling.
- `.nojekyll`: serve i file così come sono (nessuna elaborazione Jekyll).

Le due versioni linguistiche sono collegate tramite alternate `hreflang`, URL
canonico e selettore di lingua in pagina, con la root come `x-default`.

## Avvio locale

Apri `index.html` in un browser oppure servi la cartella con un server statico.

## Deploy

Progetto pensato per hosting statico (es. GitHub Pages).
