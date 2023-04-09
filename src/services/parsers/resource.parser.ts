import { IamResource } from '../../models/index.js';

export interface IResourceParser {
  resolveKey(resource: object): string;
}
export class ResourceParser implements IResourceParser {
  resolveKey(resource: IamResource): string {
    return resource.name;
  }
}
