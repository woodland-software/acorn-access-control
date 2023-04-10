import { PrincipalValidator } from '../principal.validator.js';
import { user } from '../../models/__mocks__/user.mock.js';

describe('PrincipalValidator', () => {
  const validator = new PrincipalValidator();

  it('properly matches against userId', () => {
    expect(
      validator.includesPrincipal(
        {
          ids: ['1234', '5678'],
        },
        user,
      ),
    ).toBeTruthy();
    expect(
      validator.includesPrincipal(
        {
          ids: ['5678'],
        },
        user,
      ),
    ).toBeFalsy();
  });

  it('properly matches against user.group', () => {
    expect(
      validator.includesPrincipal(
        {
          ids: ['5678'],
          groups: ['admin', 'accounting'],
        },
        user,
      ),
    ).toBeTruthy();

    expect(
      validator.includesPrincipal(
        {
          ids: ['5678'],
          groups: ['accounting'],
        },
        user,
      ),
    ).toBeFalsy();
  });

  it('properly matches against pattern', () => {
    expect(
      validator.includesPrincipal(
        {
          pattern: '*',
        },
        user,
      ),
    ).toBeTruthy();

    expect(() =>
      validator.includesPrincipal(
        {
          pattern: 'admin-*',
        },
        user,
      ),
    ).toThrowError();
  });
});
