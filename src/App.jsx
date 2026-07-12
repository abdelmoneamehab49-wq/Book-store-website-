import { useState, useCallback, useEffect } from "react";
import SearchBar from "./components/SearchBar.jsx";
import BookList from "./components/BookList.jsx";
import BookModal from "./components/BookModal.jsx";
import { searchBooks } from "./api/books.js";
import {
  loadFavorites,
  saveFavorites,
  loadTheme,
  saveTheme,
} from "./utils/storage.js";

const PAGE_SIZE = 24;
const MAX_RESULTS = 120;

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedBook, setSelectedBook] = useState(null);
  const [favorites, setFavorites] = useState(loadFavorites);
  const [view, setView] = useState("search"); // "search" | "favorites"
  const [theme, setTheme] = useState(loadTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const isFavorite = useCallback(
    (id) => favorites.some((b) => b.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((book) => {
    setFavorites((prev) =>
      prev.some((b) => b.id === book.id)
        ? prev.filter((b) => b.id !== book.id)
        : [book, ...prev]
    );
  }, []);

  const runSearch = useCallback(async (query, { append = false } = {}) => {
    const nextStart = append ? startIndex : 0;
    append ? setLoadingMore(true) : setLoading(true);
    setError("");
    if (!append) {
      setHasSearched(true);
      setLastQuery(query);
      setView("search");
    }
    try {
      const { items, totalItems: total } = await searchBooks(query, {
        maxResults: PAGE_SIZE,
        startIndex: nextStart,
      });
      setBooks((prev) => (append ? [...prev, ...items] : items));
      setTotalItems(total);
      setStartIndex(nextStart + items.length);
    } catch (err) {
      if (!append) {
        setError(err.message || "Something went wrong while searching.");
        setBooks([]);
      }
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
    }
  }, [startIndex]);

  const handleSearch = useCallback(
    (query) => runSearch(query, { append: false }),
    [runSearch]
  );

  const handleLoadMore = useCallback(() => {
    if (startIndex < Math.min(totalItems, MAX_RESULTS)) {
      runSearch(lastQuery, { append: true });
    }
  }, [runSearch, lastQuery, startIndex, totalItems]);

  const canLoadMore =
    hasSearched &&
    startIndex < totalItems &&
    startIndex < MAX_RESULTS;

  const favBooks = favorites;

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__topbar">
          <div className="app__brand">
            <span className="app__logo" aria-hidden="true">📚</span>
            <h1 className="app__title">Book Finder</h1>
          </div>
          <div className="app__topbar-actions">
            <button
              className="icon-btn"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        <p className="app__tagline">Search millions of books instantly</p>

        <SearchBar onSearch={handleSearch} loading={loading} />

        <nav className="app__tabs" aria-label="Views">
          <button
            className={`tab ${view === "search" ? "tab--active" : ""}`}
            onClick={() => setView("search")}
          >
            Search{hasSearched && books.length ? ` (${books.length})` : ""}
          </button>
          <button
            className={`tab ${view === "favorites" ? "tab--active" : ""}`}
            onClick={() => setView("favorites")}
          >
            ★ Favorites ({favorites.length})
          </button>
        </nav>
      </header>

      <main className="app__main">
        {view === "favorites" ? (
          favorites.length === 0 ? (
            <div className="state state--empty">
              <span className="state__icon">★</span>
              <p className="state__title">No favorites yet</p>
              <p className="state__hint">Tap the ☆ on any book to save it here.</p>
            </div>
          ) : (
            <div className="book-list">
              {favBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onSelect={setSelectedBook}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )
        ) : (
          <>
            {hasSearched && !loading && !error && (
              <p className="app__results-meta">
                {books.length
                  ? `${books.length} of ${totalItems.toLocaleString()} results for "${lastQuery}"`
                  : `No results for "${lastQuery}"`}
              </p>
            )}
            <BookList
              books={books}
              loading={loading}
              error={error}
              hasSearched={hasSearched}
              onSelect={setSelectedBook}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onLoadMore={handleLoadMore}
              canLoadMore={canLoadMore}
              loadingMore={loadingMore}
            />
          </>
        )}
      </main>

      <footer className="app__footer">
        <p>Powered by the Google Books API</p>
      </footer>

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          isFavorite={isFavorite(selectedBook.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}
