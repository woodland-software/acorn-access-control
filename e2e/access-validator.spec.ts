import { AccessValidator, IamResource } from 'acorn-access-control';
import { policy } from './mocks/policy.mock';
import { user } from './mocks/user.mock';

describe('AccessValidator', () => {
  it('properly initializes', () => {
    const resource: IamResource = {
      name: 'Post',
      createdBy: 'jessekernaghan',
    };
    const validator: AccessValidator = new AccessValidator();
    const valid = validator
      .check(policy)
      .principal(user)
      .can(['Post::read'])
      .on(resource);

    expect(validator).toBeDefined();
    expect(valid).toBeTruthy();
  });
});
