import { IamPolicyException } from './iam-policy.exception.js';

/**
 * Thrown internally by the IamPolicy package on input error
 */
export class IamPolicyInputException extends IamPolicyException {
  constructor(message?: string) {
    super(message);
    this.name = 'IamPolicyException';
  }
}
