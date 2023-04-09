import {
  IamPolicy,
  IamPolicyStatement,
  IamResource,
  IamPrincipal,
} from '../models/index.js';
import {
  IActionValidator,
  IConditionValidator,
  IPrincipalValidator,
  IResourceValidator,
} from '../validators/index.js';
import {
  AccessValidatorConfig,
  IAccessValidatorConfig,
} from './access-validator-config.js';

export class AccessValidator {
  private principalValidator: IPrincipalValidator;
  private actionValidator: IActionValidator;
  private resourceValidator: IResourceValidator;
  private conditionValidator: IConditionValidator;
  constructor(
    readonly config: IAccessValidatorConfig = new AccessValidatorConfig(),
  ) {
    this.principalValidator = config.principalValidator();
    this.actionValidator = config.actionValidator();
    this.resourceValidator = config.resourceValidator();
    this.conditionValidator = config.conditionValidator();
  }

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
    const { ownerCondition } = this.config;

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
        children: [ownerCondition(principal), ...existingConditions],
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
