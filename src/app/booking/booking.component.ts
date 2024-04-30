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
import { ConstantPool } from '@angular/compiler';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface Time {
  hour: string;
  minute: string;
}

export interface Data {
  day: string;
  time: string;
}

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
    console.log(`Tab ${index + 1}: ${formattedDate}`);
    const weekDays = WEEK_DAYS[currentDate.getDay()];
    console.log(`Tab ${index + 1}: ${weekDays}`);
    return `${weekDays} ${index + 1}: ${formattedDate}`;
  });

  mockUsers = [
    {
      dayTime: 'Mon 1: 01/01',
      professional: 'Cristina',
      bookingTime: '10:00',
      serviceName: 'Haircut',
      client: 'Diego',
    },
  ];

  bookingByTime: { [key: string]: any } = {};

  ngOnInit(): void {
    this.formInputs = this.formBuilder.group({
      username: [''],
      bookingDateTime: [''],
      serviceName: [''],
    });

    this.getBookings();
    this.getServices();
    this.bookingDateTime();
    this.formInputs.get('serviceName')?.setValue(2);
  }

  ngOnDestroy(): void {
    this.backendService.services().subscribe().unsubscribe();
    this.backendService.bookings().subscribe().unsubscribe();
  }

  isScheduled(day: string, time: string): boolean {
    return this.bookingByTime[`${day}-${time}-00`];
  }
  constructor(
    private formBuilder: FormBuilder,
    private backendService: HttpServiceService,
    public dialog: MatDialog
  ) {}

  async onSubmit(formInputs: FormGroup) {
    console.log(this.formInputs.value);
  }

  populate(): void {
    for (const user of this.mockUsers) {
      const [day, date] = user.dayTime.split(' ');
      const [hour, minute] = user.bookingTime.split(':');
      this.bookingByTime[`${day}-${hour}-${minute}`] = user;
    }
  }

  getServices() {
    this.backendService
      .services()
      .subscribe((services) => (this.servicesData = services));
  }

  getBookings() {
    this.backendService.bookings().subscribe();
  }

  times: Time[] = [];

  bookingDateTime() {
    for (let i = 6; i <= 24; i++) {
      const prefixHour = i < 10 ? `0${i}` : `${i}`;
      const hour = i < 10 ? `${prefixHour}:00` : `${prefixHour}:00`;
      this.times.push({
        hour: hour,
        minute: `${prefixHour}:30`,
      });
    }
  }

  onDayClick(data: Data): void {
    console.log('Day clicked');
    console.log(`${data.day} DAY`);

    console.log(`${data.time} time`);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      day: data.day,
      time: data.time,
    };

    this.openDialog(ConfirmModalComponent, dialogConfig);
  }

  openDialog(component: any, dialogConfig: MatDialogConfig<Time>): void {
    this.dialog.open(component, dialogConfig);
  }
}
