import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API} from '../helpers/global-constants';
import {User} from '../models/user';
import {concatMap} from 'rxjs/operators';
import {ManageFileService} from './manage-file.service';

export interface ResetPassword {
  newPasswordHash: string;
  previousPasswordHash: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private uploadService: ManageFileService) {
  }

  count() {
    return this.http.get(`${API}/users/count`);
  }

  get(id: string) {
    return this.http.get(`${API}/api/users/${id}`);
  }

  getAll() {
    return this.http.get(API + '/users/all');
  }

  getAllRoles() {
    return this.http.get(API + '/roles');
  }

  addWithImage(user: User, file: File, hashCode: string) {
    user.userAvatar = hashCode + '.' + file.type.substr(6);
    return this.uploadService.saveFile(file, hashCode).pipe(
      concatMap(() => this.http.post(API + '/api/users', user)
      ));
  }

  add(user: User) {
    return this.http.post(API + '/users', user);
  }

  update(user: User) {
    return this.http.put(API + '/users', user);
  }

  updateWithImage(user: User, file: File, hashCode: string) {
    user.userAvatar = hashCode + '.' + file.type.substr(6);
    return this.uploadService.saveFile(file, hashCode).pipe(
      concatMap(() => this.http.put(API + '/users', user)
      ));
  }

  getSessions() {
    return undefined;
  }

  updatePassword(data: ResetPassword) {
    return this.http.put(API + '/users/password', data);
  }
}
