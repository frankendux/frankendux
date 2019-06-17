import WreckedRadio from '/Users/alexey/Desktop/own/wrecked-radio/src/WreckedRadio';
import Store from './Store';

interface ICounter {
  likes: number;
  dislikes: number;
}

test('Store can return sections', () => {
  // Arrange
  const radio = new WreckedRadio();
  const store = new Store({ radio });
  store.addSection({
    name: 'first',
    data: { one: 1, two: 2 },
    listenTo: [],
    actionHandler: () => null,
  });
  store.addSection({
    name: 'second',
    data: { three: 3, four: 4 },
    listenTo: [],
    actionHandler: () => null,
  });
  // Act
  const firstSection = radio.channel('store').request('GET', 'first');
  const secondSection = radio.channel('store').request('GET', 'second');
  // Assert
  expect(firstSection).toEqual({ one: 1, two: 2 });
  expect(secondSection).toEqual({ three: 3, four: 4 });
});

test('Store can return state object', () => {
  // Arrange
  const radio = new WreckedRadio();
  const store = new Store({ radio });
  store.addSection({
    name: 'first',
    data: { one: 1, two: 2 },
    listenTo: [],
    actionHandler: () => null,
  });
  store.addSection({
    name: 'second',
    data: { three: 3, four: 4 },
    listenTo: [],
    actionHandler: () => null,
  });
  // Act
  const state = radio.channel('store').request('GET');
  // Assert
  expect(state).toEqual({
    first: { one: 1, two: 2 },
    second: { three: 3, four: 4 },
  });
});

test('Store handles updates', () => {
  // Arrange
  const radio = new WreckedRadio();
  const store = new Store({ radio });
  store.addSection({
    name: 'counter',
    data: { likes: 0, dislikes: 0 },
    listenTo: ['ADD_LIKE', 'ADD_DISLIKE'],
    actionHandler: (action: string, section: ICounter) => {
      if (action === 'ADD_LIKE') {
        return Object.assign({}, section, {
          likes: section.likes + 1,
        });
      }
      if (action === 'ADD_DISLIKE') {
        return Object.assign({}, section, {
          dislikes: section.dislikes + 1,
        });
      }
      return section;
    },
  });
  // Act
  radio.channel('store').request('UPDATE', 'ADD_LIKE');
  const counter = radio.channel('store').request('GET', 'counter');
  // Assert
  expect(counter).toEqual({
    likes: 1,
    dislikes: 0,
  });
});

test('Store handles updates then several handlers presented', () => {
  // Arrange
  const radio = new WreckedRadio();
  const store = new Store({ radio });
  store.addSection({
    name: 'firstCounter',
    data: { likes: 0, dislikes: 0 },
    listenTo: ['ADD_LIKE', 'ADD_DISLIKE'],
    actionHandler: (action: string, section: ICounter) => {
      if (action === 'ADD_LIKE') {
        return Object.assign({}, section, {
          likes: section.likes + 1,
        });
      }
      if (action === 'ADD_DISLIKE') {
        return Object.assign({}, section, {
          dislikes: section.dislikes + 1,
        });
      }
      return section;
    },
  });
  store.addSection({
    name: 'secondCounter',
    data: { likes: 2, dislikes: 2 },
    listenTo: ['ADD_LIKE', 'ADD_DISLIKE'],
    actionHandler: (action: string, section: ICounter) => {
      if (action === 'ADD_LIKE') {
        return Object.assign({}, section, {
          likes: section.likes + 1,
        });
      }
      if (action === 'ADD_DISLIKE') {
        return Object.assign({}, section, {
          dislikes: section.dislikes + 1,
        });
      }
      return section;
    },
  });
  // Act
  radio.channel('store').request('UPDATE', 'ADD_LIKE');
  const firstCounter = radio.channel('store').request('GET', 'firstCounter');
  const secondCounter = radio.channel('store').request('GET', 'secondCounter');
  // Assert
  expect(firstCounter).toEqual({
    likes: 1,
    dislikes: 0,
  });
  expect(secondCounter).toEqual({
    likes: 3,
    dislikes: 2,
  });
});

test('Store does nothing when receives unknown commands', () => {
  // Arrange
  const radio = new WreckedRadio();
  const store = new Store({ radio });
  store.addSection({
    name: 'counter',
    data: { likes: 0, dislikes: 0 },
    listenTo: ['ADD_LIKE', 'ADD_DISLIKE'],
    actionHandler: (action: string, section: ICounter) => {
      if (action === 'ADD_LIKE') {
        return Object.assign({}, section, {
          likes: section.likes + 1,
        });
      }
      if (action === 'ADD_DISLIKE') {
        return Object.assign({}, section, {
          dislikes: section.dislikes + 1,
        });
      }
      return section;
    },
  });
  // Act
  radio.channel('store').request('UPDATE', 'WOLOLO');
  const counter = radio.channel('store').request('GET', 'counter');
  // Assert
  expect(counter).toEqual({
    likes: 0,
    dislikes: 0,
  });
});
