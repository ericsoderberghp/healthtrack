import React from 'react';
import { render, cleanup } from '@testing-library/react';
import App from '../App';
import {} from '../__mocks__/storage';

delete window.location;
window.location = new URL('http://localhost/categories/1');

afterEach(cleanup);

it('renders category edit', async () => {
  process.env.NODE_ENV = 'test';
  const { container, findByText } = render(<App />);
  expect(container.firstChild).toMatchSnapshot();
  await findByText('What kind of measurement is this?');
  expect(container.firstChild).toMatchSnapshot();
});
