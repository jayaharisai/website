import Image from "next/image";
import "./image-figure.css";

type ImageFigureProps = {
  src: string;
  alt?: string;
  caption?: string;
  ratio?: "2/1" | "16/9" | "16/10" | "4/3";
  priority?: boolean;
};

export default function ImageFigure({
  src,
  alt = "",
  caption,
  ratio = "16/9",
  priority = false,
}: ImageFigureProps) {
  return (
    <figure className="image-figure">
      <div className="image-figure__frame" style={{ aspectRatio: ratio }}>
        <Image
          src={src}
          alt={alt || caption || ""}
          fill
          unoptimized
          priority={priority}
          sizes="(max-width: 767px) 100vw, 900px"
          className="image-figure__image"
        />
      </div>
      {caption && <figcaption className="image-figure__caption">{caption}</figcaption>}
    </figure>
  );
}
