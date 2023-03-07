import { IamPolicyPrincipal } from './iam-policy-principal.entity';
import { IamPolicyStatement } from './iam-policy-statement.entity';

export type EConditionEffect = 'ALLOW' | 'DENY';
export type EConditionMatcher = 'ANY' | 'ALL';

export interface IamPolicy<
  Principal extends IamPolicyPrincipal = IamPolicyPrincipal,
  Statement extends IamPolicyStatement<Principal> = IamPolicyStatement<Principal>,
> {
  policyId: string;
  statements: Statement[];
}
