export async function getBookReport(month, year) {
   const res = await fetch(
      `/api/report/books-report?month=${month}&year=${year}`
   );
   if (res.ok) {
      const data = await res.json();
      return data;
   } else return null;
}

export async function getDebtReport(month, year) {
   const res = await fetch(
      `/api/report/debt-report?month=${month}&year=${year}`
   );
   if (res.ok) {
      const data = await res.json();
      console.log(data);
      return data;
   } else return null;
}
