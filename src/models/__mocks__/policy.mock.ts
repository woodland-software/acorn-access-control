import { IamPolicy } from '../iam-policy.js';

export const policy: IamPolicy = {
  policyId: '',
  statements: [
    {
      statementId: '',
      policyId: '',
      effect: 'ALLOW',
      principals: [{ pattern: '*' }],
      resources: ['User/~'],
      actions: ['User::update'],
      conditions: {
        matcher: 'ALL',
        children: [
          {
            not: false,
            propertyKey: 'userId',
            type: 'string',
            values: ['5678'],
          },
        ],
      },
    },
  ],
};

export const userAccessPolicy: IamPolicy = {
  policyId: '',
  statements: [
    {
      statementId: '',
      policyId: '',
      effect: 'ALLOW',
      principals: [{ pattern: '*' }],
      resources: ['User/~'],
      actions: ['User::update'],
    },
  ],
};

export const bloggerPolicy: IamPolicy = {
  policyId: '',
  statements: [
    {
      statementId: '',
      policyId: '',
      effect: 'ALLOW',
      principals: [{ pattern: '*' }],
      resources: ['Post/~', 'User/~'],
      actions: [
        'User::read',
        'User::update',
        'Post::read',
        'Post::list',
        'Post::create',
        'Post::update',
        'Post::delete',
      ],
    },
  ],
};

export const adminPolicy: IamPolicy = {
  policyId: '',
  statements: [
    {
      statementId: '',
      policyId: '',
      effect: 'ALLOW',
      principals: [{ groups: ['admin'] }],
      resources: ['Post/*', 'User/*'],
      actions: ['*::read', '*::list', '*::create', '*::update', '*::delete'],
    },
  ],
};
