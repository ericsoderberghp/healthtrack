import track from './track';

const store = {};
global.localStorage = {
  getItem: (key) => store[key],
  setItem: (key, value) => (store[key] = value),
};

global.localStorage.setItem('track', JSON.stringify(track));
