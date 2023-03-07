import { TypeValidator } from '../type.validator';

describe('ResourceTypeValidator', () => {
  it('properly resolves string handler', () => {
    const validator = new TypeValidator();

    expect(validator.findHandler('string')).toBeDefined();
    expect(() => validator.findHandler('json')).toThrowError();
  });

  it('properly handles string type', () => {
    const validator = new TypeValidator();
    const stringValidator = validator.findHandler('string');

    expect(stringValidator('one', ['one', 'two', 'three'])).toBeTruthy();
    expect(stringValidator('four', ['one', 'two', 'three'])).toBeFalsy();
    expect(() => stringValidator(1, ['one', 'two', 'three'])).toThrowError();
    expect(() => stringValidator('one', [1, 2, 3])).toThrowError();
    expect(() => stringValidator(1, [1, 2, 3])).toThrowError();
  });
});
