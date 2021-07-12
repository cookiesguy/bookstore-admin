export async function getAllBill() {
   const res = await fetch('/api/bill');
   if (res.ok) {
      const data = await res.json();
      return data;
   }
   return null;
}

export async function deleteBillApi(id) {
   const res = await fetch(`/api/bill/delete/${id}`, {
      headers: {
         'Content-Type': 'application/json',
         Accept: 'application/json',
      },
      method: 'POST',
   });
   if (res.ok) return true;

   return false;
}

export async function getBillDetail(id) {
   const res = await fetch(`/api/bill/detail/${id}`);
   if (res.ok) {
      const data = await res.json();
      return data;
   }
   return null;
}

export async function createBill(customer, books) {
   const bookArray = [];

   books.map(el => {
      const book = {
         bookId: el.id,
         amount: el.amount,
         price: el.price,
      };
      bookArray.push(book);
      return 1;
   });

   const create = await fetch(`/api/bill/`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         Accept: 'application/json',
      },
      body: JSON.stringify({
         CustomerID: parseInt(customer.id),
      }),
   });

   if (!create.ok) return false;

   const bill = await create.json();

   const addBook = await fetch(`/api/bill/detail/${bill.id}`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         Accept: 'application/json',
      },
      body: JSON.stringify(bookArray),
   });

   if (!addBook.ok) return false;

   return true;
}

export async function updateBillApi(id, bookList) {
   const bookArray = [];

   bookList.map(el => {
      const book = {
         bookId: el.id,
         amount: el.amount,
         price: el.price,
      };
      bookArray.push(book);
      return 1;
   });

   const res = await fetch(`/api/bill/detail/update/${id}`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         Accept: 'application/json',
      },
      body: JSON.stringify(bookArray),
   });

   if (res.ok) {
      return true;
   }
   return false;
}
