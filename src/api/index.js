export async function getAllBooks() {
  const res = await fetch("https://localhost:5001/api/book");
  const data = await res.json();
  return data;
}
export async function getAllCategory() {
  const res = await fetch("https://localhost:5001/api/book/types");
  const data = await res.json();
  return data;
}
