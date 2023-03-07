import { IamPolicyCondition, IamPolicyConditionGroup } from '../../models';
import { IamPolicyInputException, IamPolicyParseException } from '../../errors';
import { IResourceParser, ResourceParser } from '../resource/resource.parser';
import { ITypeValidator, TypeValidator } from './type.validator';

export interface IConditionValidator {
  matchesGroup(
    conditionGroup: IamPolicyConditionGroup,
    resource: object,
  ): boolean;
  matchesCondition(condition: IamPolicyCondition, resource: object): boolean;
  hasProperty(propertyKey: string, resource: object): boolean;
  isGroup(condition: object): condition is IamPolicyConditionGroup;
  isCondition(condition: object): condition is IamPolicyCondition;
}

export class ConditionValidator implements IConditionValidator {
  constructor(
    private typeValidator: ITypeValidator = new TypeValidator(),
    private resourceParser: IResourceParser = new ResourceParser(),
  ) {}

  matchesGroup<T extends object>(
    conditionGroup: IamPolicyConditionGroup,
    resource: T,
  ): boolean {
    const { children, matcher } = conditionGroup;
    const matches = children.map((child) => {
      if (this.isGroup(child)) return this.matchesGroup(child, resource);
      if (this.isCondition(child))
        return this.matchesCondition(child, resource);
      throw new IamPolicyParseException(
        'expected policy condition children to be either ConditionGroup or Condition entities',
      );
    });

    if (matcher === 'ALL') return matches.every((match) => match === true);
    if (matcher === 'ANY') return matches.some((match) => match === true);

    throw new IamPolicyParseException(
      `expected matcher to be ALL or ANY, received ${matcher}`,
    );
  }

  matchesCondition<T extends object>(
    condition: IamPolicyCondition,
    resource: T,
  ) {
    const { not, resource: resourceKey, propertyKey, type, values } = condition;
    // if resource is defined, we early exit with false in order to avoid an inputException
    if (resourceKey && this.resourceParser.resolveKey(resource) !== resourceKey)
      return false;
    if (!this.hasProperty(propertyKey, resource))
      throw new IamPolicyInputException(
        `property ${propertyKey} does not exist on resource ${resourceKey}`,
      );

    const value = resource[propertyKey];
    const typeValidator = this.typeValidator.findHandler(type);
    const match = typeValidator(value, values);

    return not ? !match : match;
  }

  hasProperty<T extends object>(
    propertyKey: string,
    resource: T,
  ): propertyKey is Extract<keyof T, 'string'> {
    return resource.hasOwnProperty(propertyKey);
  }

  isGroup(condition: object): condition is IamPolicyConditionGroup {
    return condition.hasOwnProperty('matcher');
  }

  isCondition(condition: object): condition is IamPolicyCondition {
    return condition.hasOwnProperty('propertyKey');
  }
}
