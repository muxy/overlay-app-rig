import { mapGetters } from 'vuex';
import { Mutations, Events } from './store';

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

    saveOptions(options) {
      if (this.user.role !== 'broadcaster') {
        return undefined;
      }

      this.$store.commit(Mutations.SET_APP_CHANNEL_OPTIONS, {
        id: this.id,
        options
      });

      const fullOptions = this.$store.getters.option(`apps.${this.id}`);
      return this.muxy.client.setChannelState(this.id, fullOptions)
        .then(() => {
          this.muxy.broadcast(Events.CHANNEL_OPTIONS_CHANGE, fullOptions);
        });
    }
  }
};
