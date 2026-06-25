function Input({ label, type = 'text', error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>}
      <input
        type={type}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 text-base outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
        {...props}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default Input
