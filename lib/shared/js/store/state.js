import _ from 'lodash';
import * as manifest from 'manifest';

import Globals from 'shared/js/globals';

let settings = _.pick(manifest, ['extension_id', 'extension_version', 'name']);
settings = _.merge(settings, {
  production: Globals.PRODUCTION
});

export default {
  settings,
  mode: '',
  ready: false,
  error: null,
  apps: [],
  analytics: {},
  user: {},
  options: {
    combined: {},
    viewer: {},
    channel: {},
    extension: {}
  }
};
