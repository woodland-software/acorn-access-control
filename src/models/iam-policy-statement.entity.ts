import { IamPolicyConditionGroup } from './iam-policy-condition-group.entity';
import { IamPolicyPrincipal } from './iam-policy-principal.entity';
import { EConditionEffect } from './iam-policy.entity';

export interface IamPolicyStatement<
  Principal extends IamPolicyPrincipal = IamPolicyPrincipal,
> {
  statementId: string;
  policyId: string;
  principals: Principal[];
  effect: EConditionEffect;
  resources: string[];
  actions: string[];
  conditions?: IamPolicyConditionGroup;
}
