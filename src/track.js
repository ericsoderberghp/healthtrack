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
    { id: 4, name: 'water', aspect: 'behavior', type: 'name' },
  ],
  data: [],
  notes: [],
};

export const useTrack = () => {
  const [track, setTrack] = useState();
  useEffect(() => {
    const stored = localStorage.getItem('track');
    if (stored) setTrack(JSON.parse(stored));
    else setTrack(false);
  }, []);
  return [
    track,
    (nextTrack) => {
      localStorage.setItem('track', JSON.stringify(nextTrack));
      setTrack(nextTrack);
    },
  ];
};

export const getCategory = (track, id) =>
  track.categories.find((c) => c.id === id);
