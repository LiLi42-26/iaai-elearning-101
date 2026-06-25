function Card({ title, description, className = '', children }) {
  return (
    <div className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 ${className}`}>
      {(title || description) && (
        <div className="mb-4 space-y-2">
          {title && <h2 className="text-xl font-semibold text-slate-900">{title}</h2>}
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card
