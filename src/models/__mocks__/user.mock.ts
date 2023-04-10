import { IamPrincipal, IamResource } from '../index.js';

export const user: IamPrincipal & IamResource = {
  name: 'User',
  id: '1234',
  username: 'mock-user',
  groups: ['admin'],
  createdBy: '1234',
};

export const blogger: IamPrincipal & IamResource = {
  name: 'User',
  id: '1234',
  username: 'blogger-one',
  groups: [],
  createdBy: '5678',
};

export const admin: IamPrincipal & IamResource = {
  name: 'User',
  id: '5678',
  username: 'admin-one',
  groups: ['admin'],
  createdBy: '5678',
};
