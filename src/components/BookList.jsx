import BookCard from "./BookCard.jsx";

export default function BookList({
  books,
  loading,
  error,
  hasSearched,
  onSelect,
  isFavorite,
  onToggleFavorite,
  onLoadMore,
  canLoadMore,
  loadingMore,
}) {
  if (loading) {
    return (
      <div className="book-list book-list--loading" aria-busy="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="book-card book-card--skeleton" key={i}>
            <div className="book-card__cover skeleton" />
            <div className="book-card__body">
              <div className="skeleton skeleton--line" style={{ width: "80%" }} />
              <div className="skeleton skeleton--line" style={{ width: "50%" }} />
              <div className="skeleton skeleton--line" style={{ width: "90%" }} />
              <div className="skeleton skeleton--line" style={{ width: "70%" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="state state--error" role="alert">
        <span className="state__icon">⚠️</span>
        <p>{error}</p>
        <p className="state__hint">Please try again in a moment.</p>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="state state--empty">
        <span className="state__icon">📚</span>
        <p className="state__title">Find your next great read</p>
        <p className="state__hint">Search millions of books by title, author, or topic.</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="state state--empty">
        <span className="state__icon">🔍</span>
        <p className="state__title">No books found</p>
        <p className="state__hint">Try a different search term.</p>
      </div>
    );
  }

  return (
    <>
      <div className="book-list">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onSelect={onSelect}
            isFavorite={isFavorite(book.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {canLoadMore && (
        <div className="book-list__more">
          <button className="load-more" onClick={onLoadMore} disabled={loadingMore}>
            {loadingMore ? "Loading…" : "Load more results"}
          </button>
        </div>
      )}
    </>
  );
}
