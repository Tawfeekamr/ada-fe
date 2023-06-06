import axios from 'axios';

export default function fetchWrapper(method, url, opts) {
  switch (method) {
    case 'post':
      return axios({
        method: 'POST',
        url,
        data: opts,
        headers: opts.headers,
      });
    case 'get':
      return axios.get(url, opts);
    case 'put':
      return axios.put(url, opts);
    default:
      return Promise.reject(new Error('Expected post/get/put'));
  }
}

// function json(response) {
//   return response.json().then((body) => {
//     if (body.isError) {
//       return Promise.reject(body);
//     }
//     return Promise.resolve(body);
//   });
// }
