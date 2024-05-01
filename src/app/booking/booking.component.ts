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
  times: Time[] = [];
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
    return `${weekDays} : ${formattedDate}`;
  });
  bookingByTime: { [key: string]: any } = {};

  mockUsers = [
    {
      dayTime: 'Tue : 30/04',
      professional: 'Cristina',
      start: '10:00',
      end: '11:00',
      serviceName: 'Haircut',
      client: 'Diego',
    },
    {
      dayTime: 'Wed : 01/05',
      professional: 'Kennedy',
      start: '15:00',
      end: '17:30',
      serviceName: 'Haircut',
      client: 'Diego',
    },
  ];

  public isBooked(day: string, hour: string, type: 'start' | 'end'): boolean {
    return this.mockUsers.some((user) => {
      const startTime = user.start;
      const endTime = user.end;

      console.log('user.dayTime', user.dayTime);
      console.log('day', day);

      if (user.dayTime == day) {
        console.log('samee');
      }

      if (user.dayTime === day && hour === startTime && type === 'start') {
        return startTime === hour;
      } else {
        return endTime === hour;
      }
    });
  }

  getBookingClient(day: string, hour: string): string {
    const user = this.mockUsers.find((user) => {
      const startTime = user.start;
      return user.dayTime === day && hour === startTime;
    });

    return user ? user.client : '';
  }

  ngOnInit(): void {
    this.formInputs = this.formBuilder.group({
      username: [''],
      bookingDateTime: [''],
      serviceName: [''],
    });

    // this.getBookings();
    // this.getServices();
    this.bookingDateTime();
    this.formInputs.get('serviceName')?.setValue(2);
    // this.populate();
  }

  ngOnDestroy(): void {
    this.backendService.services().subscribe().unsubscribe();
    this.backendService.bookings().subscribe().unsubscribe();
  }

  // isScheduled(day: string, time: string): boolean {
  //   console.log('this.bookingTime', this.bookingByTime);
  //   console.log(this.bookingByTime[`${day}-${time}-00`]);
  //   return this.bookingByTime[`${day}-${time}-00`];
  // }

  // bookingTime(day: string, hour: string) {
  //   console.log('time', this.bookingByTime[`${day}-${hour}-00`]);
  //   return this.bookingByTime[`${day}-${hour}-00`].client;
  // }

  constructor(
    private formBuilder: FormBuilder,
    private backendService: HttpServiceService,
    public dialog: MatDialog
  ) {}

  async onSubmit(formInputs: FormGroup) {
    console.log(this.formInputs.value);
  }

  // populate(): void {
  //   console.log('Populating');
  //   for (const user of this.mockUsers) {
  //     console.log('user', user);
  //     const [day, date] = user.dayTime.split(' ');
  //     const [hour, minute] = user.bookingTime.split(':');
  //     this.bookingByTime[`${day}-${hour}-${minute}`] = user;
  //   }
  // }

  validate(day: string, time: string): boolean {
    console.log('Validating', day);
    console.log('time', time);

    const slice = day.split(':');
    const clean = slice.map((word) => word.trim());
    const cleanTime = `${clean[0]}-10-00`;
    const found = this.bookingByTime[cleanTime];

    if (found) {
      console.log('this.bookingByTime', this.bookingByTime);
      console.log('cleanTime', cleanTime);

      console.log('found', found);
      return true;
    }
    return false;
  }

  getServices() {
    this.backendService
      .services()
      .subscribe((services) => (this.servicesData = services));
  }

  getBookings() {
    this.backendService.bookings().subscribe();
  }

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

  public onDayClick(data: Data): void {
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
