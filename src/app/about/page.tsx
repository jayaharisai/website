import type { Metadata } from "next";
import { AboutIntro } from "@/components/about-intro";
import { LogoMarquee } from "@/components/logo-marquee";
import { aboutParagraphs, skills, tools } from "@/data/about";
import "@/components/shared/layout.css";
import "./page.css";

export const metadata: Metadata = {
  title: "About",
  description: "Senior Software Engineer building with LLMs, fine-tuning and AI agents.",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="page-container page-container--md about-page">
      <AboutIntro
        paragraphs={aboutParagraphs}
        image="/about/portrait.jpg"
        imageAlt="Hiker crossing a mountain stream"
      />
      <div className="about-page__marquees">
        <LogoMarquee items={skills} label="What I work on" duration={40} />
        <LogoMarquee items={tools} label="Tools and technologies I use" duration={70} reverse />
      </div>
    </main>
  );
}
