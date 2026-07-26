import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { ExperienceSection } from "@/components/experience-section"
import { ProjectsSection } from "@/components/projects-section"
import { ContactSection } from "@/components/contact-section"
import { ScrollStory } from "@/components/scroll/scroll-story"

export default function Home() {
  return (
    <ScrollStory>
      <div className="min-h-screen overflow-x-clip bg-ink text-paper">
        <Navigation />
        <main>
          <HeroSection />
          <div className="relative z-10">
            <StatsSection />
            <ExperienceSection />
            <ProjectsSection />
            <ContactSection />
          </div>
        </main>
      </div>
    </ScrollStory>
  )
}
