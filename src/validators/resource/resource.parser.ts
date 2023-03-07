import { IamResource } from '../../models';

export interface IResourceParser<Resource extends object = object> {
  resolveKey(resource: Resource): string;
}
export class ResourceParser<Resource extends IamResource = IamResource>
  implements IResourceParser<Resource>
{
  resolveKey(resource: Resource): string {
    return resource.name;
  }
}
