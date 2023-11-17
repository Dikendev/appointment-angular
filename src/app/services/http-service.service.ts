import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environment/environment';

export interface ServiceData {
  id: number;
  name: string;
  price: number;
  requiredTimeMin: number;
  serviceImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class HttpServiceService {
  private serviceData = new Subject<any>();
  serviceData$ = this.serviceData.asObservable();
  private bookingData = new Subject<any>();
  bookingData$ = this.bookingData.asObservable();

  constructor(private httpClient: HttpClient) {}

  services(): Observable<any> {
    const url = environment.backendApi;
    return this.httpClient.get<Object[]>(`${url}/service`).pipe(
      tap((data) => {
        console.log('data', data);
        this.serviceData.next(data);
      })
    );
  }

  bookings(): Observable<any> {
    const url = environment.backendApi;
    return this.httpClient.get<Object[]>(`${url}/booking`).pipe(
      tap((bookings) => {
        console.log(`bookings`, bookings);
        this.bookingData.next(bookings);
      })
    );
  }

  deleteService(serviceName: string): Observable<any> {
    const url = environment.backendApi;

    return this.httpClient
      .delete<any>(`${url}/service/delete/${serviceName}`)
      .pipe(
        tap((data) => {
          console.log('data', data);
        })
      );
  }

  createService(body: any) {
    const url = environment.backendApi;

    return this.httpClient.post(`${url}/service/`, body).pipe(
      tap((data) => {
        console.log('data', data);
      })
    );
  }
}
