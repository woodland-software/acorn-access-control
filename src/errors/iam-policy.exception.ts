/**
 * Root exception thrown by the IamPolicy package
 */
export class IamPolicyException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'IamPolicyException';
  }
}
