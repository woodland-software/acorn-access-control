import { IamPrincipal, IamPolicyConditionGroup } from '../models/index.js';

export type IsOwnerCondition<
  User extends IamPrincipal = IamPrincipal,
  Group extends IamPolicyConditionGroup = IamPolicyConditionGroup,
> = (user: User) => Group;

export const IsOwnerCondition: IsOwnerCondition<
  IamPrincipal,
  IamPolicyConditionGroup
> = (user) => {
  return {
    matcher: 'ANY',
    children: [
      {
        not: false,
        propertyKey: 'createdBy',
        type: 'string',
        values: [user.id],
      },
      // solves for case where we want user to be able to update
      // their own user resource
      {
        not: false,
        resource: 'User',
        propertyKey: 'id',
        type: 'string',
        values: [user.id],
      },
    ],
  };
};
