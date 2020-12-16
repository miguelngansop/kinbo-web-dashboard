import {Role} from './role';

export class User {
  role: Role;
  roleId: string;
  userAvatar: string;
  userCreatedAt: Date;
  userDisabledAt: Date;
  userEnabled: boolean;
  userFirstname: string;
  userGender: string;
  userId: string;
  userLastname: string;
  userLogin: string;
  userPasswordHash:	string;

  constructor() {
    this.role = <Role> {};
  }
}
