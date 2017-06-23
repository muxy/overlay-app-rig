import { mapGetters } from 'vuex';
import { Mutations, Events } from './store';

export default {
  props: ['id'],

  computed: {
    ...mapGetters(['muxy', 'user']),

    option: (state) => (path, def) => {
      if (path === undefined || path === '') {
        return state.$store.getters.options(`apps.${state.id}`, def);
      }

      return state.$store.getters.option(`apps.${state.id}.${path}`, def);
    }
  },

  methods: {
    optionWatch(path, cb, opts) {
      return this.$store.watch(() => {
        return this.option(path);
      }, cb, opts);
    },

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

    saveChannelOptions(options) {
      if (this.user.role !== 'broadcaster') {
        return undefined;
      }

      this.$store.commit(Mutations.SET_APP_CHANNEL_OPTIONS, {
        id: this.id,
        options
      });

      const fullOptions = this.$store.getters.option(`apps.${this.id}`);
      const promise = this.muxy.client.setChannelState(this.id, fullOptions)
        .then(() => {
          this.muxy.send(Events.CHANNEL_OPTIONS_CHANGE, fullOptions);
        });

      this.$emit('save-promise', promise);
      return promise;
    }
  }
};
