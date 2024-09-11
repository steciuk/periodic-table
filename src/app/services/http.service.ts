import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly baseUrl = '';
  private readonly http = inject(HttpClient);

  get<T>(...params: Parameters<HttpClient['get']>) {
    const [endpoint, ...rest] = params;

    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, ...rest);
  }

  post<T>(...params: Parameters<HttpClient['post']>) {
    const [endpoint, ...rest] = params;

    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, ...rest);
  }

  put<T>(...params: Parameters<HttpClient['put']>) {
    const [endpoint, ...rest] = params;

    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, ...rest);
  }

  delete<T>(...params: Parameters<HttpClient['delete']>) {
    const [endpoint, ...rest] = params;

    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, ...rest);
  }
}
