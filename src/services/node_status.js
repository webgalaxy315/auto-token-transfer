export function getNodeStatus(hash) {
  return fetch('https://avax-rpc.projectx.financial/'+ hash +'/ping', {
    method: 'get', 
    headers: new Headers({
        'Content-Type': 'application/json'
    })
   }).then(data => data.json())
   .catch(() => false);
 }