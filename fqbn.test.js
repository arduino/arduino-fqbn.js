const FQBN = require('./fqbn');

const parseCases = [
  {fqbn: 'fqbn:with:too:many:parts',
    error: 'TooManyPartsError'},
  {fqbn: 'toofewparts',
    error: 'TooFewPartsError'},
  {fqbn: 'fqbn:with:invalid:config',
    error: 'InvalidConfigError'},

  {fqbn: 'arduino:avr:uno',
    expects: ['arduino', 'avr', 'uno', {}]},
  {fqbn: 'arduino:avr:mega:cpu=atmega1280',
    expects: ['arduino', 'avr', 'mega', {cpu: 'atmega1280'}]},
  {fqbn: 'arduino:avr:mega:cpu=atmega1280,mem=1024',
    expects: ['arduino', 'avr', 'mega', {mem: '1024', cpu: 'atmega1280'}]}
];

parseCases.forEach(testCase => {
  test('parse ' + testCase.fqbn, () => {
    // Test Error
    if (testCase.error) {
      const testRun = function () {
        FQBN.parse(testCase.fqbn);
      };
      expect(testRun).toThrowError(testCase.error);
      return;
    }

    // Test Success
    const fqbn = FQBN.parse(testCase.fqbn);

    expect(fqbn.packager).toBe(testCase.expects[0]);
    expect(fqbn.architecture).toBe(testCase.expects[1]);
    expect(fqbn.id).toBe(testCase.expects[2]);
    expect(fqbn.config).toEqual(testCase.expects[3]);
  });
});

const stringifyCases = [
  {fqbn: ['arduino', 'avr', 'uno', null],
    expects: 'arduino:avr:uno'},
  {fqbn: ['arduino', 'avr', 'uno', {}],
    expects: 'arduino:avr:uno'},
  {fqbn: ['arduino', 'avr', 'mega', {cpu: 'atmega1280'}],
    expects: 'arduino:avr:mega:cpu=atmega1280'},
  {fqbn: ['arduino', 'avr', 'mega', {mem: '1024', cpu: 'atmega1280'}],
    expects: 'arduino:avr:mega:cpu=atmega1280,mem=1024'}
];

stringifyCases.forEach(testCase => {
  test('stringify ' + testCase.expects, () => {
    // Test Success
    const fqbn = FQBN.stringify(testCase.fqbn[0], testCase.fqbn[1], testCase.fqbn[2], testCase.fqbn[3]);
    expect(fqbn).toBe(testCase.expects);
  });
});
