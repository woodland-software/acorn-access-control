import { IamPolicyCondition } from './iam-policy-condition';
import { EConditionMatcher } from './iam-policy';

export interface IamPolicyConditionGroup {
  matcher: EConditionMatcher;
  children: Array<IamPolicyConditionGroup | IamPolicyCondition>;
}
