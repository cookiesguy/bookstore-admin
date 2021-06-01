export async function getAllBooks() {
  const res = await fetch("/api/book");
  const data = await res.json();
  return data;
}

export async function getAllCategory() {
  const res = await fetch("/api/book/types");
  const data = await res.json();
  return data;
}

export async function upDateBook(book) {
  const data = {
    Id: book.id,
    Title: book.name,
    Author: book.author,
    TypeID: book.type,
    Amount: book.amount,
  };
  const res = await fetch("/api/book/update", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  if (res.ok) {
    return true;
  }
}

export async function addNewBook(newBook) {
  const data = {
    Id: newBook.id,
    Title: newBook.name,
    Author: newBook.author,
    TypeID: newBook.type,
    Amount: parseInt(newBook.amount),
  };
  const res = await fetch("/api/book", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  if (res.ok) {
    return true;
  }
}

export async function deleteBook(id) {
  const res = await fetch(`/api/book/delete/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "POST",
  });
  if (res.ok) {
    return true;
  }
}
