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
  console.log(JSON.stringify(data));
  const jsonRes = await res.json();
  console.log(jsonRes);
}

export async function addNewBook(newBook) {
  console.log(newBook);
  const data = {
    Id: newBook.id,
    Title: newBook.name,
    Author: newBook.author,
    TypeID: newBook.type,
    Amount: parseInt(newBook.amount),
  };
  console.log(JSON.stringify(data));
  const res = await fetch("/api/book", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  const jsonRes = await res.json();
  console.log(jsonRes);
}

export async function deleteBook(id) {
  const res = await fetch(`/api/book/delete/${id}`);
  const data = await res.json();
  console.log(data);
}
