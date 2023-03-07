import { ActionValidator } from './action.validator';

describe('ActionValidator', () => {
  const validator = new ActionValidator();

  it('properly handles specific action', () => {
    const statementActions = ['User::update'];

    expect(
      validator.includesAction(statementActions, 'User::update'),
    ).toBeTruthy();
    expect(
      validator.includesAction(statementActions, 'User::delete'),
    ).toBeFalsy();
  });

  it('properly handles specific action list', () => {
    const statementActions = ['User::create', 'User::update'];

    expect(
      validator.includesAction(statementActions, 'User::update'),
    ).toBeTruthy();
    expect(
      validator.includesAction(statementActions, 'User::delete'),
    ).toBeFalsy();
  });

  it('properly handles action wildcard match', () => {
    const statementActions = ['User::*'];
    expect(
      validator.includesAction(statementActions, 'User::create'),
    ).toBeTruthy();
    expect(
      validator.includesAction(statementActions, 'User::update'),
    ).toBeTruthy();
    expect(
      validator.includesAction(statementActions, 'Donation::create'),
    ).toBeFalsy();
  });

  it('properly handles resource wildcard match', () => {
    const statementActions = ['*::read'];
    expect(
      validator.includesAction(statementActions, 'User::read'),
    ).toBeTruthy();
    expect(
      validator.includesAction(statementActions, 'Donation::read'),
    ).toBeTruthy();
    expect(
      validator.includesAction(statementActions, 'Donation::list'),
    ).toBeFalsy();
    expect(
      validator.includesAction(statementActions, 'User::update'),
    ).toBeFalsy();
  });

  it('properly handles combinations', () => {
    const statementActions = ['*::read', 'Donation::*'];
    expect(
      validator.includesAction(statementActions, 'User::read'),
    ).toBeTruthy();
    expect(
      validator.includesAction(statementActions, 'Donation::read'),
    ).toBeTruthy();
    expect(
      validator.includesAction(statementActions, 'Donation::list'),
    ).toBeTruthy();
    expect(
      validator.includesAction(statementActions, 'User::update'),
    ).toBeFalsy();
  });

  it('properly handles statement check', () => {
    const actions = ['User::create', 'User::update'];

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
        actions,
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
          actions: ['User::delete'],
        },
        actions,
      ),
    ).toBeFalsy();
  });
});
