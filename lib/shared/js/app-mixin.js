import { mapGetters } from 'vuex';
import { Mutations, Events } from './store';

export default {
  props: ['id'],

  computed: {
    ...mapGetters(['muxy', 'user'])
  },

  methods: {
    option(path, def) {
      const cb = typeof def === 'function' ? def : null;
      let val = typeof def !== 'function' ? def : undefined;
      let key = `apps.${this.id}.${path}`;

      if (path === undefined || path === '') {
        key = `apps.${this.id}`;
      }

      val = this.$store.getters.option(key, val);

      if (cb) {
        this.$store.watch(() => this.$store.getters.option(key), cb);
        cb(val);
      }

      return val;
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
