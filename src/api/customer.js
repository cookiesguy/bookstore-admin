export async function getAllCustomer() {
  const res = await fetch("api/customer");
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
  const res = await fetch("/api/customer", {
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
