export function ExperienceSection() {
  const education = [
    {
      period: "2025-2026",
      title: "M.S. Machine Learning",
      institution: "University of Tennessee",
      description:
        "I am currently attending University of Tennessee for my Masters of Science in Computer Science with a focus in Machine Learning, here I hope to extend my knowledge of AI and Machine Learning in this ever-changing field.",
    },
    {
      period: "2025",
      title: "AI Engineering Bootcamp",
      institution: "AI Makerspace",
      description:
        "Thoughout this bootcamp I learned about the basics of AI, RAG applications, and how to use Agentica AI within multiple use-cases for a deployed application.",
    },
    {
      period: "2021-2025",
      title: "B.S. Computer Science",
      institution: "Virginia Polytechnic Institute",
      description:
        "I am recent graduate from Virginia Tech's College of Engineering with a Bachelor's of Science in Computer Science, here I learned about the basics of software and hardware of computers.",
    },
  ]

  const experience = [
    {
      period: "2025-Present",
      title: "Associate Software Engineer",
      company: "Proven AI",
      description:
        "As an Associate Software Engineer at Proven AI, I am responsible for developing and maintaining the company's software products. I work on a variety of projects, including the company's personal websites, internal tools, and customer-facing applications.",
    },
    {
      period: "2024-2025",
      title: "Cyber Operations Intern",
      company: "American Systems",
      description:
        "At American Systems I performed IT security operations as a Cyber Operations Intern, including incident response, security tool management, log analysis, and capability development, while enhancing cybersecurity skills in a dynamic enterprise environment.",
    },
    {
      period: "2022-2024",
      title: "Assistant Facilities Manager",
      company: "Revolution Sportsplex",
      description:
        "As Assistant Facilities Manager, I maintained the turf fields to pristine condition, I handled staffing, purchased necessary equipment for maintenance of the facility, handled lighting schedule, and many more tasks.",
    },
  ]

  return (
    <section
      id="experience"
      className="py-20 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <h2 className="text-5xl font-light text-center bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-16 drop-shadow-lg">
          Education & Experience
        </h2>

        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-3xl font-medium text-white mb-8 flex items-center drop-shadow-lg">
              <span className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full mr-4"></span>
              My Education
            </h3>
            <div className="space-y-8">
              {education.map((item, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 group-hover:border-green-400/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-green-500/25 group-hover:-translate-y-1">
                    <div className="inline-block bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-medium px-4 py-2 rounded-full mb-4 shadow-lg">
                      {item.period}
                    </div>
                    <h4 className="text-xl font-medium text-white mb-2 group-hover:text-green-300 transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-green-300 text-sm mb-3 font-medium">{item.institution}</p>
                    <p className="text-gray-200 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-medium text-white mb-8 flex items-center drop-shadow-lg">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full mr-4"></span>
              My Experience
            </h3>
            <div className="space-y-8">
              {experience.map((item, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 group-hover:border-blue-400/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/25 group-hover:-translate-y-1">
                    <div className="inline-block bg-gradient-to-r from-blue-400 to-purple-500 text-white text-xs font-medium px-4 py-2 rounded-full mb-4 shadow-lg">
                      {item.period}
                    </div>
                    <h4 className="text-xl font-medium text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-blue-300 text-sm mb-3 font-medium">{item.company}</p>
                    <p className="text-gray-200 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
