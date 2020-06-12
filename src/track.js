import { useEffect, useState } from 'react';

export const apiUrl =
  'https://us-central1-healthtrack-279819.cloudfunctions.net/tracks';

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
      frequency: 1,
    },
    {
      id: 2,
      name: 'exercise',
      aspect: 'behavior',
      type: 'yes/no',
      frequency: '',
    },
    { id: 3, name: 'food', aspect: 'behavior', type: 'name', frequency: '' },
    { id: 4, name: 'water', aspect: 'behavior', type: 'rating', frequency: 1 },
  ],
  data: [],
  notes: [],
};

const developmentTrack = JSON.parse(JSON.stringify(initialTrack));
developmentTrack.name = 'my name';
developmentTrack.email = 'my@email';
developmentTrack.password = 'password';

// load with more for development
developmentTrack.categories.push({
  id: 5,
  name: 'weight',
  aspect: 'behavior',
  type: 'number',
  units: 'pounds',
});
developmentTrack.categories.push({
  id: 6,
  name: 'nap',
  aspect: 'behavior',
  type: 'yes/no',
  date: new Date().toISOString(),
});
developmentTrack.categories.push({
  id: 7,
  name: 'fatigue',
  aspect: 'symptom',
  type: 'rating',
});
developmentTrack.categories.push({
  id: 8,
  name: 'headache',
  aspect: 'symptom',
  type: 'yes/no',
});
developmentTrack.categories.push({
  id: 9,
  name: 'ibuprofen',
  aspect: 'behavior',
  type: 'yes/no',
});

let random = 0;
const nextRandom = () => {
  random += 1;
  return random;
};
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const date = new Date(yesterday);
date.setDate(yesterday.getDate() - 5);
let id = 1;
const nextId = () => {
  id += 1;
  return id;
};
while (date <= yesterday) {
  developmentTrack.data.unshift({
    id: nextId(),
    date: date.toISOString(),
    category: 1, // sleep
    name: 'sleep',
    value: 6 + (nextRandom() % 3),
  });
  if (!(nextRandom() % 3)) {
    developmentTrack.data.unshift({
      id: nextId(),
      date: date.toISOString(),
      category: 3, // food
      name: 'breakfast',
      value: 'breakfast',
    });
  }
  if (nextRandom() % 2) {
    developmentTrack.data.unshift({
      id: nextId(),
      date: date.toISOString(),
      category: 2, // exercise
      name: 'exercise',
      value: true,
    });
  }
  developmentTrack.data.unshift({
    id: nextId(),
    date: date.toISOString(),
    category: 3, // food
    name: 'lunch',
    value: 'lunch',
  });
  developmentTrack.data.unshift({
    id: nextId(),
    date: date.toISOString(),
    category: 4, // water
    name: 'water',
    value: 1 + (nextRandom() % 4),
  });
  date.setDate(date.getDate() + 1);
}

export const createTrack = (track) =>
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(track),
  })
    .then((response) => response.json())
    .then((nextTrack) => {
      localStorage.setItem('track', JSON.stringify(nextTrack));
      return nextTrack;
    });

export const signIn = (identity) =>
  fetch(`${apiUrl}/get`, {
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

export const signOut = () => localStorage.removeItem('track');

export const deleteTrack = (track) =>
  fetch(`${apiUrl}/${track.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${track.token}`,
    },
  }).then(() => localStorage.removeItem('track'));

export const useTrack = () => {
  const [track, setTrack] = useState();

  // initialize track
  useEffect(() => {
    const stored = localStorage.getItem('track');
    if (stored) {
      const lastTrack = JSON.parse(stored);
      // load latest
      fetch(`${apiUrl}/${lastTrack.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${lastTrack.token}`,
        },
      }).then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            localStorage.removeItem('track');
            setTrack(false);
          }
        } else
          return response.json().then((nextTrack) => {
            nextTrack.unchanged = true;
            setTrack(nextTrack);
          });
      });
    } else setTrack(false);
  }, []);

  useEffect(() => {
    if (track && !track.unchanged) {
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
      }, 15000); // wait for 15 seconds of inactivity
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [track]);

  return [
    track,
    (nextTrack) => {
      if (nextTrack) localStorage.setItem('track', JSON.stringify(nextTrack));
      else localStorage.removeItem('track');
      if (nextTrack && track) delete nextTrack.unchanged; // must be changing it
      setTrack(nextTrack);
    },
  ];
};

export const getCategory = (track, id) =>
  track.categories.find((c) => c.id === id);

export const getData = (track, id) => track.data.find((d) => d.id === id);
