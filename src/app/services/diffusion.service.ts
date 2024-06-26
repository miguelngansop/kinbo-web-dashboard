import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API} from '../helpers/global-constants';
import {Diffusion} from '../models/diffusion';

@Injectable({
  providedIn: 'root'
})
export class DiffusionService {

  constructor(private http: HttpClient) {
  }

  get(id: string) {
    return this.http.get(`${API}/diffusions/${id}`);
  }


  getAll() {
    return this.http.get(API + '/diffusions/all');
  }

  add(diffusion: Diffusion) {
    return this.http.post(API + '/diffusions', diffusion);
  }

  update(id: string, diffusion: Diffusion) {
    return this.http.put(`${API}/diffusions/${id}`, diffusion, {responseType: 'text'});
  }

  delete(id: string) {
    return this.http.delete(`${API}/diffusions/${id}`, {responseType: 'text'});
  }
}
