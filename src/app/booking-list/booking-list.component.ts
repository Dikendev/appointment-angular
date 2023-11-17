import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../services/http-service.service';

export interface Bookings {
  client: Client;
  service: Service;
  clientId: number;
  finishAt: Date;
  id: number;
  serviceId: number;
  startAt: Date;
  total: number;
  userId: number;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  profilePicture: string;
  phoneNumber: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: number;
  name: string;
  price: number;
  requiredTimeMin: number;
  serviceImage: string;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css'],
})
export class BookingListComponent implements OnInit {
  bookings!: Bookings[];

  constructor(private backendService: HttpServiceService) {}
  ngOnInit(): void {
    this.getBookingData();
  }

  getBookingData(): void {
    this.backendService.bookingData$.subscribe(
      (bookings) => (this.bookings = bookings)
    );
  }
}
