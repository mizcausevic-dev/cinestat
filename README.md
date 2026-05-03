# 🎬 CineStat

> **A React analytics dashboard visualizing personal entertainment collection data — movies, TV shows, episodes, and a ranked comedy favorites list.**

Built by **[Miz Causevic](https://mizcausevic.com/skills)** as part of front-end portfolio.

---

## 🖼 Preview

| Light Mode | Dark Mode |
|---|---|
| *(screenshot coming soon)* | *(screenshot coming soon)* |

---

## ✨ Features

- 📊 **KPI Cards** — Totals for movies, shows, episodes, and favorite comedies
- 📈 **Collection Timeline** — Area chart of library additions over the years
- 🍩 **Movies by Decade** — Donut chart showing era distribution of your film library
- 📺 **Top Shows** — Horizontal bar chart ranked by episode count
- 😂 **Favorite Comedies** — Ranked table with title and year
- 🕐 **Recent Updates** — Latest 10 updated items with type badges
- 🌙 **Dark / Light Mode** — Toggle with one click using CSS custom properties
- ♿ **Fully Accessible** — Semantic HTML, keyboard nav, skip links, ARIA labels
- 📱 **Responsive** — Works on desktop and mobile

---

## 🛠 Tech Stack

| Tool | Role |
|---|---|
| **React 18** | Component-driven UI |
| **Vite** | Fast local dev + production build |
| **Recharts** | Composable chart library (area, bar, donut) |
| **Lucide React** | Icon system |
| **Plain CSS** | No Tailwind — intentional design tokens via CSS custom properties |

---

## 📂 Data

All data files live in `src/data/` — entertainment metadata only. No sensitive or proprietary content.

| File | Contents |
|---|---|
| `collection-movies.json` | ~356 collected films with title, year, collected date |
| `collection-shows.json` | ~38 TV series with season/episode structure |
| `collection-episodes-1/2/3.json` | ~3,000 episode-level records |
| `lists-list-fav-comedies.json` | 52 ranked comedy favorites |

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/fknmiz/cinestat.git
cd cinestat
npm install
```

### 2. Run Locally

```bash
npm run dev
```

Open [http://localhost:4173](http://localhost:4173) in your browser.

### 3. Build for Production

```bash
npm run build
npm run preview
```

---

## ☁️ Deploy to Vercel (Free)

1. Push this repo to GitHub ✅
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Select `fknmiz/cinestat` from the list
4. Vercel auto-detects Vite — no config changes needed
5. Click **Deploy** — live in ~30 seconds

> Every push to `main` auto-redeploys. Add a custom domain for free in Vercel settings.

---

## 🎯 Portfolio Value

This project demonstrates:

- ✅ React 18 component composition with reusable UI primitives
- ✅ Multi-source JSON data shaping and aggregation
- ✅ Recharts responsive visualizations
- ✅ CSS custom property theming (light/dark mode)
- ✅ Accessibility-first markup
- ✅ Clean, maintainable project structure

---

## 🔮 Roadmap

- [ ] Trakt.tv API live integration (replace static JSON)
- [ ] Genre breakdown charts
- [ ] Watch history timeline
- [ ] Export to CSV
- [ ] Vercel live demo link

---

## 📄 License

MIT — free to use and modify.

---

**Built by Miz Causevic**
[LinkedIn](https://linkedin.com/in/mirzacaus) · [GitHub](https://github.com/fknmiz) · [Portfolio](https://mizcausevic.com)
