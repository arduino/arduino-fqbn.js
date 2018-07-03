const FQBN = require('./fqbn');

var parseCases = [
  {fqbn: 'invalid',
  error: FQBN.ErrInvalidFQBN},
  {fqbn: 'arduino:avr:uno',
  expects: ['arduino', 'avr', 'uno', {}]},
  {fqbn: 'arduino:avr:mega:cpu=atmega1280',
  expects: ['arduino', 'avr', 'mega', {'cpu': 'atmega1280'}]},
  {fqbn: 'arduino:avr:mega:cpu=atmega1280,mem=1024',
  expects: ['arduino', 'avr', 'mega', {'mem': '1024', 'cpu': 'atmega1280'}]}
];

parseCases.forEach(function (testCase) {
  test('parse ' + testCase.fqbn, () => {
    // Test Error
    if (testCase.error) {
      function testRun() {
        FQBN.parse(testCase.fqbn)
      }
      expect(testRun).toThrowError(testCase.error);
      return
    }

    // Test Success
    var fqbn = FQBN.parse(testCase.fqbn);

    expect(fqbn.packager).toBe(testCase.expects[0])
    expect(fqbn.architecture).toBe(testCase.expects[1])
    expect(fqbn.id).toBe(testCase.expects[2])
    expect(fqbn.config).toEqual(testCase.expects[3])
  });
});


var stringifyCases = [
  {fqbn: {packager: 'arduino', architecture: 'avr', id: 'uno' },
  expects: 'arduino:avr:uno'},
  {fqbn: {packager: 'arduino', architecture: 'avr', id: 'mega', config:  {'cpu': 'atmega1280'} },
  expects: 'arduino:avr:mega:cpu=atmega1280'},
  {fqbn: {packager: 'arduino', architecture: 'avr', id: 'mega', config:  {'cpu': 'atmega1280', 'mem': '1024'} },
  expects: 'arduino:avr:mega:cpu=atmega1280,mem=1024'},
];

stringifyCases.forEach(function (testCase) {
  test('stringify ' + testCase.expects, () => {
    // Test Success
    var fqbn = FQBN.stringify(testCase.fqbn);
    expect(fqbn).toBe(testCase.expects);
  });
});
