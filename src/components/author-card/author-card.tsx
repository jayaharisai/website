import "./author-card.css";

type AuthorCardProps = {
  name: string;
  bio: string;
};

export default function AuthorCard({ name, bio }: AuthorCardProps) {
  return (
    <aside className="author-card" aria-label="About the author">
      <span className="author-card__avatar" aria-hidden="true">
        {name.charAt(0)}
      </span>
      <div className="author-card__text">
        <p className="author-card__label">Written by</p>
        <p className="author-card__name">{name}</p>
        <p className="author-card__bio">{bio}</p>
      </div>
    </aside>
  );
}
