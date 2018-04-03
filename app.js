'use strict';

const path = require('path');
const pmx = require('pmx');
const pm2 = require('pm2');
const fsUtils = require('./lib/fs-utils');
const pino = require('pino');


const pm2EnvModule = (config) => {
  const log = pino({
    name: 'pm2-env-module',
    level: config.logLevel,
    prettyPrint: true,
  });
  pm2.list((err, processList) => {
    if (err) {
      log.error(err.stack || err);
      process.exit(2);
    }
    processList
      .filter(process => process.name !== 'pm2-env-module')
      .forEach((process) => {
        log.debug(`Analize envs for process ${process.name}`);
        const processRootPath = path.dirname(process.pm2_env.pm_exec_path);

        const currentEnv = process.pm2_env[config.envVariableName];

        const envFileToApply = path.resolve(processRootPath, config.envRelativePath, `${config.envFilename}.${currentEnv}`);
        const envFile = path.resolve(processRootPath, config.envRelativePath, config.envFilename);
        log.info(`Copy ${envFileToApply} to ${envFile}`);

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
          .then(renamed => log.info('env copied: %s', renamed))
          .catch(renameError => log.error(renameError, 'env error'));
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
