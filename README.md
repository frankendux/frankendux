# Frankendux

It's a state management solution than does everything that Redux does (i.e. keeps your data in one place, manages its updates and notificates subscribers about data changes), but implemented in a way, that makes it a little better:

- Instead of calling every reducer on every action it calls only those reducers, that's are really interested in action handling
- Instead of calling every listener on every state change it calls only those listeners, that's are really interested in change handling
- Instead of trying to handle side effects using strange hacks (redux-thunk turns our actions into functions, that's no way a good thing) and huge middleware (redux-saga offers a better approach, but 7.6 KB is too much for the task like that) it relies on mediator (message bus) that allows you to make side effects without any magic
- It's written using strong TypeScrypt instead of way too mush dynamic JavaScript
- It's written using OOP instead of weird FP, that too often becomes weired
- It's as small as possible

RIGHT NOW FRANKENDUX IS NOTHING MORE THAN A CONCEPT PROOF, SO **DON'T YOU DARE TO USE IT IN PRODUCTION.**

## Road to release:

- [DONE] Create a working demo app, that implements state changes via direct action handling and making side effects
- [TODO] Make refactoring
- [TODO] Write documentation
- [TODO] Cover with unit-tests
- [TODO] Make sure it can be used with server-side rendering
- [TODO] Make sure that it does not make applications less testable
- [TODO] Create Frankendux DevTools (Redux DevTools alternative)
