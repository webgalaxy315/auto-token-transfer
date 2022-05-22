export function setNodeApi(amount,token) {
   return fetch('https://nodeapi.projectx.financial/api/v1/nodes/create', {
      method: 'POST',
      headers: new Headers({
         'Authorization': 'Bearer ' + token,
         'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ amount })
   }).then(data => data.json());
}