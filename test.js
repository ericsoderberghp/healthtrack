/* eslint-disable no-undef */
import { Selector } from 'testcafe';

fixture('basic').page('http://localhost:3000');

const heading = (text) => Selector('h1').withText(text);

const button = (title) => Selector('button').withAttribute('title', title);

const input = (name) => Selector('input').withAttribute('name', name);

test('initial', async (t) => {
  await t.expect(heading('Hi!').exists).ok();
});

test('start', async (t) => {
  await t
    .expect(heading('Hi!').exists)
    .ok()
    .typeText(input('name'), 'test name')
    .typeText(input('email'), 'test@email')
    .typeText(input('password'), 'test^password')
    .click(button('get started'))
    .expect(heading('test name'))
    .ok()

    .click(button('categories'))
    .expect(heading('categories'))
    .ok()
    .click(button('add category'))
    .expect(heading('add category'))
    .ok()
    .typeText(input('name'), 'test category')
    .click(
      Selector('span').withText('behavior - something you do, like exercise'),
    )
    .click(Selector('span').withText('number - like hours of sleep'))
    .click(button('Add'))
    .expect(Selector('span').withText('test category'))
    .ok()

    .click(button('data'))
    .expect(heading('data'))
    .ok()
    .click(button('add data'))
    .expect(heading('add data'))
    .ok()
    .typeText(Selector('input').withAttribute('aria-label', 'search'), 'sl')
    .click(Selector('span').withText('sleep'))
    .expect(Selector('span').withText('hours'))
    .ok()
    .typeText(input('value'), '8')
    .click(button('Add'))
    .expect(Selector('span').withText('8'))
    .ok()

    .click(button('correlate'))
    .expect(heading('correlate'))
    .ok()
    .click(button('notes'))
    .expect(heading('notes'))
    .ok()
    .click(button('home'))
    .expect(heading('test name'))
    .ok()
    .click(button('delete everything'))
    .expect(heading('Hi!').exists)
    .ok();
});
