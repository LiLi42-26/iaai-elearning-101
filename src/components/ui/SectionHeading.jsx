function SectionHeading({ title, subtitle, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 max-w-2xl">{subtitle}</p>}
    </div>
  )
}

export default SectionHeading
