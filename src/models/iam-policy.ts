import { IamPolicyPrincipal } from './iam-policy-principal';
import { IamPolicyStatement } from './iam-policy-statement';

export type EConditionEffect = 'ALLOW' | 'DENY';
export type EConditionMatcher = 'ANY' | 'ALL';

export interface IamPolicy {
  policyId: string;
  statements: IamPolicyStatement[];
}
