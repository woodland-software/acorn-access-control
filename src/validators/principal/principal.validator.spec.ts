import { PrincipalValidator } from './principal.validator';
import { user } from '../../models/mocks/user.mock';

describe('PrincipalValidator', () => {
  const validator = new PrincipalValidator();

  it('properly matches against userId', () => {
    expect(
      validator.includesUser(
        {
          userIds: ['1234', '5678'],
        },
        user,
      ),
    ).toBeTruthy();
    expect(
      validator.includesUser(
        {
          userIds: ['5678'],
        },
        user,
      ),
    ).toBeFalsy();
  });

  it('properly matches against userGroup', () => {
    expect(
      validator.includesUser(
        {
          userIds: ['5678'],
          userGroups: ['admin', 'accounting'],
        },
        user,
      ),
    ).toBeTruthy();

    expect(
      validator.includesUser(
        {
          userIds: ['5678'],
          userGroups: ['accounting'],
        },
        user,
      ),
    ).toBeFalsy();
  });

  it('properly matches against pattern', () => {
    expect(
      validator.includesUser(
        {
          pattern: '*',
        },
        user,
      ),
    ).toBeTruthy();

    expect(() =>
      validator.includesUser(
        {
          pattern: 'admin-*',
        },
        user,
      ),
    ).toThrowError();
  });
});
