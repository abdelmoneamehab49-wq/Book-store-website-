import { useState, useCallback } from "react";
import SearchBar from "./components/SearchBar.jsx";
import BookList from "./components/BookList.jsx";
import { searchBooks } from "./api/books.js";

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (query) => {
    setLoading(true);
    setError("");
    setLastQuery(query);
    setHasSearched(true);
    try {
      const { items } = await searchBooks(query, { maxResults: 24 });
      setBooks(items);
    } catch (err) {
      setError(err.message || "Something went wrong while searching.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__logo" aria-hidden="true">📚</span>
          <h1 className="app__title">Book Finder</h1>
        </div>
        <p className="app__tagline">Search millions of books instantly</p>
        <SearchBar onSearch={handleSearch} loading={loading} />
      </header>

      <main className="app__main">
        {hasSearched && !loading && !error && (
          <p className="app__results-meta">
            {books.length
              ? `Showing results for "${lastQuery}"`
              : `No results for "${lastQuery}"`}
          </p>
        )}
        <BookList
          books={books}
          loading={loading}
          error={error}
          hasSearched={hasSearched}
        />
      </main>

      <footer className="app__footer">
        <p>Powered by the Google Books API</p>
      </footer>
    </div>
  );
}
