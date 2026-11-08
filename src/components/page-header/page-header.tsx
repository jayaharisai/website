import "../shared/typography.css";
import "./page-header.css";

type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="page-header">
      <h1 className="heading-1">{title}</h1>
      {description && <p className="description">{description}</p>}
    </header>
  );
}
