import { IamResource } from '..';

export interface Post extends IamResource {
  title: string;
}
export const post: Post = {
  name: 'Post',
  title: 'Blog Post',
  createdBy: '1234',
};
