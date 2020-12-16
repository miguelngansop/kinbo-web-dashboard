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

  get(id: string) {
    return this.http.get(`${API}/api/agents/${id}`);
  }

  getAll() {
    return this.http.get(API + '/api/agents');
  }

  getAllRoles() {
    return this.http.get(API + '/api/roles');
  }

  addWithImage(agent: User, file: File, hashCode: string) {
    agent.userAvatar = hashCode + '.' + file.type.substr(6);
    return this.uploadService.saveFile(file, hashCode).pipe(
      concatMap(()=> this.http.post(API+'/api/agents',agent)
      ));
  }

  add(agent : User){
    return this.http.post(API+'/api/agents',agent);
  }

  update(agent: User) {
    return this.http.put(API + '/api/agents', agent);
  }

  updateWithImage(agent: User, file: File, hashCode: string) {
    agent.userAvatar = hashCode + '.' + file.type.substr(6);
    return this.uploadService.saveFile(file, hashCode).pipe(
      concatMap(() => this.http.put(API + '/api/agents', agent)
      ));
  }

  getSessions() {
    return undefined;
  }

  updatePassword(data: ResetPassword) {
    return this.http.put(API + '/api/agents/password', data);
  }
}
