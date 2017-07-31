/* globals Muxy */

import { mapGetters } from 'vuex';
import { Mutations, Events } from './store';

/**
 * AppMixin should be included as a mixin in every Overlay App. It provides
 * convenience functions for working with an app's state and an interface to
 * the low-level Muxy SDK.
 */
export default {
  props: ['id', 'enabled', 'shown'],
  computed: mapGetters(['user']),

  /**
   * On app creation, we initialize a version of the Muxy SDK locked to this app's id.
   * This allows access to the Muxy API correctly namespaced to the app.
   */
  created() {
    this.muxy = new Muxy.SDK(this.id);
  },

  /**
   * VueJS method for watching local data or property values.
   */
  watch: {
    /**
     * Watch the `shown` property to emit events when the app is to be shown or hidden.
     * The app iteself may listen for `app-shown` or `app-hidden` events if custom logic
     * is needed.
     *
     * @param {boolean} showing - True if the app is about to be shown, false
     * if it is about to be hidden.
     */
    shown(showing) {
      if (showing) {
        this.$emit('app-shown', { id: this.id });
      } else {
        this.$emit('app-hidden', { id: this.id });
      }
    }
  },

  methods: {
    /**
     * Getter for an app's options. Takes a string path to any option object or value.
     *
     * @param {string,null} path - The option path to access. If null or empty string, returns
     * the full options object for this app.
     *
     * @param {string,function} def - If a string, a default value to return if the option path
     * is undefined. If a function, a callback that will be called immediately with
     * the value at `path` and again whenever the `path` value changes.
     */
    option(path, def) {
      // App configuration is stored in `{extension|channel|viewer}.apps.<app id>`.
      const cb = typeof def === 'function' ? def : null;
      let val = typeof def !== 'function' ? def : undefined;
      let key = `apps.${this.id}.${path}`;

      if (path === undefined || path === '') {
        key = `apps.${this.id}`;

        // Provide a convenience default value if no parameters are provided.
        // This means `this.option().setting` will be undefined rather than throw an exception.
        val = val || {};
      }

      val = this.$store.getters.option(key, val);

      if (cb) {
        this.$store.watch(() => this.$store.getters.option(key), cb);
        cb(val);
      }

      return val;
    },

    /**
     * Shows the app interface. Does nothing if the app is currently shown.
     */
    show() {
      this.$nextTick(() => {
        this.$store.commit(Mutations.SHOW_APP, { appID: this.id });
      });
    },

    /**
     * Hides the app interface. Does nothing if the app is currently hidden.
     */
    hide() {
      this.$nextTick(() => {
        this.$store.commit(Mutations.HIDE_APP, { appID: this.id });
      });
    },

    /**
     * Toggle the current display state of the app.
     */
    toggle() {
      this.$nextTick(() => {
        this.$store.commit(Mutations.TOGGLE_APP, { appID: this.id });
      });
    },

    /**
     * Save an app's options for this channel. This will replace all current
     * settings for this app with the contents of `options`. Can only be
     * called from the Config or Live App.
     *
     * @param {Object} options - The app options value.
     *
     * @returns A Promise that will resolve or reject once the options
     * have been saved to the server. Returns null if the function was
     * not called by the broadcaster.
     */
    saveChannelOptions(options) {
      if (this.user.role !== 'broadcaster') {
        return null;
      }

      this.$store.commit(Mutations.SET_APP_CHANNEL_OPTIONS, {
        id: this.id,
        options
      });

      const promise = this.muxy.setChannelState(options).then(() => {
        const fullOptions = this.$store.state.options.combined;
        this.muxy.send(Events.CHANNEL_OPTIONS_CHANGE, fullOptions);
      });

      this.$emit('save-promise', promise);
      return promise;
    }
  }
};
