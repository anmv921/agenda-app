import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contato } from './contato/contato';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { env } from 'process';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  url: string = environment.apiBaseUrl;

  constructor(
    private http: HttpClient
  ) { }

  save( in_contato: Contato ) : Observable<Contato> {
    return this.http.post<Contato>(this.url, in_contato);
  }

  list() : Observable<Contato[]> {
    return this.http.get<any>(this.url);
  }

  favourite(in_contato: Contato) : Observable<any> {
    return this.http.patch(`${this.url}/${in_contato.id}/favorito`, null);
  }

  upload(contato: Contato, formData: FormData) : Observable<any> {
    return this.http.put(`${this.url}/${contato.id}/foto`, formData,
      { responseType : 'blob' }
    );
  }
}
