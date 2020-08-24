import { useEffect, useState } from 'react';
import { nextId, sortOn, toDateFormat } from './utils';

export const apiUrl =
  'https://us-central1-healthtrack-279819.cloudfunctions.net/tracks';

// when developing, turn off to keep things local
const publish = process.env.NODE_ENV !== 'test';
if (!publish) console.log('!!! NOT PUBLISHING');

export const initialTrack = {
  name: '',
  email: '',
  password: '',
  categories: [
    {
      id: 1,
      name: 'sleep',
      aspect: 'behavior',
      type: 'number',
      units: 'hours',
      times: ['08:00'],
    },
    {
      id: 2,
      name: 'exercise',
      aspect: 'behavior',
      type: 'yes/no',
    },
    { id: 3, name: 'food', aspect: 'behavior', type: 'name' },
    {
      id: 4,
      name: 'water',
      aspect: 'behavior',
      type: 'scale',
      times: ['20:00'],
    },
  ],
  data: [],
  notes: [],
};

export const getCategory = (track, id) =>
  track.categories.find((c) => c.id === id);

export const getData = (track, id) => track.data.find((d) => d.id === id);

const upgrade = (nextTrack) => {
  // convert category type 'rating' to 'scale'
  nextTrack.categories.forEach((category) => {
    if (category.type === 'rating') category.type = 'scale';
  });
  // remove any data without a category
  nextTrack.data = nextTrack.data.filter(
    (d) => d.category && getCategory(nextTrack, d.category),
  );

  // ensure data values are the appropriate types
  nextTrack.data.forEach((data) => {
    const category = getCategory(nextTrack, data.category);
    if (category.type === 'number' && typeof data.value === 'string') {
      data.value = parseFloat(data.value, 10);
      data.name = category.name;
    }
    if (category.type === 'scale' && typeof data.value === 'string') {
      data.value = parseInt(data.value, 10);
      data.name = category.name;
    }
    if (category.type === 'yes/no' && typeof data.value === 'string') {
      data.value = JSON.parse(data.value);
      data.name = category.name;
    }
  });

  // convert category frequency and hour to times
  nextTrack.categories.forEach((category) => {
    const { frequency, hour } = category;
    if (frequency) {
      const h = hour ? `${hour}`.padStart(2, '0') : '12';
      if (frequency === 1) category.times = [`${h}:00`];
      else if (frequency === 2) category.times = ['08:00', '16:00'];
      else if (frequency === 3) category.times = ['08:00', '12:00', '16:00'];
      else if (frequency === 4)
        category.times = ['08:00', '12:00', '16:00', '20:00'];
      else if (frequency === 6)
        category.times = ['08:00', '10:00', '12:00', '14:00', '16:00', '20:00'];
      delete category.frequency;
      delete category.hour;
    }
  });

  // convert universal dates to local dates, assume Pacific Time
  const convertDate = (datum) => {
    if (datum.date.indexOf('Z') !== -1) {
      const date = new Date(datum.date);
      // one-time special case for Christina's data
      if (
        nextTrack.id === 'Christina-Monaco-christina-monacofamily-org' &&
        date.getFullYear() === 2020 &&
        (date.getMonth() < 7 || (date.getMonth() === 7 && date.getDate() < 20))
      ) {
        // subtract two hours to convert from PT to CT
        date.setHours(date.getHours() - 2);
      }
      datum.date = toDateFormat(date);
    }
  };
  nextTrack.data.forEach((datum) => convertDate(datum));
  nextTrack.notes.forEach((datum) => convertDate(datum));
};

export const createTrack = (track) => {
  track.email = track.email.toLowerCase();
  return fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(track),
  })
    .then((response) => response.json())
    .then((nextTrack) => {
      global.localStorage.setItem('track', JSON.stringify(nextTrack));
      return nextTrack;
    });
};

