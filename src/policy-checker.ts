import { IsOwnerCondition } from './conditions/is-owner.condition';

import {
  ActionValidator,
  PrincipalValidator,
  ConditionValidator,
  ResourceValidator,
} from './validators';
import {
  IamPolicy,
  IamPolicyPrincipal,
  IamPolicyStatement,
  IamResource,
  IamUser,
} from './models';

export class PolicyChecker<
  ActionKey extends string = string,
  Resource extends IamResource = IamResource,
  Principal extends IamPolicyPrincipal = IamPolicyPrincipal,
  Statement extends IamPolicyStatement<Principal> = IamPolicyStatement<Principal>,
  Policy extends IamPolicy<Principal, Statement> = IamPolicy<
    Principal,
    Statement
  >,
  User extends IamUser = IamUser,
> {
  constructor(
    private principalValidator: PrincipalValidator<
      User,
      Principal,
      Statement
    > = new PrincipalValidator(),
    private resourceValidator: ResourceValidator<
      Resource,
      Statement
    > = new ResourceValidator(),
    private conditionValidator: ConditionValidator<Resource> = new ConditionValidator(),
    private actionValidator: ActionValidator<
      ActionKey,
      Statement
    > = new ActionValidator(),
  ) {}

  validate<T extends Resource>(
    policy: Policy,
    resource: T,
    principal: User,
    actions: ActionKey[],
  ) {
    let isValid = false;
    for (const statement of policy.statements) {
      const matches = this.validateStatement(
        statement,
        resource,
        principal,
        actions,
      );

      if (matches && statement.effect === 'DENY') return false;
      if (matches) isValid = true;
    }

    return isValid;
  }

  validateStatement<T extends Resource>(
    statement: Statement,
    resource: T,
    principal: User,
    actions: ActionKey[],
  ) {
    const localStatement = { ...statement };
    if (!this.principalValidator.inStatement(localStatement, principal))
      return false;
    if (!this.actionValidator.inStatement(localStatement, actions))
      return false;
    if (!this.resourceValidator.inStatement(localStatement, resource))
      return false;

    if (this.resourceValidator.allowsCreator(localStatement, resource)) {
      const existingConditions = localStatement.conditions
        ? [localStatement.conditions]
        : [];
      localStatement.conditions = {
        matcher: 'ANY',
        children: [IsOwnerCondition(principal), ...existingConditions],
      };
    }
    if (localStatement.conditions) {
      if (
        !this.conditionValidator.matchesGroup(
          localStatement.conditions,
          resource,
        )
      )
        return false;
    }

    return true;
  }

  builder(policy: Policy) {
    return this.check(policy);
  }

  check(policy: Policy) {
    return {
      resource: <T extends Resource>(resource: T) => ({
        allows: (actions: ActionKey[]) => ({
          by: (user: User) => this.validate(policy, resource, user, actions),
        }),
      }),

      principal: (user: User) => ({
        can: (actions: ActionKey[]) => ({
          on: <T extends Resource>(resource: T) =>
            this.validate(policy, resource, user, actions),
        }),
      }),

      allows: (actions: ActionKey[]) => ({
        on: <T extends Resource>(resource: T) => ({
          by: (user: User) => this.validate(policy, resource, user, actions),
        }),

        by: (user: User) => ({
          on: <T extends Resource>(resource: T) =>
            this.validate(policy, resource, user, actions),
        }),
      }),
    };
  }
}
