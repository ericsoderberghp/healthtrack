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

export const sortCategories = (c1, c2) => {
  if (c1.times && !c2.times) return -1;
  if (c2.times && !c1.times) return 1;
  if (c1.times && c2.times) {
    if (c1.times[0] < c2.times[0]) return -1;
    if (c2.times[0] < c1.times[0]) return 1;
  }
  const n1 = c1.name.toLowerCase();
  const n2 = c2.name.toLowerCase();
  if (n1 < n2) return -1;
  if (n2 < n1) return 1;
  return 0;
};

export const nextId = (array) => {
  let nextId = 1;
  array.forEach((item) => {
    nextId = Math.max(nextId, item.id + 1);
  });
  return nextId;
};

const toZeroPadString = (num, size) => `${num}`.padStart(size, '0');

export const toDateFormat = (date, hours, minutes) =>
  `${date.getFullYear()}-${toZeroPadString(
    date.getMonth() + 1,
    2,
  )}-${toZeroPadString(date.getDate(), 2)} ${toZeroPadString(
    hours !== undefined ? hours : date.getHours(),
    2,
  )}:${toZeroPadString(
    minutes !== undefined ? minutes : date.getMinutes(),
    2,
  )}`;

const appDateExp = new RegExp(/^(\d+)-(\d+)-(\d+) (\d+):(\d+)$/);

export const parseDate = (date, zeroMonth = false) => {
  if (!date) return [];
  let d;
  if (date instanceof Date) d = date;
  // already a Date object
  else if (date.indexOf('Z') !== -1) d = new Date(date); // UTC date
  if (d) {
    return [
      d.getFullYear(),
      d.getMonth() + (zeroMonth ? 0 : 1),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
    ];
  }
  // app date format: 'YYYY-MM-DD HH:mm'
  return date
    .match(appDateExp)
    .slice(1)
    .map((f) => Number.parseInt(f, 10))
    .map((f, i) => (i === 1 && zeroMonth ? f - 1 : f));
};

export const toDate = (date) => new Date(...parseDate(date, true));

export const sameDate = (date1, date2, includeHour) => {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  return (
    d1[0] === d2[0] &&
    d1[1] === d2[1] &&
    d1[2] === d2[2] &&
    (!includeHour || d1[3] === d2[3])
  );
};

export const betweenDates = (date1, date2, date3) => {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  d2.setHours(0);
  const d3 = toDate(date3);
  d3.setHours(24);
  return d1 > d2 && d1 < d3;
};

export const getTime = (date) => {
  const d = toDate(date);
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
  setTime(toDate(date) || new Date(), time)
    .toLocaleString(undefined, {
      hour: 'numeric',
    })
    .toLowerCase();
