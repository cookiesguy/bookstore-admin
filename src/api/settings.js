export async function getAllConfig() {
   const res = await fetch('/api/configurations');
   if (res.ok) {
      const data = await res.json();

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

export async function changeConfigValue(configs) {
   const newConfigs = {};
   configs.map(el => {
      newConfigs[el.name] = el.value;
      return 1;
   });

   const res = await fetch(`/api/configurations/update`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         Accept: 'application/json',
      },
      body: JSON.stringify(newConfigs),
   });

   console.log(res);
}
