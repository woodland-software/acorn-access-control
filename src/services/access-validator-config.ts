import { IsOwnerCondition } from '../conditions';
import { IamPolicyConditionGroup, IamPrincipal } from '../models';
import {
  ActionValidator,
  ConditionValidator,
  IActionValidator,
  IConditionValidator,
  IPrincipalValidator,
  IResourceValidator,
  PrincipalValidator,
  ResourceValidator,
} from '../validators';
import { IResourceParser, ResourceParser } from './parsers';

export interface IAccessValidatorConfig {
  principalValidator: () => IPrincipalValidator;
  resourceValidator: () => IResourceValidator;
  conditionValidator: () => IConditionValidator;
  actionValidator: () => IActionValidator;
  resourceParser: () => IResourceParser;
  ownerCondition: (user: IamPrincipal) => IamPolicyConditionGroup;
}

export class AccessValidatorConfig implements IAccessValidatorConfig {
  principalValidator = () => new PrincipalValidator();
  resourceValidator = () => new ResourceValidator(this.resourceParser());
  conditionValidator = () => new ConditionValidator();
  actionValidator = () => new ActionValidator();
  resourceParser = () => new ResourceParser();
  ownerCondition = (user: IamPrincipal) => IsOwnerCondition(user);
}
