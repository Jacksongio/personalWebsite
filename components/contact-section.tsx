import { Button } from "@/components/ui/button"
import { Mail, MapPin, User } from "lucide-react"
import Link from "next/link"

export function ContactSection() {
  const contactInfo = [
    { icon: User, label: "Name", value: "Jackson Giordano" },
    { icon: Mail, label: "Email", value: "jackson@giordano.us" },
    { icon: MapPin, label: "From", value: "Reston, Virginia" },
  ]

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-black via-gray-900 to-purple-900 relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-light bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4 drop-shadow-lg">
          Get In Touch
        </h2>
        <p className="text-xl text-gray-200 mb-12">I'm always interested in new opportunities and collaborations</p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {contactInfo.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="group text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-2"
              >
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
                  <div className="relative w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-2 group-hover:text-gray-300 transition-colors duration-300">
                  {item.label}
                </p>
                <p className="text-white font-medium group-hover:text-blue-200 transition-colors duration-300 drop-shadow-md">
                  {item.value}
                </p>
              </div>
            )
          })}
        </div>

        <Link href="mailto:jackson@giordano.us">
          <Button
            size="lg"
            className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white px-12 py-4 rounded-full text-lg font-medium shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 group overflow-hidden"
          >
            <span className="relative z-10">Send Message</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          </Button>
        </Link>
      </div>
    </section>
  )
}
