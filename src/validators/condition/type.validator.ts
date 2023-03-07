import { IamPolicyInputException, IamPolicyParseException } from '../../errors';

export interface ITypeValidatorHandler {
  stringValidator(input: unknown, values: unknown): boolean;
}
export interface ITypeValidator extends ITypeValidatorHandler {
  findHandler(typeKey: string): ITypeValidatorHandler['stringValidator'];
}

export class TypeValidator implements ITypeValidator {
  findHandler(typeKey: string) {
    switch (typeKey) {
      case 'string':
        return this.stringValidator;

      default:
        throw new IamPolicyParseException(
          `Unable to find type validator for type ${typeKey}`,
        );
    }
  }

  stringValidator(input: unknown, values: unknown[]): boolean {
    const isString = (input: unknown): input is string => {
      return typeof input === 'string';
    };

    const isStringArr = (input: unknown[]): input is string[] => {
      return input.every(isString);
    };

    if (!isString(input))
      throw new IamPolicyInputException(
        `expected string type for input, got ${typeof input} with value ${input}`,
      );

    if (!isStringArr(values))
      throw new IamPolicyParseException(
        `expected string array type for condition values`,
      );

    return values.includes(input);
  }
}
