const today = new Date().toISOString().split('T')[0];
const tmp = new Date();
tmp.setDate(-1);
const yesterday = tmp.toISOString().split('T')[0];

const track = {
  id: 'test-track',
  categories: [
    {
      id: 1,
      name: 'test-yesno',
      aspect: 'behavior',
      type: 'yes/no',
      times: ['16:00'],
    },
    {
      id: 2,
      name: 'test-scale',
      aspect: 'symptom',
      type: 'scale',
      times: ['12:00'],
    },
    {
      id: 3,
      name: 'test-number',
      aspect: 'behavior',
      type: 'number',
      times: ['08:00'],
      units: 'hours',
    },
    {
      id: 4,
      name: 'test-name',
      aspect: 'behavior',
      type: 'name',
      times: ['12:00'],
    },
    {
      id: 5,
      name: 'test-infrequent',
      aspect: 'behavior',
      type: 'scale',
    },
  ],
  createdAt: '2020-06-10T03:50:00.221Z',
  data: [
    {
      id: 1,
      category: 1,
      value: true,
      name: 'test-yesno',
      date: `${today} 16:00`,
    },
    {
      id: 2,
      category: 2,
      value: 3,
      name: 'test-scale',
      date: `${today} 12:00`,
    },
    {
      id: 3,
      category: 3,
      value: 8,
      name: 'test-number',
      date: `${today} 08:00`,
    },
    {
      id: 4,
      category: 4,
      value: 'test-value',
      name: 'test-value',
      date: `${today} 12:00`,
    },
    {
      id: 5,
      category: 2,
      value: 2,
      name: 'test-scale',
      date: `${yesterday} 16:00`,
    },
  ],
  name: 'Test Track',
  notes: [
    { id: 1, text: 'surfed Grandview', date: '2020-06-20T19:00:00.564Z' },
  ],
  email: 'test@my.com',
};

export default track;
