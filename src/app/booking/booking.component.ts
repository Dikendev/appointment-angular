import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpServiceService } from '../services/http-service.service';
import { Service } from '../booking-list/booking-list.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingComponent implements OnInit, OnDestroy {
  formInputs!: FormGroup;
  servicesData!: Service[];
  tabs = new Array(7).fill(0).map((_, index) => {
    const today = new Date();
    const currentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + index
    );
    const formattedDate = formatDate(currentDate, 'dd/MM', 'en-US');
    return `Tab ${index + 1}: ${formattedDate}`;
  });
  ngOnInit(): void {
    this.formInputs = this.formBuilder.group({
      username: [''],
      bookingDateTime: [''],
      serviceName: [''],
    });

    this.getBookings();
    this.getServices();

    this.formInputs.get('serviceName')?.setValue(2);
  }

  ngOnDestroy(): void {
    this.backendService.services().subscribe().unsubscribe();
    this.backendService.bookings().subscribe().unsubscribe();
  }

  constructor(
    private formBuilder: FormBuilder,
    private backendService: HttpServiceService
  ) {}

  async onSubmit(formInputs: FormGroup) {
    console.log(this.formInputs.value);
  }

  getServices() {
    this.backendService
      .services()
      .subscribe((services) => (this.servicesData = services));
  }

  getBookings() {
    this.backendService.bookings().subscribe();
  }
}
