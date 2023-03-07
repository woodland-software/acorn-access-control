import { IamPolicyException } from './iam-policy.exception';

/**
 * Thrown internally by the IamPolicy package when policy object is invalid
 */
export class IamPolicyParseException extends IamPolicyException {
  constructor(message?: string) {
    super(message);
    this.name = 'IamPolicyException';
  }
}
