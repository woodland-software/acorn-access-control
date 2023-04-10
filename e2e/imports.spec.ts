import {
  AccessValidator,
  IActionValidator,
  ActionValidator,
  IConditionValidator,
  ConditionValidator,
  IsOwnerCondition,
  IPrincipalValidator,
  PrincipalValidator,
  IResourceValidator,
  ResourceValidator,
  ITypeValidator,
  TypeValidator,
  ValidatorHandler,
  IamPolicyException,
  IamPolicyInputException,
  IamPolicyParseException,
} from 'acorn-access-control';

describe('Import test', () => {
  it("doesn't error with the expected import list", () => {
    expect(AccessValidator).toBeDefined();
    expect(ActionValidator).toBeDefined();
    expect(ConditionValidator).toBeDefined();
    expect(IamPolicyException).toBeDefined();
    expect(IamPolicyInputException).toBeDefined();
    expect(IamPolicyParseException).toBeDefined();
    expect(PrincipalValidator).toBeDefined();
    expect(ResourceValidator).toBeDefined();
    expect(TypeValidator).toBeDefined();
  });
});
