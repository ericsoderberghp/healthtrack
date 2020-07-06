import React from 'react';
import { render, cleanup } from '@testing-library/react';
import App from '../App';

delete window.location;
window.location = new URL('http://localhost/onboard');

afterEach(cleanup);

it('renders onboard', async () => {
  process.env.NODE_ENV = 'test';
  const { container, findByText } = render(<App />);
  expect(container.firstChild).toMatchSnapshot();
  await findByText('Hi!');
  expect(container.firstChild).toMatchSnapshot();
});
