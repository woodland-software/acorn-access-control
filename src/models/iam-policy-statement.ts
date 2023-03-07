import { IamPolicyConditionGroup } from './iam-policy-condition-group';
import { IamPolicyPrincipal } from './iam-policy-principal';
import { EConditionEffect } from './iam-policy';

export interface IamPolicyStatement<ActionKey extends string = string> {
  statementId: string;
  policyId: string;
  principals: IamPolicyPrincipal[];
  effect: EConditionEffect;
  resources: string[];
  actions: ActionKey[];
  conditions?: IamPolicyConditionGroup;
}
