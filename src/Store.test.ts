import WreckedRadio from '/Users/alexey/Desktop/own/wrecked-radio/src/WreckedRadio';
import Store from './Store';

// listenTo: ['ADD_LIKE', 'ADD_DISLIKE'],
//   actionHandler: (action: string, section: ICounter) => {
//   if (action === 'ADD_LIKE') {
//     return Object.assign({}, section, {
//       likes: section.likes + 1,
//     });
//   }
//   if (action === 'ADD_DISLIKE') {
//     return Object.assign({}, section, {
//       dislikes: section.dislikes + 1,
//     });
//   }
//   return section;
// },

test('Store keeps and returns sections', () => {
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
