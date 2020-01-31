arduino-fqbn
============

- Parse arduino fqbn:

	```javascript
	fqbn.parse('arduino:avr:mega:cpu=atmega1260,mem=1024')
	{
		packager: 'arduino',
		architecture: 'avr',
		id: 'mega',
		config: {
			cpu: 'atmega1260',
			mem: '1024'
		}
	}
	```

- And viceversa:

	```javascript
	fqbn.stringify('arduino','avr','mega', {
			cpu: 'atmega1260',
			mem: '1024'
		})
	'arduino:avr:mega:cpu=atmega1260,mem=1024'
	```

How to deploy on npm
--------------------

1. Change the version in package.json
2. Login with `npm login`
3. Publish with `npm publish`