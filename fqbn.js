'use strict';

class TooManyPartsError extends Error {
  constructor(n) {
    super('TooManyPartsError: expecting at most 4 parts, got ' + n);
  }
}

class TooFewPartsError extends Error {
  constructor(n) {
    super('TooFewPartsError: expecting at least 3 parts, got ' + n);
  }
}

class InvalidConfigError extends Error {
  constructor(config) {
    super('InvalidConfigError: configs should be in the form `key=value`, got ' + config);
  }
}

function parse(fqbn) {
  const parts = fqbn.split(':');

  // Check length
  if (parts.length > 4) {
    throw new TooManyPartsError(parts.length);
  }

  if (parts.length < 3) {
    throw new TooFewPartsError(parts.length);
  }

  // Parse config
  const config = {};
  if (parts.length === 4) {
    const confParts = parts[3].split(',');
    for (const confPart of confParts) {
      const keyVal = confPart.split('=');
      if (keyVal.length !== 2) {
        throw new InvalidConfigError(confPart);
      }

      config[keyVal[0]] = keyVal[1];
    }
  }

  return {
    packager: parts[0],
    architecture: parts[1],
    id: parts[2],
    config
  };
}

function stringify(obj) {
  let output = obj.packager + ':' + obj.architecture + ':' + obj.id;

  if (!obj.config) {
    return output;
  }

  const configLen = Object.keys(obj.config).length;

  if (obj.config && configLen > 0) {
    output += ':';
  }

  let i = 0;
  for (const key in obj.config) {
    if (Object.prototype.hasOwnProperty.call(obj.config, key)) {
      output += key + '=' + obj.config[key];

      if (i < configLen - 1) {
        output += ',';
      }

      i++;
    }
  }

  return output;
}

module.exports = {
  parse,
  stringify
};
