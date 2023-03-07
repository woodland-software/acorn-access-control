import { ResourceValidator } from '../resource.validator';

describe('ResourceValidator', () => {
  const validator = new ResourceValidator();

  const resource = {
    id: '5678',
    name: 'Resource',
    title: 'Resource title',
    createdBy: '1234',
  };
  it('properly determines if resource is included in statement', () => {
    expect(
      validator.inStatement(
        {
          statementId: '',
          policyId: '',
          effect: 'ALLOW',
          principals: [{ pattern: '*' }],
          resources: ['Resource/*'],
          actions: ['User::create', 'User::update', 'User::delete'],
        },
        resource,
      ),
    ).toBeTruthy();

    expect(
      validator.inStatement(
        {
          statementId: '',
          policyId: '',
          effect: 'ALLOW',
          principals: [{ pattern: '*' }],
          resources: ['Resource/5678'],
          actions: ['User::create', 'User::update', 'User::delete'],
        },
        resource,
      ),
    ).toBeTruthy();

    expect(
      validator.inStatement(
        {
          statementId: '',
          policyId: '',
          effect: 'ALLOW',
          principals: [{ pattern: '*' }],
          resources: ['Resource/~'],
          actions: ['User::create', 'User::update', 'User::delete'],
        },
        resource,
      ),
    ).toBeTruthy();

    expect(
      validator.inStatement(
        {
          statementId: '',
          policyId: '',
          effect: 'ALLOW',
          principals: [{ pattern: '*' }],
          resources: ['User/~'],
          actions: ['User::create', 'User::update', 'User::delete'],
        },
        resource,
      ),
    ).toBeFalsy();
  });

  it('properly determines if resource allows creator to access', () => {
    expect(
      validator.allowsCreator(
        {
          statementId: '',
          policyId: '',
          effect: 'ALLOW',
          principals: [{ pattern: '*' }],
          resources: ['Resource/~'],
          actions: ['User::create', 'User::update', 'User::delete'],
        },
        resource,
      ),
    ).toBeTruthy();
    expect(
      validator.allowsCreator(
        {
          statementId: '',
          policyId: '',
          effect: 'ALLOW',
          principals: [{ pattern: '*' }],
          resources: ['Resource/*'],
          actions: ['User::create', 'User::update', 'User::delete'],
        },
        resource,
      ),
    ).toBeFalsy();
  });
});
