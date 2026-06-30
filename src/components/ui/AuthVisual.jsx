import loginVisual from "../../assets/login-visual.jpg";

function AuthVisual({ topBadge, bottomCard }) {
  return (
    <section className="hidden lg:flex relative aspect-square items-center justify-center">
      <div className="absolute top-1/4 -right-10 w-64 h-64 bg-pink-500/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 -left-10 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full" />

      {/* Image principale avec effet de zoom/pan en boucle (Ken Burns) */}
      <div className="relative w-full h-full max-w-[500px] max-h-[500px] rounded-3xl shadow-2xl overflow-hidden">
        <img
          src={loginVisual}
          alt="IA Learning"
          className="w-full h-full object-cover animate-kenburns"
        />
        {/* léger voile pour assurer la lisibilité des badges blancs par-dessus */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {topBadge && (
        <div
          className="animate-float absolute -top-4 right-6 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-xl"
        >
          <span className="material-symbols-outlined text-cyan-500">
            {topBadge.icon}
          </span>
          <span className="text-sm font-bold text-[#0b1c30]">
            {topBadge.label}
          </span>
        </div>
      )}

      {bottomCard && (
        <div
          className="animate-float-delayed absolute bottom-10 right-4 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl max-w-[280px]"
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full ${bottomCard.iconBg}`}
          >
            <span className="material-symbols-outlined text-white">
              {bottomCard.icon}
            </span>
          </span>
          <div>
            <div className="text-sm font-bold text-[#0b1c30]">
              {bottomCard.title}
            </div>
            <div className="text-xs text-[#7e7385]">
              {bottomCard.subtitle}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
export default AuthVisual;