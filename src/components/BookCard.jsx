export default function BookCard({ book, onSelect, isFavorite, onToggleFavorite }) {
  const authors = book.authors.length ? book.authors.join(", ") : "Unknown author";
  const year = book.publishedDate ? book.publishedDate.slice(0, 4) : "";

  function handleFavorite(e) {
    e.stopPropagation();
    onToggleFavorite(book);
  }

  return (
    <article
      className="book-card"
      onClick={() => onSelect(book)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(book);
        }
      }}
    >
      <div className="book-card__cover">
        {book.thumbnail ? (
          <img src={book.thumbnail} alt={`Cover of ${book.title}`} loading="lazy" />
        ) : (
          <div className="book-card__cover-fallback" aria-hidden="true">📖</div>
        )}
        <button
          className={`book-card__fav ${isFavorite ? "book-card__fav--active" : ""}`}
          onClick={handleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "★" : "☆"}
        </button>
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
          <span className="book-card__link">View details ↗</span>
        </div>
      </div>
    </article>
  );
}
