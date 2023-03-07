import { ConditionValidator } from './condition.validator';
import { user } from '../../../tests/mocks/user.mock';

describe('ConditionValidator', () => {
  const validator = new ConditionValidator();

  const resource = {
    id: '5678',
    name: 'Resource',
    title: 'Resource title',
    createdBy: '1234',
  };

  it('properly handles conditions', () => {
    expect(
      validator.matchesCondition(
        {
          not: false,
          propertyKey: 'createdBy',
          type: 'string',
          values: [user.id],
        },
        resource,
      ),
    ).toBe(true);
  });
});
