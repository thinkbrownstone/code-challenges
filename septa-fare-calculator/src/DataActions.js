import fetch from 'isomorphic-fetch';

const root = 'http://localhost:3000/';

export default function fetchValue(path) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      const objectPath = path.replace(/\//g, '.');

      dispatch({
        type: 'REQUEST_RECORD',
        path,
      });

      fetch(root.concat(path))
      .then((response) => {
        response.json().then((value) => {
          dispatch({
            type: 'RECEIVE_RECORD',
            path: 'data.'.concat(objectPath),
            object: value,
            receivedAt: Date.now(),
          });
          resolve(value);
        });
      })
      .catch((err) => {
        reject(err);
      });
    });
  };
}
