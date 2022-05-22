export function getNodeList(token) {
  return fetch('https://nodeapi.projectx.financial/api/v1/nodes/client',{
    method: 'get', 
    headers: new Headers({
        'Authorization': 'Bearer '+token, 
        'Content-Type': 'application/json'
    })
   }).then(data => data.json())
 }