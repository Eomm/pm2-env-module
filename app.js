'use strict';

const path = require('path');
const pmx = require('pmx');
const pm2 = require('pm2');
const fsUtils = require('./lib/fs-utils');
const pino = require('pino')({
  name: 'pm2-env-module',
  prettyPrint: true, // don't need iper-performance, but need legibility
});


const pm2EnvModule = (config) => {
  const log = pino.child({ level: config.logLevel });

  pm2.list((err, processList) => {
    if (err) {
      log.error(err, 'Error on listing pm2 process');
      return;
    }

    processList
      .filter(process => process.name !== 'pm2-env-module')
      .forEach((process) => {
        log.debug('Check .env on process: %s', process.name);
        const processRootPath = path.dirname(process.pm2_env.pm_exec_path);

        const currentEnv = process.pm2_env[config.envVariableName];
        log.debug('Current env: %s', currentEnv);

        const envFile = path.resolve(processRootPath, config.envRelativePath, config.envFilename);
        log.trace('Destination env file: %s', envFile);

        let processPromise;
        if (config.buildEnvFile === true) {
          log.trace('Building file .env');
          const envText = Object.entries(process.pm2_env)
            .filter(([, value]) => typeof value !== 'object')
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
          log.trace('Env file generated:\n%s', envText);

          log.debug('Building file: %s', envFile);
          processPromise = fsUtils.writeTextFile(envFile, envText);
        } else {
          const envFileToApply = path.resolve(processRootPath, config.envRelativePath, `${config.envFilename}.${currentEnv}`);
          log.trace('Source env file to rename: %s', envFileToApply);

          processPromise = fsUtils.existFile(envFileToApply)
            .then(() => {
              log.debug('Try to copy %s to %s', envFileToApply, envFile);
              return fsUtils.copyFile(envFileToApply, envFile);
            });
        }

        processPromise
          .then(renamed => log.info('.env file ready: %s', renamed))
          .catch(renameError => log.error(renameError, 'Error evaluating .env file'));
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
    pino.fatal(err, 'Error on init module');
    process.exit(2);
  }
  pm2EnvModule(conf);
});
