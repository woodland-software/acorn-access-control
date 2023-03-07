import { IamUser, IamPolicyConditionGroup } from '../models';

export type IsOwnerCondition<
  User extends IamUser = IamUser,
  Group extends IamPolicyConditionGroup = IamPolicyConditionGroup,
> = (user: User) => Group;

export const IsOwnerCondition: IsOwnerCondition<
  IamUser,
  IamPolicyConditionGroup
> = (user) => {
  return {
    matcher: 'ANY',
    children: [
      {
        not: false,
        propertyKey: 'createdBy',
        type: 'string',
        values: [user.userId],
      },
      // solves for case where we want user to be able to update
      // their own user resource
      {
        not: false,
        resource: 'User',
        propertyKey: 'userId',
        type: 'string',
        values: [user.userId],
      },
    ],
  };
};
