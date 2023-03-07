import { IamPolicyStatement, IamResource } from '../../models';
import { ResourceParser } from './resource.parser';

export interface IResourceValidator<
  Resource extends object = object,
  Statement extends IamPolicyStatement = IamPolicyStatement,
> {
  inStatement(statement: Statement, resource: Resource): boolean;
  allowsCreator(statement: Statement, resource: Resource): boolean;
}

export class ResourceValidator<
  Resource extends IamResource = IamResource,
  Statement extends IamPolicyStatement = IamPolicyStatement,
> implements IResourceValidator<Resource, Statement>
{
  constructor(private resourceParser: ResourceParser = new ResourceParser()) {}

  inStatement(statement: Statement, resource: Resource): boolean {
    const resourceKey = this.resourceParser.resolveKey(resource);
    return !!statement.resources.find(
      (statementResourceKey) =>
        statementResourceKey.split('/')[0] === resourceKey,
    );
  }

  allowsCreator(statement: Statement, resource: Resource) {
    const resourceKey = this.resourceParser.resolveKey(resource);
    return !!statement.resources.find(
      (statementResourceKey) => statementResourceKey === `${resourceKey}/~`,
    );
  }
}
