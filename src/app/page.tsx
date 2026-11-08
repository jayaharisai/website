import { GridHighlight } from "@/components/grid-highlight";
import { Hero } from "@/components/hero";
import { PrimaryButton } from "@/components/primary-button";
import { SecondaryButton } from "@/components/secondary-button";
import "./page.css";

export default function Home() {
  return (
    <main id="main-content" className="home">
      <GridHighlight />
      <Hero />
      <div className="home__actions">
        <PrimaryButton href="/about">View About</PrimaryButton>
        <SecondaryButton href="/posts">Read Posts</SecondaryButton>
      </div>
    </main>
  );
}
