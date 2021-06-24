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
}
