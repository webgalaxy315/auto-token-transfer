export function auth(item) {
   return fetch('https://nodeapi.projectx.financial/api/v1/auth/client', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({wallet_address: item })
   })
      .then(data => data.json())
}