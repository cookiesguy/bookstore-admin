export async function getAllBooks() {
  const res = await fetch("/api/book");
  if (res.ok) {
    const data = await res.json();

    return data;
  } else return null;
}

export async function getAllCategory() {
  const res = await fetch("/api/book/types");
  if (res.ok) {
    const data = await res.json();

    return data;
  } else return null;
}

export async function upDateBook(book) {
  const data = {
    Id: book.id,
    Title: book.name,
    Author: book.author,
    TypeID: book.category.id,
    Amount: book.amount,
  };
  console.log(data);
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
  return false;
}

export async function addNewBook(newBook) {
  const data = {
    Id: newBook.id,
    Title: newBook.name,
    Author: newBook.author,
    TypeID: newBook.category.id,
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
  } else {
    return false;
  }
}

export async function deleteBook(id) {
  console.log(id);
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
  return false;
}
