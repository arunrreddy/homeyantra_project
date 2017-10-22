'use strict';
const path = require('path');

const jsonfile = require('jsonfile');

const secretsPath = path.join(process.env.HOME, '/workspace/secrets');
const readSecretJSON = name => jsonfile.readFileSync(path.join(secretsPath,
`${name}.json`)); module.exports = readSecretJSON;
