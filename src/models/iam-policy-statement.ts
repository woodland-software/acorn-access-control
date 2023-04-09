import { IamPolicyConditionGroup } from './iam-policy-condition-group.js';
import { IamPolicyPrincipal } from './iam-policy-principal.js';
import { EConditionEffect } from './iam-policy.js';

export interface IamPolicyStatement<ActionKey extends string = string> {
  statementId: string;
  policyId: string;
  principals: IamPolicyPrincipal[];
  effect: EConditionEffect;
  resources: string[];
  actions: ActionKey[];
  conditions?: IamPolicyConditionGroup;
}
