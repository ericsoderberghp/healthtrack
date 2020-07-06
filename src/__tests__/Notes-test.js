import React from 'react';
import { render, cleanup } from '@testing-library/react';
import App from '../App';
import {} from '../__mocks__/storage';

delete window.location;
window.location = new URL('http://localhost/notes');

afterEach(cleanup);

it('renders data', async () => {
  process.env.NODE_ENV = 'test';
  const { container, findByText } = render(<App />);
  expect(container.firstChild).toMatchSnapshot();
  await findByText('surfed Grandview');
  expect(container.firstChild).toMatchSnapshot();
});
