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

export interface IAccessValidatorConfig {
  principalValidator: IPrincipalValidator;
  resourceValidator: IResourceValidator;
  conditionValidator: IConditionValidator;
  actionValidator: IActionValidator;
  ownerCondition: (user: IamPrincipal) => IamPolicyConditionGroup;
}

export class AccessValidatorConfig implements IAccessValidatorConfig {
  principalValidator = new PrincipalValidator();
  resourceValidator = new ResourceValidator();
  conditionValidator = new ConditionValidator();
  actionValidator = new ActionValidator();
  ownerCondition = (user: IamPrincipal) => IsOwnerCondition(user);
}
