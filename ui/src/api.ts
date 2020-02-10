import axios from 'axios';
import qs from 'qs';

axios.defaults.paramsSerializer = params => {
  return qs.stringify(params, { indices: false }); // param=value1&param=value2
};

function url(path: string) {
  let baseUrl = '';
  if (process.env.REACT_APP_API_BASE_URL) {
    baseUrl = process.env.REACT_APP_API_BASE_URL;
  }
  return `${baseUrl}${path}`;
}

export function search(query: string, size: number, fields: string[] = []) {
  return axios
    .get(url('/search'), {
      params: {
        fields,
        q: query,
        size,
      },
    })
    .then(response => response.data);
}
