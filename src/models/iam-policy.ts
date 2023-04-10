import { IamPolicyStatement } from './iam-policy-statement.js';

export type EConditionEffect = 'ALLOW' | 'DENY';
export type EConditionMatcher = 'ANY' | 'ALL';

export interface IamPolicy {
  policyId: string;
  statements: IamPolicyStatement[];
}
