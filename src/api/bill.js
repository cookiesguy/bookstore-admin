export async function getAllBill() {
  const res = await fetch("/api/bill");
  const data = await res.json();
  console.log(data);
  return data;
}

export async function deleteBillApi(id) {
  const res = await fetch(`/api/bill/delete/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "POST",
  });
  console.log(res);
}
