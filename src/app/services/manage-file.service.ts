import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
import {API} from '../helpers/global-constants';

@Injectable({
  providedIn: 'root'
})
export class ManageFileService {

  constructor(private http: HttpClient) {
  }

  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest('POST', `${API}/s3/upload`, formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${API}/getallfiles`);
  }

  getFile(fileName: string): Observable<Blob> {
    return this.http.get(`${API}/s3/api/file/${fileName}`, {responseType: 'blob'});
  }

  saveFile(file: File, hashCode: string) {
    if (file) {
      const formdata: FormData = new FormData();
      formdata.append('file', file, hashCode + '.' + file.type.substr(6));
      return this.http.post(`${API}/s3/upload`, formdata, {responseType: 'text'});
    } else {
      return of({});
    }

  }

  deleteFile(fileName: string) {
    return this.http.delete(`${API}/files/${fileName}`);
  }

}
