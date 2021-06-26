export async function getAllConfig() {
   const res = await fetch('/api/configurations');
   if (res.ok) {
      const data = await res.json();
      console.log(data);
      return data;
   }
   return null;
}

export async function toggleConfig(name) {
   await fetch(`api/configurations/toggle/${name}`, {
      method: 'POST',
   });
}

export async function getConfigItem(name) {
   const res = await fetch(`api/configurations/${name}`);
   const data = await res.json();
   return data;
}
