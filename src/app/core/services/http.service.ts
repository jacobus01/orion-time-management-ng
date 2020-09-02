import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataSource } from 'ng2-smart-table/lib/lib/data-source/data-source';
import { ServerDataSource } from 'ng2-smart-table';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public url = environment.baseURL;
  public headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });

  constructor(private http: HttpClient) { }

  // getServerDataSource(endpoint: string): DataSource {
  //   console.log('[HttpService] getServerDataSource() apiUrl =>', this.url);
  //   return new ServerDataSource(this.http,
  //     {
  //       endPoint: `${this.url}/${endpoint}`,
  //       totalKey: 'totalCount',
  //       dataKey: 'items',
  //       pagerPageKey: 'pageNumber',
  //       pagerLimitKey: 'pageSize',
  //       filterFieldKey: 'filterBy#field#',
  //       sortFieldKey: 'sortBy',
  //       sortDirKey: 'orderBy',
  //     });
  // }

  get(endpoint: string, options?): Observable<any> {
    console.log('[HttpService] get() =>', `${this.url}/${endpoint}`);
    const newOptions = Object.assign({}, options, {headers: this.headers});
    return this.http.get(`${this.url}/${endpoint}`, newOptions);
  }

  post(endpoint: string, data, options?): Observable<any> {
    console.log('[HttpService] post() apiUrl =>', this.url);
    const newOptions = Object.assign({}, options, {headers: this.headers});
    return this.http.post(`${this.url}/${endpoint}`, data, newOptions);
  }

  put(endpoint: string, data, options?): Observable<any> {
    console.log('[HttpService] getServerDataSource() put =>', this.url);
    const newOptions = Object.assign({}, options, {headers: this.headers});
    return this.http.put(`${this.url}/${endpoint}`, data, newOptions);
  }

  delete(endpoint: string, options?): Observable<any> {
    console.log('[HttpService] getServerDataSource() delete =>', this.url);
    const newOptions = Object.assign({}, options, {headers: this.headers});
    return this.http.delete(`${this.url}/${endpoint}`, newOptions);
  }
}
