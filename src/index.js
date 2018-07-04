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

class PartMissingError extends Error {
  constructor(parts) {
    super('PartMissingError: the following parts are missing: ' + parts);
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

function stringify(packager, architecture, id, config) {
  const missingParts = [];
  if (!packager) {
    missingParts.push('packager');
  }
  if (!architecture) {
    missingParts.push('architecture');
  }
  if (!id) {
    missingParts.push('id');
  }

  if (missingParts.length > 0) {
    throw new PartMissingError(missingParts);
  }

  let output = packager + ':' + architecture + ':' + id;

  if (!config || Object.keys(config).length === 0) {
    return output;
  }

  const configParts = [];

  for (const key in config) {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      configParts.push(key + '=' + config[key]);
    }
  }

  configParts.sort();
  output += ':' + configParts.join(',');

  return output;
}

module.exports = {
  parse,
  stringify
};
