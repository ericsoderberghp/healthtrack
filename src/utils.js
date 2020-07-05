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
      let valueA = a[keys[i]];
      let valueB = b[keys[i]];
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }
      if (valueA < valueB) return before;
      if (valueA > valueB) return after;
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
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d2.setHours(0);
  const d3 = new Date(date3);
  d3.setHours(24);
  return d1 > d2 && d1 < d3;
};

export const getTime = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hours = d.getHours();
  const minutes = d.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
};

export const alignDate = (date, offset = 0) => {
  const result = new Date(date);
  result.setHours(12 + offset);
  result.setMinutes(0);
  result.setSeconds(0);
  return result;
};

export const setTime = (date, time) => {
  const result = new Date(date);
  if (time) {
    const parts = time.split(':');
    result.setHours(parts[0]);
    result.setMinutes(parts[1] || 0);
    result.setSeconds(parts[2] || 0);
  }
  return result;
};

export const dateTimes = (date, times) =>
  times.map((time) => setTime(date, time));

export const timeLabel = (date, time) =>
  setTime(date || new Date(), time).toLocaleString(undefined, {
    hour: 'numeric',
  });
