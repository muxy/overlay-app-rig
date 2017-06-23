import { mapGetters } from 'vuex';
import { Mutations } from './store';

export default {
  props: ['id'],

  computed: {
    ...mapGetters(['muxy', 'user']),

    option: (state) => (path, def) =>
      state.$store.getters.option(`apps.${state.id}.${path}`, def)
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
    },

    setAppChannelOptions(options) {
      this.$store.commit(Mutations.SET_APP_CHANNEL_OPTIONS, {
        id: this.id,
        options
      });
    }
  }
};
