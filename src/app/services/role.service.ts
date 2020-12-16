import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API} from '../helpers/global-constants';
import {Role} from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get(API + '/api/roles');
  }

  getAllMenus() {
    return this.http.get(API + '/api/menus');
  }

  add(role: Role) {
    return this.http.post(API + '/api/roles', role);
  }

  update(role: Role) {
    return this.http.put(API + '/api/roles', role);
  }
}
