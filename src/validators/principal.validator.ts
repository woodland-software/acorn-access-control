import {
  IamPolicyPrincipal,
  IamPolicyStatement,
  IamPrincipal,
} from '../models';
import { IamPolicyParseException } from '../errors';

export interface IPrincipalValidator {
  inStatement(statement: IamPolicyStatement, user: IamPrincipal): boolean;
  includesPrincipal(principal: IamPolicyPrincipal, user: IamPrincipal): boolean;
}

export class PrincipalValidator implements IPrincipalValidator {
  inStatement(statement: IamPolicyStatement, user: IamPrincipal): boolean {
    return !!statement.principals.find((principal) =>
      this.includesPrincipal(principal, user),
    );
  }

  includesPrincipal(
    policyPrincipal: IamPolicyPrincipal,
    principal: IamPrincipal,
  ): boolean {
    const { pattern, ids, groups } = policyPrincipal;

    if (pattern) {
      if (pattern === '*') return true;
      else
        throw new IamPolicyParseException(
          'currently only `*` wildcard supported',
        );
    }

    if (ids && ids.includes(principal.id)) {
      return true;
    }

    if (groups && !!groups.find((group) => principal.groups.includes(group))) {
      return true;
    }

    return false;
  }
}
