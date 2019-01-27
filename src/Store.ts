import { IWreckedRadio } from 'wrecked-radio';

export interface IStore {
  [key:string]: any;
}

export interface IStoreAction {
  type: string;
  payload?: any;
}

export type IActionHanler = (action: IStoreAction, section: any) => void;

export interface IListenersContainer {
  [key:string]: string[];
}

export interface IActionHandlersContainer {
  [key:string]: IActionHanler;
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
 * - Keeping application state in one place
 * - Updating state via actions and action handlers
 * - Notifying consumers about state changes
 *
 * Supposed to be used with "Wrecked Radio" package, that's necessary to implement communications
 * between views (components), side-effects and this Store.
 */
class Store {
  private readonly store: IStore = {};
  private readonly listeners: IListenersContainer = {};
  private readonly actionHandlers: IActionHandlersContainer = {};
  private readonly radio: IWreckedRadio;
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
   * Adds section to the store: sets default section value and registers provided action handlers
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
