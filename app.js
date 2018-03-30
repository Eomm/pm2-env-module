'use strict';

const path = require('path');
const pmx = require('pmx');
const pm2 = require('pm2');
const fsUtils = require('./lib/fs-utils');


const pm2EnvModule = (config) => {
  pm2.list((err, processList) => {
    if (err) {
      console.error(err.stack || err);
      process.exit(2);
    }
    processList
      .filter(process => process.name !== 'pm2-env-module')
      .forEach((process) => {
        const processRootPath = path.dirname(process.pm2_env.pm_exec_path);

        const currentEnv = process.pm2_env[config.envVariableName];

        const envFileToApply = path.resolve(processRootPath, config.envRelativePath, `${config.envFilename}.${currentEnv}`);
        const envFile = path.resolve(processRootPath, config.envRelativePath, config.envFilename);
        console.log(`Copy ${envFileToApply} to ${envFile}`);

        fsUtils.existFile(envFileToApply)
          .then(() => {
            if (config.buildEnvFile === true) {
              const envText = Object.entries(process.pm2_env)
                .filter(([, value]) => typeof value !== 'object')
                .map(([key, value]) => `${key}=${value}`)
                .join('\n');
              return fsUtils.writeTextFile(envFile, envText);
            }
            return fsUtils.copyFile(envFileToApply, envFile);
          })
          .then(renamed => console.log('env copied:', renamed))
          .catch(renameError => console.error('env error', renameError));
      });
  });
};

// pmx.action('rename', (reply) => {
//   console.log('rename.');
//   pm2EnvModule(configuration);
//   return reply('done');
// });


pmx.initModule({}, (err, conf) => {
  if (err) {
    console.error(err.stack || err);
    process.exit(2);
  }
  pm2EnvModule(conf);
});
