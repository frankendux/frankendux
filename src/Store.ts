/**
 * State manager implementation.
 * For more information check out [[Store]] class implementation.
 */

import { IWreckedRadio } from '/Users/alexey/Desktop/own/wrecked-radio/src/WreckedRadio';

/**
 * Store shape.
 */
export interface IStore {
  /**
   * Keys are section names, values contain related data of any type (usually it's an
   * object or an array).
   */
  [key:string]: any;
}

/**
 * Shape of actions that represent an event or command that should be handled by store.
 */
export interface IStoreAction {
  /**
   * Unique action name.
   */
  type: string;
  /**
   * Optional data that describes an action.
   */
  payload?: any;
}

/**
 * Shape of functions that handle events/commands.
 * Receives an action object and current section value and should return new updated section value.
 */
export type IActionHandler = (action: IStoreAction, section: any) => any;

/**
 * Shape of the object that stores associations between event names (types) and section names that
 * are listening this event.
 */
export interface IListenersContainer {
  /**
   * Key is an event name, value is an array of section names.
   */
  [key:string]: string[];
}

/**
 * Shape of the object that associates section names and related action handlers.
 */
export interface IActionHandlersContainer {
  /**
   * Key is a section name, value is an action handler.
   */
  [key:string]: IActionHandler;
}

/**
 * Shape of data that should be passed to Store constructor.
 */
export interface IStoreParams {
  /**
   * Wrecked Radio instance that's necessary for communications between Store and various
   * applicarion parts.
   */
  radio: IWreckedRadio;
}

export interface ISectionDescription {
  /**
   * Unique section name
   */
  name: string;
  /**
   * Initial section value
   */
  data: any;
  /**
   * Array of action names that this section should listen and handle
   */
  listenTo: string[];
  /**
   * Action handler for this section
   */
  actionHandler: IActionHandler;
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
 * // Imports
 * import WreckedRadio from 'wrecked-radio';
 * import Store, { IStoreAction } from 'frankendux';
 *
 * // Instantiation
 * const radio = new WreckedRadio();
 * const store = new Store({ radio });
 *
 * // Declaring a part of our application state
 * store.addSection({
 *   // Unique state section name
 *   name: 'counter',
 *   // Initial section shape and values
 *   data: {
 *     dislikes: 1,
 *     likes: 3,
 *   },
 *   // A list of action types that this section listens and handles
 *   listenTo: ['ADD_LIKE', 'ADD_DISLIKE'],
 *   // A function that performs section updates.
 *   actionHandler: (action: IStoreAction, section: ICounter) => {
 *     if (action.type === 'ADD_LIKE') {
 *       return Object.assign({}, section, {
 *         likes: section.likes + 1,
 *       });
 *     } else if (action.type === 'ADD_DISLIKE') {
 *       return Object.assign({}, section, {
 *         dislikes: section.dislikes + 1,
 *       });
 *     }
 *     return section;
 *   },
 * });
 *
 * // Then somewhere in our app we can trigger a state update
 * radio.getChannel('store').request('UPDATE', 'ADD_LIKE');
 *
 * // Also we can get store section manually (not recommended way, prefer using withStore)
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
   * Wrecked Radio instance used for communications with different application parts (like "views"
   * or side-effect performers).
   */
  private readonly radio: IWreckedRadio;
  /**
   * Saves link to Wrecked Radio instance and starts to listen for requests in "store" channel.
   */
  constructor(params: IStoreParams) {
    this.radio = params.radio;
    this.radio.channel('store').reply('GET', this.get.bind(this));
    this.radio.channel('store').reply('UPDATE', this.updateHandler.bind(this));
  }
  /**
   * Get specific state section or whole state object (if no section name provided)
   * @param section - The name of a section you want to get.
   */
  private get(section?: string): any {
    return section ? this.store[section] : this.store;
  }
  /**
   * Add a section to the store. Set default section value and registers provided action handlers.
   */
  public addSection(section: ISectionDescription) {
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
   * State update handler that notifies subscribers about state change
   */
  private updateHandler(action: any) {
    const listeningSections = this.listeners[action] || this.listeners[action.type];
    if (listeningSections) {
      listeningSections.forEach((sectionName: string) => {
        this.store[sectionName] = this.actionHandlers[sectionName](action, this.get(sectionName));
        this.radio.channel('store').trigger(`${sectionName}:update`, this.get());
      });
    }
  }
}

export default Store;
