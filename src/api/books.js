const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

export async function searchBooks(query, { maxResults = 20, startIndex = 0 } = {}) {
  if (!query.trim()) return { items: [], totalItems: 0 };

  const params = new URLSearchParams({
    q: query,
    maxResults: String(maxResults),
    startIndex: String(startIndex),
    printType: "books",
  });

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  const data = await res.json();
  return {
    items: (data.items || []).map(normalizeBook),
    totalItems: data.totalItems || 0,
  };
}

function normalizeBook(item) {
  const v = item.volumeInfo || {};
  return {
    id: item.id,
    title: v.title || "Untitled",
    subtitle: v.subtitle || "",
    authors: v.authors || [],
    description: v.description || "",
    thumbnail: v.imageLinks?.thumbnail?.replace("http://", "https://") || "",
    infoLink: v.infoLink || "",
    publishedDate: v.publishedDate || "",
    categories: v.categories || [],
    averageRating: v.averageRating || null,
    pageCount: v.pageCount || null,
  };
}
