import { IamResource } from '../../models';

export interface IResourceParser {
  resolveKey(resource: object): string;
}
export class ResourceParser implements IResourceParser {
  resolveKey(resource: IamResource): string {
    return resource.name;
  }
}
