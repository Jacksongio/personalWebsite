import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="mb-8">
          <div className="relative w-40 h-40 mx-auto mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20 shadow-2xl group-hover:scale-105 transition-transform duration-500">
              <Image
                src="/profile.jpg"
                alt="Jackson Giordano"
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h1 className="text-6xl font-light text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
            Jackson Giordano
          </h1>
          <p className="text-2xl text-blue-200 mb-2 animate-fade-in-up delay-300 drop-shadow-lg">
            Software Engineer
          </p>
          <p className="text-lg text-purple-200 animate-fade-in-up delay-500 drop-shadow-lg">
            Proven AI
          </p>
        </div>

        <p className="text-lg text-gray-100 max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up delay-700 drop-shadow-lg">
        I am a recent Computer Science graduate from Virginia Tech's College of Engineering, and an Associate Software Engineer at Proven AI. I am also currently a student at University of Tennessee for their Masters of Science in Computer Science program with a focus in Software Engineering. I am always looking for more to learn, and am always looking to collaborate on any coding projects!
        </p>

        <div className="flex justify-center space-x-6 animate-fade-in-up delay-1000">
          <Link href="https://github.com/jacksongio" target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">View My Work</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </Link>
          <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              size="lg"
              className="relative px-8 py-4 rounded-full text-lg font-medium bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm transition-all duration-300 group hover:shadow-lg hover:shadow-white/25"
            >
              <span className="relative z-10">Download Resume</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
