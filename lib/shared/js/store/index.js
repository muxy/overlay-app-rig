import Getters from './getters';
import { Mutations, Events, Mutators } from './mutations';
import State from './state';

// Application State Store
// -----------------------
const StateStore = {
  state: State,
  getters: Getters,
  mutations: Mutators
};

export default StateStore;
export { Mutations, Events };
