import { useState, useRef, useEffect } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <span className="search-bar__icon" aria-hidden="true">🔍</span>
      <input
        ref={inputRef}
        type="search"
        className="search-bar__input"
        placeholder="Search by title, author, or keyword…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search books"
      />
      <button type="submit" className="search-bar__button" disabled={loading}>
        {loading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