export const signIn = (identity) => {
  identity.email = identity.email.toLowerCase();
  return fetch(`${apiUrl}/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(identity),
  }).then((response) => {
    if (response.ok)
      return response.json().then((nextTrack) => {
        nextTrack.unchanged = true;
        return nextTrack;
      });
    return undefined;
  });
};

export const signOut = () => global.localStorage.removeItem('track');

export const deleteTrack = (track) =>
  fetch(`${apiUrl}/${track.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${track.token}`,
    },
  }).then(() => global.localStorage.removeItem('track'));

export const useTrack = () => {
  const [track, setTrack] = useState();

  // initialize track
  useEffect(() => {
    const stored = global.localStorage.getItem('track');
    if (stored) {
      const lastTrack = JSON.parse(stored);
      if (publish) {
        // load latest
        fetch(`${apiUrl}/${lastTrack.id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${lastTrack.token}`,
          },
        }).then((response) => {
          if (!response.ok) {
            if (response.status === 404) {
              global.localStorage.removeItem('track');
              setTrack(false);
            }
          } else
            return response.json().then((nextTrack) => {
              nextTrack.unchanged = true;
              upgrade(nextTrack);
              global.localStorage.setItem('track', JSON.stringify(nextTrack));
              setTrack(nextTrack);
            });
        });
      } else {
        // !publish
        lastTrack.unchanged = true;
        upgrade(lastTrack);
        setTrack(lastTrack);
      }
    } else setTrack(false);
  }, []);

  useEffect(() => {
    if (publish && track && !track.unchanged) {
      // lazily publish when the user hasn't edited it for a while
      const timer = setTimeout(() => {
        fetch(`${apiUrl}/${track.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${track.token}`,
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify(track),
        })
          .then((response) => response.json())
          .then((nextTrack) => {
            nextTrack.unchanged = true;
            setTrack(nextTrack);
          });
      }, 5000); // wait for 5 seconds of inactivity
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [track]);

  return [
    track,
    (nextTrack) => {
      if (nextTrack)
        global.localStorage.setItem('track', JSON.stringify(nextTrack));
      else global.localStorage.removeItem('track');
      if (nextTrack && track) delete nextTrack.unchanged; // must be changing it
      setTrack(nextTrack);
    },
    () => {
      if (!publish || !track.unchanged) return { then: (f) => f() }; // simulate promise
      return fetch(`${apiUrl}/${track.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${track.token}`,
        },
      }).then((response) => {
        if (response.ok)
          return response.json().then((nextTrack) => {
            nextTrack.unchanged = true;
            upgrade(nextTrack);
            setTrack(nextTrack);
          });
      });
    },
  ];
};

export const addData = (track, nextData) => {
  const nextTrack = JSON.parse(JSON.stringify(track));
  nextTrack.data.unshift({
    id: nextId(nextTrack.data),
    date: toDateFormat(new Date()),
    ...nextData,
  });
  sortOn(nextTrack.data, 'date', 'desc');
  return nextTrack;
};

export const updateData = (track, data, nextData) => {
  const nextTrack = JSON.parse(JSON.stringify(track));
  const index = nextTrack.data.findIndex((d) => d.id === data.id);
  nextTrack.data[index] = { ...data, ...nextData };
  sortOn(nextTrack.data, 'date', 'desc');
  return nextTrack;
};

export const deleteData = (track, data) => {
  const nextTrack = JSON.parse(JSON.stringify(track));
  const index = nextTrack.data.findIndex((d) => d.id === data.id);
  nextTrack.data.splice(index, 1);
  return nextTrack;
};

export const addNote = (track, nextNote) => {
  const nextTrack = JSON.parse(JSON.stringify(track));
  nextTrack.notes.unshift({
    id: nextId(nextTrack.notes),
    date: toDateFormat(new Date()),
    text: '',
    ...nextNote,
  });
  sortOn(nextTrack.notes, 'date', 'desc');
  return nextTrack;
};

export const updateNote = (track, note, nextNote) => {
  const nextTrack = JSON.parse(JSON.stringify(track));
  const index = nextTrack.notes.findIndex((n) => n.id === note.id);
  nextTrack.notes[index] = { ...note, ...nextNote };
  sortOn(nextTrack.notes, 'date', 'desc');
  return nextTrack;
};

export const deleteNote = (track, note) => {
  const nextTrack = JSON.parse(JSON.stringify(track));
  const index = nextTrack.notes.findIndex((n) => n.id === note.id);
  nextTrack.notes.splice(index, 1);
  return nextTrack;
};
