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
