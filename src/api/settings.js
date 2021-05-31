export default async function getAllConfig() {
  const res = await fetch("/api/configurations");
  const data = await res.json();
  return data;
}
