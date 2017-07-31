const fs = require('fs');
const path = require('path');
const replace = require('buffer-replace');

module.exports = function directInjection(content) {
  let out = content;
  const appDirs = this.query.apps || [];
  const apps = [];

  appDirs.forEach((appDir) => {
    try {
      const configFile = `${appDir}/config.json`;
      this.addDependency(configFile); // Watch for file changes.

      const configObj = JSON.parse(fs.readFileSync(configFile, 'utf8'));
      apps.push(configObj);
    } catch (err) {
      console.error(err);
    }
  });

  // DI:Import{Config|Live|Viewer}Apps
  //
  // Inserts import statements for every app.
  // import <basename(app.viewer)> from 'app/<app.id>/<app.viewer>';

  // DI:{Config|Live|Viewer}AppComponents
  //
  // Inserts an object map of app id to app import names.
  // { <app.id>: <basename(app.viewer)> }

  // DI:ImportAppIcons
  //
  // Inserts import statements for each app icon.
  // import <basename(app.viewer)>Icon from 'app/<app.id>/<app.icon>

  // DI:AppList
  //
  // Inserts a list of app configuration objects.
  // [ { id: <app id>, etc. } ]

  try {
    const iconImportStatements = [];

    const configImportStatements = [];
    const configAppComponents = [];

    const liveImportStatements = [];
    const liveAppComponents = [];

    const viewerImportStatements = [];
    const viewerAppComponents = [];

    for (let i = 0; i < apps.length; i += 1) {
      const app = apps[i];

      const configBasename = path.posix.basename(app.config || '');
      const liveBasename = path.posix.basename(app.live || '');
      const viewerBasename = path.posix.basename(app.viewer || '');

      iconImportStatements.push(`import ${viewerBasename}Icon from 'app/${app.id}/${app.icon}';`);

      configImportStatements.push(`import ${configBasename} from 'app/${app.id}/${app.config}';`);
      configAppComponents.push(`${app.id}: ${configBasename}`);

      liveImportStatements.push(`import ${liveBasename} from 'app/${app.id}/${app.live}';`);
      liveAppComponents.push(`${app.id}: ${liveBasename}`);

      viewerImportStatements.push(`import ${viewerBasename} from 'app/${app.id}/${app.viewer}';`);
      viewerAppComponents.push(`${app.id}: ${viewerBasename}`);
    }

    out = replace(out, '/* DI:ImportAppIcons */', `${iconImportStatements.join('\n')}`);
    out = replace(out, '/* DI:AppList */', `[${apps.map(a => JSON.stringify(a)).join(', ')}]`);

    out = replace(out, '/* DI:ImportConfigApps */', `${configImportStatements.join('\n')}`);
    out = replace(out, '/* DI:ConfigAppComponents */', `{\n  ${configAppComponents.join(',\n  ')}\n}`);

    out = replace(out, '/* DI:ImportLiveApps */', `${liveImportStatements.join('\n')}`);
    out = replace(out, '/* DI:LiveAppComponents */', `{\n  ${liveAppComponents.join(',\n  ')}\n}`);

    out = replace(out, '/* DI:ImportViewerApps */', `${viewerImportStatements.join('\n')}`);
    out = replace(out, '/* DI:ViewerAppComponents */', `{\n  ${viewerAppComponents.join(',\n  ')}\n}`);
  } catch (err) {
    console.error(err);
    throw err;
  }

  return out;
};
