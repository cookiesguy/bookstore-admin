export async function getAllCustomer() {
   const res = await fetch('api/customer');
   if (res.ok) {
      const data = await res.json();
      return data;
   } else {
      return null;
   }
}

export async function addNewCustomer(newCustomer) {
   const data = {
      Name: newCustomer.name,
      PhoneNumber: newCustomer.phoneNumber,
      Address: newCustomer.address,
      Email: newCustomer.email,
   };
   const res = await fetch('/api/customer', {
      headers: {
         'Content-Type': 'application/json',
         Accept: 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
   });
   if (res.ok) {
      return true;
   }
   return false;
}

export async function updateCustomer(customer) {
   const res = await fetch('/api/customer/update', {
      headers: {
         'Content-Type': 'application/json',
         Accept: 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
         CustomerID: customer.id,
         Name: customer.name,
         Email: customer.email,
         Address: customer.address,
         PhoneNumber: customer.phoneNumber,
      }),
   });
   if (res.ok) {
      return true;
   }
   return false;
}
