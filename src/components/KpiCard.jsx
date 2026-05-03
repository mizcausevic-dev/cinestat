export default function KpiCard({ label, value, sub, tone = 'teal' }) {
  return (
    <article className={`card kpi kpi-${tone}`}>
      <p className="eyebrow">{label}</p>
      <h3>{value}</h3>
      <p className="kpi-sub">{sub}</p>
    </article>
  )
}
