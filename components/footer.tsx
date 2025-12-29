import { Github, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-300">© 2024 Jackson Giordano. All rights reserved.</p>
          </div>

          <div className="flex space-x-6">
            {[
              { icon: Github, href: "https://github.com/jacksongio" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/jacksongio" },
              { icon: Mail, href: "mailto:jackson@giordano.us" },
            ].map((social, index) => {
              const Icon = social.icon
              return (
                <a
                  key={index}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group relative p-3 rounded-full bg-white/5 border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Icon className="relative z-10 w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
