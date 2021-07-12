export async function addNewPaymentApi(customerId, money) {
   const res = await fetch(`/api/receipt`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         Accept: 'application/json',
      },
      body: JSON.stringify({
         CustomerID: parseInt(customerId),
         MoneyAmount: money,
      }),
   });

   if (res.ok) {
      return true;
   }

   return false;
}

export async function getAllPayment() {
   const res = await fetch('/api/receipt');

   if (res.ok) {
      const data = await res.json();

      return data;
   } else return null;
}

export async function deletePayment(id) {
   const res = await fetch(`/api/receipt/delete/${id}`, {
      method: 'POST',
   });

   if (res.ok) {
      return true;
   }

   return false;
}

export async function updatePayment(id, money) {
   const res = await fetch(` /api/receipt/update`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         Accept: 'application/json',
      },
      body: JSON.stringify({
         ReceiptID: id,
         MoneyAmount: money,
      }),
   });

   if (res.ok) {
      return true;
   }

   return false;
}
