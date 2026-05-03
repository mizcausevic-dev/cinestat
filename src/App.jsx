import { useMemo, useState } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Film, Clapperboard, Tv, Moon, Sun, Star } from 'lucide-react'

import movies    from './data/collection-movies.json'
import shows     from './data/collection-shows.json'
import eps1      from './data/collection-episodes-1.json'
import eps2      from './data/collection-episodes-2.json'
import eps3      from './data/collection-episodes-3.json'
import favorites from './data/lists-list-fav-comedies.json'

import KpiCard       from './components/KpiCard'
import SectionHeader from './components/SectionHeader'

const allEpisodes = [...eps1, ...eps2, ...eps3]
const PIE_COLORS  = ['#4f98a3', '#5aad39', '#d1a000', '#9b5ce8', '#c0554e']

const fmt = (n) => new Intl.NumberFormat('en-US').format(n)
const yearOf = (d) => d ? String(d).slice(0, 4) : null
const decade = (y) => y ? `${Math.floor(y / 10) * 10}s` : 'Unknown'

export default function App() {
  const [theme, setTheme] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )

  const data = useMemo(() => {
    // --- Collection timeline ---
    const timeMap = {}
    const bump = (date, key) => {
      const y = yearOf(date)
      if (!y) return
      if (!timeMap[y]) timeMap[y] = { year: y, Movies: 0, Shows: 0, Episodes: 0 }
      timeMap[y][key]++
    }
    movies.forEach((m) => bump(m.collected_at, 'Movies'))
    shows.forEach((s)  => bump(s.last_collected_at, 'Shows'))
    allEpisodes.forEach((e) => bump(e.collected_at, 'Episodes'))
    const timeline = Object.values(timeMap).sort((a, b) => +a.year - +b.year)

    // --- Decade breakdown ---
    const decadeMap = {}
    movies.forEach(({ movie }) => {
      const d = decade(movie.year)
      decadeMap[d] = (decadeMap[d] || 0) + 1
    })
    const movieByDecade = Object.entries(decadeMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name))

    // --- Top shows ---
    const topShows = [...shows]
      .map(({ show }) => ({ title: show.title, episodes: show.aired_episodes || 0, year: show.year }))
      .sort((a, b) => b.episodes - a.episodes)
      .slice(0, 8)

    // --- Recent items ---
    const recent = [
      ...movies.map((m) => ({ title: m.movie.title, year: m.movie.year, type: 'Movie', date: m.updated_at || m.collected_at })),
      ...shows.map((s)  => ({ title: s.show.title,  year: s.show.year,  type: 'Show',  date: s.last_updated_at || s.last_collected_at })),
    ].filter((i) => i.date).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)

    // --- Fav comedies ---
    const favRows = [...favorites]
      .filter((i) => i.movie)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 12)
      .map((i) => ({ title: i.movie.title, year: i.movie.year, rank: i.rank }))

    const movieYears = movies.map((m) => m.movie.year).filter(Boolean)

    return {
      totalMovies:    movies.length,
      totalShows:     shows.length,
      totalEpisodes:  allEpisodes.length,
      totalFavs:      favorites.length,
      earliestMovie:  Math.min(...movieYears),
      latestMovie:    Math.max(...movieYears),
      timeline, movieByDecade, topShows, recent, favRows,
    }
  }, [])

  const tooltipStyle = { background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 16, color: 'var(--text)', fontSize: 13 }

  return (
    <div className={`app ${theme}`}>
      <a href="#main" className="skip-link">Skip to content</a>

      {/* ── Topbar ── */}
      <header className="topbar">
        <div>
          <p className="eyebrow"><Film size={14} /> React Portfolio Project</p>
          <h1>CineStat</h1>
          <p className="hero-copy">
            An analytics dashboard built on real entertainment data — movies, shows, episodes,
            and a ranked comedy list. No enterprise internals, just clean React.
          </p>
        </div>
        <button
          className="theme-toggle"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <main id="main" className="dashboard">

        {/* ── Hero row ── */}
        <section className="hero-grid">
          <article className="card hero-card">
            <div>
              <p className="eyebrow">Collection scope</p>
              <h2>Media trends<br/>at a glance.</h2>
              <p style={{ marginTop: '0.65rem', maxWidth: '54ch' }}>
                Multi-source JSON data shaped into KPIs, charts, and rankings. Demonstrates
                component composition, custom hooks, and accessible UI.
              </p>
            </div>
            <div className="hero-stats">
              <div><span>Coverage</span><strong>{data.earliestMovie} – {data.latestMovie}</strong></div>
              <div><span>Favorites list</span><strong>{data.totalFavs} picks</strong></div>
            </div>
          </article>

          <article className="card spotlight">
            <p className="eyebrow">Stack highlights</p>
            <h3>Frontend-first.</h3>
            <ul>
              <li>React 18 + Vite — fast dev &amp; production builds.</li>
              <li>Recharts — composable, responsive visualizations.</li>
              <li>CSS custom properties — light/dark theming, no framework needed.</li>
              <li>Real data — not Lorem Ipsum, not mock generators.</li>
            </ul>
          </article>
        </section>

        {/* ── KPIs ── */}
        <section className="kpi-grid" aria-label="Key metrics">
          <KpiCard label="Movies" value={fmt(data.totalMovies)} sub="Collected film entries" tone="teal" />
          <KpiCard label="Shows" value={fmt(data.totalShows)} sub="Series in the library" tone="gold" />
          <KpiCard label="Episodes" value={fmt(data.totalEpisodes)} sub="Episode-level records" tone="green" />
          <KpiCard label="Fav Comedies" value={fmt(data.totalFavs)} sub="Ranked personal list" tone="plum" />
        </section>

        {/* ── Timeline + Decade ── */}
        <section className="viz-grid two-up">
          <article className="card chart-card">
            <SectionHeader title="Collection timeline" description="Items added to the library over the years." />
            <div className="chart-wrap tall">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.timeline}>
                  <defs>
                    <linearGradient id="gEp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d1a000" stopOpacity={0.55}/>
                      <stop offset="95%" stopColor="#d1a000" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gMv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f98a3" stopOpacity={0.55}/>
                      <stop offset="95%" stopColor="#4f98a3" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--grid)" />
                  <XAxis dataKey="year" stroke="var(--muted)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="var(--muted)" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="Episodes" stroke="#d1a000" fill="url(#gEp)" strokeWidth={2.5} dot={false} />
                  <Area type="monotone" dataKey="Movies"   stroke="#4f98a3" fill="url(#gMv)" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="card chart-card">
            <SectionHeader title="Movies by decade" description="Library era breakdown at a glance." />
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.movieByDecade} dataKey="value" nameKey="name" innerRadius={65} outerRadius={102} paddingAngle={3}>
                    {data.movieByDecade.map((entry, i) => (
                      <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12, color: 'var(--muted)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>

        {/* ── Top shows + Favorites ── */}
        <section className="viz-grid two-up">
          <article className="card chart-card">
            <SectionHeader title="Top shows" description="Series ranked by total aired episodes." />
            <div className="chart-wrap tall">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topShows} layout="vertical" margin={{ left: 4, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--grid)" />
                  <XAxis type="number" stroke="var(--muted)" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="title" width={108} stroke="var(--muted)" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="episodes" fill="#4f98a3" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="card table-card">
            <SectionHeader title="Favorite comedies" description="Top 12 ranked picks from the personal list." />
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Rank</th><th>Title</th><th>Year</th></tr>
                </thead>
                <tbody>
                  {data.favRows.map((item) => (
                    <tr key={item.rank}>
                      <td><span className="rank-pill"><Star size={11} /> {item.rank}</span></td>
                      <td>{item.title}</td>
                      <td>{item.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        {/* ── Recent updates ── */}
        <section className="viz-grid two-up">
          <article className="card recent-card">
            <SectionHeader title="Recently updated" description="Latest 10 movie and show records." />
            <div className="recent-list">
              {data.recent.map((item) => (
                <div className="recent-item" key={`${item.type}-${item.title}`}>
                  <div className="recent-meta">
                    <span className={`type-badge ${item.type.toLowerCase()}`}>
                      {item.type === 'Movie' ? <Clapperboard size={12}/> : <Tv size={12}/>} {item.type}
                    </span>
                    <strong>{item.title}</strong>
                  </div>
                  <span className="recent-date">
                    {item.year} · {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="card notes-card">
            <SectionHeader title="What this demonstrates" description="For anyone reviewing the repo." />
            <ul className="notes-list">
              <li>Data aggregation from five JSON source files into unified dashboard state.</li>
              <li>Reusable component architecture — KpiCard, SectionHeader, chart wrappers.</li>
              <li>CSS custom property system for cohesive light/dark theming.</li>
              <li>Recharts area, bar, and donut charts with responsive containers.</li>
              <li>Accessible tables, semantic HTML, focus management, skip links.</li>
              <li>Entertainment data only — no proprietary or security-sensitive content.</li>
            </ul>
          </article>
        </section>
      </main>
    </div>
  )
}
