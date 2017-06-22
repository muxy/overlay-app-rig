import { mapGetters } from 'vuex';

import { Mutations } from './store';

export default {
  props: ['id'],

  computed: {
    ...mapGetters(['option', 'muxy', 'user'])
  },

  methods: {
    show() {
      this.$nextTick(() => {
        this.$store.commit(Mutations.SHOW_APP, { appID: this.id });
      });
    },

    hide() {
      this.$nextTick(() => {
        this.$store.commit(Mutations.HIDE_APP, { appID: this.id });
      });
    },

    toggle() {
      this.$nextTick(() => {
        this.$store.commit(Mutations.TOGGLE_APP, { appID: this.id });
      });
    }
  }
};
