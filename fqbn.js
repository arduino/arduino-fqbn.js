function parse(fqbn) {
	var parts = fqbn.split(':');

	// Check length
	if (parts.length !== 3 && parts.length !== 4) {
		throw new ErrInvalidFQBN('given fqbn has ' + parts.length + ', should have 3 or 4');
	}

	// Parse config
	var config = {};
	if (parts.length === 4) {
		confParts = parts[3].split(',')
		for (var confPart of confParts) {
			keyVal = confPart.split('=');
			if (keyVal.length !== 2) {
				throw new ErrInvalidFQBN('given fqbn has an invalid config: ' + confPart);
			}

			config[keyVal[0]] = keyVal[1];
		}
	}

	return {
		packager: parts[0],
		architecture: parts[1],
		id: parts[2],
		config: config
	}
}

function stringify(obj) {
	var output = obj.packager + ':' + obj.architecture + ':' + obj.id;

	if (!obj.config) {
		return output;
	}

	var configLen = Object.keys(obj.config).length;

	if (obj.config && configLen > 0) {
		output += ':'
	}

	var i = 0;
	for (var key in obj.config) {
		output += key + '=' + obj.config[key];

		console.log(key, i, configLen)

		if (i < configLen-1) {
			output += ',';
		}

		i++;
	}

	return output;
}

class ErrInvalidFQBN {
	constructor(message) {
		this.message = message;
	}

	toString() {
		return 'InvalidFQBN' + ': ' + this.message + '';
	}

}

module.exports = {
	parse: parse,
	stringify: stringify,
	ErrInvalidFQBN: ErrInvalidFQBN
};