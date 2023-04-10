import { IamPolicyStatement } from '../models/index.js';
import {
  IamPolicyInputException,
  IamPolicyParseException,
} from '../errors/index.js';

export interface IActionValidator {
  inStatement(statement: IamPolicyStatement, actionKeys: string[]): boolean;
  includesAction(statementActionKeys: string[], actionKey: string): boolean;
}

export class ActionValidator<ActionKey extends string = string>
  implements IActionValidator
{
  inStatement(
    statement: IamPolicyStatement<ActionKey>,
    actionKeys: ActionKey[],
  ): boolean {
    return actionKeys.every((actionKey) =>
      this.includesAction(statement.actions, actionKey),
    );
  }

  includesAction(
    statementActionKeys: ActionKey[],
    actionKey: ActionKey,
  ): boolean {
    for (const statementActionKey of statementActionKeys) {
      // early exit on direct match
      if (statementActionKey === actionKey) return true;

      // constrained wildcard matching
      const actionParts = actionKey.split('::');
      const statementActionParts = statementActionKey.split('::');

      if (actionParts.length < 2)
        throw new IamPolicyInputException(`unable to parse action `);

      if (statementActionParts.length < 2)
        throw new IamPolicyParseException(
          `unable to parse policy statement actions or target action`,
        );

      const [resourcePart, actionPart] = actionParts;
      const [statementResourcePart, statementActionPart] = statementActionParts;

      // allows for "*::action"
      if (statementResourcePart === '*' && actionPart === statementActionPart)
        return true;
      // allows for "Resource::*"
      if (statementActionPart === '*' && resourcePart === statementResourcePart)
        return true;
    }

    return false;
  }
}
