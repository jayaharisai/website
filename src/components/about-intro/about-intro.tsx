import Image from "next/image";
import "./about-intro.css";

type AboutIntroProps = {
  label?: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
};

export default function AboutIntro({
  label = "About me",
  paragraphs,
  image,
  imageAlt,
}: AboutIntroProps) {
  return (
    <section className="about-intro">
      <div className="about-intro__text">
        <h1 className="about-intro__label">{label}</h1>
        <div className="about-intro__copy">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="about-intro__photo">
        <Image
          src={image}
          alt={imageAlt}
          fill
          unoptimized
          priority
          sizes="(max-width: 1023px) 100vw, 280px"
          className="about-intro__image"
        />
      </div>
    </section>
  );
}
