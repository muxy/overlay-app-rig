import * as config from 'manifest';

import gumshoeFactory from 'shared/libs/js/gumshoe';

const UA_STRING = 'UA-99381428-2';
const ANALYTICS_ENDPOINT = 'https://ext.muxy.io/data';

export default class Analytics {
  constructor(store) {
    this.gumshoe = gumshoeFactory();
    this.gumshoe.transport({
      name: 'muxy-twitch-extension',

      send: (data, fn) => {
        this.gumshoe.reqwest(
          {
            data,
            url: ANALYTICS_ENDPOINT,
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            crossOrigin: true
          },
          () => {
            if (fn) {
              fn(null);
            }
          }
        );
      },

      map: (data) => {
        const appName = config.name;
        const ip = store.getters.user.ip || '<unknown ip>';
        const channelID = store.getters.user.channelID || null;
        const opaqueID = store.getters.user.twitchOpaqueID || null;
        const userID = !opaqueID || opaqueID[0] !== 'U' ? null : opaqueID;

        const pd = data.pageData;
        pd.ipAddress = ip;

        const result = {
          aid: appName,
          an: appName,
          cid: opaqueID ||
            data.clientUuid ||
            data.sessionUuid ||
            '00000000-0000-0000-0000-000000000000',
          dh: pd.hostName,
          dl: pd.url,
          dp: pd.path,
          dr: pd.referer,
          dt: pd.title,
          je: pd.javaEnabled,
          sr: pd.screenResolution,
          t: 'event',
          tid: UA_STRING,
          ua: pd.userAgent,
          uid: userID,
          uip: ip,
          ul: pd.language,
          v: 1,
          vp: `${pd.viewportHeight}x${pd.viewportWidth}`,
          cd1: channelID,
          cd2: store.getters.user.role,
          cd3: store.getters.user.game,
          cd4: store.getters.user.videoMode,
          cm2: store.getters.user.latency,
          cm3: store.getters.user.bitrate
        };

        if (data.eventName === 'page.view') {
          result.t = 'pageview';
        } else {
          result.ec = data.eventData.category;
          result.ea = data.eventName;
          result.el = data.eventData.label || '';
          result.ev = data.eventData.value;
        }
        return result;
      }
    });
    this.gumshoe({ transport: 'muxy-twitch-extension' });
  }

  sendPageView() {
    this.gumshoe.send('page.view', {});
  }

  sendEvent(name, category, value = 0, label = '') {
    const data = {
      category,
      value,
      label
    };
    this.gumshoe.send(name, data, {});
  }
}
