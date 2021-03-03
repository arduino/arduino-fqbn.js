/*
* Copyright 2018 ARDUINO AS (http://www.arduino.cc/)
* This file is part of arduino-fqbn.js.
* Copyright (c) 2018
* Authors: Matteo Suppo
*
* This software is released under:
* The GNU General Public License, which covers the main part of
* arduino-fqbn.js
* The terms of this license can be found at:
* https://www.gnu.org/licenses/gpl-3.0.en.html
*
* You can be released from the requirements of the above licenses by purchasing
* a commercial license. Buying such a license is mandatory if you want to modify or
* otherwise use the software for commercial activities involving the Arduino
* software without disclosing the source code of your own applications. To purchase
* a commercial license, send an email to license@arduino.cc.
*
*/
const FQBN = require('./index');

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
  {fqbn: [null, 'avr', 'uno', null],
    error: 'PartMissingError', expects: 'error'},
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
    // Test Error
    if (testCase.error) {
      const testRun = function () {
        FQBN.stringify(testCase.fqbn[0], testCase.fqbn[1], testCase.fqbn[2], testCase.fqbn[3]);
      };
      expect(testRun).toThrowError(testCase.error);
      return;
    }

    // Test Success
    const fqbn = FQBN.stringify(testCase.fqbn[0], testCase.fqbn[1], testCase.fqbn[2], testCase.fqbn[3]);
    expect(fqbn).toBe(testCase.expects);
  });
});
