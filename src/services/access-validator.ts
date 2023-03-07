import {
  IamPolicy,
  IamPolicyStatement,
  IamResource,
  IamPrincipal,
} from '../models';
import {
  AccessValidatorConfig,
  IAccessValidatorConfig,
} from './access-validator-config';

export class AccessValidator {
  constructor(
    readonly config: IAccessValidatorConfig = new AccessValidatorConfig(),
  ) {}

  validate(
    policy: IamPolicy,
    resource: IamResource,
    principal: IamPrincipal,
    actions: string[],
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

  validateStatement(
    statement: IamPolicyStatement,
    resource: IamResource,
    principal: IamPrincipal,
    actions: string[],
  ) {
    const localStatement = { ...statement };
    const {
      principalValidator,
      actionValidator,
      resourceValidator,
      conditionValidator,
      ownerCondition,
    } = this.config;

    if (!principalValidator.inStatement(localStatement, principal))
      return false;
    if (!actionValidator.inStatement(localStatement, actions)) return false;
    if (!resourceValidator.inStatement(localStatement, resource)) return false;

    if (resourceValidator.allowsCreator(localStatement, resource)) {
      const existingConditions = localStatement.conditions
        ? [localStatement.conditions]
        : [];
      localStatement.conditions = {
        matcher: 'ANY',
        children: [ownerCondition(principal), ...existingConditions],
      };
    }
    if (localStatement.conditions) {
      if (!conditionValidator.matchesGroup(localStatement.conditions, resource))
        return false;
    }

    return true;
  }

  builder(policy: IamPolicy) {
    return this.check(policy);
  }

  check(policy: IamPolicy) {
    return {
      resource: (resource: IamResource) => ({
        allows: (actions: string[]) => ({
          by: (user: IamPrincipal) =>
            this.validate(policy, resource, user, actions),
        }),
      }),

      principal: (user: IamPrincipal) => ({
        can: (actions: string[]) => ({
          on: (resource: IamResource) =>
            this.validate(policy, resource, user, actions),
        }),
      }),

      allows: (actions: string[]) => ({
        on: (resource: IamResource) => ({
          by: (user: IamPrincipal) =>
            this.validate(policy, resource, user, actions),
        }),

        by: (user: IamPrincipal) => ({
          on: (resource: IamResource) =>
            this.validate(policy, resource, user, actions),
        }),
      }),
    };
  }
}
