import { IamPolicyPrincipal, IamPolicyStatement, IamUser } from '../../models';
import { IamPolicyParseException } from '../../errors';

export interface IPrincipalValidator<
  User extends IamUser = IamUser,
  Principal extends IamPolicyPrincipal = IamPolicyPrincipal,
  Statement extends IamPolicyStatement = IamPolicyStatement,
> {
  inStatement(statement: Statement, user: User): boolean;
  includesUser(principal: Principal, user: User): boolean;
}

export class PrincipalValidator<
  User extends IamUser = IamUser,
  Principal extends IamPolicyPrincipal = IamPolicyPrincipal,
  Statement extends IamPolicyStatement<Principal> = IamPolicyStatement<Principal>,
> implements IPrincipalValidator<User, Principal, Statement>
{
  inStatement(statement: Statement, user: User): boolean {
    return !!statement.principals.find((principal) =>
      this.includesUser(principal, user),
    );
  }

  includesUser(principal: Principal, user: User): boolean {
    const { pattern, userIds, userGroups } = principal;

    if (pattern) {
      if (pattern === '*') return true;
      else
        throw new IamPolicyParseException(
          'currently only `*` wildcard supported',
        );
    }

    if (userIds && userIds.includes(user.userId)) {
      return true;
    }

    if (
      userGroups &&
      !!userGroups.find((userGroup) => user.userGroups.includes(userGroup))
    ) {
      return true;
    }

    return false;
  }
}
