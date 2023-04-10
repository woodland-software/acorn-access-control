import { IamPolicy } from 'acorn-access-control';
export const policy: IamPolicy = {
  policyId: 'policy-1',
  statements: [
    {
      statementId: 'statement-1',
      policyId: 'policy-1',
      effect: 'ALLOW',
      principals: [{ ids: ['user-1'] }],
      actions: ['Post::read'],
      resources: ['Post'],
    },
  ],
};
