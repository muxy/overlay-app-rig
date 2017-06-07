import * as settings from 'manifest';

import Globals from 'shared/js/globals';

// Wrapper around global Twitch extension object.
class Ext {
  static onAuthorized(cb) {
    window.Twitch.ext.onAuthorized(cb);
  }

  static onContext(cb) {
    window.Twitch.ext.onContext(cb);
  }
}

if (!Globals.EMBEDDED) {
  Ext.onAuthorized = (cb) => {
    const channelID = '126955211';
    const opaqueID = 'U12345';
    const expiration = ((new Date()).getTime() / 1000) + 3600; // One-hour expiration
    const payload = {
      exp: expiration,
      opaque_user_id: opaqueID,
      channel_id: channelID,
      role: 'broadcaster',
      pubsub_perms: {
        listen: [
          'broadcast',
          `whisper-${opaqueID}`
        ],
        send: ['*']
      }
    };

    cb({
      clientId: settings.extension_id,
      channelId: channelID,
      userId: opaqueID,
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${window.btoa(JSON.stringify(payload))}.ya80vfzl96gMUJ1BX2z_2LtcJiWEX_yLzcQB4Ih-huI`
    });
  };
}

export default Ext;
