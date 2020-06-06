export const getParams = () => {
  const { location } = window;
  const params = {};
  location.search
    .slice(1)
    .split('&')
    .forEach((p) => {
      const [k, v] = p.split('=');
      params[k] = decodeURIComponent(v);
    });
  return params;
};

export const sortOn = (array, key, direction = 'asc') => {
  const before = direction === 'asc' ? -1 : 1;
  const after = direction === 'asc' ? 1 : -1;
  array.sort((a, b) => {
    const lowerA = a[key].toLowerCase();
    const lowerB = b[key].toLowerCase();
    if (lowerA < lowerB) return before;
    if (lowerA > lowerB) return after;
    return 0;
  });
};
