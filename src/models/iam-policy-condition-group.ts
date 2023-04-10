import { IamPolicyCondition } from './iam-policy-condition.js';
import { EConditionMatcher } from './iam-policy.js';

export interface IamPolicyConditionGroup {
  matcher: EConditionMatcher;
  children: Array<IamPolicyConditionGroup | IamPolicyCondition>;
}
