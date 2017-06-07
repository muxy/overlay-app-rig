import Globals from 'shared/js/globals';

import Getters from './getters';
import { Mutations, Mutators } from './mutations';
import State from './state';

// Application State Store
// -----------------------
const StateStore = {
  strict: !Globals.PRODUCTION,
  state: State,
  getters: Getters,
  mutations: Mutators
};

export default StateStore;
export { Mutations };
