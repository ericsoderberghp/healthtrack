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
  const keys = Array.isArray(key) ? key : [key];
  array.sort((a, b) => {
    for (let i = 0; i < keys.length; i += 1) {
      const lowerA = a[keys[i]].toLowerCase();
      const lowerB = b[keys[i]].toLowerCase();
      if (lowerA < lowerB) return before;
      if (lowerA > lowerB) return after;
    }
    return 0;
  });
  return array;
};

export const nextId = (array) => {
  let nextId = 1;
  array.forEach((item) => {
    nextId = Math.max(nextId, item.id + 1);
  });
  return nextId;
};

export const sameDate = (date1, date2, includeHour) => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate() &&
    (!includeHour || d1.getHours() === d2.getHours())
  );
};

export const betweenDates = (date1, date2, date3) => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const d3 = typeof date3 === 'string' ? new Date(date3) : date3;
  return (
    d1.getFullYear() >= d2.getFullYear() &&
    d1.getMonth() >= d2.getMonth() &&
    d1.getDate() >= d2.getDate() &&
    d1.getFullYear() <= d3.getFullYear() &&
    d1.getMonth() <= d3.getMonth() &&
    d1.getDate() <= d3.getDate()
  );
};

export const alignDate = (date, offset = 0) => {
  const result = new Date(date);
  result.setHours(12 + offset);
  result.setMinutes(0);
  result.setSeconds(0);
  return result;
};

// assumes date is aligned already
export const frequencyDates = (date, frequency) => {
  if (frequency === 1) return [alignDate(date)];
  if (frequency === 2) return [alignDate(date, -4), alignDate(date, +4)];
  if (frequency === 3)
    return [alignDate(date, -4), alignDate(date), alignDate(date, +4)];
  if (frequency === 4)
    return [
      alignDate(date, -4),
      alignDate(date),
      alignDate(date, +4),
      alignDate(date, +8),
    ];
  return []; // don't handle > 4 frequency yet
};
