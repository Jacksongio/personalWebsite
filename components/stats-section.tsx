export function StatsSection() {
  const stats = [
    { number: "7", label: "Projects Deployed" },
    { number: "32", label: "Github Project Repositories" },
    { number: "12", label: "Years Experience with programming" },
    { number: "5", label: "Computers Built" },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_50%)]"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="text-5xl font-light bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-200 leading-tight group-hover:text-white transition-colors duration-300 drop-shadow-md">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
