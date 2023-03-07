import { IamPolicyStatement, IamResource } from '../models';
import { ResourceParser } from '../services/parsers/resource.parser';

export interface IResourceValidator {
  inStatement(statement: IamPolicyStatement, resource: object): boolean;
  allowsCreator(statement: IamPolicyStatement, resource: object): boolean;
}

export class ResourceValidator implements IResourceValidator {
  constructor(private resourceParser: ResourceParser = new ResourceParser()) {}

  inStatement(statement: IamPolicyStatement, resource: IamResource): boolean {
    const resourceKey = this.resourceParser.resolveKey(resource);
    return !!statement.resources.find(
      (statementResourceKey) =>
        statementResourceKey.split('/')[0] === resourceKey,
    );
  }

  allowsCreator(statement: IamPolicyStatement, resource: IamResource) {
    const resourceKey = this.resourceParser.resolveKey(resource);
    return !!statement.resources.find(
      (statementResourceKey) => statementResourceKey === `${resourceKey}/~`,
    );
  }
}
