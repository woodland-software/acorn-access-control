import { IamPolicyStatement } from '../../models';
import { IamPolicyInputException, IamPolicyParseException } from '../../errors';

export interface IActionValidator<
  ActionKey extends string = string,
  Statement extends IamPolicyStatement = IamPolicyStatement,
> {
  inStatement(statement: Statement, actionKeys: ActionKey[]): boolean;
  includesAction(
    statementActionKeys: ActionKey[],
    actionKey: ActionKey,
  ): boolean;
}

export class ActionValidator<
  ActionKey extends string = string,
  Statement extends IamPolicyStatement = IamPolicyStatement,
> implements IActionValidator<ActionKey, Statement>
{
  inStatement(statement: IamPolicyStatement, actionKeys: string[]): boolean {
    return actionKeys.every((actionKey) =>
      this.includesAction(statement.actions, actionKey),
    );
  }

  includesAction(statementActionKeys: string[], actionKey: string): boolean {
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
