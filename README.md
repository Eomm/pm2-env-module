# PM2 .env module

`pm2-env-module` aim to ease the configuration of nodejs apps that use the `.env` files to manage enviroment settings and can't use the [pm2 enviroment management](http://pm2.keymetrics.io/docs/usage/environment/).


## Install

```sh
pm2 install pm2-env-module
```

To install a specific version use the `@<version>` suffix

```sh
pm2 install pm2-env-module@0.0.1
```


## How it works

After the installation of this module you can control it like a normal pm2 process:

```sh
pm2 start pm2-env-module
pm2 stop pm2-env-module
pm2 restart pm2-env-module
pm2 logs pm2-env-module
```

Every time it is started, the module will read all the process of the pm2 where is installed and, foreach process it will:
+ if a file `<process-script-path>/<config.envRelativePath>/<config.envFilename>.<enviroment-of-process[envVariableName]>` exist
+ copy the previous file to `<process-script-path>/<config.envRelativePath>/<config.envFilename>` overriding if exist

If some error occurs, it will be logged.

**NB:** the command `pm2 start|stop|restart all` DOES NOT EFFECT the modules, so keep in mind that you must call `pm2 restart pm2-env-module` before restarting your process to change the env files.


## Configuration

| Configuration | Default | Description
| ------------- | ------- | -----------
| `envFilename`     | `.env`     | The file name of the env file
| `envRelativePath` | ``         | An optional path to add to the script root path
| `envVariableName` | `NODE_ENV` | The env variable that contains the name of the enviroment execution
| `buildEnvFile`    | `false`    | Generate an env file with the data set on the ecosystem's pm2 file. It will ignore other `.env*` files
| `logLevel`        | `info`     | Set the log level. Values are: [fatal, error, warn, info, debug, trace](https://getpino.io/#/docs/API?id=level)


### Change values

After having installed the module you have to type: `pm2 set pm2-env-module:<param> <value>`

```sh
pm2 set pm2-env-module:envFilename configFile
pm2 set pm2-env-module:envRelativePath /config
pm2 set pm2-env-module:envVariableName ENVIROMENT
pm2 set pm2-env-module:buildEnvFile true
pm2 set pm2-env-module:logLevel trace
```


## Todos

+ Test
+ JSDocs
+ Configuration add-on:
    + custom settings per process


## License

Copyright [Manuel Spigolon](https://github.com/Eomm), Licensed under [MIT](./LICENSE).
