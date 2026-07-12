import { useEffect, useRef } from "react";

export default function BookModal({ book, onClose, isFavorite, onToggleFavorite }) {
  const closeRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!book) return null;

  const authors = book.authors.length ? book.authors.join(", ") : "Unknown author";

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={book.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal__close" onClick={onClose} aria-label="Close" ref={closeRef}>
          ✕
        </button>

        <div className="modal__cover">
          {book.thumbnail ? (
            <img src={book.thumbnail.replace("zoom=1", "zoom=3")} alt={`Cover of ${book.title}`} />
          ) : (
            <div className="modal__cover-fallback" aria-hidden="true">📖</div>
          )}
        </div>

        <div className="modal__content">
          <h2 className="modal__title">{book.title}</h2>
          {book.subtitle && <p className="modal__subtitle">{book.subtitle}</p>}

          <p className="modal__meta">
            <strong>{authors}</strong>
            {book.publishedDate && ` · ${book.publishedDate.slice(0, 4)}`}
          </p>

          <div className="modal__stats">
            {book.averageRating && (
              <span className="modal__stat">★ {book.averageRating.toFixed(1)} rating</span>
            )}
            {book.pageCount && (
              <span className="modal__stat">{book.pageCount} pages</span>
            )}
            {book.categories[0] && (
              <span className="modal__stat">{book.categories.join(", ")}</span>
            )}
          </div>

          {book.description && (
            <p className="modal__desc">{book.description}</p>
          )}

          <div className="modal__actions">
            <button
              className={`btn-fav ${isFavorite ? "btn-fav--active" : ""}`}
              onClick={() => onToggleFavorite(book)}
            >
              {isFavorite ? "★ Saved to favorites" : "☆ Save to favorites"}
            </button>
            {book.infoLink && (
              <a
                className="btn-link"
                href={book.infoLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Google Books ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
