import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contato } from './contato/contato';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { env } from 'process';
import { PaginaContato } from './contato/paginaContato';

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

  list(in_page: any, in_size: any) : Observable<PaginaContato> {
    const params = new HttpParams()
      .set('page', in_page)
      .set('size', in_size);

    return this.http.get<any>(`${this.url}?${params.toString()}`);
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
