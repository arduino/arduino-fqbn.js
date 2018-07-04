/*
 * This file is part of arduino-fqbn.
 *
 * Copyright 2018 Arduino AG (http://www.arduino.cc/)
 *
 * arduino-fqbn is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * As a special exception, you may use this file as part of a free software
 * library without restriction.  Specifically, if other files instantiate
 * templates or use macros or inline functions from this file, or you compile
 * this file and link it with other files to produce an executable, this
 * file does not by itself cause the resulting executable to be covered by
 * the GNU General Public License.  This exception does not however
 * invalidate any other reasons why the executable file might be covered by
 * the GNU General Public License.
 */
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
