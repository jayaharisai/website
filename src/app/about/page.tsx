import type { Metadata } from "next";
import { AboutIntro } from "@/components/about-intro";
import { LogoMarquee } from "@/components/logo-marquee";
import { aboutParagraphs, tools } from "@/data/about";
import "@/components/shared/layout.css";
import "./page.css";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="page-container page-container--md about-page">
      <AboutIntro
        paragraphs={aboutParagraphs}
        image="/about/portrait.jpg"
        imageAlt="Hiker crossing a mountain stream"
      />
      <LogoMarquee items={tools} />
    </main>
  );
}
