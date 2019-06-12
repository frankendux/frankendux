import { IWreckedRadio } from 'wrecked-radio';

export interface IStore {
  [key:string]: any;
}

export interface IStoreAction {
  type: string;
  payload?: any;
}

export type IActionHandler = (action: IStoreAction, section: any) => void;

export interface IListenersContainer {
  [key:string]: string[];
}

export interface IActionHandlersContainer {
  [key:string]: IActionHandler;
}

export interface IStoreParams {
  radio: IWreckedRadio;
}

export interface IStoreSection {
  name: string;
  data: object;
  actionHandler: any;
  listenTo: string[];
}

/**
 * Store implements everything you expect from a state management solution, it's responsible for:
 *
 * - Keeping application state all in one place
 * - Updating state via actions and action handlers
 * - Notifying consumers about state changes
 *
 * Supposed to be used with "Wrecked Radio" package that's necessary to implement communications
 * between views (components), side-effects and this Store.
 *
 * Usage example:
 *
 * ```
 * // Instantiation
 * const radio = new WreckedRadio();
 * const store = new Store({ radio });
 *
 * // Declaring a part of our application state
 * store.addSection({
 *     // Unique section name
 *     name: 'counter',
 *     // Initial section shape and values
 *     data: {
 *         dislikes: 1,
 *         likes: 3,
 *     },
 *     // Action types that this section listens and handles
 *     listenTo: ['ADD_LIKE', 'ADD_DISLIKE'],
 *     // A function that performs section updates.
 *     actionHandler: (action: string, section: ICounter) => {
 *         if (action === 'ADD_LIKE') {
 *             return Object.assign({}, section, {
 *                 likes: section.likes + 1,
 *             });
 *         } else if (action === 'ADD_DISLIKE') {
 *             return Object.assign({}, section, {
 *                 dislikes: section.dislikes + 1,
 *             });
 *         }
 *         return section;
 *     },
 * });
 *
 * // And then somewhere in our app  can we trigger a state update
 * radio.getChannel('store').request('UPDATE', 'ADD_LIKE');
 *
 * // Also we can get store section manually (not recommended, prefer using withStore)
 * radio.getChannel('store').request('GET', 'counter');
 * ```
 */
class Store {
  /**
   * Store object that keeps application state
   */
  private readonly store: IStore = {};
  /**
   * Keeps pairs of section names and lists of events that this sections are listening
   */
  private readonly listeners: IListenersContainer = {};
  /**
   * Keeps pairs of section names and related action handlers
   */
  private readonly actionHandlers: IActionHandlersContainer = {};
  /**
   * Wrecked Radio instance used for communications with different application parts (like "views" or side-effect performers)
   */
  private readonly radio: IWreckedRadio;
  /**
   * Saves link to "wrecked-radio" instance and implements... what?
   */
  constructor(params: IStoreParams) {
    this.radio = params.radio;
    this.radio.getChannel('store').addRequestHandler('GET', this.getSection.bind(this));
    this.radio.getChannel('store').addRequestHandler('UPDATE', this.updateHandler.bind(this));
  }
  /**
   * Get specific state section
   * @param section - The name of a section you want to get.
   */
  public getSection(section: string) {
    return this.store[section];
  }
  /**
   * Get whole state object
   */
  public getState() {
    return this.store;
  }
  /**
   * Adds a section to the store: sets default section value and registers provided action handlers
   */
  public addSection(section: IStoreSection) {
    this.store[section.name] = section.data;
    section.listenTo.forEach((eventName) => {
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }
      this.listeners[eventName].push(section.name);
    });
    this.actionHandlers[section.name] = section.actionHandler;
  }
  /**
   * State update handler, that notifies subscribers about state change
   */
  private updateHandler(action: any) {
    const listeningSections = this.listeners[action] || this.listeners[action.type]; // FIXME
    if (listeningSections) {
      listeningSections.forEach((sectionName: string) => {
        const update = this.actionHandlers[sectionName](action, this.getSection(sectionName));
        this.store[sectionName] = update;
        this.radio.getChannel('store').trigger(`${sectionName}:update`, this.getState());
      });
    }
  }
}

export default Store;
