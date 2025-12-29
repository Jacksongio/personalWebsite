export function ProjectsSection() {
  const projects = [
    {
      title: "GioAdvisor",
      description:
        "'GioGPT.com' is a website that is a personal chatbot. I personally trained this OpenAI API on my own dataset focused on sharp and straight to the point responses using the GPT 4o model. This chatbot has been designed to format Markdown output from the answers, thus permitting GioGPT to create code and answer complex questions.",
      color: "from-orange-400 to-red-500",
      githubUrl: "gioadvisor.com",
    },
    {
      title: "GioBlockchain",
      description:
        "This Python-based blockchain implementation demonstrates core principles like block hashing and chain validation while featuring advanced functionalities such as smart contracts, transaction validation, and decentralized networking. It simulates real-world blockchains like Bitcoin and Ethereum for learning and exploration.",
      color: "from-yellow-400 to-orange-500",
      githubUrl: "https://github.com/jacksongio/GioBlockchain",
    },
    {
      title: "CryptoAnalyzer",
      description:
        "This project is a C-based application designed to read, parse, and analyze historical cryptocurrency data from a CSV file. The program calculates and outputs key statistics such as the average, minimum, and maximum values of cryptocurrency prices over time. This tool is especially useful for understanding trends and making data-driven decisions in cryptocurrency trading.",
      color: "from-green-400 to-blue-500",
      githubUrl: "https://github.com/jacksongio/CryptoAnalyzer",
    },
    {
      title: "miniZip",
      description:
        "miniZip is a minimal C ZIP archiver powered by zlib, reverse-engineered from WinZip’s compression logic. This lightweight CLI tool demonstrates writing local file headers, compressing data, assembling the central directory, and finalizing with the End of Central Directory record—an ideal hands-on ZIP guide.",
      color: "from-purple-400 to-pink-500",
      githubUrl: "https://github.com/jacksongio/GioWorkout",
    },
    {
      title: "GioGPT",
      description:
        "'GioGPT.com' is a website that is a personal chatbot. I personally trained this OpenAI API on my own dataset focused on sharp and straight to the point responses using the GPT 4o model. This chatbot has been designed to format Markdown output from the answers, thus permitting GioGPT to create code and answer complex questions.",
      color: "from-orange-400 to-red-500",
      githubUrl: "https://github.com/jacksongio/GioGPT",
    },
    {
      title: "GioWorkout",
      description:
        "GioWorkout is a personal project that leverages the power of the ChatGPT API to create various innovative applications. GioWorkout is a dynamic workout generator that provides customized workout routines based on user preferences and goals.",
      color: "from-purple-400 to-pink-500",
      githubUrl: "https://github.com/jacksongio/GioWorkout",
    },
  ]

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-light bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent mb-4 drop-shadow-lg">
            Coding Projects
          </h2>
          <p className="text-xl text-gray-200">A showcase of my technical work and personal projects</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden block cursor-pointer"
            >
              {/* Animated background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-500`}
              ></div>

              {/* Glowing border effect */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${project.color} opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500`}
              ></div>

              <div className="relative z-10">
                <h3 className="text-2xl font-medium text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors duration-300">
                  {project.description}
                </p>

                {/* Hover indicator */}
                <div className="mt-6 flex items-center text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                  <span>View Project</span>
                  <svg
                    className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
