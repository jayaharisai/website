import CopyButton from "./copy-button";
import "./code-block.css";

type CodeBlockProps = {
  code: string;
  language: string;
  filename?: string;
};

export default function CodeBlock({ code, language, filename }: CodeBlockProps) {
  return (
    <figure className="code-block">
      <figcaption className="code-block__bar">
        <span className="code-block__label">{filename ?? language}</span>
        <CopyButton text={code} />
      </figcaption>
      <pre className="code-block__pre" tabIndex={0}>
        <code>{code}</code>
      </pre>
    </figure>
  );
}
