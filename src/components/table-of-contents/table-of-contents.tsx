import "./table-of-contents.css";

type TocItem = {
  id: string;
  label: string;
};

type TableOfContentsProps = {
  items: TocItem[];
};

export default function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <nav className="toc" aria-label="On this page">
      <h2 className="toc__title">On this page</h2>
      <ol className="toc__list">
        {items.map(({ id, label }) => (
          <li key={id}>
            <a href={`#${id}`} className="toc__link">
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
