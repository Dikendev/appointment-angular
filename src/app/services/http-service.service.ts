import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, from, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpServiceService {
  constructor(private httpClient: HttpClient) {}

  getServices() {
    const url = environment.backendApi;
    return this.httpClient.get(`${url}/service`);
  }

  getServicesTeste(): Observable<any> {
    const url = environment.backendApi;

    const data = from(fetch(`${url}/service/`));

    data.subscribe({
      next(response) {
        console.log(response);
      },
      error(err) {
        console.log(err);
      },
      complete() {
        console.log('Completed');
      },
    });
    return data;
  }
}
