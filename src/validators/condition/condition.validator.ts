import { IamPolicyCondition, IamPolicyConditionGroup } from '../../models';
import { IamPolicyInputException, IamPolicyParseException } from '../../errors';
import { IResourceParser, ResourceParser } from '../resource/resource.parser';
import { ITypeValidator, TypeValidator } from './type.validator';

interface IConditionValidator<
  Resource extends object = object,
  Condition extends IamPolicyCondition = IamPolicyCondition,
  Group extends IamPolicyConditionGroup = IamPolicyConditionGroup,
> {
  matchesGroup(conditionGroup: Group, resource: Resource): boolean;
  matchesCondition(condition: Condition, resource: Resource): boolean;
  hasProperty(propertyKey: string, resource: Resource): boolean;
  isGroup(condition: object): condition is Group;
  isCondition(condition: object): condition is Condition;
}

export class ConditionValidator<
  Resource extends object = object,
  Condition extends IamPolicyCondition = IamPolicyCondition,
  Group extends IamPolicyConditionGroup = IamPolicyConditionGroup,
> implements IConditionValidator<Resource, Condition, Group>
{
  constructor(
    private typeValidator: ITypeValidator = new TypeValidator(),
    private resourceParser: IResourceParser = new ResourceParser(),
  ) {}

  matchesGroup<T extends Resource>(
    conditionGroup: Group,
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

  matchesCondition<T extends Resource>(condition: Condition, resource: T) {
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

  hasProperty<T extends Resource>(
    propertyKey: string,
    resource: T,
  ): propertyKey is Extract<keyof T, 'string'> {
    return resource.hasOwnProperty(propertyKey);
  }

  isGroup(condition: object): condition is Group {
    return condition.hasOwnProperty('matcher');
  }

  isCondition(condition: object): condition is Condition {
    return condition.hasOwnProperty('propertyKey');
  }
}
