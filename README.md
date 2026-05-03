# CineStat

A public-safe React analytics dashboard visualizing entertainment collection data — movies, TV shows, episodes, and a ranked comedy favorites list.

**Live demo:** _Deploy via Vercel or Netlify — one click from this repo._

---

## Why this repo works as a portfolio piece

- React 18 component composition with reusable UI primitives.
- Multi-source JSON data shaping and aggregation.
- Recharts responsive visualizations (area, bar, donut).
- Light/dark theme toggle with CSS custom properties.
- Fully accessible: semantic HTML, keyboard nav, skip links, ARIA labels.
- Zero cybersec, governance, compliance, or enterprise-sensitive content.

---

## Dashboard features

| Section | What it shows |
|---|---|
| KPI Cards | Totals for movies, shows, episodes, and favorite comedies |
| Collection Timeline | Area chart of additions over the years |
| Movies by Decade | Donut chart of library era distribution |
| Top Shows | Horizontal bar chart ranked by episode count |
| Favorite Comedies | Ranked table with title and year |
| Recent Updates | Latest 10 updated items with type badge |

---

## Stack

- **React 18** — component-driven UI
- **Vite** — fast local dev and production build
- **Recharts** — composable chart library
- **Lucide React** — icon system
- **Plain CSS** — no Tailwind, intentional design tokens via CSS custom properties

---

## Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:4173`

## Production build

```bash
npm run build
npm run preview
```

---

## Data

All data files live in `src/data/` and contain entertainment metadata only:

| File | Contents |
|---|---|
| `collection-movies.json` | ~356 collected films with title, year, collected date |
| `collection-shows.json` | ~38 TV series with season/episode structure |
| `collection-episodes-1/2/3.json` | ~3000 episode-level records |
| `lists-list-fav-comedies.json` | 52 ranked comedy favorites |

---

## Notes

This project uses personal entertainment metadata — titles, years, collection timestamps, and rankings. No internal architecture, security posture, or proprietary business data is exposed.
