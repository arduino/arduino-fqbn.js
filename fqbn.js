'use strict';

function parse(fqbn) {
  const parts = fqbn.split(':');

  // Check length
  if (parts.length !== 3 && parts.length !== 4) {
    throw new Error('InvalidFQBN: given fqbn has ' + parts.length + ', should have 3 or 4');
  }

  // Parse config
  const config = {};
  if (parts.length === 4) {
    const confParts = parts[3].split(',');
    for (const confPart of confParts) {
      const keyVal = confPart.split('=');
      if (keyVal.length !== 2) {
        throw new Error('InvalidFQBN: given fqbn has an invalid config: ' + confPart);
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
