export default function BookCard({ book }) {
  const authors = book.authors.length ? book.authors.join(", ") : "Unknown author";
  const year = book.publishedDate ? book.publishedDate.slice(0, 4) : "";

  return (
    <article className="book-card">
      <div className="book-card__cover">
        {book.thumbnail ? (
          <img src={book.thumbnail} alt={`Cover of ${book.title}`} loading="lazy" />
        ) : (
          <div className="book-card__cover-fallback" aria-hidden="true">📖</div>
        )}
      </div>

      <div className="book-card__body">
        <h3 className="book-card__title" title={book.title}>{book.title}</h3>
        {book.subtitle && <p className="book-card__subtitle">{book.subtitle}</p>}
        <p className="book-card__meta">
          {authors}{year && ` · ${year}`}
        </p>

        {book.averageRating && (
          <p className="book-card__rating" title={`${book.averageRating} out of 5`}>
            {"★".repeat(Math.round(book.averageRating))}
            <span className="book-card__rating-value"> {book.averageRating.toFixed(1)}</span>
          </p>
        )}

        {book.description && (
          <p className="book-card__desc">{book.description.slice(0, 160)}…</p>
        )}

        <div className="book-card__footer">
          {book.categories[0] && (
            <span className="book-card__tag">{book.categories[0]}</span>
          )}
          {book.infoLink && (
            <a
              className="book-card__link"
              href={book.infoLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              More info ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
