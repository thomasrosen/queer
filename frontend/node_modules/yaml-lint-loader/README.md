# yaml-lint-loader

[![Dependency Status](https://img.shields.io/david/hsz/yaml-lint-loader.svg?style=flat-square)](https://david-dm.org/hsz/yaml-lint-loader)
[![Dev Dependency Status](https://img.shields.io/david/dev/hsz/yaml-lint-loader.svg?style=flat-square)](https://david-dm.org/hsz/yaml-lint-loader)
[![Version](https://img.shields.io/npm/v/yaml-lint-loader.svg?style=flat-square)](https://www.npmjs.com/package/yaml-lint-loader)
[![Month Download](https://img.shields.io/npm/dm/yaml-lint-loader.svg?style=flat-square)](https://www.npmjs.com/package/yaml-lint-loader)
[![License](https://img.shields.io/npm/l/yaml-lint-loader.svg?style=flat-square)](https://www.npmjs.com/package/yaml-lint-loader)

YAML lint loader module for [webpack](http://webpack.github.io/).

Loader verifies the syntax of YAML files using [yaml-lint](https://github.com/rasshofer/yaml-lint).

It is recommended to use it together with [yaml-loader](https://github.com/okonet/yaml-loader)
and [json-loader](https://github.com/webpack/json-loader) to get the JSON objects.

## Installation

`npm install --save yaml-lint-loader`

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

Simplest case would be:

``` javascript
var json = require("json-loader!yaml-loader!yaml-lint-loader./file.yml");
// => returns file.yml as javascript object
```

Example webpack configuration for handling `.yaml` and `.yml` files may look like:

```js
// webpack.config.js
module: {
  rules: [
    {
      test: /\.ya?ml$/,
      use: [
        { loader: 'json-loader' },
        { loader: 'yaml-loader' },
        { loader: 'yaml-lint-loader' },
      ],
    },
  ]
}
```

## Configuration

It is possible to configure the behaviour of `yaml-lint` module which is used for linting
YAML files with creating the `.yaml-lint.json` file in the current working directory
with following example configuration:

```json
{
  "schema": "CORE_SCHEMA",
  "ignore": "dir/*.yaml"
}
```

Available options for [schema](https://github.com/rasshofer/yaml-lint#schema-string)
and [ignore](https://github.com/rasshofer/yaml-lint#ignore-string-or-array-of-strings)
properties are described in [yaml-lint](https://github.com/rasshofer/yaml-lint) README.

## License

Copyright (c) 2018 Jakub Chrzanowski
Licensed under the [MIT](./LICENSE) license.
