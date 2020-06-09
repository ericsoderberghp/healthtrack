import { useEffect, useState } from 'react';

export const apiUrl =
  'https://us-central1-grommet-designer.cloudfunctions.net/healthtracks';

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
    },
    { id: 2, name: 'exercise', aspect: 'behavior', type: 'yes/no' },
    { id: 3, name: 'food', aspect: 'behavior', type: 'name' },
    { id: 4, name: 'water', aspect: 'behavior', type: 'rating' },
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

export const useTrack = () => {
  const [track, setTrack] = useState();
  useEffect(() => {
    const stored = localStorage.getItem('track');
    if (stored) setTrack(JSON.parse(stored));
    // else setTrack(false);
    else setTrack(developmentTrack);
  }, []);
  return [
    track,
    (nextTrack) => {
      if (nextTrack) localStorage.setItem('track', JSON.stringify(nextTrack));
      else localStorage.removeItem('track');
      setTrack(nextTrack);
    },
  ];
};

export const getCategory = (track, id) =>
  track.categories.find((c) => c.id === id);

export const getData = (track, id) => track.data.find((d) => d.id === id);
