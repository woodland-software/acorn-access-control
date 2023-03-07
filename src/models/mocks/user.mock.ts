import { IamUser, IamResource } from '..';

export const user: IamUser & IamResource = {
  name: 'User',
  userId: '1234',
  username: 'mock-user',
  userGroups: ['admin'],
  createdBy: '1234',
};

export const blogger: IamUser & IamResource = {
  name: 'User',
  userId: '1234',
  username: 'blogger-one',
  userGroups: [],
  createdBy: '5678',
};

export const admin: IamUser & IamResource = {
  name: 'User',
  userId: '5678',
  username: 'admin-one',
  userGroups: ['admin'],
  createdBy: '5678',
};
