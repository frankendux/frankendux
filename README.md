# Frankendux

[![CircleCI](https://img.shields.io/circleci/build/github/frankendux/frankendux.svg)](https://circleci.com/gh/frankendux/frankendux)
[![Coverage Status](https://img.shields.io/coveralls/github/frankendux/frankendux.svg)](https://coveralls.io/github/frankendux/frankendux)

It's a state management solution that does everything that [Redux](https://github.com/reduxjs/redux) does (i.e. keeps your data in one place, manages its updates and notificates subscribers about data changes), but it makes that in a little better way:

- Instead of calling every reducer on every action it calls only those of them, that are really interested in action handling
- Instead of calling every listener on every state change it calls only those of them, that are really interested in state change handling
- Instead of trying to handle side effects using [strange hacks](https://github.com/reduxjs/redux-thunk/blob/master/src/index.js) ([redux-thunk](https://github.com/reduxjs/redux-thunk) turns our actions into functions, that's no way a good thing) and huge middleware ([redux-saga](https://github.com/redux-saga/redux-saga/) offers a better approach, but [7.6 KB](https://bundlephobia.com/result?p=redux-saga@0.16.2) is too much) it relies on a mediator (message bus) that allows you to make side effects without any magic and with a cleaner architecture
- It's written using strong TypeScrypt instead of way too much dynamic JavaScript
- It's written using OOP instead of FP, that's too often becomes weired
- It's as small as possible

RIGHT NOW FRANKENDUX IS NOTHING MORE THAN A CONCEPT PROOF, SO **DON'T YOU DARE TO USE IT IN PRODUCTION.**

## Road to release:

- ~~*[DONE]* Create a working demo app, that implements state changes via direct action handling and making side effects~~
- *[WIP]* Make refactoring
- *[TODO]* Write documentation
- *[TODO]* Cover with unit-tests
- *[TODO]* Make sure it can be used with server-side rendering
- *[TODO]* Make sure that it does not make applications less testable
- *[TODO]* Create Frankendux DevTools (Redux DevTools replacement)
