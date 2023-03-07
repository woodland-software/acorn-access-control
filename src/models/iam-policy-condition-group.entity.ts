import { IamPolicyCondition } from './iam-policy-condition.entity';
import { EConditionMatcher } from './iam-policy.entity';

export interface IamPolicyConditionGroup {
  matcher: EConditionMatcher;
  children: Array<IamPolicyConditionGroup | IamPolicyCondition>;
}
