import _ from 'lodash';
import * as manifest from 'manifest';


let settings = _.pick(manifest, ['extension_id', 'extension_version', 'name']);

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
