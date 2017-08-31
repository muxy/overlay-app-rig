import _ from 'lodash';

const Getters = {
  // Return whether or not the app is 'ready.' This means
  // we have received an authentication token for use with
  // the state/broadcast server and have initialized all
  // needed communication services.
  ready: state => state.ready,

  // Return a list of all apps not explicitly removed.
  availableApps: (state) => {
    let apps = state.apps.filter(a => a.available);
    apps = _.uniqBy(apps, 'id');
    return _.orderBy(apps, ['required', 'name'], ['desc', 'asc']);
  },

  // Return a list of all required or enabled apps.
  // If `forceTwitchAuth` is true and no Twitch ID is set for the
  // current user, only the `auth` app is returned.
  activeApps: (state, getters) => {
    // Filter disabled apps.
    let apps = state.apps.filter(a => a.available);

    const forceAuth = getters.option('forceTwitchAuth') || false;
    if (forceAuth && !state.user.twitchID) {
      // Only show 'auth' app if forced.
      apps = apps.filter(a => a.id === 'auth');
    }

    if (state.user.twitchID) {
      // Don't show 'auth' app id already authed.
      apps = apps.filter(a => a.id !== 'auth');
    }

    // Filter down to only required or enabled apps.
    apps = apps.filter(a => a.required || a.enabled);

    apps = _.uniqBy(apps, 'id');
    return _.orderBy(apps, ['required', 'name'], ['desc', 'asc']);
  },

  liveApps: (state) => {
    let apps = state.apps.filter(a => a.available);
    apps = apps.filter(a => (a.required || a.enabled) && a.live);

    apps = _.uniqBy(apps, 'id');
    return _.orderBy(apps, ['required', 'name'], ['desc', 'asc']);
  },

  // Return a single app instance.
  app: state => appID => state.apps.filter(a => a.id === appID),

  // Return a value (or default) for a given option path.
  // `key` may be a single value (e.g. "toolbarPosition") or a
  // full path (e.g. "toolbar.backgroundColor").
  // `def` may be any value or `undefined`.
  // Options have a precedence order of viewer set option ->
  // broadcaster set option -> extension option.
  option: state => (key, def) => {
    const val = _.at(state.options.combined, key)[0];
    return val === undefined ? def : val;
  },

  // Return all options for the current channel.
  channelOptions: state => state.options.channel,

  // Return the current user.
  user: state => state.user,

  // Return the Muxy SDK.
  muxy: state => state.muxySDK
};

export default Getters;
