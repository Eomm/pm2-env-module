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


### Change values

After having installed the module you have to type: `pm2 set pm2-env-module:<param> <value>`

```sh
pm2 set pm2-env-module:envFilename configFile
pm2 set pm2-env-module:envRelativePath /config
pm2 set pm2-env-module:envVariableName ENVIROMENT
```


## Todos

+ Remove `console.log`
+ Test
+ JSDocs
+ Configuration add-on:
    + `debug` for print out information
    + custom settings per process


## License
(The MIT License)

Copyright (c) 2018 Manuel Spigolon <behemoth89@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
