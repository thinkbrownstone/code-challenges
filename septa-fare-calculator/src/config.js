import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import fares from './fares.json';

// This sets the mock adapter on the default instance
var mock = new MockAdapter(axios);

// Mock any GET request to /fares
// arguments for reply are (status, data, headers)
mock.onGet('/fares').reply(200, {
  fares
});

export default axios
